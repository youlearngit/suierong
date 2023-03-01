// sub3/pages/bbx/home.js
var app = getApp();
import utils from './utils';
import talent from './talent';
import user from '../../../utils/user';
import api from '../../../utils/api';
import util from '../../../utils/util';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: utils.preffixUrl(),
        loginFlag: true,
        preUrl: app.globalData.URL,
        cndUrl: app.globalData.CDNURL,
        preffixLoc: './img/', // 临时本地目录
        location2: [],
        options: {}, // 首页入参
        avatar: '',
        mine: {},
        bbx_channel: '',
        talent_channel: '',
        sui_channel: '',
        track_channel: '',
        nick: '',
        location: {},
        location_json: '',
        word: '',

    popup_phone: {
      show: false
    },
    popup_poster: {
      show: false,
      imgs: [],
      select: -1
    },
    mkData: [],
    popup_image: {
      show: false,
      img: ''
    },

        my_poster: {
            shareBox: '',
            hidePoster: true,
            imgPath: ''
        },
        mycanvas: {
            width: '',
            height: '',
            unit: ''
        },
        entityList: [],
    },
    //取消登录
    logincancel: function () {
        var that = this;
        that.setData({
            loginFlag: true,
        })
    },
    getImageList() {
        let data = {}
        talent.search(data).then(res => {
            console.log('getImageList', res);
            if (res.result_code == '0000') {
                res.entityList.forEach(element => {
                    if (element.PICTURE_PATH.indexOf('png') || element.PICTURE_PATH.indexOf('jpeg') || element.PICTURE_PATH.indexOf('jpg')) {
                        element.FILE_TYPE = '1'
                    }

                });
                this.setData({
                    entityList: res.entityList
                })
            }
        })
    },
    staffByLocation: async function (e) {
        let {
            list,
            location
        } = this.data;
        wx.showLoading({
            title: "加载中",
        });
        list = [];
        let res = {
            LIST: false
        };
        console.log(location);
        if (!res.LIST && location.codes[2]) {
            res = await talent.selectStaff({
                type: 1,
                code: location.codes[2]
            }); // 区专员
        }
        if (!res.LIST && location.codes[1]) {
            res = await talent.selectStaff({
                type: 1,
                code: location.codes[1]
            }); // 市专员
        }
        if (!res.LIST && location.codes[0]) {
            res = await talent.selectStaff({
                type: 1,
                code: location.codes[0]
            }); // 省专员
        }
        list = res.LIST || [];
        if (list.length > 0) {
            list = utils.repeatArrKey(list, "ID");
            list = list.filter(x => x.TYPE == '1');
            list = this.listDisplay(list);
        }
        wx.hideLoading();
        console.log(list);
        this.setData({
            list: list[0]
        });
    },
    listDisplay: function (list) {
        let {
            mkData
        } = this.data;

		for (let i in list) {
			list[i].distance_km = 0;
			if (list[i].AGENCYNO) {
				let mk = mkData.find(x=>x.ORG_CODE==list[i].AGENCYNO);
				if (mk) {
					list[i].mk = mk;
					list[i].distance = mk.distance;
					list[i].distance_km = mk.distance_km;
				}
			}
		}

		list.sort(function(x,y){
			return x.distance_km - y.distance_km;
		});

		return list;
	},
  imagePreview: function (e) {
    let {
      img
    } = e.currentTarget.dataset;
    wx.previewImage({
      // current: '', // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })

    // let {img} = e.currentTarget.dataset;
    // let {popup_image} = this.data;
    // popup_image.show = !popup_image.show;
    // if (img) {
    // 	popup_image.img = img;
    // }
    // this.setData({popup_image});
  },

  onSearchEvent: function (e) {
    let {
      location,
      word
    } = this.data;

    if (word) {
      talent.tracking(3);
      wx.navigateTo({
        url: '/sub3/pages/bbx/articles?search_type=word&word=' + word + '&location=' + JSON.stringify(location),
      });
    }
  },

  posterCreate: function (e) {
    let {
      popup_poster,
      my_poster
    } = this.data;
    popup_poster.show = false;
    my_poster.shareBox = 'shareBox on';
    my_poster.hidePoster = false;
    this.setData({
      popup_poster,
      my_poster
    })
  },

  posterChoose: async function (e) {
    let {
      id
    } = e.currentTarget.dataset;
    let {
      popup_poster,
      my_poster,
      preffixUrl,
      mine
    } = this.data;
    let that = this;
    let res;
    popup_poster.select = id;

    let choose_poster = popup_poster.posters[id];

        my_poster.share_params = choose_poster.share_params;
        my_poster.imgPath = '';
        this.setData({
         
            ' my_poster.imgPath':''
        });
        
        if (choose_poster.poster_imgUrl) {
            my_poster.imgPath = '';
            this.setData({
                popup_poster,
                my_poster
            });
            
            // res = await wx.getImageInfo({
            // 	src: choose_poster.poster_imgUrl
            // });
            // popup_poster.posters[id].poster_imgPath = res.path;
            // my_poster.imgPath = res.path;
            // this.setData({popup_poster,my_poster});

      let imgEx = choose_poster.poster_imgUrl.split('.').pop();

            if (imgEx == 'png') { // 服务器不支持png的特殊处理
                let sysfem_info = await api.getSystemInfo2(750, 1334, 1.3); // 背景图(宽,高,1.3)
                let {
                    popup_poster,
                    my_poster,
                    preffixUrl,
                    mine,
                    mycanvas
                } = that.data;
                console.log('ze');
               
                let {
                    width,
                    height,
                    unit
                } = mycanvas;
                console.log('sysfem_info',sysfem_info);
                mycanvas = {
                    width: sysfem_info.posterBoxWidth,
                    height: sysfem_info.posterBoxHeight,
                    unit: sysfem_info.unit,
                }

                that.setData({
                    mycanvas
                });
                if (id == '1') {
                    let filePath = wx.env.USER_DATA_PATH + '/' + new Date().getTime() + '_' + Math.round(Math.random() * (999 - 100) + 100) + `.${imgEx}`;
                    let url = ''
                    wx.downloadFile({
                        url:  preffixUrl + 'jhycfx.png' ,
                        filePath: filePath,
                        success: function (res) {
                            url = res.filePath;
                            let context = wx.createCanvasContext('mycanvas');
                            context.fillRect(0, 0, 750, 1216);
                            context.drawImage(url, 0, 0, 750, 1216); //背景绘制
                            var touxiang = that.data.avatar;
                            var nickname = '@' + that.data.nick + " 向您推荐";
                            context.setFillStyle("white");
                            context.setFillStyle('#333');
                            context.setFontSize(28);
                            context.setTextAlign('left');
                            context.fillText(nickname, 30, 1185); //昵称绘制
                            context.stroke();
                            context.setFontSize(20);
                            // context.fillText("长按立即申请", 565, 1196); //提示绘制
                            //绘制头像
                            context.setStrokeStyle('#fff');
                            context.setLineWidth(0);
                            context.arc(140, 1075, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
                            context.clip();
                            context.drawImage(touxiang, 70, 1005, 140, 140); //头像绘制
                            context.stroke();
                            context.draw();
                            var _time = setTimeout(function () {
                                wx.canvasToTempFilePath({
                                    canvasId: 'mycanvas',
                                    fileType: "jpg",
                                    quality: 0.7,
                                    success: function (add) {
                                        console.log(add);
                                        // wx.hideToast();
                                        my_poster.imgPath = add.tempFilePath;
                                        // popup_poster.posters[id].poster_imgPath = add.tempFilePath;
                                        that.setData({
                                            my_poster,
                                            popup_poster
                                        });
                                    },
                                    fail: function (err) {
                                        //console.log(err);
                                    }
                                });
                            }, 300);
                        }
                    });
                    
                } else if(id == '2') {
                    let filePath = wx.env.USER_DATA_PATH + '/' + new Date().getTime() + '_' + Math.round(Math.random() * (999 - 100) + 100) + `.${imgEx}`;
                    let url = ''
                    wx.downloadFile({
                        url:  preffixUrl + 'ycfx.png' ,
                        // filePath: filePath,
                        success: function (res) {
                            console.log(res);
                            url = res.tempFilePath;
                            let context = wx.createCanvasContext('mycanvas');
                            var touxiang = that.data.avatar;
                            var nickname = '@' + that.data.nick + " 向您推荐";
                            context.setFillStyle("white");
                            context.fillRect(0, 0, 750, 1216);
                            context.drawImage(url, 0, 0, 750, 1216); //背景绘制
                            context.setFillStyle('#333');
                            context.setFontSize(28);
                            context.setTextAlign('left');
                            context.fillText(nickname, 30, 1185); //昵称绘制
                            context.stroke();
                            context.setFontSize(20);
                            // context.fillText("长按立即申请", 565, 1196); //提示绘制
                            //绘制头像
                            context.setStrokeStyle('#fff');
                            context.setLineWidth(0);
                            context.arc(140, 1075, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
                            context.clip();
                            context.drawImage(touxiang, 70, 1005, 140, 140); //头像绘制
                            context.stroke();
                            context.draw();
                            var _time = setTimeout(function () {
                                wx.canvasToTempFilePath({
                                    canvasId: 'mycanvas',
                                    fileType: "jpg",
                                    quality: 0.7,
                                    success: function (add) {
                                        console.log(add);
                                        // wx.hideToast();
                                        my_poster.imgPath = add.tempFilePath;
                                        // popup_poster.posters[id].poster_imgPath = add.tempFilePath;
                                        that.setData({
                                            my_poster,
                                            popup_poster
                                        });
                                    },
                                    fail: function (err) {
                                        //console.log(err);
                                    }
                                });
                            }, 300);
                        }
                    });
                    
                } else {
                    
                    let filePath = wx.env.USER_DATA_PATH + '/' + new Date().getTime() + '_' + Math.round(Math.random() * (999 - 100) + 100) + `.${imgEx}`;
                wx.downloadFile({
                    url: choose_poster.poster_imgUrl,
                    filePath: filePath,
                    success: function (res) {
                        popup_poster.posters[id].poster_imgPath = res.filePath;
                        my_poster.imgPath = res.filePath;
                        that.setData({
                            popup_poster,
                            my_poster
                        });
                    }
                });
                }
              
              
                
            } else {
                wx.downloadFile({
                    url: choose_poster.poster_imgUrl,
                    success: function (res) {
                        popup_poster.posters[id].poster_imgPath = res.tempFilePath;
                        my_poster.imgPath = res.tempFilePath;
                        that.setData({
                            popup_poster,
                            my_poster
                        });
                    }
                });
            }

    } else {
      my_poster.imgPath = '';
      this.setData({
        popup_poster,
        my_poster
      });

      choose_poster.poster_drawFunc({
        id
      });
    }
  },

    share: async function (e) {
        let {
            popup_poster,
            preffixUrl,
            mine
        } = this.data;
        var that = this;
        let url1 = ''
        let url2 = ''
        let url3 = ''
        user.ifAuthUserInfo().then(res => {
            if (res) {
                var isCreat = that.data.imagePath;
                that.setData({
                    shareBox: "shareBox on",
                });
                if (isCreat) {
                    wx.hideToast();
                } else {
                    // wx.showToast({
                    //     title: "海报绘制中...",
                    //     icon: "loading",
                    //     mask: true,
                    //     duration: 20000,
                    // });

                    that.setData({
                        nick: app.globalData.userInfo.nickName, //授权昵称
                    });

                    wx.downloadFile({
                        url: app.globalData.userInfo.avatarUrl,
                        success: function (res) {
                            if (res.statusCode === 200) {
                                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                that.setData({
                                    avatar: res.tempFilePath, //授权头像
                                });


                            }
                        },
                    });
                    // let poster_imgUrl1,poster_imgUrl2,poster_imgUrl3
                    let poster_imgUrl2 = preffixUrl + 'jhycfx.png'
                    let poster_imgUrl3 = preffixUrl + 'ycfx.png'
                    var touxiang = that.data.avatar;
                    var nickname = '@' + that.data.nick + " 向您推荐";
                    let posters = [{
                            // img: preffixUrl + 'poster_default_20220217.png', // 无固定二维码，需动态合成
                            img: preffixUrl + 'poster_default_20211109.png', // 固定二维码
                            title: '通用版',
                            poster_imgPath: '',
                            // poster_imgUrl: preffixUrl + 'poster_default_20220217.png', // 无固定二维码，需动态合成
                            poster_imgUrl: preffixUrl + 'poster_default_20211109.png', // 固定二维码
                            share_params: `&channel=320000MIN&intid=${mine.intid}`,
                            poster_drawFunc: async ({
                                id,
                                channel = '320000MIN'
                            }) => {
                                let {
                                    popup_poster,
                                    my_poster,
                                    preffixUrl,
                                    mine,
                                    mycanvas
                                } = that.data;
                                console.log('ze');
                                let sysfem_info = await api.getSystemInfo2(750, 1334, 1.3); // 背景图(宽,高,1.3)
                                mycanvas = {
                                    width: sysfem_info.posterBoxWidth,
                                    height: sysfem_info.posterBoxHeight,
                                    unit: sysfem_info.unit,
                                }
                                that.setData({
                                    mycanvas
                                });
                                let {
                                    width,
                                    height,
                                    unit
                                } = mycanvas;

                                let promise_imgs = [];
                                let promise_arr = [];
                                let context = wx.createCanvasContext('mycanvas');
                                var touxiang = that.data.avatar;
                                var nickname = '@' + that.data.nick + " 向您推荐";
                                console.log('touxiang', touxiang);
                                console.log('nickname', nickname);
                                context.drawImage(promise_imgs[0], 0, 0, width, height);
                                context.save();
                                context.setFillStyle('#333');
                                context.setFontSize(28);
                                context.setTextAlign('left');
                                context.fillText(nickname, 30, 1205); //昵称绘制
                                context.setStrokeStyle('#fff');
                                context.setLineWidth(0);
                                context.clip();
                                context.drawImage(touxiang, 0, 0, 140, 140); //头像绘制
                                context.save();
                                context.drawImage(promise_imgs[1], 450 * unit, 1200 * unit, 120 * unit, 120 * unit);
                                context.save();
                                context.stroke();
                                // context.draw();
                                context.draw(false, function () {
                                    setTimeout(() => {
                                        wx.canvasToTempFilePath({
                                            canvasId: 'mycanvas',
                                            x: 0,
                                            y: 0,
                                            width: width,
                                            height: height,
                                            destWidth: width,
                                            destHeight: height,
                                            quality: 1,
                                            success: (res) => {
                                                my_poster.imgPath = res.tempFilePath;
                                                popup_poster.posters[id].poster_imgPath = res.tempFilePath;
                                                that.setData({
                                                    my_poster,
                                                    popup_poster
                                                });
                                            },
                                            fail: (err) => {

                                            },
                                        });
                                    }, 200);
                                });
                                await Promise.all(promise_arr);
                                promise_arr.push(
                                    new Promise(function (resolve, reject) {
                                        wx.getImageInfo({
                                            // src: preffixUrl + 'poster_default_20220217.png', // 无固定二维码，需动态合成
                                            src: preffixUrl + 'poster_default_20211109.png', // 固定二维码
                                            success: function (res) {
                                                promise_imgs.push(res.path);
                                                resolve(res);
                                            },
                                            fail: function (err) {
                                                reject(err);
                                            },
                                        });
                                    })
                                );
                                promise_arr.push(
                                    new Promise(function (resolve, reject) {
                                        api.generateMiniCode('sub3/pages/bbx/home', 'bbx' + mine.intid + channel).then((res) => {
                                            if (res) {
                                                promise_imgs.push(res);
                                                resolve();
                                            } else {
                                                reject();
                                            }
                                        });
                                    })
                                );
                                console.log('promise_arr', promise_arr);



                            },
                        },
                        {
                            // img: preffixUrl + 'poster_default_taodu_20220217.png', // 无固定二维码，需动态合成
                            img: preffixUrl + 'poster_default_taodu_20211109.png', // 固定二维码
                            title: '宜兴定制版',
                            poster_imgPath: '',
                            // poster_imgUrl: preffixUrl + 'poster_default_taodu_20220217.png', // 无固定二维码，需动态合成
                            poster_imgUrl: preffixUrl + 'jhycfx.png', // 固定二维码
                            // poster_imgUrl: '', // 固定二维码
                            share_params: `&channel=320282MIN&intid=${mine.intid}`,
                            // poster_drawFunc: async ({
                            //     id,
                            //     channel = '320282MIN'
                            // }) => {
                            //     let {
                            //         popup_poster,
                            //         my_poster,
                            //         preffixUrl,
                            //         mine,
                            //         mycanvas
                            //     } = that.data;

                            //     let sysfem_info = await api.getSystemInfo2(750, 1232, 1.3); // 背景图(宽,高,1.3)
                            //     mycanvas = {
                            //         width: sysfem_info.posterBoxWidth,
                            //         height: sysfem_info.posterBoxHeight,
                            //         unit: sysfem_info.unit,
                            //     }
                            //     that.setData({
                            //         mycanvas
                            //     });
                            //     let {
                            //         width,
                            //         height,
                            //         unit
                            //     } = mycanvas;

                            //     let promise_imgs = [];
                            //     let promise_arr = [];
                            //     promise_arr.push(
                            //         new Promise(function (resolve, reject) {
                            //             wx.getImageInfo({
                            //                 // src: preffixUrl + 'poster_default_taodu_20220217.png', // 无固定二维码，需动态合成
                            //                 src: preffixUrl + 'jhycfx.png', // 固定二维码
                            //                 success: function (res) {
                            //                     promise_imgs.push(res.path);
                            //                     resolve(res);
                            //                 },
                            //                 fail: function (err) {
                            //                     reject(err);
                            //                 },
                            //             });
                            //         })
                            //     );
                            //     promise_arr.push(
                            //         new Promise(function (resolve, reject) {
                            //             api.generateMiniCode('sub3/pages/bbx/home', 'bbx' + mine.intid + channel).then((res) => {
                            //                 if (res) {
                            //                     promise_imgs.push(res);
                            //                     resolve();
                            //                 } else {
                            //                     reject();
                            //                 }
                            //             });
                            //         })
                            //     );
                            //     await Promise.all(promise_arr);
                            //     var touxiang = this.data.avatar;
                            //     var nickname = '@' + this.data.nick + " 向您推荐";
                            //     let context = wx.createCanvasContext('mycanvas');
                            //     context.setFillStyle("white");
                            //     context.drawImage(promise_imgs[0], 0, 0, 375, 1020);
                            //     context.save();
                            //     // context.drawImage(promise_imgs[1], 500 * unit, 1000 * unit, 300 * unit, 200 * unit);
                            //     console.log('touxiang', touxiang);
                            //     console.log('nickname', nickname);

                            //     // context.drawImage(promise_imgs[0], 0, 0, width, height);
                            //     context.setFillStyle('#333');
                            //     context.setFontSize(28);
                            //     context.setTextAlign('left');
                            //     context.fillText(nickname, 0, 0);
                            //     context.save();
                            //     // context.arc(140, 1095, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
                            //     context.clip();
                            //     context.drawImage(touxiang, 0 * unit, 0 * unit, 140 * unit, 140 * unit); //头像绘制
                            //     // context.drawImage(promise_imgs[1], 450 * unit, 1200 * unit, 120 * unit, 120 * unit);

                            //     context.save();

                            //     context.draw(false, function () {
                            //         setTimeout(() => {
                            //             wx.canvasToTempFilePath({
                            //                 canvasId: 'mycanvas',
                            //                 x: 0,
                            //                 y: 0,
                            //                 width: width,
                            //                 height: height,
                            //                 destWidth: width,
                            //                 destHeight: height,
                            //                 quality: 1,
                            //                 success: (res) => {
                            //                     my_poster.imgPath = res.tempFilePath;
                            //                     popup_poster.posters[id].poster_imgPath = res.tempFilePath;
                            //                     popup_poster.posters[id].poster_imgUrl = res.tempFilePath;
                            //                     that.setData({
                            //                         my_poster,
                            //                         popup_poster
                            //                     });
                            //                 },
                            //                 fail: (err) => {

                            //                 },
                            //             });
                            //         }, 200);
                            //     });
                            // },
                        },
                        {
                            // img: preffixUrl + 'poster_default_hjyc_20220217.png', // 无固定二维码，需动态合成
                            img: preffixUrl + 'poster_default_hjyc_20211210.png', // 固定二维码
                            title: '海聚英才',
                            poster_imgPath: '',
                            // poster_imgUrl: preffixUrl + 'poster_default_hjyc_20220217.png', // 无固定二维码，需动态合成
                            poster_imgUrl: preffixUrl + 'ycfx.png', // 固定二维码
                            share_params: `&channel=310000MIN&intid=${mine.intid}`,
                            poster_drawFunc: async ({
                                id,
                                channel = '310000MIN'
                            }) => {
                                let {
                                    popup_poster,
                                    my_poster,
                                    preffixUrl,
                                    mine,
                                    mycanvas
                                } = that.data;

                                let sysfem_info = await api.getSystemInfo2(750, 1232, 1.3); // 背景图(宽,高,1.3)
                                mycanvas = {
                                    width: sysfem_info.posterBoxWidth,
                                    height: sysfem_info.posterBoxHeight,
                                    unit: sysfem_info.unit,
                                }
                                that.setData({
                                    mycanvas
                                });
                                let {
                                    width,
                                    height,
                                    unit
                                } = mycanvas;

          let promise_imgs = [];
          let promise_arr = [];
          promise_arr.push(
            new Promise(function (resolve, reject) {
              wx.getImageInfo({
                // src: preffixUrl + 'poster_default_hjyc_20220217.png', // 无固定二维码，需动态合成
                src: preffixUrl + 'poster_default_hjyc_20211210.png', // 固定二维码
                success: function (res) {
                  promise_imgs.push(res.path);
                  resolve(res);
                },
                fail: function (err) {
                  reject(err);
                },
              });
            })
          );
          promise_arr.push(
            new Promise(function (resolve, reject) {
              api.generateMiniCode('sub3/pages/bbx/home', 'bbx' + mine.intid + channel).then((res) => {
                if (res) {
                  promise_imgs.push(res);
                  resolve();
                } else {
                  reject();
                }
              });
            })
          );
          await Promise.all(promise_arr);

                                let context = wx.createCanvasContext('mycanvas');
                                console.log('promise_imgs', promise_imgs);
                                context.drawImage(promise_imgs[0], 0, 0, width, height);
                                context.save();
                                var touxiang = that.data.avatar;
                                var nickname = '@' + that.data.nick + " 向您推荐";
                                console.log('touxiang', touxiang);
                                console.log('nickname', nickname);
                                context.drawImage(promise_imgs[0], 0, 0, width, height);
                                context.save();
                                context.setTextAlign('left');
                                context.setFontSize(54 * unit);
                                context.setFillStyle('#FFFFFF');
                                context.fillText(nickname, 0, 0);
                                context.save();
                                context.arc(140, 1095, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
                                context.clip();
                                context.drawImage(touxiang, 652 * unit, 1729 * unit, 180 * unit, 180 * unit); //小程序码
                                context.save();
                                // context.drawImage(touxiang, 70, 1025, 140, 140); //头像绘制
                                context.drawImage(promise_imgs[1], 500 * unit, 1000 * unit, 200 * unit, 200 * unit);
                                context.save();

          context.draw(false, function () {
            setTimeout(() => {
              wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                x: 0,
                y: 0,
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
                quality: 1,
                success: (res) => {
                  my_poster.imgPath = res.tempFilePath;
                  popup_poster.posters[id].poster_imgPath = res.tempFilePath;
                  that.setData({
                    my_poster,
                    popup_poster
                  });
                },
                fail: (err) => {

                },
              });
            }, 200);
          });
        },
      },
    ];

                    popup_poster.posters = posters;
                    popup_poster.show = true;
                    console.log('popup_poster', popup_poster);
                    that.setData({
                        popup_poster
                    });
                }
            } else {
                that.setData({
                    loginFlag: false,
                });
            }
        })

    },

  popupClose(e) {
    let {
      event
    } = e.currentTarget.dataset;

    if (event == 'popup_phone') {
      wx.showToast({
        title: '请授权手机号',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    this.setData({
      [event + '.show']: false,
    });
  },

  async phoneGet(e) {
    let {
      popup_phone
    } = this.data;
    wx.showLoading({
      title: '获取中...',
    });

    let phone = await talent.phoneDecrypt(e);
    if (!phone) {
      wx.showToast({
        title: '请授权手机号',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    popup_phone.show = false;

    wx.hideLoading();
    this.setData({
      popup_phone
    });
  },

  navTap: function (e) {
    let {
      tracking
    } = e.currentTarget.dataset;
    talent.tracking(tracking);
  },

    async toTalentPage(a) {
        console.log(a.currentTarget.dataset.type);
        if (a.currentTarget.dataset.type == '0') {

            talent.tracking(5);
            wx.showLoading({
                title: '跳转中',
                mask: true,
            });
            let {
                bbx_channel
            } = this.data;
            let talent_channel = utils.getBBXChannel().talent_channel;
            try {
                const userInfo = await user.getIdentityInfo();
                console.log(
                    'userInfo', userInfo
                );
                this.setData({
                    userInfo
                })
                await user.getRencai(userInfo.ID_NUMBER);
                wx.navigateTo({
                    url: `/sub1/pages/info/set_rencai?talentname=${userInfo.NAME}&channel=${talent_channel}&bbx_channel=${bbx_channel}`,
                });
                wx.hideLoading();
            } catch (error) {
                wx.hideLoading();
                if (error === 'unSelectIdcard') {
                    wx.showModal({
                        title: '提示',
                        content: '请先进行身份认证',
                        showCancel: false,
                        confirmText: '确定',
                        success: (result) => {
                            if (result.confirm) {
                                wx.navigateTo({
                                    url: '/sub1/pages/auth/index',
                                });
                            }
                        },
                    });
                } else if (error === 'unRencai') {
                    wx.navigateTo({
                        url: `/sub1/pages/creditStationPerson/show?channel=${talent_channel}&bbx_channel=${bbx_channel}`,
                    });
                } else {
                    wx.showModal({
                        title: '提示',
                        content: error.message || error,
                        showCancel: false,
                        confirmText: '确定',
                        success: (result) => {
                            if (result.confirm) {}
                        },
                    });
                }
            }
        } else {
            let location = JSON.stringify(this.data.location)
            wx.navigateTo({
                url: `/sub3/pages/bbx/technology?location=` + location,
            });
            // wx.showModal({

            //   content: '敬请期待',
            //   showCancel: false,
            //   confirmText: '确定',
            //   success: (result) => {
            //     if (result.confirm) {}
            //   },
            // });
        }
    },
    getUrl(e) {
        console.log(e.currentTarget.dataset);
        if (e.currentTarget.dataset.APP_IDTYPE == '1') {
            wx.navigateTo({
                url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(e.currentTarget.dataset.url),
            });
        } else if (e.currentTarget.dataset.appid == '') {
            console.log(11);
            wx.navigateTo({
                url: e.currentTarget.dataset.url,
            });

        } else {
            wx.navigateToMiniProgram({
                appId: e.currentTarget.dataset.appid,
                path: e.currentTarget.dataset.url,
                envVersion: 'release',
                success(res) {
                    // 打开成功
                },
                fail(res) {
                    // 打开失败
                },
                complete(res) {
                    // 调用结束  不管成功还是失败都执行
                }
                /**
                 * appId：跳转到的小程序app-id
                 * path：打开的页面路径，如果为空则打开首页，path 中 ? 后面的部分会成为 query，在小程序的 App.onLaunch、App.onShow 和 Page.onLoad的回调函数中获取query数据
                 * extraData：需要传递给目标小程序的数据，目标小程序可在 App.onLaunch、App.onShow 中获取到这份数据
                 * envVersion：要打开的小程序版本，有效值: develop（开发版），trial（体验版），release（正式版），仅在当前小程序为开发版或体验版时此参数有效，如果当前小程序是正式版，则打开的小程序必定是正式版
                 */
            })
        }

    },
    phoneCall: function (e) {
        let {
            phone
        } = e.currentTarget.dataset;
        if (phone) {
            wx.makePhoneCall({
                phoneNumber: phone,
            })
        }
    },
    toHJYC() {
        wx.navigateToMiniProgram({
            appId: "wx3df07dc2d19f6433",
            path: "pages/home",
            envVersion: 'trial', // release
            success(res) {},
        });
    },

  comingSoom: function (e) {
    wx.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 2000,
    });
  },

  onRegionChange: function (e) {
    let {
      detail
    } = e;
    let {
      code,
      value
    } = detail
    console.log(e);;
    let location = {
      adcode: code[2],
      province: value[0],
      city: value[1],
      district: value[2],
      codes: code,
      values: value,
    }
    this.setData({
      location: location,
      location2: JSON.stringify(location),
    })
    this.staffByLocation()
    console.log();
  },

  locationInit: async function (e) {
    let {
      location,
      location_json,
      bbx_channel
    } = this.data;

    switch (bbx_channel) {
      case '320282': {
        location = await utils.getLocationByAdcode(bbx_channel);
      }
      break;
    case '310000': {
      location = await utils.getLocationByAdcode(bbx_channel);
    }
    break;
    default: {
      location = await utils.getUserLocation();
    }
    break;
    }
    location_json = JSON.stringify(location);
    let location2 = location_json
    console.log(location);
    this.setData({
      location,
      location_json,
      location2
    });
    this.staffByLocation()
  },

  authIndex(e) {
    wx.showModal({
      title: '提示',
      content: '请您先授权登录',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            // url: '/sub1/pages/auth/index',
            url: '/pages/mine/mine',
          })
        } else {
          wx.navigateBack({
            // delta: 1,
          })
        }
      }
    });
  },

  async setChannel(channel) {
    let {
      bbx_channel,
      talent_channel,
      sui_channel,
      track_channel
    } = this.data;
    utils.setBBXChannel(channel);
    bbx_channel = utils.getBBXChannel().channel;
    talent_channel = utils.getBBXChannel().talent_channel;
    sui_channel = utils.getBBXChannel().sui_channel;
    track_channel = utils.getBBXChannel().track_channel;
    this.setData({
      bbx_channel,
      talent_channel,
      sui_channel,
      track_channel
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      options
    });
    // if (app.globalData.phones) {
    //   api
    //     .getPhoneNumber(e)
    //     .then((phone) => {
    //       //console.log(phone)

    //     })
    // }
    let {
      channel
    } = options;
    channel = channel || app.globalData.channel || "";
    if (options.channel == '000000QYB') {
        await this.setChannel(options.channel);
        talent.tracking(1, {
            share_intid: options.intid,
          });
      
    }
    await this.setChannel(channel);
    this.getImageList()
    this.locationInit();
    // this.staffByLocation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function (e) {

    let {
      mine,
      popup_phone,
      options
    } = this.data;
    let res;

    mine = await talent.getMine();
    if (!mine.openid && !options.channel == '000000QYB') {
      this.authIndex();
      return;
    }

    // 授权弹框方案
    popup_phone.show = mine.phone ? false : true;
    this.setData({
      mine,
      popup_phone
    });

    // 授权页方案
    if (!mine.phone) {
      wx.navigateTo({
        url: '/sub3/pages/bbx/authorize',
      });
      return;
    }

    this.setData({
      mine
    });

    // 记录分享来自
    // bbx+int_id（10位）+渠道号（6位） e.g. bbx1100093041310000MIN
    // options.scene = 'bbx1100093041310000MIN' //test@xwl 扫二维码进入
    let share_by = {
      intid: '', // 分享人intid
      openid: '', // 分享人openid
      channel: '', // 分享渠道
      way: '', // 分享方式 0-右上角 1-二维码
    }
    if (options.scene) { // 扫二维码进入
      let scenes = decodeURIComponent(options.scene).split('a');
      if (scenes[0] && scenes[0].substr(0, 3) == 'bbx') {
        share_by.intid = scenes[0].substr(3, 10);
        share_by.channel = scenes[0].substr(13);
        share_by.way = '1';
        await this.setChannel(share_by.channel);
      }
    } else { // 非二维码进入
      if (options.intid) { // 链接自带分享者
        share_by.intid = options.intid; // 分享人
      } else {
        res = await talent.getShareIntid({
          openid: mine.openid
        });
        share_by.intid = res.intid || '';
      }
      if (share_by.intid) {
        share_by.channel = options.channel || this.data.track_channel;
        share_by.way = '0';
      }
    }
    if (share_by.intid) {
      share_by.openid = await app.getOpenIdByID(share_by.intid);
    }
    if (share_by.openid) { // 确有其分享者
      res = await app.getShareInfo(share_by.openid, mine.openid);
      if (!res[0]) {
        app.addShareInfo({
          share_person: share_by.channel, // 分享渠道
          share_website: 'sub3/pages/bbx/home', // 分享网址
          share_click: mine.openid, // 被分享人
          share_date: util.formatTime(new Date()),
          share_way: share_by.way, // 0-右上角 1-二维码
          emp_no: '',
          text1: share_by.intid, // 分享人
        });
      }
    }
    this.setData({
      share_by
    });

    // talent_record记录
    if (options.channel == '310000MIN' && options.tel && options.idcard) { // 特殊渠道判断特殊参数
      res = await talent.rsaTalent({
        tel: decodeURIComponent(options.tel),
        idcard: decodeURIComponent(options.idcard),
      })

      if (res.tel) {
        talent.tracking(1, {
          phone: res.tel || '',
          idcard: res.idcard || '',
          talent_level: options.level || '',
          share_intid: share_by.intid,
        });
        this.setData({
          phone: res.tel || '',
          idcard: res.idcard || '',
          talent_level: options.level || '',
          share_intid: share_by.intid,
        })
      }
    } else {
      talent.tracking(1, {
        share_intid: share_by.intid,
      });
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let {
      cndUrl,
      preffixUrl,
      my_poster,
      bbx_channel,
      track_channel,
      mine
    } = this.data;

    let imgPath = cndUrl + '/static/wechat/img/sui/sui-1021.png';
    if (my_poster.imgPath) {
      imgPath = my_poster.imgPath;
    } else {
      if (bbx_channel == '320282') {
        // imgPath = preffixUrl + 'poster_default_taodu_20220217.png'; // 无固定二维码，需动态合成
        imgPath = preffixUrl + 'poster_default_taodu_20211109.png'; // 固定二维码
      } else if (bbx_channel == '310000') {
        // imgPath = preffixUrl + 'poster_default_hjyc_20220217.png'; // 无固定二维码，需动态合成
        imgPath = preffixUrl + 'poster_default_hjyc_20211210.png'; // 固定二维码
      } else {
        // imgPath = preffixUrl + 'poster_default_20220217.png'; // 无固定二维码，需动态合成
        imgPath = preffixUrl + 'poster_default_20211109.png'; // 固定二维码
      }
    }

    let params = `&channel=${track_channel}&intid=${mine.intid}`;
    if (my_poster.share_params) {
      params = my_poster.share_params;
    }

    let title = '人才服务百宝箱';
    let url = '';

    return api.shareApp(imgPath, params, title, url);
  },

});