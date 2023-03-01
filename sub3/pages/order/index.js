// pages/carLoans/order/index.js
import requestYT from "../../../api/requestYT";
import user from "../../../utils/user";
import api from '../../../utils/api';

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: "",
        userId: "",
        resultItems: [],
        //申请状态
        ApplyStatuasItems: [
            { key: "1", value: "初审中" },
            { key: "2", value: "已受理" },
            { key: "3", value: "初审未通过" },
            { key: "4", value: "正式审批中" },
            { key: "5", value: "取消申请" },
            { key: "6", value: "审批通过" },
            { key: "7", value: "审批未通过" },
            { key: "8", value: "合同审核中" },
            { key: "9", value: "等待放款" },
            { key: "10", value: "贷款已发放" },
        ],

        //合同状态
        contStatusItems: [
            { key: "000", value: "合同未生效" },
            { key: "100", value: "合同核准中" },
            { key: "200", value: "合同核退回" },
            { key: "300", value: "合同生效" },
            { key: "400", value: "合同作废" },
            { key: "700", value: "执行完毕（结清）" },
            { key: "800", value: "执行完毕（到期未结清）" },
        ],

    isApplyFlag: false, //是否为申请结果页面跳转进来的
    backPageSize:1,
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.isApplyFlag) { //判断是否为
            this.setData({
                isApplyFlag: true,
                loanType: wx.getStorageSync('loanType')
            });
        }
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    wx.showLoading({
      title: "请稍候",
      icon: "loading",
      mask: true,
      duration: 20000,
    });
    that.setData({
      preffixUrl: app.globalData.CDNURL,
      userId: wx.getStorageSync('openid'),
    });   
    that.searcItems();
  },
  //获取列表数据
  searcItems(){
    var that  =this;
    let options = {
      url: 'carloan/searchCarLoanProcess.do',
      data: JSON.stringify({
        intId: this.data.userId,
        startNo:"1",
        queryNum: "100",
      }),
    };
    requestYT(options).then((res)=>{
      console.log(res)
      if(res.STATUS == '1'){
       if(res.detailList == ''){
        wx.showToast({
          icon: 'none',
          title: '暂未数据',
        })
       }else{
        var list = JSON.parse(res.detailList);
        list.forEach(item => {
          var applicationStatus = item.applicationStatus;
          //转换状态名称
          that.data.ApplyStatuasItems.forEach(statusItem=>{
            if(statusItem.key == applicationStatus){
              item.statusText = statusItem.value
            }
          });
            switch(applicationStatus){
              case '1':
                item.backgroundColor = 2;
                return;
              case '2':
                item.backgroundColor = 1;
                return;
              case '3':
                item.backgroundColor = 0;
                return;
              case '4':
                item.backgroundColor = 2;
                return;
              case '5':
                item.backgroundColor = 0;
                return;
              case '6':
                item.backgroundColor = 1;
                return;
              case '7':
                item.backgroundColor = 0;
                return;
              case '8':
              case '9':
                item.backgroundColor = 2;
                return;
              case '10':
                item.backgroundColor = 1;
                return;
            }
        });
        list = list.sort((el1, el2) =>
             Date.parse(el2.applyDate) - Date.parse(el1.applyDate)
        );
        that.setData({
            resultItems : list,
          })
        }
      }else{
        wx.showToast({
          title: '获取数据异常',
        })
      }
      wx.hideLoading();
    })
  },

    toBusinessPage(e) {
        let item = e.currentTarget.dataset.dataset;
        if ((item.applicationStatus != 1 && item.applicationStatus != 3) && (item.comfirmedStatus != '' && item.comfirmedStatus != '0')) {
            wx.showLoading({
                title: '请稍候',
                mask: true
            })

            //跳转个人汽车消费贷信息补充页面
            let options = {
                url: 'carloan/selectcarLoanInfo.do',
                data: JSON.stringify({
                    SERNO: item.serno,
                    startNo: "1",
                    queryNum: "100",
                }),
            };
            requestYT(options).then((res) => {
                console.log(res)
                if (res.msgCode != '1111') {
                    let params = JSON.parse(res.carLoanInfoDetal);
                    if (item.comfirmedStatus == "2") {
                        params.indexFlag1 = true; //贷款详情信息页确认标记
                        params.indexFlag2 = true; //借款人基本信息页确认标记
                        params.indexFlag3 = true; //车辆基本信息页确认标记
                    } else {
                        params.indexFlag1 = false; //贷款详情信息页确认标记
                        params.indexFlag2 = false; //借款人基本信息页确认标记
                        params.indexFlag3 = false; //车辆基本信息页确认标记
                    }
                    params.comfirmedStatus = item.comfirmedStatus;
                    //newInfomationPage InformationPage
                    wx.navigateTo({
                        url: '/sub3/pages/order/newInfomationPage/index?params=' + JSON.stringify(params),
                    });
                } else {
                    wx.hideLoading({
                        success: (res) => {
                            wx.showToast({
                                title: '获取数据异常',
                            })
                        },
                    })
                }
            });
        }
    },

    toLoanPage(e) {
        var item = e.currentTarget.dataset.dataset;
        var that = this;
        wx.showLoading({
                title: '请稍候',
                mask: true
            })
            //只读合同
        if ((item.applicationStatus == '8' || item.applicationStatus == '9' || item.applicationStatus == '10') && item.comfirmedStatus == '2' && item.isEmortgageApp == '1') {
            var type = 'b02';
            let options = {
                url: 'carloan/viewSignContact.do',
                data: {
                    type: type.toLocaleUpperCase(),
                    serialNo: item.contno, //合同号
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
                        success: res => {
                            wx.openDocument({
                                filePath: wx.env.USER_DATA_PATH + "/" + '查看合同.pdf',
                                success: function(res) {
                                    wx.hideLoading();
                                },
                                fail(err) {
                                    wx.hideLoading({
                                        title: '合同获取异常',
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
            }).catch(res => {
                wx.hideLoading();
                wx.showToast({
                    title: '合同查询失败',
                    icon: 'none',
                });
            });
        } else {
            // 签约合同
            let options = {
                url: 'carloan/searchContInfo.do',
                data: JSON.stringify({
                    contType: "1",
                    contNo: item.contno,
                }),
            };
            requestYT(options).then((res) => {
                if (res.msgCode != "1111") {
                    var contInfo = JSON.parse(res.contInfo);
                    if (!contInfo.repayAccNo || contInfo.repayAccNo == '') {
                        wx.hideLoading();
                        wx.showModal({
                            title: '提示',
                            content: '请联系您的经办客户经理，关联本笔合同的还款账号！',
                            showCancel: false,
                            confirmText: '确定'
                        });
                        return;
                    }
                    contInfo.isEmortgageApp = item.isEmortgageApp;
                    contInfo.applicationStatus = item.applicationStatus;
                    contInfo.comfirmedStatus = item.comfirmedStatus;
                    contInfo.countContAmt = that.convertNum(Number(
                        (contInfo.contAmt == "0" || contInfo.contAmt == "" ? '0' : contInfo.contAmt)) + Number((contInfo.followContAmt == "0" || contInfo.followContAmt == "" ? '0' : contInfo.followContAmt)));
                    contInfo.contAmt = that.convertNum(contInfo.contAmt);
                    contInfo.followContAmt = contInfo.followContAmt == "0" || contInfo.followContAmt == "" ? '/' : that.convertNum(contInfo.followContAmt);
                    contInfo.followContTerm = contInfo.followContTerm == "0" || contInfo.followContTerm == "" ? '/' : contInfo.followContTerm;
                    contInfo.assessedAmt = contInfo.assessedAmt == "0" || contInfo.assessedAmt == "" ? '/' : contInfo.assessedAmt;
                    // 年利率精度调整
                    contInfo.executeRateY = (contInfo.executeRateY * 100).toFixed(2);
                    contInfo.baseRateY = (contInfo.baseRateY * 100).toFixed(2);
                    contInfo.diffRateY = Math.abs(((contInfo.executeRateY - contInfo.baseRateY) * 100).toFixed(0));
                    // 暂作价精度调整
                    contInfo.mortgagRate = (contInfo.mortgagRate * 100).toFixed(2);

                    var timestamp = Date.parse(new Date());
                    var date = new Date(timestamp);
                    //获取年份  
                    var Y = date.getFullYear();
                    //获取月份  
                    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                    //获取当日日期 
                    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                    contInfo.signDate = Y + "年" + M + "月" + D + "日";
                    wx.navigateTo({
                        url: '/sub3/pages/order/contract/index?params=' + JSON.stringify(contInfo),
                    });
                }
            }).catch(err => {

            })
        }
    },
    // 大写转换
    convertNum(money) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(money)) {
            return "数据非法"; //判断数据是否大于0
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
        var Symbol = ""; //正负值标记
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
        if (money < 0) {
            money = -money;
            Symbol = "负 ";
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
                } else {
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
        ChineseStr = Symbol + ChineseStr;

        return ChineseStr;
    },

    //拨打手机号
    callPhone(e) {
        var tel = e.currentTarget.dataset.dataset;
        wx.makePhoneCall({
            phoneNumber: tel,
            success: function() {},
            fail: function() {}
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

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