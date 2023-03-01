// sub8/pages/agriculture/index.js projectCooperation

const app = getApp();
import user from '../../../utils/user';
import Chat from '../../../api/Chat';
import api from "../../../utils/api"
import utils from './utils';
import talent from './talent';
// const chat = new Chat();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stationNameMove: null,
    cndUrl: app.globalData.CDNURL,
    cndUrls: 'https://wxapp.jsbchina.cn:7080/rhedt//',
    openid: wx.getStorageSync('openid'),
    keywords: '',
    preffixUrls: utils.preffixUrl(),
    preffixUrl: app.globalData.URL,
    catalogueList: [{
        title: '融资服务',
        type: 0,
        list: [{
            ACTION: "1",
            CODE: "snd",
            DEPT: "A",
            NAME: "苏农贷",
            REGION: "1",
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            url: '/sub1/pages/xnd/index',
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
          {
            ACTION: "1",
            CODE: "hjd",
            DEPT: "A",
            NAME: "农业担保贷款",
            REGION: "1",
            url: '/pages/nong/index',
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
          {
            ACTION: "1",
            CODE: "nhjyd",
            DEPT: "A",
            NAME: "农户经营贷",
            REGION: "1",
            url: '/sub1/pages/sui/index',
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
          {
            ACTION: "1",
            CODE: "cclld",
            DEPT: "A",
            NAME: "仓储冷链贷",
            url: '/sub1/pages/warehousing/index',
            REGION: "1",
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
          {
            ACTION: "1",
            CODE: "hayhygfpd",
            DEPT: "A",
            NAME: "淮安分行阳光扶贫贷",
            url: '/pages/sunshine/index',
            REGION: "1",
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
          {
            ACTION: "1",
            CODE: "ztclogo",
            DEPT: "A",
            NAME: "信贷直通车",
            url: '/pages/sunshine/index',
            REGION: "1",
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
        ],
      },
      {
        title: '综合服务',
        type: 1,
        list: [{
            ACTION: "1",
            CODE: "zhfw1",
            DEPT: "A",
            NAME: "账户服务",
            url: '/sub8/pages/agriculture/more?type=1',
            REGION: "1",
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
          {
            ACTION: "1",
            CODE: "ttlclogo",
            DEPT: "A",
            NAME: "天天理财",
            url: '/sub8/pages/agriculture/more?type=2',
            REGION: "1",
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
          {
            ACTION: "1",
            CODE: "shfw1",
            DEPT: "A",
            NAME: "商户服务",
            url: '/sub8/pages/agriculture/more?type=3',
            REGION: "1",
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
          {
            ACTION: "1",
            CODE: "xfjr1",
            DEPT: "A",
            NAME: "消费金融",
            url: '/sub8/pages/agriculture/more?type=4',
            REGION: "1",
            SEQUENCE: "1",
            STATUS: "1",
            SUMMARY: "让您的融资不再难",
            TYPE: "M",
            UPDATE_DATE: "20200421",
          },
        ]
      }
    ],
    menuList: [{
        name: '贷款融资',
        contont: '让您的融资不再难',
        imageUrlL: '/static/wechat/img/zssn/dkrz.png',
        colour: '#3995FF ',
        type: '0'
      },
      {
        name: '账户服务',
        contont: '移动预约 自动填单',
        imageUrlL: '/static/wechat/img/zssn/zhfw.png',
        colour: '#45BF03 ',
        type: '1'
      },
      {
        name: '天天理财',
        contont: '您的财富管理助手',
        imageUrlL: '/static/wechat/img/zssn/ttlc.png',
        colour: '#FF9E4F ',
        type: '2'
      },
      {
        name: '商户服务',
        contont: '您的收银管家',
        imageUrlL: '/static/wechat/img/zssn/shfw.png',
        colour: '#8780DF ',
        type: '3'
      },
    ],
    synthesizeList: [{
        name: '网点查询',
        url: '/sub2/pages/map/index',
        imageUrl: 'wdcx'
      },
      {
        name: '房产评估',
        url: '/pages/house/house',
        imageUrl: 'fcgj'
      },
      {
        name: '房贷计算器',
        url: '/pages/showWeb/showWeb?skipUrl=https://csh.jsbchina.cn/eHomeLife/calculator/monthLimitCalculator.do',
        imageUrl: 'grsjyh'
      },
      {
        name: '农村产权交易',
        url: '/sub8/pages/agriculture/propertyRight',
        imageUrl: 'nccqjy'
      },
    ],
    chaX: 0, // 转换值X
    chaY: 0, // 转换值Y
    touch: false, // 触摸标记
    posX: 270, // 初始位置
    posY: 418, // 初始位置
    loginFlag: true, //授权提示控制
    hidePoster: true, //隐藏海报
    maskHidden: true, //控制遮罩层
    hidePoster: true,
    showApply: true,
    infoFlag: 5,
    showPosterBox: false,
    preffixUrl: app.globalData.CDNURL,
    nick: "", //授权昵称
    avatar: "", //授权头像
    wechat: "", //本详情页二维码
    // bg: "/static/wechat/img/gjx/fxbj.jpg", //图片背景图
    //touxiang: "/pages/public/img/temp/touxiang.jpg",//头像路径
    maskHidden: true, //控制遮罩层
    edushow: true,
    imagePath: "", //存放canvas生成的图片
    canvasId: "mycanvas",
    loginFlag: true,
    submit: true,
    isScroll: true,
    userInfo: {},
    newbg: '',
    wechat: '',
    inputBottom: 0,
    top: "10vh",
    height: "75vh",
    empNo: '',
    ACCESS_PATH: '首页访问量',
    location_json: null,
    bgzssn: '/static/wechat/img/zssn/zssnhb.png',
    bgztc: '/static/wechat/img/zssn/ztchb2.png',
    // bg: "/static/wechat/img/zssn/ztchb2.png", //图片背景图
    bg: "", //图片背景图
    showPosterBox: false,
    posterImgs: [{
        img: app.globalData.CDNURL + '/static/wechat/img/zssn/zssnhb.png',
        title: '掌上三农',
        poster: '',
      },
      {
        img: app.globalData.CDNURL + '/static/wechat/img/zssn/ztchb2.png',
        title: '信贷直通车',
        poster: '',
      },

    ],
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
    mine: {},
  },
  //点击分享
  showShare: function () {
    var that = this;
    that.setData({
      showPosterBox: true,
    });
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
          let poster_imgUrl2 = app.globalData.CDNURL + '/static/wechat/img/zssn/zssnhb.png'
          let poster_imgUrl3 = preffixUrl + 'ycfx.png'
          var touxiang = that.data.avatar;
          var nickname = '@' + that.data.nick + " 向您推荐";
          let posters = [{
              // img: preffixUrl + 'poster_default_20220217.png', // 无固定二维码，需动态合成
              img: app.globalData.CDNURL + '/static/wechat/img/zssn/zssnhb.png', // 固定二维码
              title: '掌上三农',
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
              img: app.globalData.CDNURL + '/static/wechat/img/zssn/ztchb2.png', // 固定二维码
              title: '信贷直通车',
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

      ' my_poster.imgPath': ''
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
        console.log('sysfem_info', sysfem_info);
        mycanvas = {
          width: sysfem_info.posterBoxWidth,
          height: sysfem_info.posterBoxHeight,
          unit: sysfem_info.unit,
        }

        that.setData({
          mycanvas
        });
        console.log(id);
        if (id == '0') {
          let filePath = wx.env.USER_DATA_PATH + '/' + new Date().getTime() + '_' + Math.round(Math.random() * (999 - 100) + 100) + `.${imgEx}`;
          console.log('id', id);
          console.log('filePath', filePath);
          let url = ''
          wx.downloadFile({
            url: app.globalData.CDNURL + '/static/wechat/img/zssn/zssnhb.png',
            filePath: filePath,
            success: function (res) {
              console.log(res);
              url = res.filePath;
              let context = wx.createCanvasContext('mycanvas');
              context.drawImage(url, 0, 0, 750, 1216); //背景绘制
              context.drawImage(that.data.wechat, 440, 1090, 120, 120); //小程序码
              
              context.setFillStyle('#333');
              context.setFontSize(30);
              context.setTextAlign('left');
              context.stroke();
              context.setFontSize(20);
             
              //绘制头像
              context.setStrokeStyle('#333');
              context.setLineWidth(0);
              context.clip();
              context.stroke();
              console.log(1111);
              context.draw()
              setTimeout(() => {
                wx.canvasToTempFilePath({
                  canvasId: 'mycanvas',
                  fileType: "png",
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
                    console.log(err);
                  }
                });
              }, 200);
              // context.draw(true, function () {
              // });
              // my_poster.imgPath = url;
              // // popup_poster.posters[id].poster_imgPath = add.tempFilePath;
              // that.setData({
              //   my_poster,
              //   popup_poster
              // });
             
              console.log('my_poster',my_poster);
            }
          });

        } else if (id == '1') {
          let filePath = wx.env.USER_DATA_PATH + '/' + new Date().getTime() + '_' + Math.round(Math.random() * (999 - 100) + 100) + `.${imgEx}`;
          console.log('id', id);
          console.log('filePath', filePath);
          let url = ''
          wx.downloadFile({
            url: app.globalData.CDNURL + '/static/wechat/img/zssn/ztchb2.png',
            filePath: filePath,
            success: function (res) {
              console.log(res);
              url = res.filePath;
              let context = wx.createCanvasContext('mycanvas');
              context.drawImage(url, 0, 0, 750, 1216); //背景绘制
              // context.drawImage(that.data.wechat, 440, 1090, 120, 120); //小程序码bb
              
              context.setFillStyle('#333');
              context.setFontSize(30);
              context.setTextAlign('left');
              context.stroke();
              context.setFontSize(20);
             
              //绘制头像
              context.setStrokeStyle('#333');
              context.setLineWidth(0);
              context.clip();
              context.stroke();
              console.log(1111);
              context.draw()
              setTimeout(() => {
                wx.canvasToTempFilePath({
                  canvasId: 'mycanvas',
                  fileType: "png",
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
                    console.log(err);
                  }
                });
              }, 200);
              // context.draw(true, function () {
              // });
              // my_poster.imgPath = url;
              // // popup_poster.posters[id].poster_imgPath = add.tempFilePath;
              // that.setData({
              //   my_poster,
              //   popup_poster
              // });
             
              console.log('my_poster',my_poster);
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
  posterCreate: function (e) {
    let {
      popup_poster,
      my_poster
    } = this.data;
    console.log('my_poster',my_poster);
    popup_poster.show = false;
    my_poster.shareBox = 'shareBox on';
    my_poster.hidePoster = false;
    this.setData({
      popup_poster,
      my_poster
    })
  },
  // async choosePoster(e) {

  //   var that = this;
  //   let index = e.currentTarget.dataset.id;
  //   that.setData({
  //     bg: '',
  //     imagePath: '',
  //     canvasHidden: false,
  //     posterIdselected: e.currentTarget.dataset.id,
  //   });

  //   if (e.currentTarget.dataset.url) {
  //     that.setData({
  //       bg: e.currentTarget.dataset.url,
  //     });
  //   } else {
  //     that.setData({
  //       imagePath: '',
  //     });

  //   }
  // },
  // createPoster() {
  //   var that = this;
  //   //let cxt_arc = wx.createCanvasContext('canvasArc'); //创建并返回绘图上下文context对象。
  //   // cxt_arc.draw(cxt_arc);
  //   // //console.log(cxt_arc)
  //   // 查看是否授权
  //   var isCreat = that.data.imagePath;
  //   that.setData({
  //     shareBox: "shareBox on",
  //   });
  //   if (isCreat) {
  //     wx.hideToast();
  //   } else {
  //     wx.showToast({
  //       title: "海报绘制中...",
  //       icon: "loading",
  //       mask: true,
  //       duration: 20000,
  //     });
  //     //把背景图片保存到本地
  //     console.log(this.data.bg);
  //     wx.downloadFile({
  //       url: this.data.bg,
  //       success: function (res) {
  //         console.log('res', res);
  //         if (res.statusCode === 200) {
  //           // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
  //           that.setData({
  //             newbg: res.tempFilePath,
  //           });
  //           that.showCreat();

  //         }
  //         //console.log(res.tempFilePath);
  //       },
  //     });

  //   }
  // },
  // 跳转需求适配
  getAdaptive() {
    wx.navigateTo({
      url: "/sub9/pages/agriculture/shipei3"
    })
  },
  // 开始触摸
  touchStart: function (e) {
    console.log("== touchStart =="); // 拖动开始
    // e.touches[0] 内容就是触摸点的坐标值
    var tranX = e.touches[0].pageX - this.data.posX;
    var tranY = e.touches[0].pageY - this.data.posY;
    console.log("start tranX: " + tranX);
    console.log("start tranY: " + tranY);
    // 存储chaX和chaY 并设置 touch: true
    this.setData({
      touch: true,
      chaX: tranX,
      chaY: tranY
    });
  },
  // 触摸移动
  touchMove: function (e) {
    if (!this.data.touch) return;
    // e.touches[0] 内容就是触摸点的坐标值
    var new_posX = e.touches[0].pageX - this.data.chaX;
    var new_posY = e.touches[0].pageY - this.data.chaY;
    console.log(" move new_posX: " + new_posX);
    console.log(" move nwe_posY: " + new_posY);
    this.setData({
      posX: new_posX,
      posY: new_posY
    });
  },
  // 触摸结束
  touchEnd: function (e) {
    console.log("== touchEnd ==")
    if (!this.data.touch) return;
    this.setData({
      touch: false,
      chaX: 0,
      chaY: 0
    });
  },
  // 获取焦点事件
  bindfocus(e) {
    this.setData({
      isScroll: false
    })
  },
  // 失去焦点事件
  closeblur(e) {
    this.setData({
      isScroll: true
    })
  },
  stationNameBlur() {
    this.setData({
      stationNameMove: null // 这里必须是null
    })
  },
  getZt() {
    let skipUrl = `https://xnzb.org.cn/xdztc/src/ztc/login.html`;
    console.log(skipUrl);
    wx.navigateTo({
      url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.showCreat()
    api.getSystemInfo2(750, 1346, 1.4).then((res) => {
      console.log('res0', res);
      this.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        empNo: this.data.empNo ? this.data.empNo : app.globalData.empNo,
        screenWidth: res.systemInfo.screenWidth,
      });
    });


    user.ifAuthUserInfo().then((res) => {
      if (res) {
        that.setData({
          loginFlag: true,
        });
      } else {
        that.setData({
          loginFlag: false,
        });
      }
    });


  },
  initData: async function (options) {
    let {
      location,
      location_json,
      locData,
      mkData,
      bbx_channel
    } = this.data;

    bbx_channel = utils.getBBXChannel().channel;

    // location_json = options.location;
    // location = location_json?JSON.parse(location_json):{};
    // if (!location.adcode) {
    location = await utils.getUserLocation();
    console.log(location);
    location_json = JSON.stringify(location);
    // }
    console.log('location_json', location_json);




    // mkData.find(x=>x.distance_km)
    locData = JSON.parse(location_json);

    let search_location = locData
    console.log('location_json', location_json);
    this.setData({
      location,
      location_json,
      mkData,
      locData,
      bbx_channel,
      search_location
    })

    this.saveUsInfo()
  },
  async saveUsInfo() {

    let city = JSON.parse(this.data.location_json).city
    let name = ''
    if (!app.globalData.userInfo || !app.globalData.userInfo.nickName) {
      name = '陌生用户'
    } else {
      name = app.globalData.userInfo.nickName
    }
    let data = {
      flag: JSON.stringify(this.data.infoFlag),
      openId: this.data.openid,
      ACCESS_PATH: this.data.ACCESS_PATH,
      location: city,
      NAME: name
    }
    console.log(data);
    talent.saveUsInfo(data).then(res => {
      console.log(res);
      this.setData({
        infoFlag: 5,
        ACCESS_PATH: '首页访问量',
      })
    })
  },
  // createPoster() {
  //   console.log(1);
  //   var that = this;
  //   that.closePopUp();
  //   that.setData({
  //     shareBox: 'shareBox on',
  //     hidePoster: false,
  //   });

  // },
  logincancel: function () {
    var that = this;
    that.setData({
      loginFlag: true,
    });
  },
  closePopUp() {
    this.setData({
      showPosterBox: false,
      showComplain: false,
    });
    console.log(this.data);
  },
  //点击分享
  // showShare: function () {
  //   var that = this;
  //   //let cxt_arc = wx.createCanvasContext('canvasArc'); //创建并返回绘图上下文context对象。
  //   // cxt_arc.draw(cxt_arc);
  //   // //console.log(cxt_arc)
  //   // 查看是否授权
  //   var isCreat = that.data.imagePath;
  //       that.setData({
  //         shareBox: "shareBox on",
  //       });
  //       if (isCreat) {
  //         wx.hideToast();
  //       } else {
  //         wx.showToast({
  //           title: "海报绘制中...",
  //           icon: "loading",
  //           mask: true,
  //           duration: 20000,
  //         });

  //         that.showCreat();

  //       }

  // },
  getCardInfo() {
    var that = this
    console.log(app.globalData.empNo);
    emp.getCardInfoByEmp(app.globalData.empNo).then((res) => {
      console.log('getCardInfoByEmp', res);
      that.setData({
        cardInfo: res
      })
    })
  },
  //取消分享
  showHide: function () {
    var that = this;
    that.setData({
      shareBox: "shareBox",
      edushow: true,
    });
  },
  //点击生成海报按钮function
  showCreat: function (e) {
    var that = this;
    if (that.data.submit) {
      that.setData({
        submit: false,
      });
      //请求接口
      console.log('45454545');
      // that.createNewImg();
      api.generateMiniCode("sub8/pages/agriculture/index").then(res => {
        console.log(res);

        that.setData({
          wechat: res, //赋值本地的二维码图片给data.wechat
        });
        console.log(that);
        // that.createNewImg();

      })
    }
  },
  baocun: function () {
    var that = this;
    //console.log(that.data.imagePath)
    wx.showToast({
      title: "加载中",
      icon: "loading",
      //mask: true,
      duration: 5000,
    });
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.hideToast();

        wx.showModal({
          content: "图片已保存到相册，赶紧晒一下吧~",
          showCancel: false,
          confirmText: "好的",
          confirmColor: "#333",
          success: function (res) {
            if (res.confirm) {
              //console.log("用户点击确定");
              that.setData({
                maskHidden: true,
                shareBox: "shareBox",
              });
            }
          },
          fail: function (res) {
            wx.hideToast();
          },
        });
      },
    });
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    console.log('createNewImg');
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("white");
    context.fillRect(0, 0, 750, 1216);
    var path = that.data.newbg;
    context.drawImage(path, 0, 0, 750, 1216); //背景绘制
    context.drawImage(that.data.wechat, 440, 1090, 120, 120); //小程序码
    // console.log('that.data.nick', that.data.nick);
    // var touxiang = that.data.avatar;
    // var touxiang = that.data.userInfo.avatarUrl;
    // context.drawImage(touxiang, 100, 990, 100, 100);//头像绘制
    //绘制昵称
    // var nickname = '@' + that.data.nick + " 向您推荐";
    // console.log('nickname', nickname);
    // var nickname = " 识别二维码进入";
    // context.setFillStyle('#488EA4');
    // context.setFontSize(36);
    context.setFillStyle('#333');
    context.setFontSize(30);
    context.setTextAlign('left');
    // context.fillText(nickname,30, 1146); //昵称绘制
    context.stroke();
    context.setFontSize(20);
    // context.setFontSize(36);
    // context.fillText("长按立即申请", 545, 1146); //提示绘制
    // context.fillText("江苏银行人才服务百宝箱", 250, 1046); //提示绘制
    //绘制头像
    context.setStrokeStyle('#333');
    // context.setStrokeStyle('#488EA4');
    context.setLineWidth(0);
    // context.arc(140, 1095, 70, 0, 2 * Math.PI, false) //画一个圆形裁剪区域
    context.clip();
    // context.drawImage(touxiang, 70, 1025, 140, 140); //头像绘制
    context.stroke();
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    var _time = setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        fileType: "jpg",
        quality: 0.7,
        success: function (res) {
          wx.hideToast();
          var tempFilePath = res.tempFilePath;

          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          //console.log(res);
        }
      });
    }, 300);
  },
  showComplain(e) {
    user.ifAuthUserInfo().then((res) => {
      if (res) {
        this.setData({
          showComplain: true,
        });
      } else {
        this.setData({
          loginFlag: false,
        });
      }
    });
  },
  // 跳转政策
  getFunction() {
    this.setData({
      infoFlag: 1,
      ACCESS_PATH: '政策资讯'
    })
    this.saveUsInfo()

    wx.navigateTo({
      url: "./overview"
    })
  },
  onShareTimeline() {
    console.log(212121);
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '自定义转发标题'
        })
      }, 2000)
    })
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      promise
    }
  },
  getRz() {
    this.setData({
      infoFlag: 4,
      ACCESS_PATH: '融资服务'
    })
    this.saveUsInfo()

  },
  // 跳转项目合作
  getProject(e) {
    console.log(111);
    this.setData({
      infoFlag: 3,
      ACCESS_PATH: '项目合作'
    })
    this.saveUsInfo()
    wx.navigateTo({
      url: "./projectCooperation?type=" + e.currentTarget.dataset.type
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '开发中，敬请期待',
    //   showCancel: false,
    //   success(res) {

    //   }
    // });
  },
  // 跳转市场分析
  getBazaar(e) {
    this.setData({
      infoFlag: 2,
      ACCESS_PATH: '市场分析'
    })
    this.saveUsInfo()
    wx.navigateTo({
      url: "/sub8/pages/agriculture/marketAnalysis?type=" + e.currentTarget.dataset.type
    })
  },
  // 跳转菜单页
  getMore(e) {
    console.log(e.currentTarget.dataset.type);
    wx.navigateTo({
      url: "./more?type=" + e.currentTarget.dataset.type
    })
  },
  // 搜索关键词
  getSearch() {
    console.log(this.data.keywords);
    wx.navigateTo({
      url: "./articles?keywords=" + this.data.keywords
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      infoFlag: 5,
    })
    this.initData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '掌上三农',
      path: 'sub8/pages/agriculture/index'

    }
  }
})