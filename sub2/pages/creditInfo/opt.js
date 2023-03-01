// pages/creditInfo/serviceOption .js
var app = getApp();


Page({

    data: {
        type:0,
        borrower_type: 0,
        business_type: 0,
        preffixUrl: '',
    },

    onLoad() {
        this.setData({
            preffixUrl: app.globalData.JSBURL
        })
        if (wx.getStorageSync('openid') === '') {
            app
                .getSessionInfo()
                .then(res => {

                })
        }

    },

    /**
     * 选择绑定数据
     */
    selectChange(e) {
        this.setData({
            business_type: e.currentTarget.dataset.id
        })
    },
    //选择授权类型：个人、企业
    selectChange1(e) {
      this.setData({
          type: e.currentTarget.dataset.id,
          business_type: 0,
          borrower_type:0
      })
    },
    selectChange2(e) {
      this.setData({
        borrower_type: e.currentTarget.dataset.id,
        business_type: 0,
      })
  },

    /**
     * 跳到借款人界面
     */
    navTo(e) {
        let {business_type,type,borrower_type} = this.data;
        if (business_type == 0 || type == 0 || (type == 2 && borrower_type == 0)) {
            wx.showToast({
                title: '请选择业务',
                icon: 'none'
            })
        } else {
            //跳转到借款人页面
            if(type == '1'){//个人征信授权
              //跳转个人经营贷企业授权
              wx.showLoading({
                  title: '加载中',
                  mask: true,
                  success(res) {
                      wx.redirectTo({
                          url: '../creditInfo/borrower?business_type=' + `${business_type}`,
                      })
                  }
              })
            }else{
              if(borrower_type == 2){
               //对公企业征信授权
               wx.showLoading({
                title: '加载中',
                mask: true,
                success(res) {
                    wx.redirectTo({
                        url: '../creditInfo/companyBorrower?business_type=' + `${business_type}`,
                    })
                }
               })
              }else{
                //小企业征信授权
                wx.showLoading({
                  title: '加载中',
                  mask: true,
                  success(res) {
                      wx.redirectTo({
                          url: '../creditInfo/smallCompanyBorrower?business_type=' + `${business_type}`,
                      })
                  }
                })
              }
            }
           
        }
    }
})