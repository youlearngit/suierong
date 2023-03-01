const util = require('../../utils/util');
const app = getApp();
const api = require('../../../utils/api');
const utils = require('../../../utils/util');

import user from '../../../utils/user';

var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag: true, //授权提示控制
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: {},
        shareBox: "shareBox",
        submit: true,
        maskHidden: true,
        nick: '', //授权昵称
        avatar: '', //授权头像
        wechat: "", //本详情页二维码
        bg: "/static/wechat/img/zm/remotePoster.png", //图片背景图
        //touxiang: "/pages/public/img/temp/touxiang.jpg",//头像路径
        maskHidden: true, //控制遮罩层
        imagePath: "", //存放canvas生成的图片
        canvasId: 'mycanvas',
        preffixUrl: '',
        path: '',
        newbg: '',
        scene: '',
        callGetPhone: '',
        navto: true,
        empNo: '',
        cndUrl: app.globalData.CDNURL,
        intId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
        that = this;
        if (options.scene) {
            var scene = decodeURIComponent(options.scene);
            if(scene.indexOf('a')!=-1){
                let str=scene
                scene=str.split("a")[2]+','+str.split("a")[0]
            }
            this.setData({
                scene: scene
            });
            wx.setStorageSync('recommendNum', scene)
        }
        if(options.name){
            var scene = decodeURIComponent(options.name);
            this.setData({
                scene: scene,
            });
            wx.setStorageSync('billScene', scene+',')
        }
        this.setData({
            preffixUrl: app.globalData.URL,
            navTop: app.globalData.statusBarTop,
            navHeight: app.globalData.statusBarHeight,
        })
        var pagenum = getCurrentPages()
        this.setData({
            pageFlag: pagenum.length
        })
        user.getCustomerInfo().then(res => {
            if (res.USERID) {
                that.setData({
                    empNo: res.USERID,
                    intId:res.INT_ID
                })
            }
        })
        that.userInfo();
        // 查看是否授权
       

    },
    


    userInfo: function() {

    },
    bindGetUserInfo(e) {
        wx.showLoading({
            title: '授权中',
        });
        if (!that.data.navto) {
            that.showShare();
            return;
        }
        setTimeout(res => {
            wx.hideLoading();
            that.setData({
                loginFlag: true,
            })
            wx.redirectTo({
                url: "/sub2/pages/billDisCount/index"
            })
        }, 1500)
    },
    //取消登录
    logincancel: function() {
        that.setData({
            loginFlag: true,
        })
    },
    // 拨打电话给收件人
    callGetPhone(e) {
        // 号码
        let telPhone = e.currentTarget.dataset.getphone;
        this.callPhone(telPhone);
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let pages = getCurrentPages(); //获取加载的页面
        let currentPage = pages[pages.length - 1]; //获取当前页面的对象
        var path = "sub2/pages/billDisCount/poster" + "?scene=" + that.data.intId + 'a' + utils.formatTime(new Date())+'a'+that.data.empNo;
        return {
            path: path,
            imageUrl: app.globalData.CDNURL + "/static/wechat/img/zm/remotePoster.png"
        }
    },
    indexpage: function() {
        that.setData({
            navto: true
        })
        user.ifAuthUserInfo().then(res=>{
            if (res) {
                wx.redirectTo({
                    url: "/sub2/pages/billDisCount/index"
                })
            } else {
                that.setData({
                    loginFlag: false,
                })
            }
        })
    },
    home() {
        wx.switchTab({
            url: 'pages/shop/index2',
        })
    },
    prePage() {
        wx.navigateBack();
    },
    callGetPhone(e) {
        // 号码
        let telPhone = e.currentTarget.dataset.getphone;
        wx.showModal({
            title: '温馨提示',
            content: '您确定要拨打' + telPhone + "?",
            showCancel: true,
            cancelText: "取消",
            cancelColor: '#999', //取消文字的颜色
            confirmText: "立即拨打", //默认是“确定”
            confirmColor: '#0066b3',
            success: function(res) {
                if (res.cancel) {
                    //点击取消,默认隐藏弹框
                } else {
                    //点击确定
                    that.callPhone(telPhone);
                }
            },
            fail: function(res) {}, //接口调用失败的回调函数
            complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
        })
    },
    callPhone(phoneNumber) {
        wx.makePhoneCall({
            phoneNumber: phoneNumber,
            success: function() {
                //console.log("拨打电话成功！")
            },
            fail: function() {
                //console.log("拨打电话失败！")
            }
        })
    },
    //点击分享
    showShare: function() {
        that.setData({
                navto: false
            })
            // 查看是否授权

        user.ifAuthUserInfo().then(res=>{
            if(res){
                that.setData({
                    nick: app.globalData.userInfo.nickName, //授权昵称
                })

                wx.getImageInfo({
                    src:app.globalData.userInfo.avatarUrl,
                    success: function(res) {

                        that.setData({
                            shareBox: "shareBox on",
                        });
                        that.setData({
                            avatar: res.path //授权头像
                        })

                        that.showCreat();

                    },
                    fail: function(err) {
                        console.log(res)
                    }
                })
            }else{
                that.setData({
                    loginFlag: false,
                })
            }
        })
    },
    //取消分享
    showHide: function() {
        that.setData({
            shareBox: "shareBox",
        })
    },
    //点击生成海报按钮function
    showCreat: function(e) {
        if (that.data.submit) {
            that.setData({
                submit: false
            })
            user.getCustomerInfo().then(res => {
                if (res.ID_CARD == undefined || res.ID_CARD == '') {
                    wx.showModal({
                        title: '提示',
                        content: '请实名注册身份信息',
                        success(res) {
                            if (res.confirm) {

                                wx.navigateTo({ url: '/sub1/pages/info/identify' })

                            } else if (res.cancel) {}
                        }
                    })

                } else {
                    wx.showToast({
                        title: '生成中',
                        icon: 'loading',
                        duration: 10000
                    })
                    wx.getImageInfo({
                        src: that.data.cndUrl + that.data.bg,
                        success(res) {  
                            that.setData({
                                newbg: res.path //授权头像
                            })
                            api.generateMiniCode('sub2/pages/billDisCount/poster', that.data.empNo).then(res => {
                                that.setData({
                                    wechat: res, //赋值本地的二维码图片给data.wechat
                                });
                                that.createNewImg();
                            })
                        
                        },
                        fail(res) {}
                    })
                }
            })
        }
    },
    //点击保存到相册
    baocun: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 5000
        })
        wx.saveImageToPhotosAlbum({
            filePath: that.data.imagePath,
            success(res) {
                wx.hideToast();

                wx.showModal({

                    content: '图片已保存到相册，赶紧晒一下吧~',
                    showCancel: false,
                    confirmText: '好的',
                    confirmColor: '#333',
                    success: function(res) {
                        if (res.confirm) {
                            //console.log('用户点击确定');
                            that.setData({
                                maskHidden: true,
                                shareBox: "shareBox",
                            })
                        }
                    },
                    fail: function(res) {
                        wx.hideToast();
                    }
                })
            }
        })
    },
    //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
    createNewImg: function() {

        var context = wx.createCanvasContext('mycanvas');
        context.setFillStyle("white");
        context.fillRect(0, 0, 750, 1216);
        var path = that.data.newbg;
        context.drawImage(path, 0, 0, 750, 1000); //背景绘制
        context.drawImage(that.data.wechat, 550, 1035, 150, 150); //小程序码

        var touxiang = that.data.avatar;
        //绘制昵称
        var nickname = '@' + that.data.nick + ' 向您推荐';
        context.setFillStyle('#333');
        context.setFontSize(28);
        context.setTextAlign('left');
        context.fillText(nickname, 40, 1200); //昵称绘制
        context.stroke();
        context.setFontSize(20);
        // context.fillText("长按立即申请", 565, 1156); //提示绘制
        //绘制头像
        context.setStrokeStyle('#fff');
        context.setLineWidth(0);
        context.arc(120, 1095, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
        context.clip();
        context.drawImage(touxiang, 50, 1025, 140, 140); //头像绘制
        context.stroke();
        context.draw();
        //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        var _time = setTimeout(function() {
            wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                fileType: "jpg",
                quality: 0.7,
                success: function(res) {
                    wx.hideToast();
                    var tempFilePath = res.tempFilePath;

                    that.setData({
                        imagePath: tempFilePath,
                        canvasHidden: true
                    });
                },
                fail: function(res) {
                    //console.log(res);
                }
            });
        }, 300);
    },

})