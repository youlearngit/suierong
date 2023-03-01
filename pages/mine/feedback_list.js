var app = getApp()
var adds = {};
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '功能异常', value: '1' },
      { name: '体验问题', value: '2' },
      { name: '功能建议', value: '3' },
      { name: '其    他', value: '4' }
    ],
    submit: true, //重复提交
    img_arr: [],
    files: [],
    imgss:[],
    formdata: '',
    userInfo: {},
    suc_flag: true,
    currentTab: "0",//顶部tab切换
    list: [],
    preffixUrl: '',
    status: '',
    code: '',
    hidden:true
  },

  radioChange: function (e) {
    this.setData({
      opinion: e.detail.value,
    })
  },
  /**
     * 获取内容
     */

  getDataBindTap: function (e) {
    var result = e.detail.value;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderList()
    this.setData({
      preffixUrl: app.globalData.URL
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: time
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



  //点击切换
  clickTab: function (e) {
    var that = this;
    
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      
      that.setData({
        currentTab: e.target.dataset.current,
        hidden: true
      })
      if (this.data.currentTab == 1) {
        wx.showToast({
          title: "加载中...",
          icon: 'loading',
          mask:true,
          duration: 3000
        })
        wx.request({
          url: app.globalData.URL + 'message',  
          data: {
            open_id: wx.getStorageSync('openid'),
          },
          header: {
            'content-type': 'application/json', // 默认值
            "key": (Date.parse(new Date())).toString().substring(0, 6),
            "sessionId": wx.getStorageSync('sessionid'),
            "transNo": 'XC010'
          },
          success: function (res) {
            wx.hideToast();
            if (res.statusCode==200){
              let data1 = util.dect(res.data.stringData)
              that.setData({
                list: JSON.parse(data1),
              })
            } else {
              setTimeout(function(){
                that.setData({
                  hidden: false
                })
              },300)
              
            }
          }
        })
      }
    }
  },
  //提交操作
  formSubmit: function (e) {
    if (this.data.opinion == null || this.data.opinion == '') {
      wx.showToast({
        title: '请选择类型',
        icon: 'none',
        mask: false
      });
      return;
    }
    if (this.data.formdata == null || this.data.formdata == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        mask: false
      });
      return;
    }
    if (this.data.submit) {
      this.setData({
        submit: false
      })

      let data = JSON.stringify({
        id_id: "id",
        string_opinion: this.data.formdata,
        string_feed_type: this.data.opinion,
        string_open_id: wx.getStorageSync('openid'),
        string_feed_picture: this.data.files.toString(),
      });
      if (adds.openid == "") {
        wx.showToast({
          title: '请授权',
          icon: 'loading',
          duration: 1000,
          mask: true
        });
        return;
      }
      var that = this;
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: app.globalData.URL + 'addOpinion',
        data: {
          // data: data
         data:util.enct(data) + util.digest(data),
        },      
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "key": (Date.parse(new Date())).toString().substring(0, 6),
          "sessionId": wx.getStorageSync("sessionid"),
          "transNo": 'XC011'          
        },
        method:'POST',
        success(res) {
          wx.hideLoading();
          setTimeout(function(){
            if (res.data.code != -1) {
              that.setData({
                suc_flag: false
              })
            } else {
              that.setData({
                submit: true,

              })
            }
          },100)
          
        }
      })
    } else {
      wx.showToast({
        title: '您已提交过了',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //选择本地照片，并展示temp
  upimg: function () {
    var that = this;
    var _index = that.data.files.length
    if (_index > 2) {
      wx.showToast({
        title: '最多只能上传三张图片哦',
        icon: 'none',
        duration: 3000,
        mask: true
      });
      return false;
    } else {
      wx.chooseImage({
        count: 3 - _index,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {

          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var feed_picture = res.tempFilePaths;
          var file = that.data.files;
          for (var i = 0; i < feed_picture.length; i++) {
            
            ////console.log('图片地址名称' + feed_picture[i]);  
            wx.uploadFile({

              url: app.globalData.URL + 'feedbackupload',
              filePath: feed_picture[i],
              name: 'file',
              header: {
                "key": (Date.parse(new Date())).toString().substring(0, 6)
              },
              success: function (res) {
                wx.hideToast();
                var Result = res.data;
                file.push(Result);
                ////console.log(file)
                that.setData({
                  files: file
                });
               // //console.log(that.data.files)
              },
            })
          }
        }
      })
    }
  },

  deleteImage: function (e) {
    var imgss=[];
    var that = this;
    for (var x = 0; x < that.data.files.length;x++){
      imgss.push(that.data.files[x])
    };
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          imgss.splice(index, 1);
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          files: imgss
        });
      }
    })
  },
  //点击预览图片
  ylimg: function (e) {
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.img_arr
    })
  },
  
  formdata: function (e) {
    this.setData({
      formdata: e.detail.value
    })
  },

  renderList: function () {
   
  },   

  tomine:function(){
    wx.switchTab({
      url: '/pages/mine/mine'
    });
  }
})