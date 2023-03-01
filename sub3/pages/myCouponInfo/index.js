// sub3/pages/myCouponInfo/index.js
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        if (options.data) {
            let a = JSON.parse(options.data);
            a.GET_TIME = a.GET_TIME.substr(0, 11)


            if (a.PRD_NAME.indexOf(",") == (a.PRD_NAME.length - 1)) {
                a.PRD_NAME = a.PRD_NAME.substr(0, a.PRD_NAME.length - 1)
            }
            that.setData({
                info: a
            })
        }
    },


})