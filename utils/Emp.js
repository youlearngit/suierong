import requestYT from "../api/requestYT";
var app = getApp();

export default class Emp {
	static getCardInfoByEmp(empNo) {
		let options = {
			url: "jsyh/getCardByEmp.do",
			data: JSON.stringify({
				empNo,
			}),
		};
		return requestYT(options).then(res => {
			if (res.STATUS === "1" && res.card) {
				return JSON.parse(res.card);
			} else {
				return Promise.reject("unGetCardByEmp");
			}
		});
	}

	/**
	 * 更具员工好获取员工名片信息
	 * @param {员工号} empNo
	 */
	static async getCardInfo(empNo) {
		let options = {
			url: "jsyh/getCardByEmp.do",
			data: JSON.stringify({
				empNo,
			}),
		};
		return requestYT(options).then(async res => {
			if (res.STATUS === "1" && res.card) {
				let cardInfo = JSON.parse(res.card);
				cardInfo.PHOTO = encodeURIComponent(cardInfo.PHOTO);
				cardInfo.TAG2 = cardInfo.TAG.split("_");

				if (cardInfo.PHOTO && cardInfo.TEXT2 && cardInfo.TEXT2 == "1") {
				} else {
					let avatarName = "";
					if (cardInfo.GENDER == "男") {
						avatarName = "sui_502.png";
					} else if (cardInfo.GENDER == "女") {
						avatarName = "sui_503.png";
					} else {
						avatarName = "sui_501.png";
					}
					cardInfo.PHOTO2 = app.globalData.CDNURL + "/static/wechat/img/sui/" + avatarName;
				}
				return cardInfo;
			} else {
				// console.log("/getCardByEmp 未查询到" + empNo + "的名片信息");
				return Promise.reject("not found cardInfo");
			}
		});
	}
}
