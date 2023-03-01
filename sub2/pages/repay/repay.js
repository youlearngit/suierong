import MYURLS from "../../utils/urls";
var app = getApp();
Page({
	data: {
		preffixUrl: "",
		itemsThumbMultiple: [
			{
				thumb: "/static/wechat/img/repay1.jpg",
				title: "微信还款",
				arrow: true,
			},
			{
				thumb: "/static/wechat/img/repay2.jpg",
				title: "快速还款",
				arrow: true,
			},
			{
				thumb: "/static/wechat/img/repay2.jpg",
				title: "美团卡还款",
				arrow: true,
			},
		],
	},
	onLoad() {
		this.setData({
			preffixUrl: "https://wxapp.jsbchina.cn:7080/creditAuth/",
		});
	},
	/**
	 * 判断微信还款还是快速还款
	 * @param {*} e
	 */
	onItemClick(e) {
		if (e.currentTarget.id === "item1") {
			wx.navigateTo({
				url: "../showWeb/showWeb?skipUrl=" + encodeURIComponent(MYURLS.Urls.fastRepay),
			});
		} else if (e.currentTarget.id === "item2") {
			wx.navigateTo({
				url: "../showWeb/showWeb?skipUrl=" + encodeURIComponent(MYURLS.Urls.MeituanRepay),
			});
		} else {
			wx.navigateToMiniProgram({
				appId: "wxcd618295301aa719",
				extraData: {
					foo: "bar",
				},
				success(res) {},
			});
		}
	},
});
