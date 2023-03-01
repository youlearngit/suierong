const app = getApp();
var that;
const util = require("../../../utils/util");
import House from '../../../api/House.js';
import user from '../../../utils/user.js';
var encr = require('../../../utils/encrypt/encrypt.js');
var aeskey = encr.key
Page({

    data: {
        state: '去认证'
    },
    onLoad: function (options) {
        that = this;
        that.setData({
            preffixUrl: app.globalData.URL
        });
        that.getRcrz()
        that.getHouseList();

    },
    getRcrz() {
        user.getCustomerInfo().then(res => {
            let customer = res;

            let dataJson1 = JSON.stringify({
                open_id: wx.getStorageSync('openid'),
                cert_no: customer.ID_CARD
            })
            let custnameTwo1 = encr.jiami(dataJson1, aeskey)
            console.log(dataJson1)

            wx.request({
                url: app.globalData.YTURL + 'jsyh/getPersonByorder.do',
                data: encr.gwRequest(custnameTwo1),
                method: 'POST',
                success(res) {
                    if (res.data.head.H_STATUS != '1') {
                        wx.showToast({
                            title: res.data.head.H_MSG,
                            icon: 'none'
                        })
                        return;
                    }
                    let json = encr.aesDecrypt(res.data.body, aeskey)
                    if (json.flag == '1') {
                        if (json.LIST[0].RESULT_MSG != '') {
                            that.setData({
                                state: '已认证'
                            })
                        }
                    } else {
                        that.setData({
                            state: '去认证'
                        })
                    }

                }
            })
        })
    },
    getHouseList() {

        House.getHouseInfoByUserID().then(houseList=>{
            that.setData({
                houseList
            })
        })
    },
    house() {
        wx.navigateTo({
            url: '/sub1/pages/sui/house',
        })
    },
    renzheng() {
        wx.navigateTo({
            url: '../creditStationPerson/index',
        })
    },
    review() {
        wx.showModal({
            confirmText: '确认提交',
            confirmColor: '#1677FF',
            cancelColor: '#1677FF',
            title: '提交人工审核\n最高可申请1000万元',
            content: '提交人工审批，我们将安排客户经理与您对接，收集材料。\n您的线上审批结果将失效，您确认需要提交吗',
            success(res) {
                if (res.confirm) {} else if (res.cancel) {}
            }
        })
    },
    houseInfo(e) {
        let index = e.currentTarget.dataset.index;
        let houseInfo = that.data.houseList[index];
        houseInfo.GUJIA = (houseInfo.SALEPRICE * 0.0001).toFixed(0);
        houseInfo.KEDAI = (houseInfo.SALEPRICE * 0.00007).toFixed(0);
        wx.navigateTo({
            url: "/sub1/pages/info/house_info?data=" + encodeURIComponent(JSON.stringify(houseInfo)),
        });
    },
    onShow() {
        that.getRcrz()

        that.getHouseList();
    },


})