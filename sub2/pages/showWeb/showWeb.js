const base64 = require("../../utils/base64");
import MYURLS from "../../utils/urls";
// const qybank = "https://qybanktest.jsbchina.cn/qybankuat/page/index.html#page/99/03/P9903.html" // 验证
const qybank = "https://qybank.jsbchina.cn/qybankA/page/index.html#page/99/03/P9903.html"
var CryptoJS = require("../../utils/AES.js");
var that;

Page({
    data: {
        skipUrl: ""
    },
    onLoad(options) {
        that = this;
        //console.log(options)
        let skipUrl = decodeURIComponent(options.skipUrl);
        if (options.sendStr) {
            let data = JSON.parse(decodeURIComponent(options.sendStr));
            if (data.platFlag) {
                this.setData({
                    skipUrl: skipUrl +
                        "?custno=" +
                        data.custNo +
                        "&custtype=" +
                        data.custType +
                        "&merchantno=" +
                        data.merchantNo +
                        "&platFlag=" +
                        data.platFlag +
                        "&sign=" +
                        encodeURIComponent(data.sign) +
                        "&signType=" +
                        data.signType +
                        "&time=" +
                        data.time +
                        "&transData=" +
                        data.transData
                });
            } else {
                this.setData({
                    skipUrl: skipUrl +
                        "?custno=" +
                        data.custNo +
                        "&custtype=" +
                        data.custType +
                        "&merchantno=" +
                        data.merchantNo +
                        "&sign=" +
                        encodeURIComponent(data.sign) +
                        "&signType=" +
                        data.signType +
                        "&time=" +
                        data.time +
                        "&transData=" +
                        data.transData
                });
            }
            // //console.log(this.data.skipUrl);
        } else if (options.scene) {
            var urlParam = base64.baseDecode(options.scene);
            let params = urlParam.split("&");
            //开放银行跳转
            if (params[0] == "t=othe") {
                let data = "";
                for (let i = 1; i < params.length; i++) {
                    data = data + "&" + params[i];
                }
                data = data.substring(1);
                skipUrl = MYURLS.Urls.openBank + options.scene;

                this.setData({
                    skipUrl: decodeURIComponent(skipUrl)
                });
                //console.log(this.data.skipUrl);
            } else {
                wx.switchTab({
                    url: '/pages/shop/index2',
                });
            }
        } else if (options.qybank) {
            var key = "qybankjscryptxcx123123";

            var jiami1 = that.Encrypt(options.openid, key);
            var jiami2 = that.Encrypt(options.phone, key);
            var jiami3 = that.Encrypt(options.productNo, key);
            let params = '?openid=' + jiami1 + '&phone=' + jiami2 + '&productNo=' + jiami3
            skipUrl = qybank + params;
            //console.log('sub2/page/showweb/showweb')
            //console.log('openid=' + options.openid + '&phone=' + options.phone + '&productNo=' + options.productNo)

            //console.log(skipUrl)
            this.setData({
                skipUrl: skipUrl
            });
        } else {
            //普通跳转
            //console.log(decodeURIComponent(options.skipUrl));
            this.setData({
                skipUrl: decodeURIComponent(options.skipUrl)
            });
        }
    },
    //aes加密
    Encrypt: function(word, key) {
        return CryptoJS.AES.encrypt(word, key).toString();
    },
    onShareAppMessage: options => {
        let return_url = encodeURIComponent(options.webViewUrl); //分享的当前页面的路径
        var path = "/pages/showWeb/showWeb?skipUrl=" + return_url; //小程序存放分享页面的内嵌网页路径
        return {
            title: "",
            path: path
        };
    }
});