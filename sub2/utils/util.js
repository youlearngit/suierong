
const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	// return [year, month, day].map(formatNumber).join('-') +'/'+ [hour, minute, second].map(formatNumber).join(':')
	return [year, month, day].map(formatNumber).join("-");
};

const formatTime2 = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes(); 
	const second = date.getSeconds();
	return [year, month, day].map(formatNumber).join("-") + "  " + [hour, minute, second].map(formatNumber).join(":");
};

const formatTime3 = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	// return [year, month, day].map(formatNumber).join('-') +'/'+ [hour, minute, second].map(formatNumber).join(':')
	return [year, month, day].map(formatNumber).join(".");
};


const formatTime4 = date => {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	// return [year, month, day].map(formatNumber).join('-') +'/'+ [hour, minute, second].map(formatNumber).join(':')
	return [month, day].map(formatNumber).join("");
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//加密
const enct = data => {
  //具体目录以你的设置为准
  const sm2 = require('../miniprogram_npm/miniprogram-sm-crypto/index').sm2;
  let keypair = sm2.generateKeyPairHex();
  let publicKey = keypair.publicKey; // 公钥
  let privateKey = keypair.privateKey; // 私钥
  let key = wx.getStorageSync('key');
  publicKey = key.split('&')[1];
  let encryptData = sm2.doEncrypt(data, publicKey, 1); // 加密结果
  return encryptData
}

//解密
const dect = data => {

  //具体目录以你的设置为准
  const sm2 = require('../miniprogram_npm/miniprogram-sm-crypto/index').sm2;
  let keypair = sm2.generateKeyPairHex();
  let publicKey = keypair.publicKey; // 公钥
  let privateKey = keypair.privateKey; // 私钥
  let key = wx.getStorageSync('key');
  privateKey = key.split('&')[0];
  let decryptData = sm2.doDecrypt(data, privateKey, 1); // 解密结果
  return decryptData
}

const digest = data => {
  const sm3 = require('../miniprogram_npm/miniprogram-sm-crypto/index').sm3;
  let hashData = sm3(encodeURIComponent(data)); // 杂凑
  return hashData
}

//坐标距离计算
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}
//计算路程距离
function calcDistance (start_long, start_lat, end_long, end_lat) {
  var d1 = 0.01745329251994329;
  var d2 = start_long;
  var d3 = start_lat;
  var d4 = end_long;
  var d5 = end_lat;
  d2 *= d1;
  d3 *= d1;
  d4 *= d1;
  d5 *= d1;
  var d6 = Math.sin(d2);
  var d7 = Math.sin(d3);
  var d8 = Math.cos(d2);
  var d9 = Math.cos(d3);
  var d10 = Math.sin(d4);
  var d11 = Math.sin(d5);
  var d12 = Math.cos(d4);
  var d13 = Math.cos(d5);
  var arrayOfDouble1 = [];
  var arrayOfDouble2 = [];
  arrayOfDouble1.push(d9 * d8);
  arrayOfDouble1.push(d9 * d6);
  arrayOfDouble1.push(d7);
  arrayOfDouble2.push(d13 * d12);
  arrayOfDouble2.push(d13 * d10);
  arrayOfDouble2.push(d11);
  var d14 = Math.sqrt((arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] - arrayOfDouble2[0]) +
    (arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
    (arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2]));
  var result = Math.round((Math.asin(d14 / 2.0) * 12742001.579854401));
  return result <= 1000 ? result : (result / 1000) + '千';
}

const string = data =>{
  if(data == undefined || data == null || data == ''){
    data = '--';
  }
  return data;
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatTime3: formatTime3,
  formatTime4: formatTime4,
  enct: enct,
  dect: dect,
  digest: digest,
  getDistance: getDistance,
  calcDistance: calcDistance,
  string:string
}
