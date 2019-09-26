const puppeteer = require("puppeteer");
const fileUtil = require("fs");
const mysql = require("mysql");

/**
 *
 * 本js目的：了解puppeteer的api。熟悉node.js的内置模块。
 * 下篇：写一个爬虫去爬取网站内容。
 *
 * node内置模块：
 *  path 模块 ：提供了一些用于处理文件路径的小工具
 *  util 模块 ：提供一些工具方法
 *  fs 模块 ： 文件操作系统的API
 *  events 模块 ：提供事件触发与事件监听器功能的封装。
 *  http 模块 ：提供创建服务器，访问网络请求的功能
 *  url 模块 ： 提供网络请求功能
 *  Net 模块 ： 提供了一些用于底层的网络通信的小工具，包含了创建服务器/客户端的方法
 *  OS 模块 ： 模块提供了一些基本的系统操作函数
 *  DNS 模块 ： 模块用于解析域名
 *  Domain 模块 ： 简化异步代码的异常处理，可以捕捉处理try catch无法捕捉的异常
 */

(async () => {
    //创建浏览器实例
    const browser = await puppeteer.launch({
        // headless : false,
        // devtools : true
    });
    //打开一个空白页
    const page = await browser.newPage();
    //调整窗口大小
    await page.setViewport({width: 800, height: 500});
    //开启堆栈信息跟踪
    await page.tracing.start({
        path:"trace.json"
    });
    const connect = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'test'
    });

    connect.connect();

    //允许请求被拦截
    // page.setRequestInterception(true);
    //page提供的事件，如load、close、dialog、request
    page.once('load', () => {
        console.log("Page loaded!")
    });
    page.on('close', () => {
        console.log("Page close!!");
    });
    //对打开页面的请求进行拦截，如图片、css、js等请求
    page.on('request', (request) => {
        console.log(" 请求路径："+ request.url())
    });

    //自定义事件 start
    // page.on('xx', (data) => {
    //     console.log("xx 事件");
    // });
    // // 触发事件
    // page.emit("xx");
    // 自定义事件 end

    //访问页面
    let h = await page.goto("https://www.baidu.com");

    try {
        // 获取页面内容、保存内容到文件
        // console.log(page.content());
        fileUtil.writeFile('content.html', await page.content(), (error) => {
            console.log(error);
        });
    } catch (e) {
        console.log(e)
    }

    //模拟用户行为
    // await page.waitFor(1000)   //延迟1秒输入
    // await page.type("#login_field", "worldhf@sina.com"); //立即输入
    // await page.type("#password", "Hufeng@1990", {
    //     delay: 100
    // })
    // await page.click("input[type=submit]"); //点击登录按钮
    //截图
    // await page.screenshot({
    //     path : "ex.png",
    //     fullPage: true
    // })
    //保存pdf
    await page.pdf({
        path : 'sa.pdf',
        // format : 'A4'
    });
    var  addSql = 'INSERT INTO test1(name, text) VALUES(?,?)';
    var  addSqlParams = ['菜鸟工具', 'https://c.runoob.com'];
    connect.query(addSql, addSqlParams, (err, result) => {
        console.log("=============数据库操作完成======")
        console.log(err);
        console.log(result);
    })

    //在打开的页面中执行pageFunctions
    let s = await page.evaluate(() => {
        //可以运用dom操作，获取需要的数据
        console.log("==============> evalua")
        return 1;
    })
    console.log(s);
    await page.tracing.stop();
    await page.close();
    await browser.close();

    connect.end();
})()
