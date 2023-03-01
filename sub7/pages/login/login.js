import api from '../../../utils/api';
import Get from '../../../api/Get';
Page({
    data: {
      preffixUrl: getApp().globalData.CDNURL,
      //mobile:'18226427709',
      mobile:'',
      //code:'000000',
      code:'',
      disabled: '',
      codename: '获取验证码',
      codestatus:'',//是否点击了发送按钮
      iscode:false //验证码是否正确
    },
    onLoad(){
      if(wx.getStorageSync('token')){
        Get.isLogin().then(res=>{
          if(res.judgeLogin=="0000"&&res.phone!=''){
            wx.setStorageSync('token', res.token)
            wx.navigateTo({
              url: '../index/index',
            })
          }
        }).catch(res=>{
          console.log(res)
        })
      }
    },
    phoneInput(e) {
      this.setData({
          mobile: e.detail.value.trim()
      })
    },
    codeInput(e) {
      this.setData({
          code: e.detail.value.trim()
      })
    },
        //点击获取验证码按钮，出发按钮事件
        getVerificationCode(e) {
          this.getCode();
          var _this = this
          _this.setData({
          disabled: true
          })
      },
    //校验手机号、后台发送验证码至手机
    getCode: function () {
      var mobile = this.data.mobile.trim();
      var _this = this;
      if (mobile == "") {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          _this.setData({
            codename: '获取验证码',
            disabled: false
          }, 3000)
        })
        return false;
      } else if (mobile.length != 11) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          _this.setData({
            codename: '获取验证码',
            disabled: false
          }, 3000)
        })
        return false;
      } else if (mobile != null && mobile != '') {
        api.sendCode1(this.data.mobile).then(res=>{
            console.log(res)
            if (res.code === '200') {
              var num = 60;
              var timer = setInterval(function () {
                num--;
                if (num <= 0) {
                  clearInterval(timer);
                  _this.setData({
                    codename: '重新发送',
                    disabled: false,
                    codestatus:0
                  })
                } else {
                  _this.setData({
                    codename: num + "s",
                    codestatus:1
                  })
                }
              }, 1000)
              wx.showToast({
                title: '发送成功',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
              _this.setData({
                disabled: false,
                codestatus:0
              })
            }
        }).catch(err=>{
          console.log('err',err)
          wx.showToast({
              title: '发送失败',
              icon: 'none',
              duration: 1000
            })
            _this.setData({
              disabled: false,
              codestatus:0
            })
        })
      } else {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 1000
        })
      }
    },
    // 登录
    jumpPage(){
      let mobile=this.data.mobile;
      let code=this.data.code;
      let codestatus=this.data.codestatus;
      // 手机号校验
      const regex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!mobile) {
          wx.showToast({
              title: '请输入您的手机号码！',
              icon: 'none',
              duration: 2000
          })
          return false;
      } else if (mobile.length !== 0) {
          if (mobile.length !== 11 || !regex.test(mobile)) {
              wx.showToast({
                  title: '请输入正确的手机号码！',
                  icon: 'none',
                  duration: 2000
              })
              return false;
          }
      };
      //状态为0时
      if(codestatus==0){
        wx.showToast({
          title: '请获取验证码！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if(code.length!=6){
            wx.showToast({
                title: '请输入正确的验证码！',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
          Get.Login(mobile,code).then(res=>{
            wx.setStorageSync('token', res.msg)
            wx.showToast({
              title: '登录成功！',
              icon: 'success',
              duration: 2000
            })
            setTimeout(()=>{
              wx.navigateTo({
                url: '../index/index',
              })
            },2000)
          }).catch(res=>{
            wx.showToast({
              title: '登录失败！',
              icon: 'none',
              duration: 2000
            })
          })
    },
})