import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";

import http from "../../utils/requsetP.js";
const { $Toast } = require("../../dist/base/index");
import { sendCode, checkCode } from '../../../utils/api';
const util = require("../../utils/util");
var app = getApp();

Page({
    data: {
        preffixUrl: "",
        codeMessage: "发送验证码",
        disabled: "",
        phoneNum: "",
        msgCode: "",
        code: "", //验证码id，
        type: "", // 修改 添加
        page: "", //0是从跨境申请  1是自贸云申请
    },

    onLoad(e) {
        //console.log(e.page);
        this.setData({
            preffixUrl: app.globalData.JSBURL,
            page: e.page,
        });
        this.initValidate();
    },

    phoneInput(e) {
        var that = this;
        that.setData({
            phoneNum: e.detail.value,
        });
    },

    msgInput(e) {
        var that = this;
        that.setData({
            msgCode: e.detail.value,
        });
    },

    compareCode(data) {
        var that = this;

        checkCode(that.data.phoneNum, that.data.msgCode)
        .then((res) => {
          if (res.result_code == '0000') {
            that.addApplication(data);
           
          } else {
            $Toast({
                content: res.result_msg,
                type: "error",
            });
          }
        })
        .catch((err) => {
            $Toast({
                content: err.message||err,
                type: "error",
            });
        });
        //验证二维码
    },

    addApplication(params) {
        var that = this;
        let page = that.data.page;
        params.open_id = wx.getStorageSync("openid");
        params.text1 = page;
        if (page == "0") {
            params.type = 1;
        } else {
            params.type = 2;
        }
        var str = JSON.stringify(params);
        let data = util.enct(str) + util.digest(str);

        http.requestP({
            url: that.data.preffixUrl + "save-zmy-related",
            method: "POST",
            data: {
                data: data,
            },
            header: {
                "content-type": "application/x-www-form-urlencoded",
                key: Date.parse(new Date()).toString().substring(0, 6),
                sessionId: wx.getStorageSync("sessionid"),
                transNo: "XC016",
            },
        })
            .then((res) => {
                // //console.log('添加结果', res);
                if (res.code == 1) {
                    wx.showModal({
                        title: "提示",
                        content: "我们已经收到您的申请，将会尽快联系您",
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta: 1,
                                });
                            } else if (res.cancel) {
                                // //console.log('用户点击取消')
                            }
                        },
                    });
                }
            })
            .catch((err) => {
                //console.log("添加信息异常", err);
            });
    },

    getMsgCode() {
        var that = this;
        let phone = that.data.phoneNum;
        if (phone == "" || phone == null) {
            $Toast({
                content: "请输入手机号",
                type: "warning",
            });
            return;
        } else if (!/^1[3456789]\d{9}$/.test(phone)) {
            $Toast({
                content: "请输入11位的手机号码",
                type: "warning",
            });
            return;
        }
        let type = "";
        let page = that.data.page;

        if (page == 1) {
            type = 2;
        } else {
            type = 3;
        }

        sendCode(phone,type).then(res=>{
            console.log(res)
            if (res.code == 1) {
                // //console.log('获取的验证码id为', util.dect(res.stringData));
                // that.setData({
                //     code: util.dect(res.stringData),
                // });
                $Toast({
                    content: "验证码发送成功",
                    type: "success",
                });
                that.setData({
                    disabled: "disabled",
                });
                var times = 60;
                var interval = setInterval(() => {
                    times--;
                    if (times == 0) {
                        that.setData({
                            disabled: "",
                            codeMessage: "获取验证码",
                        });
                        clearInterval(interval);
                    } else {
                        that.setData({
                            codeMessage: times + "s",
                            disabled: "disabled",
                        });
                    }
                }, 1000);
            } else {
                $Toast({
                    content: res.msg,
                    type: "error",
                });
                return;
            }
        }).catch(err=>{
            $Toast({
                content: err.message||err,
                type: "error",
            });
        })


        
    },
    /**
     * 提交表单
     */
    submitForm(e) {
        var that = this;
        that.initValidate();
        var params = e.detail.value;
        if (!that.WxValidate.checkForm(params)) {
            const error = this.WxValidate.errorList[0];
            $Toast({
                content: error.msg,
                type: "warning",
            });
        } else {
            that.compareCode(params);
        }
    },

    initValidate() {
        var that = this;
        var rules = {
            enterprise_name: {
                required: true,
                orgName: true,
            },
            customer_name: {
                required: true,
                name: true,
            },
            customer_tel: {
                required: true,
                tel: true,
            },
            credit_code: {
                required: true,
            },
        };

        var messages = {
            enterprise_name: {
                required: "请输入企业名称",
            },
            customer_name: {
                required: "请输入姓名",
            },
            customer_tel: {
                required: "请输入手机号",
            },
            credit_code: {
                required: "请输入验证码",
            },
        };

        that.WxValidate = new WxValidate(rules, messages);
        // 自定义验证规则
        this.WxValidate.addMethod(
            "assistance",
            (value, param) => {
                return (
                    this.WxValidate.optional(value) ||
                    (value.length >= 1 && value.length <= 2)
                );
            },
            "请勾选1-2个敲码助手"
        );
    },
});
