// pages/carLoans/contract/carcontract/detail/detail-waiting.js
import requestYT from '../../../../../api/requestYT';
import api from "../../../../../utils/api";

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: '',
    contNo:'',
    guarContNo: "",
    flag:'',
    detail:{},
    dialogflag:'',
    nbsp: '&nbsp;&nbsp;&nbsp;&nbsp;',
    guarContInfo:{},
    guarOption:[
      {key:"01",value:"父母"},
      {key:"02",value:"配偶"},
      {key:"03",value:"子女"},
      {key:"99",value:"其他关系"},
    ],
    signOption:[
      { key:"",value:"待签约"},
      {key:"0",value:"待签约"},
      {key:"1",value:"已签约"},
    ],
    dateList:[],
    signDate:'',
    backBtnName:10,

    photo:'',
    batchId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      preffixUrl: app.globalData.CDNURL,
      contNo: options.contNo,
      guarContNo: options.guarContNo,
      flag: options.flag,
    });
    wx.showLoading({
      title: '请稍候',
    })
    that.goDetail();
  },

    // 获取合同详情
    goDetail: function() {
        var that = this;
        let options = {
            url: 'carloan/searchContInfo.do',
            data: JSON.stringify({
                contType: '2',
                contNo: that.data.contNo,
                guaranteeContNo: that.data.guarContNo,
            }),
        };
        requestYT(options).then((res) => {
            if (res.STATUS === '1') {
                if (res.msgCode != '1111') {
                    var detail = JSON.parse(res.contInfo);
                    var guarInfo = detail.guarContNoList[0];
                    var dateList = detail.contElecSignDate.split("-");
                    guarInfo.guarObligation = that.converStatus("guarObligation", guarInfo.guarObligation);
                    guarInfo.guarContSigningStatus = that.converStatus("signStatus", guarInfo.guarContSigningStatus);
                    detail.countContAmt = that.convertNum(Number(detail.contAmt) + (detail.followContAmt == "0" || detail.followContAmt == "" ? 0 : Number(detail.followContAmt)));
                    detail.contSigningStatusSpec = detail.contSigningStatus == '2' ? '无需电签' : detail.contSigningStatus == '1' ? '已签约' : '待签约';
                    var timestamp = Date.parse(new Date());
                    var date = new Date(timestamp);
                    //获取年份  
                    var Y = date.getFullYear();
                    //获取月份  
                    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                    //获取当日日期 
                    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                    detail.signDate = Y + "年" + M + "月" + D + "日";
                    that.setData({
                        detail: detail,
                        guarContInfo: guarInfo,
                        dateList: dateList,
                        signDate: Y + "-" + M + "-" + D
                    });
                    wx.hideLoading();
                } else {
                    wx.hideLoading();
                    that.alertError(res.msg);
                    setTimeout(function() {
                        that.cancel();
                    }, 2000)
                }
            } else {
                that.cancel();
            }
        }).catch(err => {
            wx.hideLoading();

    });
  },
  // 状态转换
  converStatus(label,status){
    var value = "";
    var options = [];
    if(label == "guarObligation"){
      options = this.data.guarOption
    }else if (label=="signStatus"){
      options = this.data.signOption
    }
    options.forEach(item=>{
      if(item.key == status){
        value = item.value
      }
    })
    return value;
  },
  // 大写转换
  convertNum(money){
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(money)){
      return "数据非法";  //判断数据是否大于0
    }
    var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
    var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
    var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
    var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
    var cnInteger = "整"; //整数金额时后面跟的字符
    var cnIntLast = "元"; //整型完以后的单位
    var maxNum = 999999999999999.9999; //最大处理的数字
    var IntegerNum; //金额整数部分
    var DecimalNum; //金额小数部分
    var ChineseStr = ""; //输出的中文金额字符串
    var parts; //分离金额后用的数组，预定义    
    var Symbol="";//正负值标记
    if (money == "") {
        return "";
    }

    money = parseFloat(money);
    if (money >= maxNum) {
        alert('超出最大处理数字');
        return "";
    }
    if (money == 0) {
        ChineseStr = cnNums[0] + cnIntLast + cnInteger;
        return ChineseStr;
    }
    if(money<0)
    {
        money=-money;
        Symbol="负 ";        
    }
    money = money.toString(); //转换为字符串
    if (money.indexOf(".") == -1) {
        IntegerNum = money;
        DecimalNum = '';
    } else {
        parts = money.split(".");
        IntegerNum = parts[0];
        DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
        var zeroCount = 0;
        var IntLen = IntegerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = IntegerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == "0") {
                zeroCount++;
            }
            else {
                if (zeroCount > 0) {
                    ChineseStr += cnNums[0];
                }
                zeroCount = 0; //归零
                ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                ChineseStr += cnIntUnits[q];
            }
        }
        ChineseStr += cnIntLast;
        //整型部分处理完毕
    }
    if (DecimalNum != '') { //小数部分
        var decLen = DecimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = DecimalNum.substr(i, 1);
            if (n != '0') {
                ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (ChineseStr == '') {
        ChineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (DecimalNum == '') {
        ChineseStr += cnInteger;
    }
    ChineseStr = Symbol +ChineseStr;
    
    return ChineseStr;
  },
  // 返回上一层
  cancel: function(){
    wx.navigateBack({
      delta: 1,
    })
  },

   // 查看保证合同
   toContractPage(){
     if(this.data.detail.contSigningStatus == '0' || this.data.detail.contSigningStatus == '' ){
        this.alertError('借款人未签约！');
     }else{
      // this.facecheck();
      this.setData({
        dialogflag : true
      });
      this.readingCoundDown();
     }
  },
  // 取消
  cancel(){
    wx.navigateBack();
  },
  // 提交合同
  goSubmit(){
    //console.log('this.data.backBtnName'+this.data.backBtnName)
    if(this.data.backBtnName===0){
      this.getBatchId();
    }
  },
  // 按钮倒计时10秒
  readingCoundDown() {
    let time = 10;
    this.setData({
      backBtnName: time,
    });
    let cutDown = setInterval(() => {
      time--;
      if (time < 1 || !this.data.dialogflag) {
        clearInterval(cutDown);
      }
      this.setData({
        backBtnName: time,
      });
    }, 1000);
  },

  // 人脸识别
  async getBatchId(){
    
    var that = this;
    try {
      const res = await api.getImageAndBatchId(that.data.guarContInfo.guarCusName,that.data.guarContInfo.guarCertCode);
      that.setData({
        photo:res.image,
        batchId:res.batchID
      })
      await that.uploadPhoto();
      }catch (error) {
        console.log('123', error);
        wx.showModal({
          title: '提示',
          content: error.message || error,
          showCancel: false,
          confirmText: '确定',
          success: (result) => {
            if (result.confirm) {
            }
          },
        });
      }
},
  //上传印象
  uploadPhoto(){
    wx.showLoading({
        title: '请稍候',
        mask: true,
    });
    var that = this;
    let options = {
      url: 'carloan/uploadPicToYxpy.do',
      data: JSON.stringify({
        certCode: that.data.guarContInfo.guarCertCode,
        batchId: that.data.batchId,
      }),
    };
    requestYT(options).then((res)=>{
      if(res.msgCode == '0000'){
        that.nextPage();
      }else{
        wx.hideLoading();
        this.alertError('合同签订失败，请重新提交');
      }
    }).catch(err=>{
      wx.hideLoading();
      this.alertError('合同签订失败，请重新提交');
    })
  },
  //签章调用
  nextPage(){
    var that = this;
    var type = 'b04';
    let options = {
      url: 'carloan/sign.do',
      data: {
        type: type.toLocaleUpperCase(),
        certCode:that.data.guarContInfo.guarCertCode,
        applyName:that.data.guarContInfo.guarCusName,
        gurrantContNo:that.data.guarContInfo.guarContNo,
        subSerno:that.data.guarContInfo.guarContNo,
        base64:that.data.photo,
      }
    };
    requestYT(options).then((res) => {
      if (res.msgCode === '0000') {
        //签章保存成功,提交补录申请
        that.saveInfo();
      } else {
        wx.hideLoading();
        this.alertError('请重新提交合同签订，如多次未提交成功，联系您的客户经理');
      }
    }).catch(res=>{
      wx.hideLoading();
      this.alertError('请重新提交合同签订，如多次未提交成功，联系您的客户经理');
    });
  },
  //调用合同签约接口
  saveInfo(){
    var that = this;
    let options = {
      url: 'carloan/signContact.do',
      data: {
        signType: "2",
        signDate: that.data.signDate,
        contNo: that.data.detail.contNo,
        certCode:that.data.detail.certCode,
        guaranteeCertCode:that.data.guarContInfo.guarCertCode,
        guaranteeContNo: that.data.guarContInfo.guarContNo,
        imageLotNumber: that.data.batchId,
      }
    };
    requestYT(options).then((res) => {
      if(res.msgCode === '0000'){
        that.toResultPage('1','');
      }else{
        that.toResultPage('0',res.msg);
      }
    }).catch((err)=>{
      that.toResultPage('0',"系统正在维护中，请稍后再试");
    });
  },
  //结果相应页面
  toResultPage(status,errorMsg){
    var str = 'resultPage?status='+status+'&type=b04'+'&contNo='+this.data.guarContInfo.guarContNo;
    if(status != '1'){
      str = str + '&errorMsg='+ errorMsg
    }
    wx.navigateTo({
      url: str,
    })
  },
  //阅读合同
  readContract(e){
    var that = this;
    wx.showLoading({
      title: '请稍候',
      mask: 'true'
    })
    var type = 'b04';
    let options = {
      url: 'carloan/viewSignContact.do',
      data: {
        type: type.toLocaleUpperCase(),
        serialNo: that.data.guarContInfo.guarContNo,//合同号
      }
    };
    requestYT(options).then((res) => {
      if (res.STATUS === '1') {
        that.setData({
          imgData: res.pdfPath.replace(/[\r\n]/g, ""),
        });
        var fs = wx.getFileSystemManager();
        fs.writeFile({
                  filePath: wx.env.USER_DATA_PATH + "/" + '查看合同.pdf',
                  data: wx.base64ToArrayBuffer(res.pdfPath.replace(/[\r\n]/g, "")),
                  success:res =>{
                    wx.openDocument({
                      filePath: wx.env.USER_DATA_PATH + "/" + '查看合同.pdf',
                      success: function (res) {
                        wx.hideLoading();
                      }, fail(err) {
                       wx.hideLoading({
                         title:'合同获取异常',
                         success: (res) => {},
                       })
                      }
                    })
                  }
                })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.errorMsg,
          icon: 'none',
        });
      }
    }).catch(res=>{
      wx.hideLoading();
      wx.showToast({
        title: '合同查询失败',
        icon: 'none',
      });
    });

  },
  textTo(e){
    this.toResultPage('1','');
  },
  prevPage(e){
    wx.navigateBack({
      delta: 1, 
    })
  },

   //提示错误信息
   alertError(content){
    wx.showModal({
      title: '签订失败',
      content: content,
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
        }
      },
      fail: () => {},
      complete: () => {},
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