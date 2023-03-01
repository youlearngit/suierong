const base64 = require("../../utils/base64");
import MYURLS from "../../utils/urls";
Page({
  data: {
    skipUrl: ""
  },
  onLoad(options) {
    ////console.log(options);
    //console.log('skipUrl', options.skipUrl)
    let skipUrl = decodeURIComponent(options.skipUrl);
    if (options.sendStr) {
      let data = JSON.parse(decodeURIComponent(options.sendStr));
      if (data.platFlag) {
      
        this.setData({
          skipUrl:
            skipUrl +
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
            encodeURIComponent(data.transData)
        });
      } else {
        
        this.setData({
          skipUrl:
            skipUrl +
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
            encodeURIComponent(data.transData)
        });
      }
      
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
    } else {
      //普通跳转
     
      this.setData({
        skipUrl: decodeURIComponent(options.skipUrl)
      });
    }
  },

  onShareAppMessage: options => {
    let return_url = encodeURIComponent(options.webViewUrl); //分享的当前页面的路径
    var path = "/sub2/pages/showWeb/showWeb?skipUrl=" + return_url; //小程序存放分享页面的内嵌网页路径
    return {
      title: "",
      path: path
    };
  }
});
