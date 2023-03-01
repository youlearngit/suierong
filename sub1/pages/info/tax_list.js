// sub1/pages/info/tax_list.js
const app = getApp();
var util = require('../../../utils/util.js');
var citys = require('../../../pages/public/city_zj.js')
import requestP from "../../../utils/requsetP";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reurl: 'tax_list',
    form: {
      orgID: '', //企业统一信用代码
      orgName: '',
      province: '', //省
      city: '', //市
      name: '', //法人姓名
      tel: '', //法人手机
      idCard: '', //法人身份证
      address: '', //法人联系地址
      timeIndex: '0', //申请期限
      slider: '200', //贷款额度
      // loadCardNo: '', //中征码
      provinceCode: '', //省码
      cityCode: '', //市码
      typeIndex: '0', //申请类型
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    that.setData({
      preffixUrl: app.globalData.URL,
      objectMultiArray: citys.citys,
      multiArray: citys.multiArray,
      org_cities: citys.org_cities,
      navTop: app.globalData.statusBarTop,
      navHeight: app.globalData.statusBarHeight
    })

    //企业信息
    wx.request({
      url: app.globalData.URL + "getuseCard",
      data: {
        userId: wx.getStorageSync("openid"),
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync("sessionid"),
        transNo: "XC008",
      },
      method: "POST",
      success(res) {
        //console.log(1212121212);
        //console.log(res);
        var cardlist = res.data.stringData;
        var cardlist1 = JSON.parse(util.dect(cardlist));
        var taggs = "";
        //console.log(cardlist1);
        ////console.log(cardlist1.length)
        var listname = [];
        if (cardlist1 != null && cardlist1 != undefined) {
          for (let i = 0; i < cardlist1.length; i++) {
            listname.push(cardlist1[i].ORG_NAME);


            let address1 = cardlist1[i].ORG_CODE.substring(2, 6) + '00';

            //  let promise1 =  new Promise((resolve, reject) => {

            //   }); 

            wx.request({
              url: 'https://restapi.amap.com/v3/config/district?keywords=' + address1 + '&subdistrict=1&key=f50fb5855088b5dee3b232e3971542f3',
              method: "get",
              success(res) {
                //console.log('gaodegaodegaodegaode')
                //console.log(res)
                //console.log(res.data.districts[0].name)

                cardlist1[i].ORG_ADDRESS = res.data.districts[0].name;
                that.setData({
                  cardlist: cardlist1,
                  cardname: listname,
                  busiCardList: listname,
                  falg1: "1",
                  showNon3: cardlist1.length,
                });
                //console.log(that.data.cardname);
                
              },
              fail(err) {
                //console.log("获取地区异常", err)
                wx.showToast({
                  title: '网络异常，请稍后重试',
                  icon: 'none',
                  mask: true,
                  duration: 2000
                })
              }
            })
            
          }
          that.setData({
            cardlist: cardlist1,
            cardname: listname,
            busiCardList: listname,
            falg1: "1",
            showNon3: cardlist1.length,
          });
          //console.log('for循环结束')
          //console.log(that.data.cardname)
          //console.log(that.data.cardlist)

          //console.log(that.data.cardname)
          wx.request({
            url: app.globalData.URL + "getTaxInfos",
            data: {
              companyName: JSON.stringify(that.data.cardname),
              openId: wx.getStorageSync("openid"),
            },
            header: {
              "Content-Type":
                "application/x-www-form-urlencoded",
              key: Date.parse(new Date())
                .toString()
                .substring(0, 6),
                sessionId: wx.getStorageSync("sessionid"),
											transNo: "XC025",
            },
            method: "POST",
            success(res) {
              //console.log("税务_______________");
              //console.log(res);

              if (res.data.code == 1) {
                let decryptData = util.dect(res.data.stringData);
                decryptData = JSON.parse(decryptData);
                var taxInfoRes = decryptData[0].basic.aUTHLIST;
                // var taxInfoRes = res.data.data[0].basic.aUTHLIST;
                //console.log("税务信息_______________");
                //console.log(taxInfoRes);
                for (let a = 0; a < taxInfoRes.length; a++) {
                  for (let b = 0; b < that.data.cardlist.length; b++) {
                    if (taxInfoRes[a].nsrSbh == that.data.cardlist[b].ORG_CODE) {
                      taxInfoRes[a].companyName = that.data.cardlist[b].ORG_NAME;
                      taxInfoRes[a].startTime = taxInfoRes[a].createdTs.substring(0, 10);
                      let endtime = taxInfoRes[a].createdTs.substring(0, 10);
                      let endYear = parseInt(endtime.substring(0, 4));
                      let endMonth = parseInt(endtime.substring(5, 7));
                      let endDay = parseInt(endtime.substring(8, 10));
                      //console.log(endYear + endMonth + endDay)
                      if (endMonth == 1 || endMonth == 3 || endMonth == 5 || endMonth == 7 || endMonth == 8 || endMonth == 10 || endMonth == 12) {
                        if (endDay > 3) {
                          endMonth = endMonth + 1;
                          if (endMonth < 9) {
                            endMonth = '0'.concat(endMonth);
                            //console.log(endMonth);
                          } else if (endMonth == 10) {
                            endMonth = '11';
                          } else if (endMonth == 12) {
                            endMonth = '01';
                            endYear = ''.concat(endYear + 1);
                          }
                          endDay = ''.concat(endDay - 2);

                        } else {
                          endMonth = ''.concat(endMonth);
                          endDay = '31';
                        }
                      } else if (endMonth == 4 || endMonth == 6 || endMonth == 9 || endMonth == 11) {
                        if (endDay > 2) {
                          endDay = ''.concat(endDay - 1);
                          if (endMonth < 9) {
                            endMonth = endMonth + 1;
                            if (endMonth < 9) {
                              endMonth = '0'.concat(endMonth);
                              //console.log(endMonth);
                            } else if (endMonth == 11) {
                              endMonth = '12';
                            }

                          } else {
                            endMonth = ''.concat(endMonth);
                            endDay = '30';
                          }
                        } else {
                          endDay = '30';
                        }


                      } else if (endMonth == 2) {
                        endMonth = '03';
                        endDay = endDay + 1;
                        endYear = '' + endYear
                      }

                      endYear = ''.concat(endYear);
                      //console.log(endYear + '-' + endMonth + '-' + endDay);
                      taxInfoRes[a].endTime = endYear + '-' + endMonth + '-' + endDay;
                      cardlist1[b].startTime = taxInfoRes[a].startTime;
                      cardlist1[b].endTime = taxInfoRes[a].endTime
                      cardlist1[b].startTime = taxInfoRes[a].startTime
                      cardlist1[b].isTax = true
                    }
                  }
                }

                that.setData({
                  taxInfos: taxInfoRes,
                  cardlist: cardlist1
                })
              }


              //console.log('税务结束');
              //console.log(that.data.cardlist);
            },
            error(res) { },
          });


        }

        //console.log(12345678)
        //console.log(that.data.cardname)
        //console.log(cardlist1)
        
      },
    });
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

  },

  // tax_detail: function (e) {

  //   wx.navigateTo({
  //     //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
  //     url: '../info/tax_info?companyName=' + e.currentTarget.dataset.orgname + '&isTax=' + this.data.isTax,
  //   })
  // },

  tax_detail: function (e) {

    //统一码失焦
    // blurCity: function (e) {
      var that = this;
      //console.log(that.data.cardlist)
      //console.log(e);
    if (e.currentTarget.dataset.orgname == undefined || e.currentTarget.dataset.orgname == null || e.currentTarget.dataset.orgname.trim() == '' || e.currentTarget.dataset.orgname.length < 18) {
        return;
      }

      var that = this;
    var provinceID = e.currentTarget.dataset.orgname.substring(2, 4);
    var cityID = e.currentTarget.dataset.orgname.substring(2, 6);

      if (provinceID == '32'||provinceID == '44') {
        //console.log('准备授权')
      } else {
        wx.showModal({
          title: '提示',
          content: '该地区请通过税务官方网站等渠道进行授权',
          showCancel: false,//是否显示取消按钮
          success: function (res) {

          },
          fail: function (res) { },//接口调用失败的回调函数
          complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
        })
        return;
      }
      if (cityID == 3305 || cityID == 3306 || cityID == 3300) {//浙江绍兴，湖州默认为杭州
        cityID = 3301;
      } else if (cityID == 3200) { //江苏默认为南京
        cityID = 3201;
      } else if (cityID == 4400) { //广东默认为深圳
        cityID = 4403;
      } else if (cityID == 3100) { //上海
        cityID = 3101;
      }
      var province = that.data.org_cities[provinceID];
      var city = that.data.org_cities[cityID];
      //console.log(province + ' ' + city)

      // if (province == undefined || city == undefined){
      // that.setData({
      // //isArea:false
      // })
      // wx.showModal({
      // title: '提示',
      // content: '您所在的区域不接受此项业务办理',
      // showCancel: false,//是否显示取消按钮
      // success: function (res) {

      // },
      // fail: function (res) { },//接口调用失败的回调函数
      // complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      // })
      // return;
      // }
      that.setData({
        "form.orgID": e.currentTarget.dataset.orgname,
        "form.province": province,
        "form.city": city,
        'form.provinceCode': provinceID,
        'form.cityCode': cityID,
        "provinceName": province,
        "cityName": city,
        isArea: true
      })

      wx.navigateTo({
        // url: 'tax?proCode=' + that.data.form.provinceCode + "0000&cityCode=" + that.data.form.cityCode + '00&creditCode=' + params.orgID + '&str=' + applyData + "&uid=" + res.data.stringData + "&formId=" + e.detail.formId
        url: '../info/tax?proCode=' + that.data.form.provinceCode + "0000&cityCode=" + that.data.form.cityCode + '00' + "&formId=" + e.detail.formId + "&reurl=" + that.data.reurl + "&creditCode=" + e.currentTarget.dataset.orgname
      })



    // },
  },
})