import requestYT from './requestYT';
import requestP from '../utils/requsetP';
import user from '../utils/user';
import util from '../utils/util';

var app = getApp();

export default class Chat {
  constructor() {}

  getRecentContact() {
    let options = {
      url: 'chat/getChattedManagers.do',
      data: JSON.stringify({
        customerId: wx.getStorageSync('openid'),
        pageNo: 1,
        pageSize: 10,
      }),
    };
    return requestYT(options).then(async (res) => {
      await res.LIST.sort((a, b) => Date.parse(b.lastChatTime) - Date.parse(a.lastChatTime));
      return res;
    });
  }

  getUnreadNum() {
    let options = {
      url: 'chat/getNumUnread.do',
      data: JSON.stringify({
        OPEN_ID: wx.getStorageSync('openid'),
      }),
    };
    return requestYT(options);
  }

  encryptChatData2(options) {
    var str = JSON.stringify(options);
    var data = util.enct(str) + util.digest(str);
    return requestP({
      url: app.globalData.URL + 'ocs/encrypt',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 默认值
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC024',
      },
      data: {
        message: data,
      },
    }).then((res) => {
      if (res.code == 1 && res.stringData != null) {
        return res.stringData;
      } else {
        return Promise.reject();
      }
    });
  }

  async encryptChatData(message) {
    message = JSON.stringify(message);
    let options = {
      url: 'ocs/encrypt.do',
      data: JSON.stringify({
        message,
      }),
    };

    const res = await requestYT(options);

    if (res.STATUS === '1' && res.result_code === '0000') {
      return res.data;
    } else {
      return Promise.reject(res.result_msg);
    }
  }

  toChatList() {
    let chat = new Chat();
    return user
      .ifAuthUserInfo()
      .then((res) => {
        if (res) {
          return user.getCustomerInfo();
        } else {
          return Promise.reject('unLogin');
        }
      })
      .then((res) => {
        return chat.encryptChatData({
          customerNo: wx.getStorageSync('openid'),
          nickName: res.REAL_NAME || res.NICK_NAME,
        });
      })
      .then((res) => {
        wx.navigateTo({
          url:
            '../showWeb/showWeb?skipUrl=' +
            encodeURIComponent('https://xxct.jsbchina.cn/custome-mobileBank/#/msgList?data=' + res),
        });
      });
  }

  contact(empNo) {
    let chat = new Chat();
    return user
      .ifAuthUserInfo()
      .then((res) => {
        if (res) {
          return user.getCustomerInfo();
        } else {
          return Promise.reject('unLogin');
        }
      })
      .then((res) => {
        return chat.encryptChatData({
          agentNo: empNo,
          customerNo: wx.getStorageSync('openid'),
          nickName: res.REAL_NAME || res.NICK_NAME,
        });
      })
      .then((res) => {
        wx.navigateTo({
          url:
            '/pages/showWeb/showWeb?skipUrl=' +
            encodeURIComponent('https://xxct.jsbchina.cn/custome-mobileBank/#/webchat?data=' + res),
        });
      });
  }
}
