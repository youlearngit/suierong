// sub3/pages/bbx/technology.js
var app = getApp();
import utils from './utils';

import talent from './talent';
import user from '../../../utils/user';
import api from '../../../utils/api';
import util from '../../../utils/util';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: utils.preffixUrl(),
        preUrl: app.globalData.URL,
        cndUrl: app.globalData.CDNURL,
        location:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            location:JSON.parse(options.location)
        })
        this.staffByLocation()
    },
    phoneCall: function(e) {
		let {phone} = e.currentTarget.dataset;
		if (phone) {
			wx.makePhoneCall({
				phoneNumber: phone,
			})
		}
	},
    staffByLocation: async function (e) {
        let {
            list,
            location
        } = this.data;
        wx.showLoading({
            title: "加载中",
        });
        list = [];
        let res = {
            LIST: false
        };
        console.log(location);
        if (!res.LIST && location.codes[2]) {
            res = await talent.selectStaff({
                type: 7,
                code: location.codes[2]
            }); // 区专员
        }
        if (!res.LIST && location.codes[1]) {
            res = await talent.selectStaff({
                type: 7,
                code: location.codes[1]
            }); // 市专员
        }
        if (!res.LIST && location.codes[0]) {
            res = await talent.selectStaff({
                type: 7,
                code: location.codes[0]
            }); // 省专员
        }
        console.log(res.LIST);
        list = res.LIST || [];
        if (list.length > 0) {
            list = utils.repeatArrKey(list, "ID");
            list = list.filter(x => x.TYPE == '1');
            // list = this.listDisplay(list);
        }
        wx.hideLoading();
        console.log(list);
        this.setData({
            list: res.LIST[0]
        });
    },
    listDisplay: function(list) {
		let {mkData} = this.data;

		for (let i in list) {
			list[i].distance_km = 0;
			if (list[i].AGENCYNO) {
				let mk = mkData.find(x=>x.ORG_CODE==list[i].AGENCYNO);
				if (mk) {
					list[i].mk = mk;
					list[i].distance = mk.distance;
					list[i].distance_km = mk.distance_km;
				}
			}
		}

		list.sort(function(x,y){
			return x.distance_km - y.distance_km;
		});

		return list;
	},
    getH5() {
        // wx.showModal({

        //     content: '敬请期待',
        //     showCancel: false,
        //     confirmText: '确定',
        //     success: (result) => {
        //         if (result.confirm) {}
        //     },
        // });
         let  skipUrl = 'https://www.jskjzzt.com/cxzy/pages/gongji/gongji?index=0';
         wx.navigateTo({
           url: '/pages/showWeb/showWeb?skipUrl=' + encodeURIComponent(skipUrl),
         });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})