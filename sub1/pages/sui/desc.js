// sub1/pages/sui/desc.js
var app = getApp();

Page({
    /**
     * Page initial data
     */
    data: {
        cndUrl:app.globalData.CDNURL,
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {
        this.setData({
            preffixUrl: app.globalData.URL,
        });
    },

    toMine() {
        wx.navigateTo({
            url: "/sub1/pages/auth/index",
        });
    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage: function () {},
});
