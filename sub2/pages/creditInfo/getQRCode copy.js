// pages/creditInfo/getQRCode.js
import http from '../../utils/requsetP.js'
const util = require('../../utils/util');
var that;
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrcodeUrl: '',
        avatarUrl: '',
        nickName: '',
        borrow_name: '',
        preffixUrl: '',
        businessid: '',
        authName: '',
        authID: '',
        business_type: '',
        canvasHidden: true, //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
        shareImgPath: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        information: '',
        yewuType: '',    //个人经营贷2/对公授信3
        imagePath: ''    //canvas地址
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        that = this;
        console.log(e,'页面信息');
        this.setData({information:e});
        if(e.business_type == 3){
            this.setData({yewuType : '对公授信'});
        }else if(e.business_type == 2){
            this.setData({yewuType : '个人经营贷'});
        }
        
        if (wx.getStorageSync('openid') === '') {
            app
                .getSessionInfo()
                .then(res => {})
        }
        // 查看是否授权
        let authID = e.authID
        let avatarurl = decodeURIComponent(e.avatarurl)
        let imgPath = ''
        console.log(avatarurl)

        var index = avatarurl.lastIndexOf("\/");
        imgPath = avatarurl.substring(index + 1, avatarurl.length);
        console.log(imgPath,'imgPath')
