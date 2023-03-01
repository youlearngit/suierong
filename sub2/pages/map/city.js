var amapFile = require('../../utils/amap-wx.js');
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var markersData = [];
Page({
  data: {
    weather: "",
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    mkData: [],
    result: '',
    location: '',
    select: '0',
    first: '',
    page: 0
  },
  onLoad: function(e) {
    var that = this;
    if(e.data){
      that.setData({
        mkData: JSON.parse(e.data),
      })
    }
    that.setData({
      page: e.page == undefined ? 0 : e.page
    })
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: res => {
        var latitude = res.latitude //维度
        var longitude = res.longitude //经度
        that.loadCity(latitude, longitude); //调用高德
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },
  showMarkerInfo: function(data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },
  changeMarkerColor: function(data, i) {
    var that = this;
    var markers = [];
    markers.push(data[j]);
    that.setData({
      markers: markers
    });
  },
  makertap: function(e) {
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },
  loadCity(latitude, longitude) {
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({
      key: key
    }); //key注册高德地图开发者
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function(data) {
        //console.log(data); //全部数据
        var cityCode = data[0].regeocodeData.addressComponent.adcode //获取城市code
        var city_name = data[0].regeocodeData.addressComponent.city //获取省份名称
        that.setData({
          result: city_name,
          location: city_name,
          first: city_name,
        })
      },
      fail: function(info) {}
    });
  },
  bindcity: function(e) {
    var cityCode = e.currentTarget.dataset.citycode;
    var city = e.currentTarget.dataset.city;
    var center = (e.currentTarget.dataset.center).split(',');
    this.setData({
      result: city,
      select: 1
    })
    var data = this.data.mkData;
    var m = [];
    var textData = {};
    var flag = true;
    var latitude = "";
    var longitude = ""; //经度
    for (var i in data) {
      if (data[i].ORG_FULL_NAME == '江苏银行股份有限公司') {
        continue;
      }
      if (data[i].CITY != undefined && (data[i].CITY).substring(0, 4) == cityCode && flag) {
        m.push({
          iconPath: '../../static/img/ico_loc_checked.png',
          id: data[i].ID,
          latitude: data[i].LOCATION_LAT_NAVI,
          longitude: data[i].LOCATION_LONG_NAVI,
          width: 32,
          height: 40,
          title: data[i].ORG_FULL_NAME
        })
        flag = false;
        var p_am = util.string(data[i].P_AM);
        var p_pm = util.string(data[i].P_PM);
        var c_am = util.string(data[i].C_AM);
        var c_pm = util.string(data[i].C_PM);
        textData.name = data[i].ORG_FULL_NAME;
        textData.desc = data[i].ORG_ADDRESS;
        textData.telp = data[i].TELE_PERSONAL;
        textData.telc = data[i].TELE_COMPANY;
        textData.long = data[i].LOCATION_LONG_NAVI;
        textData.lat = data[i].LOCATION_LAT_NAVI;
        textData.bizTime1 = "上午" + p_am + ",下午" + p_pm;
        textData.bizTime2 = "上午" + c_am + ",下午" + c_pm;
        textData.distance = util.calcDistance(this.data.longitude, this.data.latitude, data[i].LOCATION_LONG_NAVI, data[i].LOCATION_LAT_NAVI);
        longitude = data[i].LOCATION_LONG_NAVI;
        latitude = data[i].LOCATION_LAT_NAVI;
      } else {
        m.push({
          iconPath: '../../static/img/ico_loc_uncheck.png',
          id: data[i].ID,
          latitude: data[i].LOCATION_LAT_NAVI,
          longitude: data[i].LOCATION_LONG_NAVI,
          width: 24,
          height: 30,
          title: data[i].ORG_FULL_NAME
        })
      }
    }
    this.setData({
      markers: m,
      longitude: longitude,
      latitude: latitude,
      textData: textData
    })
  },
  closeCity: function() {
    var first = JSON.stringify(this.data.first).replace(/市/g, '');
    var result = this.data.result;
    var page = this.data.page;
    var m = this.data.markers;
    var longitude = this.data.longitude;
    var latitude = this.data.latitude;
    var data = this.data.mkData;
    //console.log(this.data.textData)
    var textData = this.data.textData
    if (this.data.select == 0 || first == result) {
      wx.navigateBack({})
    } else {
      if (page == 0) {
        wx.navigateTo({
          url: '/sub2/pages/map/index?data=' + JSON.stringify(m) + "&longitude=" + longitude + "&latitude=" + latitude + "&textData=" + JSON.stringify(textData) + '&mkData=' + JSON.stringify(data),
        })
      } else if (page == 4) { //活动列表进来
        wx.navigateTo({
          url: '/sub2/pages/activity/index?result=' + this.data.result
        })
      } else { //从input进来
        wx.navigateTo({
          url: '/sub2/pages/inputtips/input?data=' + JSON.stringify(data) + '&page=' + page + '&lat=' + latitude + '&long=' + longitude,
        })
      }
    }
  }
})