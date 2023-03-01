const app = getApp();
Page({
    data: {
        cndUrl:app.globalData.CDNURL,
    },

    onLoad: function (options) {
        this.setData({
            preffixUrl: app.globalData.URL,
        });
    },

    nothing() {
        wx.showToast({
            title: "敬请期待",
            icon: "none",
            duration: 2000,
        });
    },
    toKingSley(){
        wx.navigateTo({
          url: '/sub2/pages/kingsley/index',
        })  
        },
    
    /**
     * 跳转自贸解决方案
     */
    toTrade() {
        wx.navigateTo({
            url: "/sub1/pages/trade/index",
        });
    },

    toCross() {
		wx.navigateTo({
			url: "/sub2/pages/crossBorderE/platform",
		});
	},

    onShareAppMessage: function () {},
});
