import requestP from '../../../utils/requsetP';
import encr from '../../../utils/encrypt/encrypt.js';
var date = new Date();
var aeskey = encr.key;
var app = getApp();
import House from '../../../api/House';

Page({
  data: {
    preffixUrl: app.globalData.URL,
    result: [],
    houseInfo: [],
    houseChoosed: [],
    houseChoosed2: [],
    type: '',
    isWhite: '1',
    day_time2: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
    result: [],
    cndUrl: app.globalData.CDNURL,
    node: '',
  },

  updateNodeInfo(node, nodeInfo) {
    var that = this;
    var dataJson = JSON.stringify({
      node: node,
      open_id: wx.getStorageSync('openid'),
      sed_id: that.data.sed_id,
      node_info: nodeInfo,
    });
    var custname = encr.jiami(dataJson, aeskey); //3段加密
    requestP({
      url: app.globalData.YTURL + 'sui/updateNodeInfo.do',
      data: encr.gwRequest(custname),
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值x
      },
    }).then(res => {
      //   var jsonData = encr.aesDecrypt(res.body, aeskey); //解密返回的报文
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2]; // 上一页
      // 调用上一个页面的setData 方法，将数据存储
      if (that.data.type === 'update') {
        prevPage.setData({
          houseChoosed: that.data.houseChoosed,
        });
      } else {
        prevPage.setData({
          houseChoosed: that.data.houseChoosed,
          step: that.data.isWhite == '0' ? '4' : '3',
        });
      }
      wx.navigateBack({
        delta: 1,
      });
    });
  },

  addHouse(e) {
    var that = this;
    if (that.data.isWhite == '0') {
      let nodeInfo = JSON.stringify({
        node3: {
          applyType: that.data.applyType,
          applyNum: that.data.applyNum,
          applyTime: that.data.applyTime,
          houseChoosed: that.data.houseChoosed2,
          borrowBodyConfigList: that.data.borrowBodyConfigList,
          isWhite: that.data.isWhite,
        },
        node4: {
          day_time2: that.data.day_time2,
        },
      });
      that.updateNodeInfo('34', nodeInfo);
    } else {
      let nodeInfo = JSON.stringify({
        node3: {
          applyType: that.data.applyType,
          applyNum: that.data.applyNum,
          applyTime: that.data.applyTime,
          houseChoosed: that.data.houseChoosed2,
          borrowBodyConfigList: that.data.borrowBodyConfigList,
          isWhite: that.data.isWhite,
        },
      });
      that.updateNodeInfo('3', nodeInfo);
    }
  },

  chooseHouse(e) {
    var that = this;
    this.setData({
      result: e.detail,
    });
    let index = e.detail;
    let houseChoosed = [];
    let houseChoosed2 = [];
    let house = {};
    let house2 = {}; //只包含房产数据ID
    for (let i = 0; i < index.length; i++) {
      let houseinfo = that.data.houseInfo[parseInt(index[i])];
      house = {};
      house2 = {};
      house2.id = houseinfo.ID;
      house.dbType = '020'; //担保方式
      house.status = '0'; //查实是否
      house.quotationCount = '0'; //案例数
      house.maxPrice = '0'; //最大单价
      house.minPrice = '0'; //最小单价
      house.avgPrice = typeof houseinfo.UNITPRICE != 'undefined' ? houseinfo.UNITPRICE : ''; //平均单价
      house.unitPrice = houseinfo.UNITPRICE ? houseinfo.UNITPRICE : ''; //评估价格
      house.state = '0'; //是否可以自动评估
      house.houseName = houseinfo.COMMUNITYNAME; //房屋名称
      house.address = houseinfo.ADDRESS; //地址
      house.allQuotationCount = '0'; //总案例数
      house.buildingName = houseinfo.BUILDNAME; //楼栋名称
      house.constructionName = houseinfo.COMMUNITYNAME; //楼盘名称
      house.totalPrice = houseinfo.SALEPRICE; //评估总价
      house.floorNumber = '0'; //所在楼层
      house.totalFloor = '0'; //总楼层
      // house.endDate = houseinfo.CREATE_DATE; //建成日期
      house.endDate = '1960-02-03'; //建成日期
      house.buildingTypeName = ''; //建筑类型
      house.purposeName = ''; //房屋性质
      house.note = ''; //备注
      house.city = houseinfo.CITY_ID.substring(0, 4) + '00'; //房产所属城市
      house.district = houseinfo.CITY_ID; //房产所属划区
      house.area = houseinfo.AREA; //房产面积
      house.value = houseinfo.SALEPRICE; //在线评估价值
      houseChoosed.push(house);
      houseChoosed2.push(house2);
    }

    that.setData({
      houseChoosed,
      houseChoosed2,
    });
  },

  onLoad: function (options) {
      console.log(options);
    this.setData({
      applyType: options.applyType,
      applyNum: options.applyNum,
      applyTime: options.applyTime,
      sed_id: options.sed_id,
      type: options.type,
      province: options.province,
      isWhite: options.isWhite,
      borrowBodyConfigList: JSON.parse(options.borrowBodyConfigList),
      node: options.node,
    });
  },

  onShow: function () {
    var that = this;
    House.getHouseInfoByUserID()
      .then(async res => {
        await res.forEach(e => {
          e.gujia = parseInt(e.SALEPRICE / 10000);
        });
        that.setData({
          houseInfo: res,
        });
      })
      .catch(err => {
        console.error(err);
      });
  },
});
