// pages/carLoans/apply/index.js
import api from '../../../utils/api';

const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dealerInfo1: {}, //一手车商信息
        scene: '', // 一手车商
        preffixUrl: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo'), //获取微信用户信息
        carIdList: [],
        loanIdList: [],
        contents: '',
        flag: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        wx.showLoading({
            title: '请稍候',
        });
        let { PRJ_NAME, PRJ_POU_NAME, contains } = options;
        let loanList = [];
        let flag = true;
        if (options.loanList) {
            loanList = JSON.parse(options.loanList);
        }
        let carIdList = contains.split(',');
        console.log('loanList', loanList);
        // if (carIdList[1] == '' || carIdList.length > 2) {
        //     carIdList.pop(); //删除最后一个空数组
        // }
        //判断为房贷还是车贷  房贷 0 车贷 1
        let obj = loanList.length ? loanList[0] : {};
        let { cAR_DEALER_ID, sALESMAN_PHONE, cAR_DEALER_NAME, sALESMAN_NAME, oPERATE_ADDR, dETAILS_ADDR } = obj;
        if (cAR_DEALER_ID) {
            wx.setStorageSync('loanType', 1)
            that.setData({
                contents: '在申请前，请确认您选择购车的汽车经销商信息是否正确，如不一致，请联系经销商重新扫码进入。',
                dealerInfo1: {
                    tel: sALESMAN_PHONE || '',
                    dealer: cAR_DEALER_NAME || '',
                    name: sALESMAN_NAME || '',
                    address: oPERATE_ADDR || '',
                }
            })
        } else {
            wx.setStorageSync('loanType', 0)
            that.setData({
                contents: '在申请前，请确认您选择购房的合作项目信息是否正确，如不一致，请联系我行客户经理后重新扫码进入。',
                dealerInfo1: {
                    tel: sALESMAN_PHONE || '',
                    dealer: PRJ_NAME || '',
                    name: PRJ_POU_NAME || '',
                    address: dETAILS_ADDR || '',
                }
            })
        }
        // 1.房贷产品产品代码包括：910101，930001，930003，910106，910102，930002，930004，910107，910104
        // 2.车贷产品产品代码包括：910201，200000026439
        // 910201：个人一手汽车消费贷款
        // 200000026439：个人二手汽车消费贷款
        // 910101：个人一手住房贷款
        // 930001：个人一手住房省公组合贷款
        // 930003：个人一手住房市公组合贷款
        // 910106：公转商一手房补息贷款
        // 910104：个人一手商业用房贷款
        // 910102：个人二手住房贷款
        // 930002：个人二手住房省公组合贷款
        // 930004：个人二手住房市公组合贷款
        // 910107：公转商二手房补息贷款
        console.log('carIdList', carIdList);
        let loanIdList = [{
                "id": 1,
                "name": '买一手车',
                type: 0,
            },
            {
                "id": 2,
                "name": '买二手车',
                type: 0,
            },
            {
                "id": 3,
                "name": '买一手房',
                type: 0,
            },
            {
                "id": 4,
                "name": '买一手商用房',
                type: 0,
            },
            {
                "id": 5,
                "name": '买二手房',
                type: 0,
            },
        ];
        carIdList.forEach(item => {
            let obj = {};
            obj.id = item;
            switch (item) {
                case '910201':
                    loanIdList[0].type = 1;
                    break;
                case '200000026439':
                    loanIdList[1].type = 1;
                    break;
                case '910101':
                    loanIdList[2].type = 1;
                    flag = false;
                    break;
                case '930001':
                    loanIdList[2].type = 1;
                    flag = false;
                    break;
                case '930003':
                    loanIdList[2].type = 1;
                    flag = false;
                    break;
                case '910106':
                    loanIdList[2].type = 1;
                    flag = false;
                    break;
                case '910104':
                    loanIdList[3].type = 1;;
                    break;
                case '910102':
                    loanIdList[4].type = 1;
                    flag = false;
                    break;
                case '930002':
                    loanIdList[4].type = 1;
                    flag = false;
                    break;
                case '930004':
                    loanIdList[4].type = 1;
                    flag = false;
                    break;
                case '910107':
                    loanIdList[4].type = 1;
                    flag = false;
                    break;
                default:
                    break;
            }
        })
        console.log('loanIdList', loanIdList)
        that.setData({
            //优先展示二手车商信息
            scene: options.prjId,
            preffixUrl: app.globalData.CDNURL,
            carIdList,
            flag,
            loanIdList: loanIdList.filter(item => item.type)
        })
        wx.hideLoading();
    },
    //拨打手机号
    callPhone() {
        wx.makePhoneCall({
            phoneNumber: this.data.dealerInfo1.tel,
            success: function() {
                // console.log("拨打电话成功！")
            },
            fail: function() {
                // console.log("拨打电话失败！")
            }
        })
    },
    //点击按钮
    gotoLoan: function(e) {
        let code = e.currentTarget.dataset.id;
        let { carIdList } = this.data;
        if (code == 2) {
            wx.navigateTo({
                url: `/sub3/pages/apply/orc/index?scene=${this.data.scene}&prdCode=200000026439`
            })
        } else if (code == 1) {
            wx.navigateTo({
                url: `/sub3/pages/apply/orc/index?scene=${this.data.scene}&prdCode=910201`
            })
        } else {
            wx.navigateTo({
                url: `/sub3/pages/apply/orc/index?scene=${this.data.scene}&prdCode=${carIdList}`
            })
        }

    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

    /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.navigateBack({
      delta: 4,
    });
  },
})
