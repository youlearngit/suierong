// sub3/pages/reservedAccChg/search.js
var app = getApp();

var encr = require('../../../utils/encrypt/encrypt'); //国密3段式加密

var aeskey = encr.key //随机数
var that;
const citys = {
  江苏省: [{
      text: "南京市",
      value: "0001",
      children: [],
    },
    {
      text: "无锡市",
      value: "0002",
      children: [],
    },
    {
      text: "苏州市",
      value: "0003",
      children: [],
    },
    {
      text: "南通市",
      value: "0005",
      children: [],
    },
    {
      text: "常州市",
      value: "0008",
      children: [],
    },
    {
      text: "淮安市",
      value: "0010",
      children: [],
    },
    {
      text: "徐州市",
      value: "0006",
      children: [],
    },
    {
      text: "扬州市",
      value: "0009",
      children: [],
    },
    {
      text: "镇江市",
      value: "0007",
      children: [],
    },
    {
      text: "盐城市",
      value: "0012",
      children: [],
    },
    {
      text: "连云港市",
      value: "0011",
      children: [],
    },
    {
      text: "宿迁市",
      value: "0015",
      children: [],
    },
    {
      text: "泰州市",
      value: "0016",
      children: [],
    },
  ],
  上海市: [{
    text: "上海市",
    value: "0018",
    children: [],
  }],
  广东省: [{
    text: "深圳市",
    value: "0019",
    children: [],
  }],
  北京市: [{
    text: "北京市",
    value: "0020",
    children: [],
  }],
  浙江省: [{
    text: "杭州市",
    value: "0021",
    children: [],
  }],

};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: app.globalData.CDNURL,
    imgs: [],
    accList: [],
    accName: '',
    checkAcc:[],
    result: [1],
    popupShow: false,
    popupShow1: false,
    selectWd: '',
    columns: [{
        values: Object.keys(citys),
        className: 'column1',
      },
      {
        values: citys['江苏省'],
        className: 'column2',
        defaultIndex: 0,
      },

      {
        values: [],
        className: 'column3',
        defaultIndex: 0,
      },
    ],
    checked: true,
    shxydm:{}
  },
  wdOpen(col, colM) {
    this.setData({
      popupShow1: !this.data.popupShow1
    });

  },
  confirmWd(event) {
    const {
      picker,
      value,
      index
    } = event.detail;

    that.setData({
      selectWd: value[2]
    })
    this.setData({
      popupShow1: !this.data.popupShow1
    });

  },
  inputTxt(event) {
    console.log(event);
    this.setData({
      shxydm: event.detail,
    });
  },
  searchEd() {
    return new Promise((resolve, reject) => {
      if (this.data.shxydm.value == undefined) {
        wx.showToast({
          title: '请输入账号',
          icon: 'none'
        })
        return;
      }

      if (this.data.selectWd.value == undefined) {
        wx.showToast({
          title: '请选择网点机构',
          icon: 'none'
        })
        return;
      }
      // 31090188000005923
      wx.showLoading({
        title: '查询中',
        mask:true
      })
      let dataJson = JSON.stringify({
        systemId: this.data.shxydm.value,
        yyjgh: this.data.selectWd.value,
        resolveType:'7'
      })
      console.log('dataJson',dataJson);
      let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密
      wx.request({
        url: app.globalData.YTURL + 'appoint/pubAccountUpdate.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        success(res) {
          if (res.data.head.H_STATUS != '1') {
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: res.data.head.H_MSG,
              icon: 'none'
            })
            reject({
              err: 0
            });
            return;
          }
          let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
          console.log(json)
          wx.hideLoading({
            success: (res) => {},
          })
          if (json.zhangh === '[]'||json.zhangh==='') {
            wx.showToast({
              title: '查无信息',
              icon:'none'
            })
            that.setData({
              accList: []
            })
          } else {
            wx.showToast({
              title: '查询成功',
            })
            // let a = json.zhangh.split(',')
            let a = JSON.parse(json.zhangh) 
            // 0 对公帐号
            // 1 卡
            // 2 活期一本通
            // 3 定期一本通
            // 4 定期存折
            // 5 存单
            // 6 国债
            // 7 外系统帐号
            // 8 活期存折
            // 9 内部帐/表外帐
            // S 对私内部帐号
            // Z 客户号
            // A 所有客户账号类型
            // B 对公一号通

            a.forEach((item,index)=>{
              if(item.zhlx=='0'){
                item.txt='对公帐号'
              }
              if(item.zhlx=='1'){
                item.txt='卡'
              }if(item.zhlx=='2'){
                item.txt='活期一本通'
              }if(item.zhlx=='3'){
                item.txt='定期一本通'
              }if(item.zhlx=='4'){
                item.txt='定期存折'
              }if(item.zhlx=='5'){
                item.txt='存单'
              }if(item.zhlx=='6'){
                item.txt='国债'
              }if(item.zhlx=='7'){
                item.txt='外系统帐号'
              }if(item.zhlx=='8'){
                item.txt='活期存折'
              }if(item.zhlx=='9'){
                item.txt='内部帐/表外帐'
              }if(item.zhlx=='B'){
                item.txt='对公一号通'
              }if(item.zhlx=='S'){
                item.txt='对私内部帐号'
              }if(item.zhlx=='Z'){
                item.txt='客户号'
              }if(item.zhlx=='A'){
                item.txt='所有客户账号类型'
              }
            })
            console.log(a);
            that.setData({
              accList: a,
              socialCreditCode:json.socialCreditCode
            })
          }
          that.setData({
            accName: json.zhzwm
          })
        }
      })
    })
  },
  getData(value) {
    return new Promise((resolve, reject) => {
      let dataJson = JSON.stringify({
        main_id: value,
        type: "13"
      })
      let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

      wx.request({
        url: app.globalData.YTURL + 'open/getOaInfo.do',
        data: encr.gwRequest(custnameTwo),
        method: 'POST',
        success(res) {
          console.log(res);
          if (res.data.head.H_STATUS != '1') {
            wx.hideLoading({
              success: (res) => {},
            })
         
            reject({
              err: 0
            });
            return;
          }
          let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文
          
          if (json.result_code === "0000") {
            let data = JSON.parse(json.list);
            data.forEach((item, index) => {
              item.text = item.text.substr(4)
            })
            let col = that.data.columns;
            col[2].values = data

            that.setData({
              columns: col
            })

          } else {
            reject()
            wx.showToast({
              title: json.result_msg,
              icon: 'none'
            })
          }
        }
      })
    })
  },
  onCancel: function (e) {
    this.setData({
      popupShow1: !this.data.popupShow1
    });

  },
  submit(){
    if (this.data.shxydm.value == undefined) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none'
      })
      return;
    }
    if (this.data.selectWd.value == undefined) {
      wx.showToast({
        title: '请选择网点机构',
        icon: 'none'
      })
      return;
    }
    if (this.data.checkAcc.length == 0 ) {
      wx.showToast({
        title: '请选择账号',
        icon: 'none'
      })
      return;
    }
    if(this.data.selectWd.value!=undefined){
      wx.setStorageSync('wdInfo', JSON.stringify(this.data.selectWd))
    }
//     let b =that.data.checkAcc;
//     let c= []
//     b.forEach((item,index)=>{
// c.push(item.zhangh)
//     })
//     c= c.join(',');
    let c = this.data.checkAcc.join(',')

    wx.redirectTo({
      url: './company?p1='+this.data.socialCreditCode+'&p2='+c,
    })
  },
  onChangeWd(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
    if (index == 1) {
      that.getData(value[1].value)
    }
    if (index == 0) {
      let d = that.data.columns
      d[1].values = citys[value[0]]
      that.setData({
        columns: d
      })
      that.getData(that.data.columns[1].values[0].value)
    }
  },
  onChange(event) {
    this.setData({
      checkAcc: event.detail,
    });
  },
  allCheck(){
    // let list = this.data.accList
    // list.forEach((item,index)=>{
    //   item=item.toString();
    // })
    // console.log(typeof(list[0]))
    this.setData({
      checkAcc: this.data.accList.map(item=>{
        return item.zhangh.toString();
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getData('0001')
  },
  onPopupEvent: function (e) {
    this.setData({
      popupShow: !this.data.popupShow
    });

  },
  onPopupEvent1: function (e) {
    this.setData({
      popupShow1: !this.data.popupShow1
    });

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

  }
})