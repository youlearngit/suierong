// sub4/pages/scanqrcode/grade.js
import utils from './utils';
import {addAnswerAward} from '../../../api/mer';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: utils.preffixUrl(),
        answerdd:'',//分数
        gainent:true,//提取苏银do
        dou:'',//保存豆豆
        newtelnum:'',//手机号
        fandou:'',
        ansdemu:'',//第二次过来的分数
        tqyc:false//提取苏银do隐藏
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options);  
        this.setData({
            answerdd:options.answer,//跳转时拿到的分数
            newtelnum:options.newtelnum,//手机号
            fandou:options.fandou,//拿到的豆
            SCORE:options.gtvh//拿到的分数
        })
        if(this.data.answerdd == 60){
          this.setData({
            dou: 1000
          })
        }else if(this.data.answerdd == 80){
          this.setData({
            dou: 1500
          })
        }else if(this.data.answerdd == 100){
          this.setData({
            dou: 2000
          })
        }
        let nuniuoi = this.data.dou
        let dataInfo = {
          OPEN_ID:wx.getStorageSync('openid'),//微信id
          PHONE_NUMBER:this.data.newtelnum,//手机号码
          AWARD_NUMBER: nuniuoi.toString(),//苏银豆奖励数量转成字符串传过去tostring
          SCORE: this.data.answerdd//答题分数
        }
       
        addAnswerAward(dataInfo).then(item => {
        console.log(11111);
        console.log(dataInfo);
        console.log(item);
        })
      
        
    },
    correct:function () {//查看正确答案
        wx.navigateTo({
          url: './answer',
        })
    },
    extrat:function() {
      
        wx.showModal({
          title: '提示',
          content: '感谢您的参与！苏银豆奖励将于10个工作日内发放',
          success: function (res) {
            if (res.confirm) { //这里是点击了确定以后
             
            } else { //这里是点击了取消以后
             
              console.log('用户点击取消') 
              return
            }
          }
        })
        
    },
    // immwdiately:function () {//立即提取
    //     console.log(1111111111111);
    //     console.log(this.data.dou);
    //     let nuniuoi = this.data.dou
    //     let dataInfo = {
    //       OPEN_ID:wx.getStorageSync('openid'),//微信id
    //       PHONE_NUMBER:this.data.newtelnum,//手机号码
    //       AWARD_NUMBER: nuniuoi.toString(),//苏银豆奖励数量转成字符串传过去tostring
    //       SCORE: this.data.answerdd//答题分数
    //     }
       
    //     addAnswerAward(dataInfo).then(item => {
    //     console.log(11111);
    //     console.log(dataInfo);
    //     console.log(item);
    //     console.log(dataInfo.OPEN_ID);
    //     console.log(dataInfo.PHONE_NUMBER);
    //     console.log(dataInfo.AWARD_NUMBER);
    //     console.log(dataInfo.SCORE);
    //     console.log(dataInfo.dataInfo);
    //     })
    //   },
      close(){//关闭提取页面
        console.log(11111);
        this.setData({
          gainent: !this.data.gainent,
        })
      },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage({from}) {
      if (from === 'button') {
        return {
          title: '',
          path: '/sub4/pages/scanqrcode/newanswer',
        }
      }
      // return {
      //   title: '来自其它的转发',
      //   path: '/sub4/pages/scanqrcode/newanswer'
      // }
    },
  
    // onShareAppMessage(res){
		// 	var that = this
		// 	console.log(that.goods_data)
		// 	if(res.from==='button'){//分享按钮
		// 		return {
		// 			title:that.goods_data.share_title||that.goods_data.goods_name,
		// 			path: '/sub4/pages/scanqrcode/newanswer.wxml',
		// 			imageUrl:that.goods_data.share_img||that.goods_data.main_img,
		// 			success: function (res) {
					  
		// 			  if(res.errMsg == 'shareAppMessage:ok'){
		// 				console.log("成功",res)
		// 			  }
		// 			},
		// 			fail:function(res){
					  
		// 			  console.log("失败",res)
					  
		// 			}
		// 		}
		// 	}
			
		// }

})