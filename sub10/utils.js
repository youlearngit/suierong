// import api from '../../../utils/api';


var app = getApp();

function preffixUrl() {
	// @199: /home/rhedt-interface-1_1_1-PROD_war.ear/rhedt-interface-1.1.1-DEV.war/WEB-INF/classes/static/wechat/img/rcrz
  return app.globalData.CDNURL +'/static/wechat/img/rlc/';

}

const getNowDate = date => {// 时间控件
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month,day].map(formatNumber).join('-')
}
const formatNumber = n => {// 时间控件
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  preffixUrl : preffixUrl,
  getNowDate:getNowDate// 时间控件
}

