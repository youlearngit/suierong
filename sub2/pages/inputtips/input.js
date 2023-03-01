var amapFile = require('../../utils/amap-wx.js');
var config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var lonlat;
var city;
const app = getApp();
Page({
  data: {
    tips: {},
    tabs: ["网点", "自助银行"],
    activeIndex:0,
    sliderOffset: 0,
    sliderLeft: 0,
    result:'',
    code:'',
    list:[],
    keyword:'',
    pageIndex:1,
    pageSize:5,
    mkData:[],
    cityData:[],
    page:'',
    more:'查看更多',
    longitude:'',
    latitude:'',
    other: false,
    preffixUrl:''
  },
  onLoad: function(e){
    var lat = e.lat;
    var long = e.long;

    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    this.setData({
      mkData:JSON.parse(e.data),
      page: e.page,//1=取号进来 2=预约进来 3=搜素进来
      preffixUrl: "https://wxapp.jsbchina.cn:7080/jsb/"
    })
    var that = this;
    if(lat!=undefined &&long!=undefined && lat != null && long != null){
      that.loadCity(lat, long);//调用高德
      that.setData({
        latitude: lat,
        longitude: long,
        other:true,
        pageSize:6,
      })
    }else{ //非位置选择进来
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: res => {
          var latitude = res.latitude//维度
          var longitude = res.longitude//经度
          that.loadCity(latitude, longitude);//调用高德
          that.setData({
            latitude: latitude,
            longitude: longitude
          })
        }
      })
    }
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  bindInput: function(e){
    var that = this;
    var keywords = e.detail.value; 
    var arr=[];
    this.setData({
      keyword:keywords,
      list:arr,
      pageIndex: 1,
      more:'查看更多'
    })
    this.loadCity(this.data.latitude,this.data.longitude)
  },
  bindSearch: function(e){
    var keywords = e.target.dataset.keywords;
    var url = '../map/index?keywords=' + keywords;
    wx.redirectTo({
      url: url
    })
  },
  loadCity(latitude, longitude) {
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });//key注册高德地图开发者
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        console.log(data);//全部数据
        var cityCode = data[0].regeocodeData.addressComponent.adcode//获取城市code
        var city_name = data[0].regeocodeData.addressComponent.city//获取省份名称
        that.cityDatas(that.data.mkData, longitude, latitude, cityCode);
        if (city_name == undefined || city_name == null || city_name.length < 1){
          city_name = data[0].regeocodeData.addressComponent.province;
        }
        that.setData({
          result:city_name,
          code: cityCode,
        })
      },
      fail: function (info) { }
    });
  },
  //刷选城市
  cityDatas: function (mkData, longitude, latitude,code){
    var list=[]; var that = this;
    for (var i in mkData) {
      if (mkData[i].ORG_FULL_NAME == '江苏银行股份有限公司') {
        continue;
      }
      var temp = mkData[i];
      if (temp.ORG_FULL_NAME == undefined || temp.ORG_ADDRESS == undefined || temp.CITY == undefined
        || temp.ORG_FULL_NAME == null || temp.ORG_ADDRESS == null || temp.CITY == null
        || temp.ORG_FULL_NAME == '' || temp.ORG_ADDRESS == '' || temp.CITY == ''){
        continue;
      }
      if (temp.CITY.substring(0, 4) == code.substring(0, 4)) {
        list.push({
          org_code:temp.ORG_CODE,
          org_short_name:temp.ORG_SHORT_NAME,
          name: temp.ORG_FULL_NAME,
          address: temp.ORG_ADDRESS,
          id: temp.ID,
          cityCode: temp.CITY,
          longitude: temp.LOCATION_LONG_NAVI,
          latitude: temp.LOCATION_LAT_NAVI,
          distance: util.calcDistance(longitude, latitude, temp.LOCATION_LONG_NAVI, temp.LOCATION_LAT_NAVI)
        })
      }
    }
    that.sort(list);
  },
  sort: function (list){
    var datas = []; var that = this;
    for (var i=0;i<list.length;i++) {
      for(var j=0; j< list.length - i -1;j++){
        var temp1 = list[j];
        var a1 = 0;
        if (temp1.distance != null && String(temp1.distance).indexOf("千") != -1) {
          a1 = parseFloat(String(temp1.distance).replace(/千/g,""));
          a1 = a1*1000;
        } else {
          a1 = parseInt(temp1.distance);
        }
        var temp2 = list[j+1];
        var a2 = 0;
        if (temp2.distance != null && String(temp2.distance).indexOf("千") != -1) {
          a2 = parseFloat(String(temp2.distance).replace(/千/g, ""));
          a2 = a2 * 1000;
        } else {
          a2 = parseInt(temp2.distance);
        }
        if(a1 > a2){
          var temp = list[j];
          list[j] = list[j+1];
          list[j+1] = temp;
        }
      }
    }
    var keyword = this.data.keyword;
    if (keyword != null && keyword.trim() != '') { //关键字搜索
      var arr = [];
      var j =0;
      for (var i in list) {
        if (list[i].name.indexOf(keyword) != -1) {
          arr[j] = list[i];
          j++;
        }
      }
      this.setData({
        cityData:arr
      })
    }else{
      this.setData({
        cityData:list
      })
    }
    that.pagger();
  },
  pagger:function(){
    if (this.data.more != '已到底部') {
      if(this.data.list.length > 0){ //首次加载页数不加1
        this.setData({
          pageIndex: this.data.pageIndex + 1
        })
      }
      var arr = [];
      var pageIndex = this.data.pageIndex;
      var pageSize = this.data.pageSize;
      for(var i in this.data.list){
        arr[i] = this.data.list[i];
      }
      for (var i = (pageIndex - 1) * pageSize; i < (pageIndex * pageSize); i++) {
        if (this.data.cityData[i] != undefined){
          arr[i] = this.data.cityData[i];
        }
      }
      var index = 0;
      var tempArr = [];
      for(var i in arr){
        if(arr[i] != undefined && arr[i] != null){
          tempArr[index] = arr[i];
          index++;
        }
      }
      this.setData({
        list: tempArr,
        more: (pageIndex) * pageSize < this.data.cityData.length && tempArr.length>= pageSize? '查看更多' : '无更多数据'
      })
    }
    wx.hideLoading();
  },
  goDetail:function(e){
    var long = e.currentTarget.dataset.long;
    var lat = e.currentTarget.dataset.lat;
    if(this.data.page == 1){
      wx.navigateTo({
        url: '/sub2/pages/mine/lineup?bankname=' + e.currentTarget.dataset.name + '&bankaddress=' + e.currentTarget.dataset.address + '&data=' + JSON.stringify(this.data.mkData) + '&longitude=' + long +'&latitude='+lat+'&org_code='+e.currentTarget.dataset.org_code+'&org_short_name='+e.currentTarget.dataset.org_short_name,
      })
    } else if (this.data.page == 2){
      wx.navigateTo({
        url: '/sub2/pages/mine/book?bankname=' + e.currentTarget.dataset.name + '&bankaddress=' + e.currentTarget.dataset.address + '&data=' + JSON.stringify(this.data.mkData) + '&longitude=' + long + '&latitude=' + lat+'&org_code='+e.currentTarget.dataset.org_code+'&org_short_name='+e.currentTarget.dataset.org_short_name,
      })
    } else if (this.data.page == 3){
      var data = this.data.mkData;
      var id = e.currentTarget.dataset.id;
      var m = [];
      var textData = {};
      var longitude = '';
      var latitude  = '';
      for (var i in data) {
        if(data[i].ID != id){
          m.push({
            iconPath: '../../static/img/ico_loc_uncheck.png',
            id: data[i].ID,
            latitude: data[i].LOCATION_LAT_NAVI,
            longitude: data[i].LOCATION_LONG_NAVI,
            width: 24,
            height: 30,
            title: data[i].ORG_FULL_NAME
          })
        }else{
          m.push({
            iconPath: '../../static/img/ico_loc_checked.png',
            id: data[i].ID,
            latitude: data[i].LOCATION_LAT_NAVI,
            longitude: data[i].LOCATION_LONG_NAVI,
            width: 32,
            height: 40,
            title: data[i].ORG_FULL_NAME
          })
          var p_am = util.string(data[i].P_AM);
          var p_pm = util.string(data[i].P_PM);
          var c_am = util.string(data[i].C_AM);
          var c_pm = util.string(data[i].C_PM);
          textData.name = data[i].ORG_FULL_NAME;
          textData.org_code = data[i].ORG_CODE;
          textData.org_short_name = data[i].ORG_SHORT_NAME;

          textData.desc = data[i].ORG_ADDRESS;
          textData.long = data[i].LOCATION_LONG_NAVI;
          textData.lat = data[i].LOCATION_LAT_NAVI
          textData.telp  = data[i].TELE_PERSONAL;
          textData.telc = data[i].TELE_COMPANY;
          textData.bizTime1 = "上午"+ p_am + ",下午" + p_pm;
          textData.bizTime2 = "上午" + c_am + ",下午" + c_pm;
          textData.distance = util.calcDistance(this.data.longitude, this.data.latitude, data[i].LOCATION_LONG_NAVI, data[i].LOCATION_LAT_NAVI);

          longitude = data[i].LOCATION_LONG_NAVI;
          latitude  = data[i].LOCATION_LAT_NAVI;
        }
      }
      wx.navigateTo({
        url: '/sub2/pages/map/index?data=' + JSON.stringify(m) + "&longitude=" + longitude + "&latitude=" + latitude + "&textData=" + JSON.stringify(textData) + '&mkData=' + JSON.stringify(data),
      })
    }
  },
  select: function (e) {
    var data = this.data.mkData;
    var url = '../map/city?page='+this.data.page+'&data=' + JSON.stringify(data);
    wx.navigateTo({
      url: url
    })
  },
})