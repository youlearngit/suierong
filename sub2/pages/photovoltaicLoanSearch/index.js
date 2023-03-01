// sub2/pages/photovoltaicLoanSearch/index.js
const util = require('../../utils/util');
const app = getApp();
const api = require('../../../utils/api');
import Org from '../../../api/Org';
import user from "../../../utils/user";
import requestYT from '../../../api/requestYT';
import optionsSycz from '../../utils/city-collection'
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
const nowDate = new Date();
const citys = optionsSycz.citys;
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag: true,
        showShop: false,
        cdnUrl: app.globalData.CDNURL,
        navTop: app.globalData.statusBarTop,
        navHeight: app.globalData.statusBarHeight,
        preffixUrl: app.globalData.URL,
        title: "光伏贷登记信息查询",
        back: "返回",
        datas: [],
        infoList: [],
        itemFinancing: [
            { name: '200KW-1MW', code: '0' },
            { name: '1MW-3MW', code: '1' },
            { name: '3MW以上', code: '2' },
        ],
        itemType: [
            { name: '自发自用、余电上网', code: '0' },
            { name: '全额上网', code: '1' },
        ],
        enterpriseType: [
            { name: '民营企业', code: '0' },
            { name: '国企央企', code: '1' },
            { name: '上市公司', code: '2' },
            { name: '自己的企业', code: '3' },
            { name: '其他', code: '4' },
        ],
        itemInvestType: [
            { name: '业主自投', code: '0' },
            { name: '第三方投资', code: '1' },
            { name: '其他', code: '2' },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            datas: [{
                    id: 0,
                    "title": "客户名称",
                    type: 1,
                },
                {
                    id: 1,
                    "title": "联系人",
                    type: 1,
                },
                {
                    id: 2,
                    "title": "联系电话",
                    type: 1,
                }, {
                    id: 3,
                    "title": "融资项目情况",
                    type: 0,
                }, {
                    id: 4,
                    "title": "项目类型",
                    type: 0,
                }, {
                    id: 5,
                    "title": "用电方企业类型",
                    type: 1,
                }, {
                    id: 6,
                    "title": "项目投资类型",
                    type: 1,
                }, {
                    id: 7,
                    "title": "录入时间",
                    type: 1,
                }
            ]
        })
        that.init();
    },
    init() {
        const params = {
            openId: wx.getStorageSync('openid'),
        }
        api.historyQuery(params).then(res => {
            console.log(res)
            if (res.customerList) {
                let result = JSON.parse(res.customerList);
                let {
                    itemFinancing,
                    itemType,
                    enterpriseType,
                    itemInvestType,
                } = this.data;
                if (typeof result === 'object' && result.length) {
                    let results = result.map(item => {
                        return {
                            companyName: item.customerName,
                            contactPerson: item.contactPerson,
                            contactWay: item.contactWay,
                            itemFinancingDesc: itemFinancing.find(m => m.code === item.itemFinancing).name || "",
                            itemTypeDesc: itemType.find(m => m.code === item.itemType).name || "",
                            enterpriseTypeDesc: enterpriseType.find(m => m.code === item.enterpriseType).name || "",
                            itemInvestTypeDesc: itemInvestType.find(m => m.code === item.itemInvestType).name || "",
                            time: util.formatTime(new Date(item.createTime))
                        }
                    })
                    this.setData({
                        infoList: results
                    })
                }
            }
        })
    },
    exit() {
        wx.navigateBack({});
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let imgPath = that.data.cdnUrl + "/static/wechat/img/zm/zm_109.png"
        let params = "&empNo=" + that.data.shareEmpNo + "&intId=" + app.globalData.int_id;
        return api.shareApp(imgPath, params);
    },
    /**
     *
     * @param {*} 返回所有地区 第一列为查询到的地区
     * @returns vant pciker数据格式
     */


})