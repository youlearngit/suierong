// sub2/pages/greenFinanceZone/index.js
const util = require('../../utils/util');
const app = getApp();
const api = require('../../../utils/api');
import user from "../../../utils/user";
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag: true,
        navTop: app.globalData.statusBarTop,
        navHeight: app.globalData.statusBarHeight,
        preffixUrl: app.globalData.URL,
        greenFinanceUrl: '',
        datas: [],
        title1: '绿色金融专区',
        title2: '产品资讯，随e掌握',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            pageFlag: getCurrentPages().length,
            greenFinanceUrl: `${app.globalData.CDNURL}/static/wechat/img/greenFinance/`,
        });
        this.initData();
    },
    initData() {
        let datas = [{
                id: 1,
                title: '光伏贷',
                small_title: '清洁能源，一键申请',
                bg_url: 'greenFinance_gfd.png',
                image_url: 'logo1.png',
                color: '#0C4396',
            },
            {
                id: 2,
                title: '绿色信贷试算',
                small_title: '信贷分类，智能试算',
                bg_url: 'greenFinance_lsxd.png',
                image_url: 'logo2.png',
                color: '#029688',
            },
            // {
            //     id: 3,
            //     title: '产品手册',
            //     small_title: '',
            //     bg_url: 'greenFinance_cpsc.png',
            //     image_url: 'logo3.png',
            //     color: '#9A69CA',
            // },
            // {
            //     id: 4,
            //     title: '环境效益测算',
            //     small_title: '',
            //     bg_url: 'greenFinance_hjxy.png',
            //     image_url: 'logo4.png',
            //     color: '#E39303',
            // }
        ];
        this.setData({
            datas
        })
    },
    jumpUrl(e) {
        let id = e.currentTarget.dataset.id;
        switch (id) {
            case 1:
                wx.navigateTo({
                    url: '../photovoltaicLoan/index',
                })
                break;
            case 2:
                wx.navigateTo({
                    url: '../greenCredit/index',
                })
                break;
            default:
                wx.showToast({
                    title: '敬请期待！',
                    icon: 'none'
                })
                break;
        }
    },
    indexpage: function() {
        wx.switchTab({
            url: "/pages/shop/index2",
        });
    },
    prePage() {
        wx.navigateBack();
    },
})