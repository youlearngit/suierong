// sub1/component/poster/index.js
import user from '../../utils/user';
import log from '../../log';

var app = getApp();

Component({
  /**
   * Component properties
   */
  properties: {
    loginFlag: {
      type: [Boolean, String],
      default: true,
    },
  },

  /**
   * Component initial data
   */
  data: {
    loginFlag: true,
    preffixUrl: app.globalData.URL,
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
          //当前页面
          var page = getCurrentPages().pop(); 
          console.log(page,'当前页面');
          this.setData({loginFlag: true});
          page.onShow()
    },
    hide: function () {},
    resize: function () {},
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * Component methods
   */
  methods: {
    /**
     * 取消
     */
    logincancel: function () {
      var that = this;
      that.setData({
        loginFlag: true,
      });
      that.triggerEvent('cancel', 'canCel');
    },

    async bindGetUserInfo() {
      wx.navigateTo({
        url: '/pages/mine/getInfo',
      });
    },

    async bindGetUserInfo1() {
      let that = this;
      log.setFilterMsg('getUserProfile');
      log.info('开始获取用户信息');
      if (wx.getUserProfile) {
        wx.getUserProfile({
          desc: '获取用户信息',
          success: (res) => {
            app.globalData.userInfo = JSON.parse(JSON.stringify(res.userInfo));
            res = res.userInfo;
            var headurl = res.avatarUrl;
            if (wx.getStorageSync('openid') != null) {
              log.info('开始下载头像');
              wx.downloadFile({
                url: headurl,
                success: function (temp) {
                  log.info('头像转base64');
                  wx.getFileSystemManager().readFile({
                    filePath: temp.tempFilePath,
                    encoding: 'base64',
                    success: (file) => {
                      res.avatarUrl = 'data:image/png;base64,' + file.data;
                      log.info('开始添加信息');
                      user
                        .addWXUserInfo(res)
                        .then(() => {
                          log.info('添加信息成功');
                          that.setData({
                            loginFlag: true,
                          });
                          wx.showToast({
                            title: '登录成功',
                            icon: 'success',
                            mask: true,
                            duration: 2000,
                          });
                        })
                        .catch((err) => {
                          log.setFilterMsg('addWXUserInfoError');
                          log.info('添加用户微信数据异常', JSON.stringify(err) + '______' + JSON.stringify(res));
                          wx.showToast({
                            title: err,
                            icon: 'success',
                            mask: true,
                            duration: 2000,
                          });
                        });
                      return;
                    },
                  });
                },
              });
            }
          },
          fail(err) {
            log.info('fail' + JSON.stringify(err));
            wx.showModal({
              title: '提示',
              content: '您点击了拒绝授权，将无法申请本业务，请授权登录之后再进入。',
              showCancel: false,
              confirmText: '返回授权',
            });
          },
          complete(res) {
            log.info('获取用户信息完成', JSON.stringify(res));
            // console.log('获取用户信息完成', JSON.stringify(res));

            that.triggerEvent('onAuthUser', res);
          },
        });
      } else {
        log.setFilterMsg('notSupport');
        log.info('不支持新接口');
      }
    },
  },
});