// 二维码
        wx.downloadFile({
            url: app.globalData.URL + "/getqrcode?file=" + imgPath,
            success: function(res) {
                console.log(res,'二维码获取');
                if (res.statusCode === 200) {
                    that.setData({
                        qrcodeUrl: res.tempFilePath
                    })
                } else {}
            },
        });
        let authName = decodeURIComponent(e.authName);

        this.setData({
            preffixUrl: app.globalData.CDNURL,
            authName: authName,
            authID: authID,
            business_type: e.business_type,
            borrwo_name: e.borrwo_name
        })


    },
    // onShareAppMessage() {
    //     return {
    //         title: '',
    //         path: 'pages/authConfirm/index?id=' + that.data.authID + '&business_type=' + that.data.business_type + '&borrwo_name=' + that.data.borrow_name,
    //     }
    // },
    bindGetUserInfo(e) {
        //         wx.redirectTo({ url: '../authConfirm/index?scene='+that.data.authID });
        // return;
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl,

            nickName: app.globalData.userInfo.nickName
        })
        wx.showLoading({
            // title: '图片生成中',
            title: '图片保存中...',
            mask: true,
            success() {
                that.saveImg()
            }
        })
    },

    saveImg() {
        console.log('图片保存中');
        let unit = 0;
        let img1 = ''
        let img2 = ''
        let img3 = ''
        var y = 0; 
        var bg = '';  //背景
        var bottomBg = '';  //底部背景图
        var sqlx = '';   // 授权类型
        var stmc = '';  //实体名称
        var sqrxm = '';  //授权人姓名
        var erweima = ''; //二维码测试图片
        var saveImg = ''; //保存图片按钮
        var jkqy = ''; //对公授信---借款企业
        var jkqy1 = ''; //对公授信---借款企业第二行
        var business = ''; //个人经营贷---经营实体名称
        var business1 = ''; //个人经营贷---经营实体名称第二行
//获取底部背景图
wx.getImageInfo({   
    src: that.data.preffixUrl + 'static/wechat/img/sui/introduceDi@2x .png',//背景图
    success(res) {
        bottomBg = res.path
    }
});
//获取授权类型图
wx.getImageInfo({   
    src: that.data.preffixUrl + 'static/wechat/img/sui/type@2x.png',//背景图
    success(res) {
        sqlx = res.path
    }
});
//获取实体名称图
wx.getImageInfo({   
    src: that.data.preffixUrl + 'static/wechat/img/sui/buiness@2x.png',//背景图
    success(res) {
        stmc = res.path
    }
});
//获取授权人姓名图
wx.getImageInfo({   
    src: that.data.preffixUrl + 'static/wechat/img/sui/auth@2x.png',//背景图
    success(res) {
        sqrxm = res.path
    }
});
//二维码测试图片
wx.getImageInfo({   
    src: that.data.preffixUrl + 'static/wechat/img/sui/erweima@2x.png',//背景图
    success(res) {
        erweima = res.path
    }
});
//保存图片按钮
wx.getImageInfo({   
    src: that.data.preffixUrl + 'static/wechat/img/sui/saveImg.png',//背景图
    success(res) {
        saveImg = res.path
    }
});
//判断对公授信---借款企业是否需要换行
if((that.data.information.business_name).length <= 13){
    jkqy = that.data.information.business_name;
    y = 0;
}else{
    jkqy = that.data.information.business_name.slice(0,13);
    jkqy1 = that.data.information.business_name.slice(13);
    y = 40;
}
//判断个人经营贷---经营实体名称是否需要换行
    if((that.data.information.business_name).length <= 15){
        business = that.data.information.business_name;
        y = 0;
    }else{
        business = that.data.information.business_name.slice(0,15);
        business1 = that.data.information.business_name.slice(15);
        y = 32;
}
//获取二维码
        let promise1 = new Promise(function(resolve, reject) {
            img2 = that.data.qrcodeUrl
            resolve();
        })
//获取头像
        let promise2 = new Promise(function(resolve, reject) {
            wx.getImageInfo({
                src: that.data.avatarUrl,
                success(res) {
                    img3 = res.path
                    resolve(res);
                },
                fail(res) {
                    reject(res)
                }
            })

        });

        // Promise.all([promise1]).then((res) => {  //获取完二维码再执行以下操作
                wx.getSystemInfo({      //获取设备宽高度
                    success: function(res) {
                        let windowWidth = res.windowWidth
                        unit = res.screenWidth / windowWidth

                        wx.getImageInfo({   //获取图片信息
                            src: that.data.preffixUrl + 'static/wechat/img/sui/bg@2x.png',//背景图
                            success(res) {
                                that.setData({canvasHidden: false});
                                bg = res.path
                                console.log(res.path,'背景图信息');
                                let context = wx.createCanvasContext('share');
                                context.drawImage(bg, 0, 0, 750, 1216) //绘制背景
                                context.drawImage(bottomBg, 0, 866, 750, 350) //绘制底部白色背景
                            if(that.data.information.business_type == 3){//对公授信
                                context.setFontSize(32) //文字字体
                                context.setFillStyle("#4570DA")
                                context.fillText("Bitstream Vera Serif Bold")
                                context.fillText('对公授信',585,910);  //that.data.yewuType
                                //借款企业
                                context.setFillStyle("black");context.setFontSize(38)
                                context.fillText(jkqy,22,972); //that.data.information.business_name(0,13)
                                context.fillText(jkqy1,22,972 + y); //that.data.information.business_name.slice(13)
                                context.setFillStyle('#171A55');context.fillRect(22, 990 + y, 500, 0.5)  //分割线
                                //授权主体类型
                                context.drawImage(sqlx, 22, 1000 + y, 38, 38)
                                context.setFillStyle("#636482");context.setFontSize(28)
                                context.fillText(that.data.information.auth_enterprise_type,82,1030 + y); //that.data.information.auth_enterprise_type
                                //授权人姓名
                                context.drawImage(sqrxm, 22, 1050 + y, 38, 38)
                                context.setFillStyle("#636482");context.setFontSize(28) 
                                context.fillText(that.data.information.authName,82,1080 + y); //that.data.information.authName
                            }else if(that.data.information.business_type == 2){//个人经营贷
                                context.setFontSize(32) //文字字体
                                context.setFillStyle("#4570DA")
                                context.fillText("Bitstream Vera Serif Bold")
                                context.fillText('个人经营贷',565,910);  //that.data.yewuType
                                //借款人姓名
                                context.setFillStyle("black");context.setFontSize(38)
                                context.fillText(that.data.information.borrwo_name,22,972); //that.data.information.borrwo_name
                                context.setFillStyle('#171A55');context.fillRect(22, 990, 500, 0.5)  //分割线
                                //授权人类型
                                context.drawImage(sqlx, 22, 1000, 38, 38)
                                context.setFillStyle("#636482");context.setFontSize(28)
                                context.fillText(that.data.information.auth_type,82,1030); //that.data.information.auth_type
                                //实体经营名称
                                context.drawImage(stmc, 22, 1050, 36, 36)
                                context.setFillStyle("#636482");context.setFontSize(28) 
                                context.fillText(business,82,1080);//that.data.information.business_name(0,15)
                                context.fillText(business1,82,1112);//that.data.information.business_name(15)
                                //授权人姓名
                                context.drawImage(sqrxm, 22, 1090 + y, 38, 38)
                                context.setFillStyle("#636482");context.setFontSize(28) 
                                context.fillText(that.data.information.authName,82,1120 + y); //that.data.information.authName
                                }

                            
                                //按钮
                                context.drawImage(saveImg, 190, 1150, 400, 55)
                                // 二维码
                                context.drawImage(erweima, 547, 970, 170, 170)  //img2
                                //把画板内容绘制成图片，并回调画板图片路径
                                var retry = 0;
                                setTimeout(() => {
                                    that.drawImage(context, retry, unit);
                                }, 200)

                            }
                        })


                    },
                })
            // }).catch((err) => {
            //     wx.hideLoading();

            //     if (err.errMsg == "getImageInfo:fail invalid") {
            //         wx.showToast({
            //             title: '二维码信息获取异常',
            //             icon: 'none',
            //             mask: true,
            //             duration: 1500,
            //         })

            //         return;
            //     }
            //     wx.showToast({
            //         title: "生成图片失败",
            //         icon: "none",
            //         mask: true,
            //         duration: 200,
            //     });
            // })
    },

    drawImage(context, retry, unit) {
        //把画板内容绘制成图片，并回调画板图片路径
        context.draw(false, function() {
            wx.canvasToTempFilePath({
                // x: 0,
                // y: 0,
                // width: unit * 750,
                // height: unit * 1234,
                // destWidth: unit * 750,
                // destHeight: unit * 1234,
                canvasId: 'share',
                quality: 1,
                success: a => {
                    console.log(a.tempFilePath);
                    that.setData({
                        shareImgPath: a.tempFilePath, //将绘制的图片地址保存在shareImgPath 中
                        canvasHidden: true //设置画板隐藏，否则影响界面显示
                    })
                    // 将图片保存到本地start
                    wx.saveImageToPhotosAlbum({
                        filePath: that.data.shareImgPath,
                        success(res) {
                          wx.hideLoading() //图片已经绘制出来，隐藏提示框
                          wx.showModal({
                            content: '图片已保存到相册',
                            showCancel: false,
                            confirmText: '好的',
                            confirmColor: '#333',
                            success: function (res) {
                              if (res.confirm) {
                                //console.log('用户点击确定');
                                that.setData({
                                  maskHidden: true,
                                  shareBox: "shareBox",
                                })
                              }
                            },
                            fail: function (res) {
                                wx.showToast({
                                            title: "保存图片失败",
                                            icon: "none",
                                            mask: true,
                                            duration: 1000,
                                        });
                            }
                          })
                        }
                      })
                    // 将图片保存到本地end
                    wx.previewImage({ //将图片预览出来
                        urls: [that.data.shareImgPath]
                    })
                    wx.hideLoading() //图片已经绘制出来，隐藏提示框
                },

            })
        })
    }
})