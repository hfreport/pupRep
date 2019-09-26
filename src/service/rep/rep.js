const pup = require("puppeteer");
const config = require("../../config/config");
const fileUtil = require("fs");

(async () => {
    //打开浏览器，支持多种版本，远程的浏览器
    const launch = await pup.launch({
        // headless : false,
        // devtools : true
    });
    //打开窗口
    let page = await launch.newPage();
    //调整窗口大小
    await page.setViewport({width: 1200, height: 600});
    // //设置请求拦截
    await page.setRequestInterception(true);
    //绑定拦截器
    await page.on('request',(req)=>{
        //打印页面发出的请求
        // console.log(req.url());
        // console.log(req.resourceType());
        req.continue();
    });
    let gotoUrl = config.globalConfig.gotoUrl;
    //跳转叶面
    let res = await page.goto(gotoUrl[0]);

    await page.waitFor(1000);//等待搜索结果

    let result = await page.evaluate(()=>{
        let data = [];
        //需要注意页面是否加载完毕
        //假设网页已经引入了jquery, 如果未引入，需要添加jquery脚本
        let as = $('.unit ul li a');
        console.log(as);
        as.each((index, row) => {
            let r = $(row),d = {};
            d['name'] = r.html();
            d['href'] = r.attr('href');
            data.push(d);
        });
        return data;
    }).catch((err)=>{
        console.log(err);
    });
    try {
        fileUtil.writeFile('result.json', JSON.stringify(result), async (err) => {
            console.log(err);
        });
    } catch (e) {
        console.log(e);
    }
    await page.close();
    await launch.close();
})();
