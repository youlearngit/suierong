// sub2/pages/photovoltaicLoan/index.js
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
        // cdnUrl: app.globalData.CDNURL,
        navTop: app.globalData.statusBarTop,
        navHeight: app.globalData.statusBarHeight,
        preffixUrl: app.globalData.URL,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: {},
        btn_title: '登记信息查询',
        title: "光伏贷是我行向借款人发放的，用于建设光伏发电项目所需资金或偿还已建成光伏发电项目其他债权的固定资产贷款，以项目发电收入和国家财政补贴收入为主要还款来源。",
        listData: [{
                "id": 1,
                "list_title": "适用对象介绍",
                "list_content": [{
                        "id": 11,
                        "title": "适用对象",
                        "content": "新建光伏发电项目或者已建成光伏发电项目其他债权，一般以项目主体作为借款人，对于实力强或行业经验丰富的主要控股股东也可以作为项目借款主体。优先支持“自发自用、余电上网”的分布式屋顶光伏电站项目。"
                    },
                    {
                        "id": 12,
                        "title": "适用地区",
                        "content": "项目所在地需为江苏省内及北京市、上海市、杭州市、深圳市，其他地域暂不介入。",
                    }
                ]

            },
            {
                "id": 2,
                "list_title": "业务申报条件",
                "list_content": [{
                        "id": 21,
                        "title": "项目已向相关能源主管部门备案"
                    },
                    {
                        "id": 22,
                        "title": "取得电网企业出具的并网意见"
                    },
                    {
                        "id": 24,
                        "title": "项目资本金比例不低于20%"
                    },
                    {
                        "id": 25,
                        "title": "电站组件必须选用符合《光伏制造行业规范条件》企业名单内厂家，工程设计和建设单位应严格执行国家标准（含行业标准）和工程规范"
                    },
                ]
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            pageFlag: getCurrentPages().length,
            cdnUrl: app.globalData.CDNURL,
        });
    },
    registInfo: function() {
        let that = this;
        that.ifAuthUserInfo().then((res) => {
            if (res) {
                wx.navigateTo({
                    url: '../photovoltaicLoanApply/index',
                })
            }
        });
    },
    //跳转登记信息查询
    historySearch: function() {
        let that = this;
        that.ifAuthUserInfo().then((res) => {
            if (res) {
                wx.navigateTo({
                    url: '../photovoltaicLoanSearch/index',
                })
            }
        });
        // wx.navigateTo({
        //     url: '../photovoltaicLoanSearch/index',
        // })
    },
    indexpage: function() {
        wx.switchTab({
            url: "/pages/shop/index2",
        });
    },
    prePage() {
        wx.navigateBack();
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
     * 用户信息授权
     */
    ifAuthUserInfo() {
        var that = this;
        return user.ifAuthUserInfo().then((res) => {
            that.setData({
                loginFlag: res,
            });
            return res;
        });
    },
})