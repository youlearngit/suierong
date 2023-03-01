function base64_encode(str) {
	//下面是64个基本的编码
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var out, i, len;
	var c1, c2, c3;
	len = str.length;
	i = 0;
	out = "";
	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt((c1 & 0x3) << 4);
			out += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
			out += base64EncodeChars.charAt((c2 & 0xf) << 2);
			out += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		out += base64EncodeChars.charAt(c1 >> 2);
		out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
		out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
		out += base64EncodeChars.charAt(c3 & 0x3f);
	}
	return out;
}
/*
 *  base64编码(编码，配合encodeURIComponent使用)
 *  @parm : str 传入的字符串
 */
function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if (c >= 0x0001 && c <= 0x007f) {
			out += str.charAt(i);
		} else if (c > 0x07ff) {
			out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
		} else {
			out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
		}
	}
	return out;
}

function base64_decode(input) {
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	while (i < input.length) {
		enc1 = base64EncodeChars.indexOf(input.charAt(i++));
		enc2 = base64EncodeChars.indexOf(input.charAt(i++));
		enc3 = base64EncodeChars.indexOf(input.charAt(i++));
		enc4 = base64EncodeChars.indexOf(input.charAt(i++));
		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;
		output = output + String.fromCharCode(chr1);
		if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}
	}
	return utf8_decode(output);
}

/*
 *  utf-8解码
 *  @parm : utftext 传入的字符串
 */
function utf8_decode(utftext) {
	var string = "";
	let i = 0;
	let c = 0;
	let c1 = 0;
	let c2 = 0;
	while (i < utftext.length) {
		c = utftext.charCodeAt(i);
		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		} else if (c > 191 && c < 224) {
			c1 = utftext.charCodeAt(i + 1);
			string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
			i += 2;
		} else {
			c1 = utftext.charCodeAt(i + 1);
			c2 = utftext.charCodeAt(i + 2);
			string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
			i += 3;
		}
	}
	return string;
}

function baseEncode(str) {
	return base64_encode(utf16to8(str));
}

function baseDecode(str) {
	return base64_decode(str);
}

function encode64(input) {
	var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";
	input = unicodetoBytes(input);
	var output = "";
	var chr1,
		chr2,
		chr3 = "";
	var enc1,
		enc2,
		enc3,
		enc4 = "";
	var i = 0;

	do {
		chr1 = input[i++];
		chr2 = input[i++];
		chr3 = input[i++];

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	} while (i < input.length);

	return output;
}

function unicodetoBytes(s) {
	var result = new Array();
	if (s == null || s == "") return result;
	result.push(255); // add "FE" to head
	result.push(254);
	for (var i = 0; i < s.length; i++) {
		var c = s.charCodeAt(i).toString(16);
		if (c.length == 1) i = "000" + c;
		else if (c.length == 2) c = "00" + c;
		else if (c.length == 3) c = "0" + c;
		var var1 = parseInt(c.substring(2), 16);
		var var2 = parseInt(c.substring(0, 2), 16);
		result.push(var1);
		result.push(var2);
	}
	return result;
}
module.exports = {
	baseEncode: baseEncode,
	baseDecode: baseDecode,
	encode64,
};
