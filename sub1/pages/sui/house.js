//引入腾讯地图SDK核心类
var QQMapWX = require('../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var util = require('../../../utils/util.js');
var qqmapsdk;
var citys = require('../../../pages/public/city.js');
import user from '../../../utils/user';
import House from '../../../api/House';

const app = getApp();

Page({
  data: {
    showbiuld: 'true',
    showdanyuan: 'true',
    showfanghao: 'true',
    userInfo: {},
    show1: false, //历史评估是否显示
    cityhidden: true,
    keyhidden: true,
    keyhidden1: true,
    keyhidden2: true,
    keyhidden3: true,
    serkey: '',
    submit: true, //重复提交
    list1: [],
    name: [],
    house: {
      idCard: '', //身份证
      name: '', //姓名
      cityID: '', //城市码
      housekey: '',
      location: '',
      village: '', //58接口选择值
      biuldiD: '',
      buildname: '',
      danyuaniD: '', //单元id
      danyuanname: '', //单元name
      roomiD: '', //房号ID
      roomname: '', //房号名
      house: '', //房名
    },
    cityName: '', //城市名
    buildname: '', //输入的小区名
    buildlist: [], //查出来的小区名称集合
    buildlist1: [], //查出来的楼栋
    buildlist2: [], //查出来的房号
    danyuanlist: [], //查出来的单元
    hasBuilding: true,
    hasUnit: true,
    hasRoom: true,
    buildPlaceholder: '请点击选择',
    unitPlaceholder: '请点击选择',
    roomPlaceholder: '请点击选择',
    address: [], //地址  判断是否updata
    ceshi: '南京市建邺区沙洲街道河西大街87号朗诗国际街区北园1幢101室',
    falg: '', //判断是更新还是新增
    mianji: '',
    floor1: '',
    allfloor1: '',
    idCard: '',
    type: '', //从一键申请过来的
    multiIndex: [0, 0, 0], //以下省市选择过度
    multiArray: [],
    distractInfo: [], // 某个市的区信息
    citys: [
      { regid: '3201', parid: '32', regname: '南京市', regtype: '2', ageid: '0' },
      { regid: '3202', parid: '32', regname: '无锡市', regtype: '2', ageid: '0' },
      { regid: '3203', parid: '32', regname: '徐州市', regtype: '2', ageid: '0' },
      { regid: '3204', parid: '32', regname: '常州市', regtype: '2', ageid: '0' },
      { regid: '3205', parid: '32', regname: '苏州市', regtype: '2', ageid: '0' },
      { regid: '3206', parid: '32', regname: '南通市', regtype: '2', ageid: '0' },
      { regid: '3207', parid: '32', regname: '连云港市', regtype: '2', ageid: '0' },
      { regid: '3208', parid: '32', regname: '淮安市', regtype: '2', ageid: '0' },
      { regid: '3209', parid: '32', regname: '盐城市', regtype: '2', ageid: '0' },
      { regid: '3210', parid: '32', regname: '扬州市', regtype: '2', ageid: '0' },
      { regid: '3211', parid: '32', regname: '镇江市', regtype: '2', ageid: '0' },
      { regid: '3212', parid: '32', regname: '泰州市', regtype: '2', ageid: '0' },
      { regid: '3213', parid: '32', regname: '宿迁市', regtype: '2', ageid: '0' },
    ],
    cndUrl: app.globalData.CDNURL,
    houseTypeList: [
      {
        name: '普通住宅',
        code: '1001',
      },
      {
        name: '保障性住房',
        code: '1002',
      },
      {
        name: '住宅类公寓',
        code: '1003',
      },
      {
        name: '别墅',
        code: '1004',
      },
      {
        name: '车位',
        code: '1005',
      },
      {
        name: '其他居住房',
        code: '1006',
      },
      {
        name: '写字楼',
        code: '2001',
      },
      {
        name: '商铺',
        code: '2002',
      },
      {
        name: '商场',
        code: '2003',
      },
      {
        name: '城市综合体',
        code: '2004',
      },
      {
        name: '酒店',
        code: '2005',
      },
      {
        name: '停车场',
        code: '2006',
      },
      {
        name: '其他商用房',
        code: '2007',
      },
    ],
    houseType: '',
  },

  onLoad: function (options) {
    if (options.type) {
      this.setData({
        type: options.type,
      });
    } else {
      this.setData({
        type: '',
      });
    }
    this.setData({
      preffixUrl: app.globalData.URL,
      objectMultiArray: citys.citys2,
      multiArray: citys.multiArray2.slice(0),
    });
    var that = this;
    //查看用户是否上传信息
    // that.apli();
    //查询用户是否有查询记录
    // 实例化地图API核心类
    qqmapsdk = new QQMapWX({
      key: '2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D',
    });

    House.getHouseInfoByUserID().then((res) => {
      console.log('houses', res);
      let s = [];
      for (let i = 0; i < res.length; i++) {
        s.push({
          ADDRESS: res[i].ALIAS,
        });
      }
      that.setData({
        address: s,
      });
    });

    that.getDistarct('320100');
  },

  onShow: function () {},

  pickHouseType(e) {
    console.log(e.detail.value);
    this.setData({
      houseType: e.detail.value,
    });
  },

  addressInput(e) {
    console.log(e);
  },

  //地区选择
  bindMultiPickerChange: function (e) {
    var that = this;
    let multiArray = that.data.multiArray;
    let adcode = that.data.distractInfo[e.detail.value[2]].adcode;
    let cityName =
      multiArray[0][e.detail.value[0]] + multiArray[1][e.detail.value[1]] + multiArray[2][e.detail.value[2]];
    //console.log('cityName',cityName)
    let house = that.data.house;
    house.cityID = adcode;
    that.setData({
      cityName: cityName,
      house: house,
    });
  },
  //地区选择
  bindMultiPickerColumnChange: function (e) {
    var column2 = [];
    var that = this;
    var data = {
      multiArray: that.data.multiArray,
      multiIndex: that.data.multiIndex,
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        column2 = [];
        let citys = [];
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
            column2.push(that.data.objectMultiArray[i].regname);
            citys.push(that.data.objectMultiArray[i]);
          }
        }
        that.setData({
          citys,
        });
        let adcode = citys[0].regid + '00';
        that.getDistarct(adcode);
        that.setData({
          'multiArray[1]': column2,
        });
        break;
      case 1:
        let code = that.data.citys[e.detail.value].regid + '00';
        that.getDistarct(code);
    }
  },

  /**
   * get distarct by province
   * @code  area code
   */
  getDistarct(code) {
    var that = this;
    //console.log('code',code)

    wx.request({
      url:
        'https://restapi.amap.com/v3/config/district?keywords=' +
        code +
        '&subdistrict=1&key=f50fb5855088b5dee3b232e3971542f3',
      method: 'get',
      success(res) {
        //console.log(res)
        let districts = res.data.districts[0].districts;
        let column3 = [];
        for (let i = 0; i < districts.length; i++) {
          column3.push(districts[i].name);
        }
        that.setData({
          'multiArray[2]': column3,
          distractInfo: districts,
        });
      },
      fail(err) {
        //console.log("获取地区异常",err)
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none',
          mask: true,
          duration: 2000,
        });
      },
    });
  },

  getInput: function (e) {
    //方法1
    this.data.buildname = e.detail.value;
    this.setData({
      serkey: e.detail.value,
    });
  },
  //评估
  getInput3: function (e) {
    //面积
    var mianji = e.detail.value;
    var patrn = /^([1-9]\d*|0)(\.\d*[1-9])?$/;
    var that = this;
    if (
      !patrn.exec(mianji) ||
      (mianji.indexOf('.') != -1 && mianji.substring(mianji.indexOf('.'), mianji.length).length > 3)
    ) {
      wx.showToast({
        title: '请输入正确格式(例如:100.23)',
        mask: true,
        icon: 'none',
        duration: 2000,
      });
      that.setData({
        area: '',
      });
    } else {
      if (mianji > 10000) {
        wx.showToast({
          title: '输入面积错误，最大值9999',
          mask: true,
          icon: 'none',
          duration: 2000,
        });
      } else {
        that.setData({
          area: mianji,
        });
      }
    }
  },
  getInput1: function (e) {
    //楼层
    var floor1 = e.detail.value;
    var that = this;
    if (floor1 < 1 || floor1 > 50) {
      wx.showToast({
        title: '楼层数：请输入1至50之间的整数',
        mask: true,
        icon: 'none',
        duration: 2000,
      });
      that.setData({
        floor1: '',
      });
    } else {
      that.setData({
        floor1: floor1,
      });
    }
  },
  getInput2: function (e) {
    //总楼层
    var allfloor1 = e.detail.value;
    var that = this;
    if (allfloor1 < 1 || allfloor1 > 50) {
      wx.showToast({
        title: '总楼层数：请输入1至50之间的整数',
        mask: true,
        icon: 'none',
        duration: 2000,
      });
      that.setData({
        allfloor1: '',
        floor1: '',
      });
    } else if (allfloor1 < that.data.floor1) {
      wx.showToast({
        title: '楼层数不能大于总楼层',
        mask: true,
        icon: 'none',
        duration: 2000,
      });
      that.setData({
        allfloor1: '',
        floor1: '',
      });
    } else {
      that.setData({
        allfloor1: allfloor1,
      });
    }
  },
  buildInput(e) {
    //console.log("input")
    var that = this;
    that.setData({
      'house.buildname':
        e.detail.value.indexOf('幢') > -1 ? e.detail.value.replace('幢', '') + '幢' : e.detail.value + '幢',
    });
  },
  unitInput(e) {
    var that = this;
    that.setData({
      'house.danyuanname':
        e.detail.value.indexOf('单元') > -1 ? e.detail.value.replace('单元', '') + '单元' : e.detail.value + '单元',
    });
  },
  roomInput(e) {
    var that = this;
    that.setData({
      'house.house':
        e.detail.value.indexOf('室') > -1 ? e.detail.value.replace('室', '') + '室' : e.detail.value + '室',
    });
  },
  currentFloorInput(e) {
    this.setData({
      'house.currentFloor': e.detail.value,
    });
  },
  totalFloorInput(e) {
    this.setData({
      'house.totalFloor': e.detail.value,
    });
  },

  //隐藏跳出框
  beback: function () {
    this.setData({
      keyhidden: true,
      keyhidden1: true,
      keyhidden2: true,
      keyhidden3: true,
    });
  },

  //以下是定位、选取城市、获取城市码
  chosecity: function () {
    wx.showLoading({
      title: '加载中...',
    });
    var that = this;
    that.setData({
      cityhidden: false,
    });
    that.getUserLocation();
  },
  closeCity: function () {
    var that = this;
    that.setData({
      cityhidden: true,
    });
  },
  bindcity: function (res) {
    var that = this;
    var city = res.currentTarget.dataset.city;
    var citycode = res.currentTarget.dataset.citycode;
    wx.showLoading({
      title: '加载中...',
    });
    that.setData({
      cityName: city,
      'house.cityID': citycode,
      cityID: that.data.house.cityID,
    });
    that.setData({
      cityhidden: true,
    });
    wx.hideLoading();
  },
  //地理位置授权
  getUserLocation: function () {
    let that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] == false) {
          wx.hideLoading();
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              //console.log("res", res)
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000,
                });
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting['scope.userLocation'] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000,
                      });
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000,
                      });
                    }
                  },
                });
              }
            },
          });
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        } else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      },
    });
  },
  // 微信获得经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84', //gcj02
      success: function (res) {
        ////console.log(JSON.stringify(res))
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.getLocal(latitude, longitude);
      },
      fail: function (res) {},
    });
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      success: function (res) {
        let province = res.result.ad_info.province;
        let city = res.result.ad_info.city;
        let adcode = res.result.ad_info.adcode;
        that.setData({
          province: province,
          cityName: city.split('市')[0],
          latitude: latitude,
          longitude: longitude,
          'house.cityID': adcode.substring(0, 4) + '00',
        });
        wx.hideLoading();
      },
      fail: function (res) {
        // //console.log(res);
      },
      complete: function (res) {
        // //console.log(res);
      },
    });
  },

  //ED0161接口  住宅选择
  ed0161: function (res) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    that.setData({
      keyhidden: true, //隐藏框子
      'house.housekey': res.currentTarget.dataset.villageid, //选则的小区名称名称
      'house.location': res.currentTarget.dataset.id, //选择的小区id
      buildPlaceholder: '请点击选择',
      unitPlaceholder: '请点击选择',
      roomPlaceholder: '请点击选择',
    });
    wx.hideLoading();
  },

  ed0162: function (res) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    let house = that.data.house;
    house.biuldiD = res.currentTarget.dataset.id;
    house.buildname = res.currentTarget.dataset.villageid;
    that.setData({
      keyhidden1: true,
      // 'house.biuldiD': res.currentTarget.dataset.id,
      // 'house.buildname': res.currentTarget.dataset.villageid,
      house: house,
      hasBuilding: true,
      hasUnit: true,
      hasRoom: true,
    });
    wx.hideLoading();
  },

  ed0163: function (res) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    let house = that.data.house;
    house.danyuaniD = res.currentTarget.dataset.id;
    house.danyuanname = res.currentTarget.dataset.villageid;
    that.setData({
      keyhidden2: true,
      // 'house.danyuaniD': res.currentTarget.dataset.id,
      // 'house.danyuanname': res.currentTarget.dataset.villageid,
      house: house,
      hasBuilding: true,
      hasUnit: true,
      hasRoom: true,
    });
    wx.hideLoading();
  },

  ed0164: function (res) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    const index = res.currentTarget.dataset.index;

    let house = that.data.house;
    house.area = res.currentTarget.dataset.i;
    house.house = res.currentTarget.dataset.villageid;
    that.setData({
      keyhidden3: true,
      // 'house.area': res.currentTarget.dataset.id,
      // 'house.house': res.currentTarget.dataset.villageid,
      currentFloor: this.data.buildlist2[index].currentFloor || '',
      totalFloor: this.data.buildlist2[index].totalFloor || '',
      'house.currentFloor': this.data.buildlist2[index].currentFloor || '',
      'house.totalFloor': this.data.buildlist2[index].totalFloor || '',
      house: house,
      area: res.currentTarget.dataset.id,
    });
    wx.hideLoading();
  },

  location: function () {
    var that = this;
    if (that.data.house.location == '' || that.data.house.location == undefined) {
      wx.showToast({
        title: '请选择位置',
        icon: 'none',
        duration: 2000,
      });
    } else if (!that.data.hasBuilding) {
    } else {
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: app.globalData.URL + 'ed0175',
        data: {
          houseDataId: that.data.house.location,
          buildingNo: '', //小区编吗
        },
        header: {
          'content-type': 'application/json', // 默认值x
          key: Date.parse(new Date()).toString().substring(0, 6),
        },
        success: (res) => {
          //console.log(res)
          wx.hideKeyboard({
            complete: (res) => {
              //console.log('hideKeyboard res', res)
            },
          });
          var list = [];
          if (res.data.data) {
            that.setData({
              buildlist1: res.data.data,
              keyhidden1: false,
              hasBuilding: true,
              hasUnit: true,
              hasRoom: true,
              'house.danyuanname': '',
              'house.house': '',
            });
            wx.hideLoading();
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '未查询到您的楼栋信息,请手工录入',
              icon: 'none',
              mask: true,
              duration: 2000,
            });
            that.setData({
              keyhidden1: true,
              buildlist1: list,
              hasBuilding: false,
              hasUnit: false,
              hasRoom: false,

              'house.buildname': '',
              'house.danyuanname': '',
              'house.house': '',
              buildPlaceholder: '请录入楼栋',
              unitPlaceholder: '请录入单元号',
              roomPlaceholder: '请录入房号',
            });
          }
        },
        fail: (res) => {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none',
            mask: true,
            duration: 2000,
          });
        },
      });
    }
  },

  danyuan: function () {
    var that = this;
    if (that.data.house.buildname == '') {
      wx.showToast({
        title: '请选择楼栋',
        icon: 'none',
        duration: 2000,
      });
    } else if (!that.data.hasUnit || !that.data.hasBuilding) {
    } else {
      // that.setData({
      //   keyhidden2: false,
      // });
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: app.globalData.URL + 'ed0176',
        data: {
          buildingId: that.data.house.biuldiD,
          houseUnitName: '',
        },
        header: {
          'content-type': 'application/json', // 默认值x
          key: Date.parse(new Date()).toString().substring(0, 6),
        },
        success: (res) => {
          //console.log(res.data)
          wx.hideKeyboard({
            complete: (res) => {
              //console.log('hideKeyboard res', res)
            },
          });
          if (res.data.data) {
            var list = res.data.data;
            that.setData({
              danyuanlist: list,
              keyhidden2: false,
              hasUnit: true,
              hasRoom: true,
              'house.house': '',
            });
            wx.hideLoading();
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '未查询到您的单元,请手工录入(可不填)',
              icon: 'none',
              mask: true,
              duration: 2000,
            });
            that.setData({
              keyhidden2: true,
              hasUnit: false,
              hasRoom: false,
              'house.danyuanname': '',
              'house.house': '',
              unitPlaceholder: '请录入单元号(可不填)',
              roomPlaceholder: '请录入房号',
            });
          }
        },
        fail: (res) => {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none',
            mask: true,
            duration: 2000,
          });
        },
      });
    }
  },

  room: function () {
    var that = this;
    if (that.data.house.buildname == '') {
      wx.showToast({
        title: '请选择楼栋',
        icon: 'none',
        duration: 2000,
      });
    } else if (!that.data.hasRoom || !that.data.hasUnit || !that.data.hasBuilding) {
    } else {
      // that.setData({
      //   keyhidden3: false
      // });
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: app.globalData.URL + 'ed0177',
        data: {
          buildingId: that.data.house.biuldiD, //城市编码
          houseUnitId: that.data.house.danyuaniD, //楼栋编码
          roomName: '', //单元编码
        },
        header: {
          'content-type': 'application/json', // 默认值x
          key: Date.parse(new Date()).toString().substring(0, 6),
        },
        success: (res) => {
          wx.hideKeyboard({
            complete: (res) => {
              //console.log('hideKeyboard res', res)
            },
          });
          console.log(res.data);
          if (res.data.data) {
            var list = res.data.data;
            that.setData({
              buildlist2: list,
              keyhidden3: false,
              hasRoom: true,
            });
            wx.hideLoading();
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '未查询到您的房号,请手工录入',
              icon: 'none',
              mask: true,
              duration: 2000,
            });
            that.setData({
              keyhidden2: true,
              hasRoom: false,
              roomPlaceholder: '请录入房号',
            });
          }
        },
        fail: (res) => {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none',
            mask: true,
            duration: 2000,
          });
        },
      });
    }
  },

  //估价按钮
  submitForm(e) {
    const params = e.detail.value;
    console.log(params);
    var that = this;
    if (params.build == '') {
      wx.showToast({
        title: '请输入楼栋',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (params.room == '') {
      wx.showToast({
        title: '请输入房号',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    if (params.houseType == '') {
      wx.showToast({
        title: '请选择房产类型',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    if (params.detailAddress == '') {
      wx.showToast({
        title: '请输入完整地址',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (params.currentFloor == '') {
      wx.showToast({
        title: '请输入所在楼层',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (params.totalFloor == '') {
      wx.showToast({
        title: '请输入所在总楼层',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    if (params.squre == '' || params.squre > 9999) {
      wx.showToast({
        title: '请输入正确面积',
        icon: 'none',
        duration: 2000,
      });
      return;
    } else {
      if (that.data.submit) {
        wx.showLoading({
          title: '加载中...',
          mask: true,
        });
        if (that.data.house.danyuanname == undefined || that.data.house.danyuanname == '无单元') {
          that.data.house.danyuanname = '';
        }

        const buildName =
          that.data.house.buildname +
          (that.data.house.danyuanname == undefined || that.data.house.danyuanname == '无单元'
            ? ''
            : that.data.house.danyuanname);
        House.measureHousePrice(
          that.data.house.cityID.substring(0, 4) + '00',
          params.detailAddress,
          params.squre,
          that.data.houseTypeList[this.data.houseType].code,
          that.data.house.cityID.substring(0, 2) + '0000',
          that.data.house.cityID,
          buildName,
          that.data.house.house,
          that.data.house.currentFloor,
          that.data.house.totalFloor,
        )
          .then((res) => {
            wx.hideLoading();
            console.log('houseinfo:', res);
            const address1 = params.detailAddress;
            let data = JSON.stringify({
              id_id: 'id',
              string_open_id: wx.getStorageSync('openid'),
              string_evaluateCode: res.wbgspgbm, //编号
              string_saleprice: new Number(res.pgzj).toString(), //估价金额
              string_unitprice: res.pgdj, //单价
              string_alias: params.detailAddress, //住宅名称
              string_communityname: res.xqmc, //关键字
              string_buildname: that.data.house.buildname, //楼栋
              string_danyuanname:
                that.data.house.danyuanname == undefined || that.data.house.danyuanname == '无单元'
                  ? ''
                  : that.data.house.danyuanname, //单元
              string_housename: that.data.house.house, //房号
              string_area: res.jzmj, //面积
              string_address: params.detailAddress,
              string_city_id: that.data.house.cityID, //城市编码
            });

            console.log(JSON.parse(data));

            for (var i = 0; i < that.data.address.length; i++) {
              if (address1 === that.data.address[i].ADDRESS) {
                that.setData({
                  falg: true,
                });
              }
            }

            console.log('flag', this.data.falg);

            if (that.data.falg == true) {
              House.updateHouseInfo(data)
                .then((res) => {
                  wx.hideLoading();
                  if (that.data.type == 'pg' || that.data.type == 'ked' || that.data.type == 'wed') {
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 2];
                    prevPage.setData({
                      backData: 1,
                    });
                    wx.navigateBack({
                      delta: 1,
                    });
                  } else if (that.data.type == 'sui') {
                    wx.navigateBack({
                      delta: 1,
                    });
                  } else {
                    wx.navigateTo({
                      url: '/pages/house/list',
                    });
                  }
                })
                .catch((err) => {
                  wx.showToast({
                    title: '抱歉，房价信息更新失败，请重试',
                    icon: 'none',
                  });
                });
            } else {
              wx.request({
                url: app.globalData.URL + 'addprice',
                data: {
                  data: data,
                },
                method: 'POST',
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  key: Date.parse(new Date()).toString().substring(0, 6),
                },
                success: (res) => {
                  wx.hideLoading();
                  if (res.data.code == 1) {
                    if (that.data.type == 'pg' || that.data.type == 'ked' || that.data.type == 'wed') {
                      const pages = getCurrentPages();
                      const prevPage = pages[pages.length - 2];
                      prevPage.setData({
                        backData: 1,
                      });
                      wx.navigateBack({
                        delta: 1,
                      });
                    } else if (that.data.type == 'sui') {
                      wx.navigateBack({
                        delta: 1,
                      });
                    } else {
                      wx.navigateTo({
                        url: '/pages/house/list',
                      });
                    }
                  }
                },
              });
            }
          })
          .catch((err) => {
            console.log(err);
            wx.showToast({
              title: '抱歉，未查询到房价信息',
              icon: 'none',
            });
          });
      }
    }
  },

  searchkey: function () {
    var that = this;

    if (that.data.house.cityID == '' || that.data.buildname == '') {
      wx.showToast({
        title: '城市、住宅不许为空',
        icon: 'none',
        mask: true,
        duration: 2000,
      });
    } else {
      that.getUserInfoMation();
    }

    return;
    // 查看是否授权
  },

  getUserInfoMation: function () {
    wx.showLoading({
      title: '加载中...',
    });
    var that = this;
    if (that.data.buildname.length > 10) {
      wx.showToast({
        title: '字数不得大于10',
        icon: 'none',
        duration: 2000,
      });
    } else {
      wx.request({
        url: app.globalData.URL + 'ed0174',
        data: {
          cityId: that.data.house.cityID.substring(0, 4) + '00',
          // cityId: that.data.house.cityID.substring(0,6),
          input: that.data.buildname,
        },
        header: {
          'content-type': 'application/json', // 默认值x
          key: Date.parse(new Date()).toString().substring(0, 6),
        },
        success: (res) => {
          //console.log(res)
          if (res.data.data) {
            that.setData({
              buildlist: res.data.data,
              keyhidden: false,
              hasBuilding: true,
              hasUnit: true,
              hasRoom: true,
              'house.buildname': '',
              'house.danyuanname': '',
              'house.house': '',
              buildPlaceholder: '请点击选择',
              unitPlaceholder: '请点击选择',
              roomPlaceholder: '请点击选择',
            });
            wx.hideLoading();
          } else {
            if (res.data == null || res.data.data == null || res.data.data == '' || res.data.data == undefined) {
              wx.showToast({
                title: '未查询到该住宅信息，暂无法估价',
                icon: 'none',
                mask: true,
                duration: 2000,
              });
              that.setData({
                keyhidden: true,
                'house.buildname': '',
                'house.danyuanname': '',
                'house.house': '',
              });
            } else {
              wx.showToast({
                title: '网络异常，请稍后重试',
                icon: 'none',
                mask: true,
                duration: 2000,
              });
            }
          }
          // wx.hideLoading()
        },
        complete: function () {
          setTimeout(function () {
            wx.hideLoading();
          }, 2000);
        },
      });
    }
  },

  //查看用户是否填写个人信息认证
  apli: function () {
    var that = this;
    //个人信息
    user.getCustomerInfo().then((res) => {
      var customer = res;
      if (customer.TEL && customer.REAL_NAME) {
      } else {
        wx.showModal({
          title: '提示',
          content: '请先进行个人信息认证',
          showCancel: true, //是否显示取消按钮
          success: function (res) {
            if (!res.confirm) {
              wx.navigateBack({});
            } else {
              wx.navigateTo({
                url: '/sub1/pages/auth/index?type=1&url=/pages/house/house',
              });
            }
          },
        });
      }
    });
  },

  noHouse() {
    var that = this;
    wx.hideLoading();
    wx.showToast({
      title: '请手工录入您的楼栋信息',
      icon: 'none',
      mask: true,
      duration: 2000,
    });
    that.setData({
      keyhidden1: true,
      hasBuilding: false,
      hasUnit: false,
      hasRoom: false,
      'house.buildname': '',
      'house.danyuanname': '',
      'house.house': '',
      buildPlaceholder: '请录入楼栋',
      unitPlaceholder: '请录入单元号',
      roomPlaceholder: '请录入房号',
    });
  },

  noDanyuan() {
    var that = this;
    wx.hideLoading();
    wx.showToast({
      title: '请手工录入您的单元信息',
      icon: 'none',
      mask: true,
      duration: 2000,
    });
    that.setData({
      keyhidden2: true,
      hasUnit: false,
      hasRoom: false,
      buildPlaceholder: '请录入楼栋',
      'house.danyuanname': '',
      'house.house': '',
      unitPlaceholder: '请录入单元号',
      roomPlaceholder: '请录入房号',
    });
  },

  noRoom() {
    var that = this;
    wx.hideLoading();
    wx.showToast({
      title: '请手工录入您的房号信息',
      icon: 'none',
      mask: true,
      duration: 2000,
    });
    that.setData({
      keyhidden3: true,
      hasRoom: false,
      'house.house': '',
      buildPlaceholder: '请录入楼栋',
      unitPlaceholder: '请录入单元号',
      roomPlaceholder: '请录入房号',
    });
  },
});
