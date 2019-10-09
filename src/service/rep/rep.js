
const pup = require("puppeteer");
const fileUtil = require("fs");
const path = require("path");

//获取配置
const config = require("../../config/config");

(async () => {
    //打开浏览器，支持多种版本，远程的浏览器
    const launch = await pup.launch({
        headless : false,
        devtools : true
    });
    //打开窗口
    let page = await launch.newPage();
    //调整窗口大小
    await page.setViewport({width: 1200, height: 700});
    // //设置请求拦截
    await page.setRequestInterception(true);

    let gotoUrl = config.globalConfig.gotoUrl;
    let basePath = config.globalConfig.basePath;

    //绑定请求拦截器
    page.on('request',(req)=>{
        req.continue();
    });

    //绑定响应拦截器
    page.on('response', async (resp) => {
        let req = resp.request(), url = req.url();
        //替换保存路径
        let savePath;
        if (resp.ok()) {
            //如果是本次请求
            if (url === gotoUrl[0]) {
                savePath = path.join(basePath, 'content.html');
            } else if (url.startsWith(config.globalConfig.host) && !url.endsWith('/')) {
                //如果是页面发出的其它请求
                savePath = url.replace(gotoUrl[0], basePath);
            }
            let text = await resp.text();
            if (url.endsWith('api.md')) {
                let headers = resp.headers();
                console.log(headers);
            }

            //如果保存路径为 undefined
            if (!savePath) {
                // console.log(" 跳过的url：  " + url);
                return;
            }
            //保存
            try {
                if (!fileUtil.existsSync(savePath)) {
                    fileUtil.mkdirSync(path.dirname(savePath), {recursive:true});
                }
                fileUtil.writeFileSync(savePath, text, {
                    encoding : 'utf-8'
                });

            } catch (e) {
                console.log(e);
            }
        }
    });

    //跳转路径
    let res = await page.goto(gotoUrl[0]);

    await page.waitFor(30000);//等待搜索结果

    //获取页面中的元素
    let alis = await page.$$eval('sidebar-component sidebar-item a', (ele) => {
        let data = [];
        for (const e of ele) {
            let d = {};
            d.href = e.href;
            d.name = e.innerText;
            data.push(d);
        }
        return data;
    });
    console.log(JSON.stringify(alis));
    // try {
    //     fileUtil.writeFileSync(path.join(basePath, 'content.html'), await page.content());
    // } catch (e) {
    //     console.log(e);
    // }


    // await page.close();
    // await launch.close();
})();
