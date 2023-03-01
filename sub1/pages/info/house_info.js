// sub1/pages/info/house_info.js

const app = getApp();
var util = require("../../../utils/util.js");
var citys = require("../../../pages/public/city_zj.js");
var QQMapWX = require("../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js");
var qqmapsdk;
import requestP from "../../../utils/requsetP";
Page({
    /**
     * Page initial data
     */
    data: {
        house_info: {},
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        //console.log(decodeURIComponent(options.data));
        let house_info = JSON.parse(decodeURIComponent(options.data));
        this.setData({
            house_info,
        });
    },

    deleteHouse(e) {
        var that = this;
        wx.showModal({
            title: "提示",
            content: "确认删除该房产",
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#000000",
            confirmText: "确定",
            success: (result) => {
                if (result.confirm) {
                    return requestP({
                        url: app.globalData.URL + "sed/delHouseById",
                        data: {
                            id: e.currentTarget.dataset.id,
                        },
                        header: {
                            "content-type": "application/x-www-form-urlencoded",
                            key: Date.parse(new Date())
                                .toString()
                                .substring(0, 6),
                        },
                        method: "POST",
                    })
                        .then((res) => {
                            //console.log(res);
                            if (res.code == "1") {
                                wx.showToast({
                                    title: "删除成功",
                                    icon: "none",
                                    image: "",
                                    duration: 1500,
                                    mask: true,
                                    success: (result) => {
                                        setTimeout(() => {
                                            // wx.navigateTo({
                                            //     url: "/sub1/pages/auth/index",
                                            // });
                                          wx.navigateBack({ 
                                            delta: 1
                                          })

                                        }, 1500);
                                    },
                                });
                            }
                        })
                        .catch((err) => {
                            console.error("删除房产信息失败:", err);
                        });
                }
            },
        });
    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady: function () {},

    /**
     * Lifecycle function--Called when page show
     */
    onShow: function () {},

    /**
     * Lifecycle function--Called when page hide
     */
    onHide: function () {},

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload: function () {},

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh: function () {},

    /**
     * Called when page reach bottom
     */
    onReachBottom: function () {},

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage: function () {},
});
