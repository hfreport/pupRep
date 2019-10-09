/**
 *  pup配置文件
 */
const strUtl  = require("../utils/strUtil");
const path = require('path');
const file = require("fs");

// 配置文件，搜索关键词，
const globalConfig = {
  host : 'https://zhaoqize.github.io',
  // "gotoUrl" : ['https://www.cnki.net'], //需要跳转的url
  gotoUrl : ['{0}/puppeteer-api-zh_CN/'], //需要跳转的url

  basePath : './result/',

  //初始化配置
  init : function (obj) {

    let _host = this.host, _gotoUrl = this.gotoUrl;

    if (!_host) {
      throw new TypeError('globalConfig.host is must config');
    }

    if (!_gotoUrl || _gotoUrl.length === 0) {
      throw new TypeError('globalConfig.gotoUrl is must config');
    }

    let config = {
      inp : obj?obj.inp||[_host]:[_host]
    };

    this.gotoUrl.replace(config.inp);
  }
};

//初始化配置
globalConfig.init();

exports.globalConfig = globalConfig;
