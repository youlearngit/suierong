import utils from './utils';
import Talent from "./talent";

Page({
  data: {
    preffixUrl: utils.preffixUrl(),
    list: {}
  },
  onLoad(options) {
    // console.log(options)
    // console.log(options.datas)
    // console.log(JSON.parse(options.datas))

    let data = {
      idValue:options.id
    }
    Talent.searchById(data).then(res => {
      console.log(res);
    
      this.setData({
        list: res.entityList[0]
      })
    })
   
  },
  phoneCall: function (e) {
    console.log(e,'111');
    let {phone} = e.currentTarget.dataset;
		if (phone) {
			wx.makePhoneCall({
				phoneNumber: phone,
			})
		}
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
})