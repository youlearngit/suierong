var aes = require("../encrypt/AES.js");
var md5 = require("../encrypt/MD5.js");
var rsa = require("../encrypt/RSA.js");
var me = {
	/**
	 * aes加密
	 */
	aesEncrypt: function (data, aeskey) {
		var key = aes.enc.Utf8.parse(aeskey);
		var iv = aes.enc.Utf8.parse("SHYTBASESHYTBASE");
		var srcs = aes.enc.Utf8.parse(data);
		var mode = aes.mode.CBC;
		var pad = aes.pad.Pkcs7;
		var encrypted = aes.AES.encrypt(srcs, key, {
			iv: iv,
			mode: mode,
			padding: pad,
		});
		var result = encrypted.ciphertext.toString(aes.enc.Base64);
		return result;
	},
	/**
	 * aes解密
	 */
	aesDecrypt: function (data, key, iv, mode, pad) {
		key = aes.enc.Utf8.parse(key || me.getAesKey());
		iv = iv || aes.enc.Utf8.parse("SHYTBASESHYTBASE");
		mode = mode || aes.mode.CBC;
		pad = pad || aes.pad.Pkcs7;
		data = aes.AES.decrypt(data, key, {
			iv: iv,
			mode: mode,
			padding: pad,
		});
		return data.toString(aes.enc.Utf8);
	},
	/**
	 * md5加密
	 */
	md5Encrypt: function (data, aeskey) {
		return md5.md5(aeskey + data);
	},
	/**
	 * rsa加密
	 */
	rsaEncrypt: function (data) {
		var encrypt_rsa = new rsa.RSAKey();
		encrypt_rsa = rsa.KEYUTIL.getKey(me.getPublicKey());
		var encStr = encrypt_rsa.encrypt(data);
		encStr = rsa.hex2b64(encStr);
		return encStr;
	},

	/**
	 * 三段式加密
	 */
	encrypt: function (data, aeskey) {
		if (typeof data != "string") {
			data = JSON.stringify(data);
		}
		var rsaText = me.rsaEncrypt(aeskey);
		var aesText = me.aesEncrypt(data, aeskey);
		var md5Text = me.md5Encrypt(data, aeskey);
		var result = [md5Text, aesText, rsaText].join(String.fromCharCode(29));
		return result;
	},
	getAesKey: function () {
		return me.uuid(16, 16);
	},
	uuid: function (len, radix) {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
		var uuid = [],
			i;
		radix = radix || chars.length;
		if (len) {
			for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
		} else {
			var r;
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
			uuid[14] = "4";
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | (Math.random() * 16);
					uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join("");
	},
	/**
	 * 获取公共秘钥
	 */
	getPublicKey: function () {
		return "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr53FSkksmcTDEKrNEmLBKWS1IsxXPfQ7n0rXPBcUxNR1nIIBOZVXxdp3fDzIuzPs518Y985/4RuhXcPFOwS34Mawb8PHJ6sj4GTfSfe2vW5xynIct6+YetU+F0/bhTwJ+0u1A8XI/HLzebiYR6UawROGQks2CFycZj6H+6wlTtkX03M9u+ZixkL2N8kjdHHgea+o25ztLpzWNYlY2AjYPww61rYpMmrbhNV6qLUR67fXCR0tcH2x9P7kdC4LAu3iv2C3RZFUugd3SK2cepHM29MJt416dwCbdHJCf+YsKz7Wm233ngMw9FLxI2vjX06hCA1hHR3a2EACPIKFyPk2lwIDAQAB-----END PUBLIC KEY-----";
	},
	/**
	 * 默认的解密方式
	 */
	decrypt: function (data, aesKey) {
		var encryptData = data.substring(14); // 取得数据体
		// 拆分控制码
		var confuseStartPos = parseInt(data.substring(3, 5), 16); // 混淆起始点
		var confuseLen = parseInt(data.substring(5, 7), 16); // 混淆长度
		var confuseRule = parseInt(data.substring(7, 8), 16); // 混淆规则
		var originalLen = parseInt(data.substring(8, 14), 16); // 数据原长度
		// 反混淆
		var confuseData = "";
		var confuseStr = encryptData.substring(confuseStartPos, confuseStartPos + confuseLen); // 混淆内容
		var confuseStrLen = confuseStr.length; // 混淆内容长度
		confuseData += encryptData.substring(0, confuseStartPos); // 追加未混淆部分
		switch (confuseRule) {
			case 1: // 首尾对换
				confuseData += confuseStr.charAt(confuseStrLen - 1);
				confuseData += confuseStr.substring(1, confuseStrLen - 1);
				confuseData += confuseStr.charAt(0);
				break;
			case 2: // 基偶对换
				for (var j = 2; j <= confuseStrLen; j++) {
					if (j % 2 == 0) {
						confuseData += confuseStr.charAt(j - 1);
						confuseData += confuseStr.charAt(j - 2);
					}
				}
				if (confuseStrLen % 2 != 0 && confuseStrLen > 0) {
					confuseData += confuseStr.charAt(confuseStrLen - 1);
				}
				break;
			default:
				break;
		}
		if (0 != confuseRule) {
			confuseData += encryptData.substring(confuseStartPos + confuseLen);
			encryptData = confuseData;
		}
		// 反填充
		encryptData = encryptData.substring(0, originalLen);
		encryptData = aes.enc.Hex.parse(encryptData); // 先解16进制
		var cipherParams = aes.lib.CipherParams.create({
			ciphertext: encryptData,
		});
		var result = me.aesDecrypt(cipherParams, aesKey);
		var jsonStr = JSON.stringify(result);
		var jsonStrSym = jsonStr.replace(/eval\(.*?\)/g, "");
		var jsondata = JSON.parse(JSON.parse(jsonStrSym));
		return jsondata;
	},
};

function gwRequest(params) {
	return {
		head: {
			H_CHNL_ID: "8174",
			H_UPS_SID: wx.getStorageSync("sessionid"),
			H_TIME: new Date().getTime() + 780000 + "",
			H_TIME_OFFSET: "0",
			H_NONCE: guid(),
		},
		body: params,
	};
}
function guid() {
	var tpl = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
	return tpl.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

module.exports = {
	jiami: me.encrypt,
	key: me.getAesKey(),
	gwRequest: gwRequest,
	guid: guid(),
	aesDecrypt: me.decrypt,
};
