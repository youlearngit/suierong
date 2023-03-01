import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
import requestP from "../../../utils/requsetP";

var citys = require("../../../pages/public/city.js");
var util = require("../../../utils/util.js");
//引入腾讯地图SDK核心类
var QQMapWX = require("../../../assets/plugins/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js");
var qqmapsdk;
const App = getApp();
const date = new Date();
import user from "../../../utils/user"
import Org from '../../../api/Org'
import House from '../../../api/House'
import api from "../../../utils/api"

var list = [];
Page({
    data: {
        money: "", //金额
        orderNo: "", //网贷订单号
        showbiuld: "true",
        showdanyuan: "true",
        showfanghao: "true",
        falg: "",
        busiCardList: [],
        cardlist: [], //企业名片列表
        cardname: [], //企业名片名称列表，用于展示
        banner: "1000",

        managerTel: "",
        managerID: "",
        chkFlag: false,
        waitSubmit: [], //选择的房产
        gujia2: "", //上传用
        kedai2: "", //
        loginFlag: true, //授权提示控制
        canIUse: wx.canIUse("button.open-type.getUserInfo"),
        userInfo: {},
        pgflag: "pgflag",
        show1: false, //历史评估是否显示
        cityhidden: true,
        keyhidden: true,
        keyhidden1: true,
        keyhidden2: true,
        keyhidden3: true,
        legDisable: "",
        labelname: "",
        submit: true, //重复提交
        list1: [], //getmessagebyopeenid
        mianji: "",
        floor1: "",
        allfloor1: "",
        buildingname: [], //hu小区
        dizhi: [], //hu//地址
        gujia: [], //hu
        kedai: [], //hu
        shijian: [],
        shijian1: [],
        area: [], //mianji
        floor3: [], //楼层
        buildingname1: [], //楼栋
        allfloor3: [], //所有楼层
        housename: [],
        gujia2: [],
        kedai2: [],
        count: "",
        gujia: 0,
        kedai: 0,
        cityhidden: true,
        keyhidden: true,
        coverBgray: true,
        pingguRes: true,
        fangchuan: false,
        house: {
            idCard: "", //身份证
            name: "", //姓名
            cityID: "", //城市码
            housekey: "",
            location: "",
            village: "", //58接口选择值
            biuldiD: "",
            buildname: "",
            roomiD: "", //房号ID
            roomname: "", //房号名
        },
        cityName: "", //城市名
        buildname: "", //输入的小区名
        buildlist: [], //查出来的小区名称集合
        buildlist1: [], //查出来的楼栋
        buildlist2: [], //查出来的房号
        address: [], //地址  判断是否updata
        // floor3: [],
        ceshi: "南京市建邺区沙洲街道河西大街87号朗诗国际街区北园1幢101室",
        falg: "",
        checks: [
            {
                name: "001",
                value: "美国",
            },
            {
                name: "002",
                value: "中国",
                checked: "true",
            },
            {
                name: "003",
                value: "巴西",
            },
        ],
        legalperson: [
            {
                name: "法定代表人",
                value: "0",
                checked: true,
            },
            {
                name: "申请人",
                value: "1",
            },
        ],
        agree_flag: false,
        apliman_flag: true,
        form: {
            orgID: "", //企业统一信用代码
            orgName: "", //q企业姓名
            province: "", //省
            city: "", //市
            name: "", //法人姓名
            tel: "", //法人手机
            idCard: "", //法人身份证
            address: "", //法人联系地址
            timeIndex: "0", //申请期限
            yongtuIndex: "0", //借款用途
            slider: "", //贷款额度
            // loadCardNo: '', //中征码
            provinceCode: "", //省码
            cityCode: "", //市码
            managerID: "", //客户经理号
            officeAdd: "", //企业经营地址
            applicantIdCard: "", //申请人身份证号
            applicantName: "", //申请人姓名
            applicantTel: "",
        },
        aa: "",
        trbsName: "", //客户经理姓名
        phone: "",
        times: ["36个月", "24个月", "12个月", "9个月", "6个月", "3个月"],
        yongtu: ["经营周转", "购货", "其他经营用途"],
        edu: "000",
        flag: true,
        flag_0: true,
        flag_1: true,
        flag_2: true,
        flag_3: true,
        flag_4: true,
        flag_org_diy: true,
        flag_org_ocr: false,
        flag_self_diy: true,
        flag_self_ocr: false,
        disabled: "",
        code: "", //验证码
        iscode: null, //用于存放验证码接口里获取到的code
        codename: "获取验证码",
        region: ["江苏省", "南京市"], //暂时无用
        housees: [],
        provinceName: "", //省
        provinceNameID: "", //省ID
        cityName: "", //市
        cityNameID: "", //市ID
        multiIndex: ["", ""], //以下省市选择过度
        multiArray: [],
        objectMultiArray: [],
        org_cities: {},
        danbaoIndex: [0, 0], //以下担保选择过度
        danbaoArray: [
            ["抵押", "保证", "信用", "其他"],
            ["住宅抵押", "商铺抵押", "厂房抵押"],
        ],
        danbaoMultiArray: [
            {
                regid: "1",
                regname: "抵押",
                regtype: "1",
                ageid: "0",
            },
            {
                regid: "2",
                regname: "保证",
                regtype: "1",
                ageid: "0",
            },
            {
                regid: "3",
                regname: "信用",
                regtype: "1",
                ageid: "0",
            },
            {
                regid: "4",
                regname: "其他",
                regtype: "1",
                ageid: "0",
            },
            {
                regid: "20010010",
                parid: "1",
                regname: "住宅抵押",
                regtype: "2",
                ageid: "0",
            },
            {
                regid: "20010020",
                parid: "1",
                regname: "商铺抵押",
                regtype: "2",
                ageid: "0",
            },
            {
                regid: "20010050",
                parid: "1",
                regname: "厂房抵押",
                regtype: "2",
                ageid: "0",
            },
            {
                regid: "10020",
                parid: "2",
                regname: "担保公司保证",
                regtype: "2",
                ageid: "0",
            },
            {
                regid: "10030",
                parid: "2",
                regname: "一般企事业保证",
                regtype: "2",
                ageid: "0",
            },
            {
                regid: "5",
                parid: "3",
                regname: "信用",
                regtype: "2",
                ageid: "0",
            },
            {
                regid: "10060",
                parid: "4",
                regname: "其他",
                regtype: "2",
                ageid: "0",
            },
        ],
        ocrSelfsrc: "",
        component: App.components[2],
        camera_flag: true,
        takephoto: {
            noticeTxt: "", //渲染提示文字
            coverImg: "", //渲染遮罩层图片
            id: "", //
            tempImage: "", //存放拍照数据
        },
        pagescroll: ".page",
        src: "",
        showModalStatus: "false",
        day_time:
            date.getFullYear() +
            "年" +
            (date.getMonth() + 1) +
            "月" +
            date.getDate() +
            "日",
        preffixUrl: "",
        v: "0", //调用camera组件
        submit: true, //重复提交
        accessToken: "",
    },

    legalRadioChange: function (e) {
        let that = this;
        let ind = e.detail.value;
        that.setData({
            model: ind,
        });
        let money = that.data.money;

        that.getCustomerInfo().then((res) => {
            //console.log("identityInfo", res);
            let idCard = res.ID_NUMBER;
            let name = res.NAME;
            if (ind == 0) {
                //console.log("是法人");

                that.setData({
                    labelname: "法人",
                    "form.slider": money,
                });

                user.getCustomerInfo().then(res=>{
                    that.setData({
                        form: {
                            orgID: that.data.form.orgID, //企业统一信用代码
                            orgName: that.data.form.orgName, //q企业姓名
                            province: that.data.form.province, //省
                            city: that.data.form.city, //市
                            officeAdd: that.data.form.officeAdd, //企业地址
                            // loadCardNo: that.data.form.loadCardNo, //中征码
                            provinceCode: that.data.form.provinceCode,
                            cityCode: that.data.form.cityCode,
                            idCard: idCard,
                            name: name,
                            applicantTel: customer.TEL,
                            slider: money,
                        },
                        legDisable: "disabled",
                        danbaoNameFir: "",
                        danbaoNameSec: "",
                    });
                    wx.hideLoading();
                    that.setData({
                        apliman_flag: true,
                        agree_flag: false,
                        flag_self_diy: false,
                        flag_self_ocr: true,
                    });
                })
            } else {
                that.setData({
                    labelname: "申请人",
                    "form.slider": money,
                });
                user.getCustomerInfo().then(res=>{
                    that.setData({
                        form: {
                            orgID: that.data.form.orgID, //企业统一信用代码
                            orgName: that.data.form.orgName, //q企业姓名
                            province: that.data.form.province, //省
                            city: that.data.form.city, //市
                            officeAdd: that.data.form.officeAdd, //企业地址
                            // loadCardNo: that.data.form.loadCardNo, //中征码
                            provinceCode: that.data.form.provinceCode,
                            cityCode: that.data.form.cityCode,
                            applicantName: name,
                            applicantIdCard: idCard,
                            applicantTel: customer.TEL,
                            slider: money,
                        },
                        legDisable: "",
                        danbaoNameFir: "",
                        danbaoNameSec: "",
                        fangchuan: false,
                    });
                    wx.hideLoading();
                    that.setData({
                        apliman_flag: false,
                        flag_self_diy: true,
                        agree_flag: false,
                        flag_self_ocr: false,
                    });
                })
             
            }
        });
    },

    getInput: function (e) {
        //方法1

        this.data.buildname = e.detail.value;
    },

    onLoad(option) {
        var that = this;

        that.setData({
            org_cities: citys.org_cities,
        });

        var provinceID = option.orgID.substring(2, 4);
        var cityID = option.orgID.substring(2, 6);
        var province = that.data.org_cities[provinceID];
        var city = that.data.org_cities[cityID];
        that.setData({
            "form.orgID": option.orgID,
            "form.orgName": option.orgName,
            "form.officeAdd": option.address,
            "form.slider": option.slider,
            orderNo: option.orderNo,
            "form.province": province,
            "form.city": city,
            "form.provinceCode": provinceID,
            "form.cityCode": cityID,
            provinceName: province,
            cityName: city,
            flag_org_diy: false,
            flag_org_ocr: true,
            money: option.slider,
        });
        var _am = option.ammount;
        if (_am == 500) {
            that.setData({
                banner: "500",
            });
        }
        that.apli();
        // 实例化地图API核心类
        qqmapsdk = new QQMapWX({
            key: "2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D",
        });

        var item = wx.createSelectorQuery();
        item.select("#wrapCommon").boundingClientRect(); //里面需要绑定 view组件的id
        item.exec(function (res) {
            //res为绑定元素信息的数组
            let wrapCommon = res[0].bottom; //这样可以动态获取高度
            that.setData({
                wrapCommonBottom: wrapCommon,
            });
        });
        var that = this;
        // 实例化地图API核心类
        qqmapsdk = new QQMapWX({
            key: "2RIBZ-UTLC2-AWQUY-C7I2T-3YKN5-AIF4D",
        });
       
        //请求接口
      

        this.setData({
            preffixUrl: App.globalData.URL,
            objectMultiArray: citys.citys,
            multiArray: citys.multiArray,
            navTop: App.globalData.statusBarTop,
            navHeight: App.globalData.statusBarHeight,
        });
        this.initValidate();
        wx.showToast({
            title: "加载中...",
            icon: "loading",
            duration: 20000,
        });
        wx.request({
            url: App.globalData.URL + "getuseCard",
            data: { userId: wx.getStorageSync("openid") },
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                key: Date.parse(new Date()).toString().substring(0, 6),
                sessionId: wx.getStorageSync("sessionid"),
                transNo: "XC008",
            },
            method: "POST",
            success(res) {
                var cardlist = res.data.stringData;
                var cardlist1 = JSON.parse(util.dect(cardlist));
                var taggs = "";
                //console.log(cardlist1);
                //console.log(cardlist1.length);
                var listname = [];
                if (cardlist1 != null && cardlist1 != undefined) {
                    for (var i = 0; i < cardlist1.length; i++) {
                        listname.push(cardlist1[i].ORG_NAME);
                    }
                }
                if (cardlist1.length <= 0) {
                } else {
                    that.setData({
                        cardlist: cardlist1,
                        cardname: listname,
                        busiCardList: listname,
                        falg1: "true",
                    });
                    //console.log(that.data.falg1);
                }
            },
        });
    },
    //返回
    beback: function () {
        //console.log("sss");

        this.setData({
            keyhidden: true,
            keyhidden1: true,
            keyhidden2: true,
            keyhidden3: true,
        });
        //console.log(this.data.keyhidden1);
    },

    onShow: function () {
        if (
            App.globalData.share_person != undefined &&
            App.globalData.share_person != null &&
            App.globalData.share_person != ""
        ) {
            user.getCustomerInfo(App.globalData.share_person).then(res=>{
                if (res.ID_CARD != undefined) {
                    this.setData({
                        idcard: res.ID_CARD,
                        nick_name: res.NICK_NAME,
                        real_name: res.REAL_NAME,
                        managerTel: res.TEL?res.TEL:'',
                        managerID: res.USERID?res.USERID:"",
                        trbsName: res.REAL_NAME?res.REAL_NAME:'',
                    });
                }
            })
            }
        wx.hideToast();
        let that = this;
        if (
            wx.getStorageSync("openid") == null ||
            wx.getStorageSync("openid") == ""
        ) {
            wx.login({
                success: (res) => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    util.openid(res.code, App.globalData.URL);
                    setTimeout(function () {
                        that.onLoad();
                    }, 3000);
                },
            });
        } else {
            //判断数据库了里是否存在密钥
            wx.request({
                url: App.globalData.URL + "existkey",
                data: {
                    sessionId: wx.getStorageSync("sessionid"),
                },
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    key: Date.parse(new Date()).toString().substring(0, 6),
                },
                success(res) {
                    if (res.data == undefined || res.data != true) {
                        wx.login({
                            success: (res) => {
                                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                util.openid(res.code, App.globalData.URL);
                            },
                        });
                    }
                },
                fail() {
                    wx.showToast({
                        title: "网络异常",
                        icon: "none",
                        duration: 2000,
                    });
                },
            });
        }

        that.getCustomerInfo().then((res) => {
            //console.log("identityInfo", res);
            let idCard = res.ID_NUMBER;
            let name = res.NAME;
            let ind = 0;
            if (ind == 0) {
                that.setData({
                    model: ind,
                });
                let money = that.data.money;
                if (ind == 0) {
                    //console.log("是法人");

                    that.setData({
                        labelname: "法人",
                        "form.slider": money,
                    });
                    user.getCustomerInfo().then(res=>{
                        
                            that.setData({
                                form: {
                                    orgID: that.data.form.orgID, //企业统一信用代码
                                    orgName: that.data.form.orgName, //q企业姓名
                                    province: that.data.form.province, //省
                                    city: that.data.form.city, //市
                                    officeAdd: that.data.form.officeAdd, //企业地址
                                    // loadCardNo: that.data.form.loadCardNo, //中征码
                                    provinceCode:
                                        that.data.form.provinceCode,
                                    cityCode: that.data.form.cityCode,
                                    idCard: idCard,
                                    name: name,
                                    applicantTel: customer.TEL,
                                    slider: money,
                                },
                                legDisable: "disabled",
                                danbaoNameFir: "",
                                danbaoNameSec: "",
                            });
                        
                        wx.hideLoading();
                        that.setData({
                            apliman_flag: true,
                            agree_flag: false,
                            flag_self_diy: false,
                            flag_self_ocr: true,
                        });
                    })
                   
                }
            }
        });
    },

    /**
     * 获取个人实名认证信息
     */
    getCustomerInfo() {
        var that = this;

        return user.getIdentityInfo().then(res=>{
            this.setData({
                "form.idCard": JSON.parse(res.stringData)[0]
                    .ID_NUMBER,
                "form.name": JSON.parse(res.stringData)[0].NAME,
            });
            return res
        })
        
    },
    showModal(error) {
        wx.showToast({
            title: error.msg,
            icon: "none",
            duration: 2000,
        });
    },
    showModal(error) {
        wx.showToast({
            title: error.msg,
            icon: "none",
            duration: 2000,
        });
    },

    //切换企业执照手动录入
    change_org() {
        this.setData({
            flag_org_diy: false,
            flag_org_ocr: true,
        });
    },
    //切换企业执照OCR
    change_org_ocr() {
        this.setData({
            flag_org_diy: true,
            flag_org_ocr: false,
        });
    },
    //切换法人手动录入
    change_self() {
        this.setData({
            flag_self_diy: false,
            flag_self_ocr: true,
        });
    },
    //切换法人OCR
    change_self_ocr() {
        this.setData({
            flag_self_diy: true,
            flag_self_ocr: false,
        });
    },
    // 遮罩层显示
    show: function () {
        var that = this;
        that.setData({
            showModalStatus: true,
        });
        wx.showActionSheet({
            itemList: [
                "《个人征信查询授权书》",
                "《个人综合信息查询授权委托书》",
                "《企业征信查询授权书》",
                "《企业综合信息查询授权委托书》",
            ],
            itemColor: "#0066b3",
            success(res) {
                that.setData({
                    pagescroll: ".page .noscroll",
                });
                if (res.tapIndex == 0) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: false,
                        flag_2: true,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 1) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: true,
                        flag_2: false,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 2) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: true,
                        flag_2: true,
                        flag_3: false,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 3) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: true,
                        flag_2: true,
                        flag_3: true,
                        flag_4: false,
                    });
                }
            },
            fail(res) {
                ////console.log(res.errMsg)
                that.setData({
                    pagescroll: ".page",
                });
            },
        });
    },

    // 遮罩层隐藏
    conceal: function () {
        var that = this;
        that.setData({
            showModalStatus: true,
        });
        wx.showActionSheet({
            itemList: [
                "《个人征信查询授权书》",
                "《个人综合信息查询授权委托书》",
                "《企业征信查询授权书》",
                "《企业综合信息查询授权委托书》",
            ],
            itemColor: "#0066b3",
            success(res) {
                that.setData({
                    showModalStatus: true,
                });
                if (res.tapIndex == 0) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: false,
                        flag_2: true,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 1) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: true,
                        flag_2: false,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 2) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: true,
                        flag_2: true,
                        flag_3: false,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 3) {
                    that.setData({
                        flag_0: true,
                        flag_1: true,
                        flag_2: true,
                        flag_3: true,
                        flag_4: false,
                    });
                }
            },
            fail(res) {
                ////console.log(res.errMsg)
                that.setData({
                    pagescroll: ".page",
                });
            },
        });
        that.setData({
            flag: true,
            flag_0: true,
            flag_1: true,
            flag_2: true,
            flag_3: true,
            flag_4: true,
        });
    },

    submitForm1(e) {
        //console.log(this.data.form.applicantTel);
        if (
            wx.getStorageSync("openid") == null ||
            wx.getStorageSync("openid") == ""
        ) {
            wx.showToast({
                title: "请重新打开小程序",
                icon: "loading",
                duration: 2000,
            });
            return;
        }
        var that = this;
        const params = e.detail.value;
        //form_id
        const fId = e.detail.formId;

        //未勾选同意按钮
        if (this.data.checklist != "checked" && this.data.model == 0) {
            wx.showToast({
                title: "请勾选同意协议",
                icon: "none",
                duration: 2000,
            });
            return;
        }

        // 传入表单数据，调用验证方法
        if (!this.WxValidate.checkForm(params)) {
            const error = this.WxValidate.errorList[0];
            this.showModal(error);
            return false;
        }
        if (this.data.submit) {
            wx.showLoading({
                title: "提交中...",
                mask: true,
            });
            //console.log(that.data.gujia);
            //console.log(that.data.kedai);
            //console.log(that.data.form.yongtuIndex);

            let str = JSON.stringify({
                string_credit_code: params.orgID, //统一社会信用代码
                string_enterprise_name: params.orgName, //企业名称
                string_province: that.data.form.provinceCode, //企业实体所在省
                string_city: that.data.form.cityCode, //企业实体所在市
                // string_load_card_no: params.loadCardNo, //中征码
                string_legal_name: params.name, //法人姓名
                string_id_card_no: params.idCard, //身份证号
                string_contact_address: params.address, //联系地址
                string_apply_amount: params.slider + "", //申请额度
                string_apply_term: that.data.times[params.timeIndex].replace(
                    "个月",
                    ""
                ), //申请期限
                string_purpose: that.data.form.yongtuIndex, //贷款用途
                string_vouch_type: that.data.danbaoCodeSec, //提供担保方式
                string_mobile: params.tel, //法人手机号
                string_referrer_mobile: params.managerTel, //推荐人手机号
                string_manager_num: params.managerID, //客户经理工号
                string_estimate_the_amount: that.data.gujia, //估价金额
                string_amount_of_loanable: that.data.kedai, //可贷金额
                string_manage_user_name: that.data.trbsName, //客户经理姓名
                string_office_add: that.data.form.officeAdd, //企业经营地址
                string_json: JSON.stringify(that.data.housees),
                string_applicant_name: that.data.form.applicantName, //申请人姓名
                string_applicant_id_card: that.data.form.applicantIdCard, //申请人身份证号
                string_applicant_tel: params.applicantTel, //申请人电话
                string_sffr: that.data.model, //1代表非法人模式,0代表法人模式
                string_apply_id: that.data.orderNo, //网贷订单号
            });
            //console.log(str);
            str = util.toCDB(
                str
                    .replace(/\(/g, "-括号")
                    .replace(/\（/g, "-括号")
                    .replace(/\)/g, "括号-")
                    .replace(/\）/g, "括号-")
            );
            var data = util.enct(str) + util.digest(str);
            //console.log(util.digest(str));
            wx.request({
                url: App.globalData.URL + "addSuLoanApply", // 仅为示例，并非真实的接口地址
                data: {
                    data: data,
                    code: this.data.code,
                    phone: params.applicantTel,
                    open_id: wx.getStorageSync("openid"),
                },
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    key: Date.parse(new Date()).toString().substring(0, 6),
                    sessionId: wx.getStorageSync("sessionid"),
                    transNo: "XC019",
                },
                success(res) {
                    wx.hideLoading();
                    //console.log(res);
                    wx.showToast({
                        title: res.data.resultMsg,
                        icon: "none",
                        duration: 2000,
                    });

                    if (
                        res.data != undefined &&
                        res.data.code != undefined &&
                        res.data.code != -1
                    ) {
                        var resultData = JSON.parse(res.data.stringData);
                      //成功后跳转
                        wx.navigateTo({
                            //url: '/pages/mine/mine_applicate?orderNo=' + res.data.stringData + '&type=10',
                            url:
                                "apply_result?data=" +
                                res.data.stringData +
                                "&orgName=" +
                                params.orgName +
                                "&orgID=" +
                                params.orgID +
                                "&name=" +
                                params.name +
                                "&officeAdd=" +
                                that.data.form.cityCode +
                                "&applicantTel=" +
                                params.applicantTel +
                                "&loadCardNo=" +
                                that.data.form.loadCardNo,
                        });
                    } else {
                        wx.hideToast();
                        wx.showModal({
                            title: "提示",
                            content: res.data.msg,
                            showCancel: false, //是否显示取消按钮
                            success: function (res) {},
                            fail: function (res) {}, //接口调用失败的回调函数
                            complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
                        });
                    }
                },
                fail() {
                    wx.showToast({
                        title: "网络异常",
                        icon: "none",
                        duration: 2000,
                    });
                    that.setData({
                        submit: true,
                    });
                },
            });
        } else {
            wx.showToast({
                title: "您已提交过了",
                icon: "none",
                duration: 2000,
            });
        }
    },
    initValidate() {
        // 验证字段的规则
        const rules = {
            orgID: {
                required: true,
                orgID: true,
            },
            orgName: {
                required: true,
                orgName: true,
            },
            name: {
                required: true,
                name: true,
            },

            idCard: {
                required: true,
                idcard: true,
            },
            // address: {
            //   required: true,
            //   address: true,
            // },
            timeIndex: {
                required: true,
                timeIndex: true,
            },
            slider: {
                required: true,
                slider: true,
            },
            // loadCardNo: {
            //   required: true,
            //   minlength: 16,
            //   maxlength: 16,
            // },
            // tel: {
            //   required: true,
            //   tel: true,
            // },
            verycode: {
                required: true,
            },
            managerTel: {
                tel: true,
                minlength: 11,
                maxlength: 11,
            },
            managerID: {
                minlength: 8,
                maxlength: 8,
            },
        };

        // 验证字段的提示信息，若不传则调用默认的信息
        const messages = {
            name: {
                required: "请输入法人姓名",
                name: "法人姓名仅支持汉字（8位内）",
            },
            // tel: {
            //   required: "请输入法人代表手机号",
            //   tel: "请输入正确的法人代表手机号",
            // },
            idCard: {
                required: "请输入身份证号码",
                idcard: "请输入正确的身份证号码",
            },
            // address: {
            //   required: '请输入联系地址',
            // },
            orgID: {
                required: "请输入企业统一社会信用代码",
                orgID: "请输入正确的统一社会信用代码",
            },

            orgName: {
                required: "请输入企业名称",
                orgName: "企业名称只能包含汉字及全/半角括号",
            },
            slider: {
                required: "请输入申请金额",
                min: "申请金额不小于1万元",
                max: "申请金额不大于1000万元",
            },
            timeIndex: {
                required: "请选择申请期限",
            },
            // loadCardNo: {
            //   required: '请输入中征码',
            //   minlength: '请输入16位中征码',
            //   maxlength: '请输入16位中征码',
            // },
            verycode: {
                required: "请输入手机验证码",
            },
            managerTel: {
                tel: "请输入正确的推荐人手机号",
                minlength: "请输入11位推荐人手机号",
                maxlength: "请输入11位推荐人手机号",
            },
            managerID: {
                minlength: "请输入8位客户经理工号",
                maxlength: "请输入8位客户经理工号",
            },
        };

        // 创建实例对象
        this.WxValidate = new WxValidate(rules, messages);
    },
    //期限选择
    bindTimeChange(e) {
        const value = e.detail.value;
        this.setData({
            "form.timeIndex": value,
        });
    },
    //用途选择
    bindYongtuChange(e) {
        const value = e.detail.value;
        this.setData({
            "form.yongtuIndex": value,
        });
    },

    //获取输入的手机号，以供发验证码
    getPhoneValue: function (e) {
        var _this = this;
        _this.setData({
            phone: e.detail.value,
            "form.applicantTel": e.detail.value,
        });
    },
    //获取输入的验证码
    getCodeValue: function (e) {
        this.setData({
            code: e.detail.value,
        });
    },

    //校验手机号、后台发送验证码至手机
    getCode: function () {
        var a = this.data.form.applicantTel;

        var _this = this;
        //var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
        if (a == "") {
            wx.showToast({
                title: "手机号不能为空",
                icon: "none",
                duration: 1000,
            });
            setTimeout(function () {
                _this.setData(
                    {
                        codename: "获取验证码",
                        disabled: false,
                    },
                    3000
                );
            });
            return false;
        } else if (a.length != 11) {
            wx.showToast({
                title: "请输入正确的手机号",
                icon: "none",
                duration: 1000,
            });
            setTimeout(function () {
                _this.setData(
                    {
                        codename: "获取验证码",
                        disabled: false,
                    },
                    3000
                );
            });
            return false;
        } else if (a != null && a != "") {
            ////console.log(this.data.phone)

            api.sendCode(this.data.form.applicantTel,8).then(res=>{
                console.log(res)
                if (res.code === 1) {
                  var num = 60;
                  var timer = setInterval(function () {
                    num--;
                    if (num <= 0) {
                      clearInterval(timer);
                      _this.setData({
                        codename: '重新发送',
                        disabled: false
                      })
                    } else {
                      _this.setData({
                        codename: num + "s"
                      })
                    }
                  }, 1000)
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                  })
                  _this.setData({
                    disabled: false
                  })
                }
            }).catch(err=>{
              wx.showToast({
                  title: '发送失败',
                  icon: 'none',
                  duration: 1000
                })
                _this.setData({
                  disabled: false
                })
            })
      

       } else {
            wx.showToast({
                title: "请输入手机号",
                icon: "none",
                duration: 1000,
            });
        }
    },
    //点击获取验证码按钮，出发按钮事件
    getVerificationCode(e) {
        this.getCode();
        var _this = this;
        _this.setData({
            disabled: true,
        });
    },

    //调取拍照控件或选择图片方法控件
    creatPhoto(e) {
        //选取id号sfz--身份证，yyzz--营业执照
        const c = e.target.id;
        var that = this;
        var url = App.globalData.URL;
        util.createPhoto(c, that, url); //截取图片
    },
    //拍照调取原生组件方法
    takePhoto(e) {
        var that = this;
        //选取id号sfz--身份证，yyzz--营业执照
        const c = e.target.id;
        const ctx = wx.createCameraContext();
        var url = App.globalData.URL;
        util.takePhoto(c, ctx, url, that);
    },

    //重拍按钮
    reTake() {
        this.setData({
            camera_flag: true,
        });
        wx.showToast({
            title: "您已取消拍照",
            icon: "none",
            duration: 2000,
        });
    },
    //确定按钮
    chose() {
        this.setData({
            flag_self_ocr: false,
            preview_flag: true,
            v: "0",
        });
    },
    error(e) {
        ////console.log(e.detail)
    },
    //手写input绑定form值
    blur(e) {
        let idname = e.target.id;
        if (idname == "orgID") {
            this.setData({
                "form.orgID": e.detail.value,
            });
        } else if (idname == "orgName") {
            this.setData({
                "form.orgName": e.detail.value,
            });
        } else if (idname == "officeAdd") {
            this.setData({
                "form.officeAdd": e.detail.value,
            });
        } else if (idname == "loadCardNo") {
            this.setData({
                "form.loadCardNo": e.detail.value,
            });
        } else if (idname == "slider") {
            if (e.detail.value > 1000 || e.detail.value < 1) {
                this.setData({
                    "form.slider": "",
                });
                wx.showToast({
                    title: "请输入1-1000内的整数",
                    mask: true,
                    icon: "none",
                    duration: 2000,
                });
            } else {
                this.setData({
                    "form.slider": e.detail.value,
                });
            }
        } else if (idname == "applicantTel") {
            //console.log("22222");
            this.setData({
                "form.applicantTel": e.detail.value,
            });
        } else if (idname == "province") {
            this.setData({
                "form.province": e.detail.value,
            });
        } else if (idname == "city") {
            this.setData({
                "form.city": e.detail.value,
            });
        } else if (idname == "idCard") {
            this.setData({
                "form.idCard": e.detail.value,
            });
        } else if (idname == "name") {
            this.setData({
                "form.name": e.detail.value,
            });
        } else if (idname == "tel") {
            this.setData({
                "form.tel": e.detail.value,
            });
        } else if (idname == "managerID") {
            var that = this;
            this.setData({
                "form.managerID": e.detail.value,
            });
            if (
                that.data.form.orgName == null ||
                that.data.form.orgName == ""
            ) {
                wx.showToast({
                    title: "填写企业名称后才能显示客户经理姓名",
                    icon: "none",
                    duration: 3000,
                });
                return;
            }
            ////console.log(that.data.form.managerID);
            ////console.log(that.data.form.orgName);
            wx.request({
                // 获取token
                url: App.globalData.URL + "general",
                data: {
                    IrbsUserID: that.data.form.managerID,
                    customer: that.data.form.orgName,
                },
                header: {
                    "content-type": "application/json", // 默认值
                    key: Date.parse(new Date()).toString().substring(0, 6),
                },
                success(res) {
                    //console.log(res);
                    that.setData({
                        trbsName:
                            res.data.manageUserName == undefined
                                ? ""
                                : res.data.manageUserName,
                    });
                },
            });
        }
        ////console.log(this.data)
    },
    //同意框选中
    checkedList: function (e) {
        if (e.detail.value[0] == "true") {
            //以选中
            this.setData({
                checklist: "checked",
            });
        } else {
            this.setData({
                //反之
                checklist: "",
            });
        }
    },

    blurCity: function (e) {
        var that = this;
        var provinceID = e.detail.value.substring(2, 4);
        var cityID = e.detail.value.substring(2, 6);
        var province = that.data.org_cities[provinceID];
        var city = that.data.org_cities[cityID];
        that.setData({
            "form.orgID": e.detail.value,
            "form.province": province,
            "form.city": city,
            "form.provinceCode": provinceID,
            "form.cityCode": cityID,
            provinceName: province,
            cityName: city,
        });
    },

    //地区选择
    bindMultiPickerChange: function (e) {
        var arrs = [];
        var that = this;
        var provinceNameID =
            that.data.objectMultiArray[e.detail.value[0]].regid;
        var provinceName =
            that.data.objectMultiArray[e.detail.value[0]].regname;
        that.setData({
            "form.provinceCode": provinceNameID,
            "form.province": provinceName,
            provinceName: provinceName,
        });

        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
            if (
                that.data.objectMultiArray[i].parid ==
                    that.data.objectMultiArray[e.detail.value[0]].regid &&
                that.data.objectMultiArray[i].regtype == 2
            ) {
                arrs.push(that.data.objectMultiArray[i]);
            }
        }
        ////console.log(arrs[e.detail.value[1]].regid)//市区ID
        var cityNameID = arrs[e.detail.value[1]].regid;
        var cityName = arrs[e.detail.value[1]].regname;
        that.setData({
            "form.cityCode": cityNameID,
            "form.city": cityName,
            cityName: cityName,
        });
        that.setData({
            "multiIndex[0]": e.detail.value[0],
            "multiIndex[1]": e.detail.value[1],
        });
    },
    //地区选择
    bindMultiPickerColumnChange: function (e) {
        var that = this;
        switch (e.detail.column) {
            case 0:
                list = [];
                for (var i = 0; i < that.data.objectMultiArray.length; i++) {
                    if (
                        that.data.objectMultiArray[i].parid ==
                        that.data.objectMultiArray[e.detail.value].regid
                    ) {
                        list.push(that.data.objectMultiArray[i].regname);
                    }
                }
                that.setData({
                    "multiArray[1]": list,
                    "multiIndex[0]": e.detail.value,
                    "multiIndex[1]": 0,
                });
        }
    },
    //担保选择
    bindDanbaoPickerChange: function (e) {
        var arrs = [];
        var that = this;
        var regid = that.data.danbaoMultiArray[e.detail.value[0]].regid;
        var regname = that.data.danbaoMultiArray[e.detail.value[0]].regname;
        this.setData({
            housees: [],
        });
        that.setData({
            // 'form.provinceCode': provinceNameID,
            // 'form.province': provinceName,
            danbaoNameFir: regname,
        });

        for (var i = 0; i < that.data.danbaoMultiArray.length; i++) {
            if (
                that.data.danbaoMultiArray[i].parid ==
                    that.data.danbaoMultiArray[e.detail.value[0]].regid &&
                that.data.danbaoMultiArray[i].regtype == 2
            ) {
                arrs.push(that.data.danbaoMultiArray[i]);
            }
        }
        ////console.log(arrs[e.detail.value[1]].regid)//市区ID
        var regid = arrs[e.detail.value[1]].regid;
        var regname = arrs[e.detail.value[1]].regname;
        that.setData({
            danbaoCodeSec: regid,
            // 'form.city': cityName,
            danbaoNameSec: regname,
        });
        ////console.log(that.data.danbaoCodeSec)
        that.setData({
            "danbaoIndex[0]": e.detail.value[0],
            "danbaoIndex[1]": e.detail.value[1],
        });
        //console.log(that.data.form.idCard);
        if (regid == 20010010) {
            if (
                that.data.form.idCard == undefined ||
                that.data.form.idCard == "" ||
                that.data.form.idCard == null
            ) {
                wx.showToast({
                    title: "请先填写法人信息",
                    icon: "none",
                    duration: 2000,
                });
                that.setData({
                    danbaoNameFir: "",
                    danbaoNameSec: "",
                    fangchuan: false,
                });
            } else {
                that.setData({
                    coverBgray: false,
                    fangchuan: true,
                    pgflag: "pgflag on",
                });
                that.showPinggu();
            }
        } else {
            //coverBgray
            that.setData({
                totalPrice: "",
                coverBgray: true,
                fangchuan: false,
                pgflag: "pgflag",
            });
            if (that.animation != undefined) {
                that.animation.scale(1).step();
                that.setData({
                    animation: that.animation.export(),
                });
            }
            if (that.animationHouse != undefined) {
                that.animationHouse.bottom(that.data.bot).step();
                that.setData({
                    animationHouse: that.animationHouse.export(),
                });
            }
        }

        ////console.log(that.data.danbaoIndex)
    },
    bindDanbaoPickerColumnChange: function (e) {
        var that = this;
        switch (e.detail.column) {
            case 0:
                list = [];
                for (var i = 0; i < that.data.danbaoMultiArray.length; i++) {
                    if (
                        that.data.danbaoMultiArray[i].parid ==
                        that.data.danbaoMultiArray[e.detail.value].regid
                    ) {
                        list.push(that.data.danbaoMultiArray[i].regname);
                    }
                }
                that.setData({
                    "danbaoArray[1]": list,
                    "danbaoIndex[0]": e.detail.value,
                    "danbaoIndex[1]": 0,
                });
        }

        if (that.data.form.name == "") {
            wx.showToast({
                title: "请先填写法人信息",
                icon: "none",
                duration: 2000,
            });
            that.setData({
                danbaoNameFir: "",
                danbaoNameSec: "",
            });
        }
    },
    getInput: function (e) {
        //方法1

        this.data.buildname = e.detail.value;
        this.setData({
            serkey: e.detail.value,
        });
        ////console.log(this.data.serkey)
    },
    //评估
    getInput3: function (e) {
        //面积
        var mianji = e.detail.value;
        var patrn = /^([1-9]\d*|0)(\.\d*[1-9])?$/;
        var that = this;
        if (
            !patrn.exec(mianji) ||
            (mianji.indexOf(".") != -1 &&
                mianji.substring(mianji.indexOf("."), mianji.length).length > 3)
        ) {
            wx.showToast({
                title: "请输入正确格式(例如:100.23)",
                mask: true,
                icon: "none",
                duration: 2000,
            });
            that.setData({
                area: "",
            });
        } else {
            if (mianji > 10000) {
                wx.showToast({
                    title: "输入面积错误，最大值9999",
                    mask: true,
                    icon: "none",
                    duration: 2000,
                });
            } else {
                that.setData({
                    area: mianji,
                });
            }
        }
    },
    getInput1: function (e) {
        //楼层
        var floor1 = e.detail.value;
        var that = this;
        if (floor1 < 1 || floor1 > 50) {
            wx.showToast({
                title: "楼层数：请输入1至50之间的整数",
                mask: true,
                icon: "none",
                duration: 2000,
            });
            that.setData({
                floor1: "",
            });
        } else {
            that.setData({
                floor1: floor1,
            });
        }
    },
    getInput2: function (e) {
        //总楼层
        var allfloor1 = e.detail.value;
        var that = this;
        if (allfloor1 < 1 || allfloor1 > 50) {
            wx.showToast({
                title: "总楼层数：请输入1至50之间的整数",
                mask: true,
                icon: "none",
                duration: 2000,
            });
            that.setData({
                allfloor1: "",
                floor1: "",
            });
        } else if (allfloor1 < that.data.floor1) {
            wx.showToast({
                title: "楼层数不能大于总楼层",
                mask: true,
                icon: "none",
                duration: 2000,
            });
            that.setData({
                allfloor1: "",
                floor1: "",
            });
        } else {
            that.setData({
                allfloor1: allfloor1,
            });
        }
    },

    pingguCancle: function () {
        let that = this;
        //coverBgray
        that.setData({
            coverBgray: true,
            pgflag: "pgflag",
        });
        that.animation.scale(1).bottom(that.data.bot).step();
        that.setData({
            animation: that.animation.export(),
        });
        that.animationHouse = wx.createAnimation({
            duration: 500,
            timingFunction: "ease-in-out",
        });
        that.animationHouse.bottom("-100%").step();
        that.setData({
            animationHouse: that.animationHouse.export(),
        });
    },
    addHouse: function () {
        let that = this;
        that.setData({
            coverBgray: false,
            pingguRes: true,
            pgflag: "pgflag",
            house: {},
            area: "",
            floor1: "",
            allfloor1: "",
            cityName: "",
            buildname: "",
        });
        //底层动画
        that.animation = wx.createAnimation({
            duration: 500,
            timingFunction: "ease-in-out",
        });
        that.animation.scale(0.95).step();
        that.setData({
            animation: that.animation.export(),
        });

        // let bot = wx.getSystemInfoSync().windowHeight - that.data.wrapCommonBottom;
        // //console.log(bot)
        that.animationHouse = wx.createAnimation({
            duration: 500,
            timingFunction: "ease-in-out",
        });
        that.animationHouse.bottom(0).step();
        that.setData({
            animationHouse: that.animationHouse.export(),
        });
    },
    //确定评估结果
    subHouse: function () {
        let that = this;
        //console.log(that.data.waitSubmit);
        let ans = [];
        for (var i = 0; i < that.data.waitSubmit.length; i++) {
            ans.push({
                area1: that.data.waitSubmit[i].mianji,
                asses_price1: that.data.waitSubmit[i].gujia2,
                floor1: that.data.waitSubmit[i].cenghao,
                loan_sum1: that.data.waitSubmit[i].kedai2,
                room1: that.data.waitSubmit[i].fanghao,
                story1: that.data.waitSubmit[i].buildingname1,
                total_floor1: that.data.waitSubmit[i].zonglouceng,
                village1: that.data.waitSubmit[i].buildingname,
                village_add1: that.data.waitSubmit[i].dizhi,
            });
        }
        //console.log(ans);
        that.setData({
            coverBgray: true,
            pgflag: "pgflag",
            housees: ans, //that.data.waitSubmit
            //pingguRes: true,
        });
        if (that.animation != undefined) {
            that.animation.scale(1).step();
            that.setData({
                animation: that.animation.export(),
            });
        }

        that.animationPinggu = wx.createAnimation({
            duration: 500,
            timingFunction: "ease-in-out",
        });
        that.animationPinggu.bottom("-100%").step();
        that.setData({
            animationPinggu: that.animationPinggu.export(),
        });
    },
    //关闭评估
    closePG: function () {
        let that = this;
        that.setData({
            coverBgray: true,
            pgflag: "pgflag",
        });

        that.animation.scale(1).step();
        that.setData({
            animation: that.animation.export(),
        });
        that.animationPinggu = wx.createAnimation({
            duration: 500,
            timingFunction: "ease-in-out",
        });
        that.animationPinggu.bottom("-100%").step();
        that.setData({
            animationPinggu: that.animationPinggu.export(),
        });
    },
    //
    showPinggu: function () {
        let that = this;
        that.setData({
            coverBgray: false,
            pingguRes: false,
            pgflag: "pgflag on",
        });
        that.animation = wx.createAnimation({
            duration: 500,
            timingFunction: "ease-in-out",
        });
        that.animation.scale(0.95).step();
        that.setData({
            animation: that.animation.export(),
        });

        that.animationPinggu = wx.createAnimation({
            duration: 500,
            timingFunction: "ease-in-out",
        });
        that.animationPinggu.bottom(0).step();
        that.setData({
            animationPinggu: that.animationPinggu.export(),
        });
        wx.showLoading({
            title: "加载中...",
        });
        House.getHouseInfoByUserID().then(res=>{
            let s = [];

            if(res.length>0){
                for (var i = 0; i < res.data.length; i++) {
                    //console.log(res.data[i].BUILDINGNAME);
                    s.push({
                        buildingname: res.data[i].COMMUNITYNAME,
                        houseid: res.data[i].ID,
                        dizhi: res.data[i].ADDRESS,
                        gujia: (res.data[i].SALEPRICE * 0.0001).toFixed(0),
                        kedai: (res.data[i].SALEPRICE * 0.00007).toFixed(0),
                        shijian: res.data[i].CREATE_DATE.substring(4, 6),
                        shijian1: res.data[i].CREATE_DATE.substring(6, 8),
                        area: res.data[i].AREA,
                        // floor3: res.data[i].FLOORNUMBER,
                        buildingname1: res.data[i].BUILDNAME,
                        // allfloor3: res.data[i].TOTALFLOOR,
                        louhao: res.data[i].DANYUANNAME,
                        cenghao: res.data[i].FLOORNUMBER,
                        fanghao: res.data[i].HOUSENAME,
                        zonglouceng: res.data[i].TOTALFLOOR,
                        mianji: res.data[i].AREA,
                        gujia2: res.data[i].SALEPRICE, //估价具体金额//上传一般业务
                        kedai2: (res.data[i].SALEPRICE * 0.7).toFixed(0), //上传一般业务
                    });
                }
               
            }
            that.setData({
                list1: s,
            });
            wx.hideLoading();
        })
        wx.request({
            url: App.globalData.URL + "getpricecount",
            data: {
                open_id: wx.getStorageSync("openid"),
            },
            header: {
                "content-type": "application/x-www-form-urlencoded",
                key: Date.parse(new Date()).toString().substring(0, 6),
            },
            success: (res) => {
                //console.log(res.data);
                this.setData({
                    count: res.data,
                });
            },
        });
    },

    //选择评估结果
    checkboxChange: function (e) {
        // this.setData({
        //   housees: []
        // })
        var that = this;
        var list = that.data.list1;
        var check = e.detail.value; //checkvalue值唯一编码
        var gujia = 0;
        var kedai = 0;
        // var floor3 = '';
        var buildingname1 = "";
        var allfloor3 = "";
        var buildingname = "";
        var dizhi = "";
        var gujia2 = 0;
        var kedai2 = 0;

        var _ind = [];
        for (var i = 0; i < list.length; i++) {
            that.data.list1[i]["checked"] = "false";
            for (var j = 0; j < check.length; j++) {
                //console.log(list[i].houseid);
                if (list[i].houseid == check[j]) {
                    _ind.push(i);
                }
            }
        }
        //console.log(_ind + "ssssssss");
        var checkArr = [];
        //选中的
        for (var i = 0; i < _ind.length; i++) {
            checkArr.push(list[_ind[i]]);
        }
        //console.log(checkArr);
        that.setData({
            waitSubmit: checkArr,
        });
        if (check.length == 3) {
            wx.showToast({
                title: "最多可以抵押三套房产",
                icon: "none",
                mask: true,
                duration: 2000,
            });
            //未选的
            var ans = list.filter((n) => !checkArr.includes(n));
        } else if (check.length > 3) {
            wx.showModal({
                title: "提示",
                content: "住宅抵押套数超限，请您重新选择",
                showCancel: false,
                success: function (res) {
                    that.setData({
                        list1: list,
                        chkFlag: false,
                        kedai: 0,
                        gujia: 0,
                    });
                },
            });
        }

        for (var i in check) {
            for (var j in list) {
                if (check[i] == list[j].houseid) {
                    gujia += parseInt(list[j].gujia);
                    kedai += parseInt(list[j].kedai);
                    // floor3 = list[j].floor3;
                    buildingname1 = list[j].buildingname1;
                    // allfloor3 = list[j].allfloor3;
                    buildingname = list[j].buildingname;
                    dizhi = list[j].dizhi;
                    gujia2 = list[j].gujia2;
                    kedai2 = list[j].kedai2;
                }
            }
        }
        ////console.log(this.data.housees)
        this.setData({
            count1: check.length,
            gujia: gujia,
            kedai: kedai,
            // floor3: floor3,
            buildingname1: buildingname1,
            // allfloor3: allfloor3,
            buildingname: buildingname,
            dizhi: dizhi,
            gujia2: gujia2,
            kedai2: kedai2,
        });
    },
    //以下是定位、选取城市、获取城市码
    chosecity: function () {
        wx.showLoading({
            title: "加载中...",
        });
        var that = this;
        that.setData({
            cityhidden: false,
        });
        that.getUserLocation();
    },
    bindcity: function (res) {
        var that = this;
        var city = res.currentTarget.dataset.city;
        var citycode = res.currentTarget.dataset.citycode;
        wx.showLoading({
            title: "加载中...",
        });
        that.setData({
            cityName: city,
            "house.cityID": citycode,
            cityID: that.data.house.cityID,
        });
        //console.log();
        setTimeout(function () {
            that.setData({
                cityhidden: true,
            });
        }, 3000);
        wx.hideLoading();
    },
    closeCity: function () {
        var that = this;
        that.setData({
            cityhidden: true,
        });
    },
    getUserLocation: function () {
        let that = this;
        wx.getSetting({
            success: (res) => {
                ////console.log(JSON.stringify(res))
                if (
                    res.authSetting["scope.userLocation"] != undefined &&
                    res.authSetting["scope.userLocation"] != true
                ) {
                    wx.showModal({
                        title: "请求授权当前位置",
                        content: "需要获取您的地理位置，请确认授权",
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: "拒绝授权",
                                    icon: "none",
                                    duration: 1000,
                                });
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        if (
                                            dataAu.authSetting[
                                                "scope.userLocation"
                                            ] == true
                                        ) {
                                            wx.showToast({
                                                title: "授权成功",
                                                icon: "success",
                                                duration: 1000,
                                            });
                                            //再次授权，调用wx.getLocation的API
                                            that.getLocation();
                                        } else {
                                            wx.showToast({
                                                title: "授权失败",
                                                icon: "none",
                                                duration: 1000,
                                            });
                                        }
                                    },
                                });
                            }
                        },
                    });
                } else if (res.authSetting["scope.userLocation"] == undefined) {
                    //调用wx.getLocation的API
                    that.getLocation();
                } else {
                    //调用wx.getLocation的API
                    that.getLocation();
                }
            },
        });
    },

    // 微信获得经纬度
    getLocation: function () {
        let that = this;
        wx.getLocation({
            type: "wgs84", //gcj02
            success: function (res) {
                ////console.log(JSON.stringify(res))
                var latitude = res.latitude;
                var longitude = res.longitude;
                var speed = res.speed;
                var accuracy = res.accuracy;
                that.getLocal(latitude, longitude);
            },
            fail: function (res) {
                //console.log("fail" + JSON.stringify(res));
            },
        });
    },
    // 获取当前地理位置
    getLocal: function (latitude, longitude) {
        let that = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude,
            },
            success: function (res) {
                ////console.log(JSON.stringify(res));
                //console.log(res);
                let province = res.result.ad_info.province;
                let city = res.result.ad_info.city;
                let adcode = res.result.ad_info.adcode;
                that.setData({
                    province: province,
                    cityName: city.split("市")[0],
                    latitude: latitude,
                    longitude: longitude,
                    "house.cityID": adcode.substring(0, 4),
                });
                ////console.log(that.data.cityName)
                ////console.log(that.data.house.cityID)
                // //console.log(that.data.longitude)
                wx.hideLoading();
            },
            fail: function (res) {
                //console.log(res);
            },
            complete: function (res) {
                // //console.log(res);
            },
        });
    },

    //ED0161接口  住宅选择
    ed0161: function (res) {
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        //console.log(res.currentTarget.dataset);
        that.setData({
            keyhidden: true, //隐藏框子
            house: {
                cityID: that.data.house.cityID, //城市id
                housekey: res.currentTarget.dataset.villageid, //选则的小区名称名称
                location: res.currentTarget.dataset.id, //选择的小区id
            },
        });
        wx.hideLoading();
        //console.log(res.currentTarget.dataset.id);
    },

    ed0162: function (res) {
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        //console.log(res.currentTarget.dataset.id),
            //console.log(res.currentTarget);
        if (res.currentTarget.dataset.villageid == "其它") {
            that.setData({
                keyhidden1: true, //隐藏框子
                keyhidden3: true,
                house: {
                    cityID: that.data.house.cityID,
                    housekey: that.data.house.housekey,
                    location: that.data.house.location,
                    biuldiD: res.currentTarget.dataset.id,
                    buildname: res.currentTarget.dataset.villageid,
                    roomname: "其它",
                    roomiD: "",
                },
            });
        } else {
            that.setData({
                keyhidden1: true, //隐藏框子
                keyhidden3: true,
                house: {
                    cityID: that.data.house.cityID,
                    housekey: that.data.house.housekey,
                    location: that.data.house.location,
                    biuldiD: res.currentTarget.dataset.id,
                    buildname: res.currentTarget.dataset.villageid,
                },
            });
        }
        if (that.data.house.biuldiD == "111111") {
            that.setData({
                keyhidden3: false,
            });
        }
        wx.hideLoading();
        //console.log(that.data.house);
    },

    ed0163: function (res) {
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        //console.log(res.currentTarget.dataset.id),
            //console.log(res.currentTarget);
        if (res.currentTarget.dataset.villageid == "其它") {
            that.setData({
                keyhidden1: true, //隐藏框子
                keyhidden2: true,
                house: {
                    cityID: that.data.house.cityID,
                    housekey: that.data.house.housekey,
                    location: that.data.house.location,
                    biuldiD: that.data.house.biuldiD,
                    buildname: that.data.house.buildname,
                    danyuaniD: res.currentTarget.dataset.id,
                    danyuanname: res.currentTarget.dataset.villageid,
                    roomname: "其它",
                    roomiD: "111111",
                },
            });
        } else {
            that.setData({
                keyhidden1: true, //隐藏框子
                keyhidden2: true,
                house: {
                    cityID: that.data.house.cityID,
                    housekey: that.data.house.housekey,
                    location: that.data.house.location,
                    biuldiD: that.data.house.biuldiD,
                    buildname: that.data.house.buildname,
                    danyuaniD: res.currentTarget.dataset.id,
                    danyuanname: res.currentTarget.dataset.villageid,
                },
            });
        }
        // if (that.data.house.danyuaniD == "111111") {
        //   that.setData({
        //     keyhidden3: false
        //   })
        // }
        wx.hideLoading();
        //console.log(that.data.house);
    },

    //60接口  住宅选择
    ed0164: function (res) {
        var that = this;
        wx.showLoading({
            title: "加载中...",
        });
        that.setData({
            keyhidden2: true, //隐藏框子
            keyhidden3: true,
            house: {
                cityID: that.data.house.cityID,
                housekey: that.data.house.housekey,
                location: that.data.house.location,
                biuldiD: that.data.house.biuldiD,
                buildname: that.data.house.buildname,
                danyuaniD: that.data.house.danyuaniD,
                danyuanname: that.data.house.danyuanname,
                house: res.currentTarget.dataset.villageid,
                area: res.currentTarget.dataset.id,
            },
            area: res.currentTarget.dataset.id,
        });
        //console.log(that.data.house.housekey),
            //console.log(that.data.house.location);
        //console.log(that.data.house.biuldiD);
        //console.log(that.data.house.buildname);
        //console.log(that.data.house.roomname);
        //console.log(that.data.house.roomiD);
        if (that.data.house.roomiD == "111111") {
            that.setData({
                keyhidden3: false,
            });
        }
        wx.hideLoading();
    },

    searchkey: function () {
        wx.showLoading({
            title: "加载中...",
        });
        var that = this;
        if (that.data.buildname.length >= 10) {
            wx.showToast({
                title: "字数不得大于10",
                icon: "none",
                duration: 2000,
            });
        } else {
            //城市住宅查询
            wx.request({
                url: App.globalData.URL + "ed0161",
                data: {
                    citycode: that.data.house.cityID,
                    keyword: that.data.buildname,
                },
                header: {
                    "content-type": "application/json", // 默认值x
                    key: Date.parse(new Date()).toString().substring(0, 6),
                },
                success: (res) => {
                    //console.log(res.data.dataList);
                    if (res.data.dataList != undefined) {
                        that.setData({
                            buildlist: res.data.dataList,
                        });
                        wx.hideToast();
                        that.setData({
                            keyhidden: false,
                        });
                    } else {
                        wx.hideToast();
                        if (
                            res.data == null ||
                            res.data.dataList == null ||
                            res.data.dataList == "" ||
                            res.data.lIST == undefined
                        ) {
                            wx.showToast({
                                title: "很抱歉，没有查到相关住宅",
                                icon: "none",
                                mask: true,
                                duration: 2000,
                            });
                            that.setData({
                                keyhidden: true,
                            });
                        } else {
                            wx.showToast({
                                title: "网络异常，请稍后重试",
                                icon: "none",
                                mask: true,
                                duration: 2000,
                            });
                        }
                    }
                },
                complete: function () {
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1000);
                },
            });
        }
    },
    location: function () {
        var that = this;
        if (
            that.data.house.location == "" ||
            that.data.house.location == undefined
        ) {
            wx.showToast({
                title: "请选择位置",
                icon: "none",
                duration: 2000,
            });
        } else {
            that.setData({
                keyhidden1: false,
            });
            wx.showLoading({
                title: "加载中...",
            });
            //console.log(that.data.house.location);
            wx.request({
                url: App.globalData.URL + "ed0162",
                data: {
                    citycode: that.data.house.cityID, //城市编码
                    communityid: that.data.house.location, //小区编吗
                },
                header: {
                    "content-type": "application/json", // 默认值x
                    key: Date.parse(new Date()).toString().substring(0, 6),
                },
                success: (res) => {
                    //console.log(res.data);
                    if (
                        res.data.eRROR_CODE != undefined &&
                        res.data.eRROR_CODE != null &&
                        res.data.eRROR_CODE != ""
                    ) {
                        wx.showToast({
                            title:
                                "未查询到您的楼栋、单元、房号,请手工录入房产面积",
                            icon: "none",
                            mask: true,
                            duration: 2000,
                        });
                        that.setData({
                            keyhidden1: true,
                            showbiuld: "",
                            showdanyuan: "",
                            showfanghao: "",
                        });
                    } else if (res.data.dataList == "") {
                        var list11 = [];
                        list11.push({
                            aliases: "",
                            buildingId: "",
                            buildingName: "其它",
                        });
                        that.setData({
                            buildlist1: list11,
                        });
                    } else {
                        var list = res.data.dataList;
                        that.setData({
                            buildlist1: list,
                        });
                    }

                    //console.log(that.data.buildlist1);
                },
                complete: function () {
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1000);
                },
            });
        }
    },
    danyuan: function () {
        var that = this;
        if (that.data.house.buildingId == "") {
            wx.showToast({
                title: "请选择楼栋",
                icon: "none",
                duration: 2000,
            });
        } else {
            that.setData({
                keyhidden2: false,
            });
            wx.showLoading({
                title: "加载中...",
            });
            //console.log(that.data.house.biuldiD);
            wx.request({
                url: App.globalData.URL + "ed0163",
                data: {
                    citycode: that.data.house.cityID, //城市编码
                    communityid: that.data.house.location, //小区编吗
                    buildingid: that.data.house.biuldiD,
                    // citycode:'320100' , //城市编码
                    // communityid:'5995785' ,//小区编吗
                    // buildingid:'122704438',
                    unitname: "",
                },
                header: {
                    "content-type": "application/json", // 默认值x
                    key: Date.parse(new Date()).toString().substring(0, 6),
                },
                success: (res) => {
                    //console.log(res.data);
                    if (
                        res.data.eRROR_CODE != undefined &&
                        res.data.eRROR_CODE != null &&
                        res.data.eRROR_CODE != ""
                    ) {
                        wx.showToast({
                            title: "未查询到您的单元、房号,请手工录入房产面积",
                            icon: "none",
                            mask: true,
                            duration: 2000,
                        });
                        that.setData({
                            keyhidden2: true,
                            showdanyuan: "",
                            showfanghao: "",
                        });
                    } else if (res.data.data == null) {
                        that.setData({
                            danyuanlist: [
                                {
                                    aliases: "",
                                    unitId: "111111",
                                    unitName: "其它",
                                },
                            ],
                        });
                    } else {
                        var list = res.data.data;
                        that.setData({
                            danyuanlist: list,
                        });
                    }
                },
                complete: function () {
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1000);
                },
            });
        }
    },

    room: function () {
        var that = this;
        if (that.data.house.danyuaniD == "") {
            wx.showToast({
                title: "请选择楼栋",
                icon: "none",
                duration: 2000,
            });
        } else {
            that.setData({
                keyhidden3: false,
            });
            wx.showLoading({
                title: "加载中...",
            });
            wx.request({
                url: App.globalData.URL + "ed0164",
                data: {
                    citycode: that.data.house.cityID, //城市编码
                    buildingid: that.data.house.biuldiD, //楼栋编码
                    unitid: that.data.house.danyuaniD, //单元编码
                },
                header: {
                    "content-type": "application/json", // 默认值x
                    key: Date.parse(new Date()).toString().substring(0, 6),
                },
                success: (res) => {
                    //console.log(res.data);
                    if (
                        res.data.eRROR_CODE != undefined &&
                        res.data.eRROR_CODE != null &&
                        res.data.eRROR_CODE != ""
                    ) {
                        wx.showToast({
                            title: "未查询到您的房号,请手工录入房产面积",
                            icon: "none",
                            mask: true,
                            duration: 2000,
                        });
                        that.setData({
                            keyhidden2: true,
                            showfanghao: "",
                        });
                    } else if (res.data.data == "") {
                        that.setData({
                            buildlist2: [
                                {
                                    aliases: "",
                                    buildingArea: "",
                                    house: "其它",
                                },
                            ],
                        });
                    } else {
                        var list = res.data.data;
                        that.setData({
                            buildlist2: list,
                        });
                        //console.log(that.data.buildlist2);
                    }
                },
                complete: function () {
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1000);
                },
            });
        }
    },
    //估价按钮
    submitForm(e) {
        const params = e.detail.value;
        //console.log(params);
        var that = this;
        //console.log(that.data.house.cityID + "城市编码");
        //console.log(that.data.house.housekey + "小区名称");
        //console.log(that.data.house.buildname + "楼栋名称");
        //console.log(that.data.house.danyuanname + "城市编码");
        //console.log(that.data.house.house + "户号");
        //console.log(that.data.area + "面积");

        var addressZong =
            that.data.house.housekey +
            that.data.house.buildname +
            that.data.house.danyuanname +
            that.data.house.house;
        //console.log(that.data.keyhidden3);
        if (params.squre == "" || params.squre > 9999) {
            wx.showToast({
                title: "请输入正确面积",
                icon: "none",
                duration: 2000,
            });
        } else {
            if (that.data.submit) {
                // that.setData({
                //   submit: false
                // })
                wx.showLoading({
                    title: "加载中...",
                    mask: true,
                });
                wx.request({
                    url: App.globalData.URL + "ed0165",
                    data: {
                        citycode: that.data.house.cityID, //所在/注册市
                        name: that.data.house.housekey, //，小区 名称
                        buildingname: that.data.house.buildname, //楼栋 名称，
                        danyuanname: that.data.house.danyuanname, //单元 名称，
                        housenumber: that.data.house.house, //，户 号，
                        square: that.data.area, // 面 积
                    },
                    header: {
                        "content-type": "application/json", // 默认值x
                        key: Date.parse(new Date()).toString().substring(0, 6),
                    },
                    success: (res) => {
                        //console.log(res.data);
                        //console.log(res.data.saleprice + "         估价金额");
                        if (
                            res.data.dataList != null &&
                            res.data.dataList != undefined &&
                            res.data.dataList
                        ) {
                            //console.log("估价成功");
                            if (that.data.house.buildname == undefined) {
                                that.data.house.buildname = "";
                            }
                            if (that.data.house.danyuanname == undefined) {
                                that.data.house.danyuanname = "";
                            }
                            if (that.data.house.house == undefined) {
                                that.data.house.house = "";
                            }
                            var address1 =
                                res.data.dataList.communityName +
                                that.data.house.buildname +
                                that.data.house.danyuanname +
                                that.data.house.house;
                            //console.log(address1);
                            let data = JSON.stringify({
                                id_id: "id",
                                string_open_id: wx.getStorageSync("openid"),
                                string_evaluateCode: res.data.evaluateCode, //编号
                                string_saleprice: res.data.saleprice, //估价金额
                                string_unitprice: res.data.unitprice, //单价
                                string_alias: res.data.dataList.alias, //住宅名称
                                string_communityname:
                                    res.data.dataList.communityName, //关键字
                                string_buildname: that.data.house.buildname, //楼栋
                                string_danyuanname: that.data.house.danyuanname, //单元
                                string_housename: that.data.house.house, //房号
                                string_area: res.data.dataList.square, //面积
                                string_address: address1,
                            });
                            //console.log(that.data.address);
                            for (var i = 0; i < that.data.address.length; i++) {
                                //console.log(that.data.address[i].ADDRESS);
                                if (
                                    address1 ==
                                    that.data.address[i].buildingname
                                ) {
                                    //console.log("相同 up");
                                    that.setData({
                                        falg: true,
                                    });
                                } else {
                                    //console.log("不同 add");
                                }
                            }
                            //console.log(that.data.falg);
                            if (that.data.falg == true) {
                                wx.request({
                                    url: App.globalData.URL + "updateprice",
                                    data: {
                                        data: data,
                                    },
                                    method: "POST",
                                    header: {
                                        "Content-Type":
                                            "application/x-www-form-urlencoded",
                                        key: Date.parse(new Date())
                                            .toString()
                                            .substring(0, 6),
                                    },
                                    success: (res) => {
                                        wx.hideLoading();
                                        if (res.data.code == 1) {
                                            wx.switchTab({
                                                url: "/component/house/list",
                                            });
                                        }
                                        //console.log(res.data);
                                    },
                                });
                            } else {
                                wx.request({
                                    url: App.globalData.URL + "addprice",
                                    data: {
                                        data: data,
                                    },
                                    method: "POST",
                                    header: {
                                        "Content-Type":
                                            "application/x-www-form-urlencoded",
                                        key: Date.parse(new Date())
                                            .toString()
                                            .substring(0, 6),
                                    },
                                    success: (res) => {
                                        wx.hideLoading();
                                        //console.log(res.data);
                                        if (res.data.code == 1) {
                                            that.setData({
                                                keyhidden2: true, //隐藏框子
                                                keyhidden3: true,
                                                area: "",
                                                serkey: "",
                                                house: {
                                                    cityID:
                                                        that.data.house.cityID,
                                                    serkey: "",
                                                    location: "",
                                                    biuldiD: "",
                                                    buildname: "",
                                                    danyuaniD: "",
                                                    danyuanname: "",
                                                    house: "",
                                                },
                                            });
                                            that.showPinggu();
                                            // that.setData({
                                            //   coverBgray: false,
                                            //   pingguRes: false,
                                            //   pgflag: "pgflag on",
                                            // })
                                            that.animationHouse = wx.createAnimation(
                                                {
                                                    duration: 500,
                                                    timingFunction:
                                                        "ease-in-out",
                                                }
                                            );
                                            that.animationHouse
                                                .bottom("-100%")
                                                .step();
                                            that.setData({
                                                animationHouse: that.animationHouse.export(),
                                            });

                                            that.animationPinggu = wx.createAnimation(
                                                {
                                                    duration: 500,
                                                    timingFunction:
                                                        "ease-in-out",
                                                }
                                            );
                                            that.animationPinggu
                                                .bottom(0)
                                                .step();
                                            that.setData({
                                                animationPinggu: that.animationPinggu.export(),
                                            });
                                        }
                                    },
                                });
                            }
                        } else {
                            wx.showToast({
                                title: "很抱歉，估价失败",
                                icon: "none",
                                duration: 2000,
                            });
                        }
                    },
                });
            } else {
                wx.showToast({
                    title: "您已提交过了",
                    icon: "none",
                    duration: 2000,
                });
            }
        }
    },

    prePage() {
        wx.navigateBack();
    },
    indexpage: function () {
        wx.switchTab({
            url: "/pages/shop/index2",
        });
    },
   
    userInfo: function () {
        //console.log(App.globalData.userInfo);
    },
    //取消登录
    logincancel: function () {
        var that = this;
        that.setData({
            loginFlag: true,
        });
        // wx.showLoading({
        //   title: '未授权登录',
        //   mask:true,
        //   duration:5000
        // })
        wx.switchTab({
            url: "/pages/shop/index2",
        });
    },

    apli: function () {
        var that = this;
        // 查看是否授权
        user.ifAuthUserInfo().then((res) => {
            if (res) {
              //证件拍照
              user
                .getIdentityInfo()
                .then((res) => {})
                .catch((err) => {
                  if (err === 'unSelectIdcard') {
                    wx.showModal({
                      title: '提示',
                      content: '请先进行身份证拍照认证',
                      showCancel: true, //是否显示取消按钮
                      success: function (res) {
                        if (!res.confirm) {
                          return;
                        }
                        wx.navigateTo({
                          url: '/sub1/pages/auth/index?type=2&url=/sub3/pages/common/apli',
                        });
                      },
                    });
                  }
                });
              // 已经授权，可以直接跳转申请
            } else {
              //未授权
              that.setData({
                loginFlag: false,
              });
            }
          });
    },
    businesCard: function (e) {
        let that = this;
        that.setData({
            flag_org_diy: false,
            flag_org_ocr: true,
        });

        wx.showLoading({
            title: "数据加载中...",
            mask: true,
        });

        //wx.request 成功后执行
        wx.hideLoading();
    },
    pickBC: function (e) {
        let that = this;
        //console.log(that.data.busiCardList[e.detail.value] + "sddsad");
        that.setData({
            bcindex: e.detail.value,
        }),
        Org.getEnterpriseInfoByName(that.data.busiCardList[e.detail.value]).then(res=>{
            //console.log(res)
            that.setData({
                'form.orgID': res.ORG_CODE,
                'form.orgName': res.ORG_NAME,
                'form.officeAdd': res.ORG_ADDRESS,
                'form.loadCardNo': res.ZCODE,
    
              })
    
              let provinceID = res.ORG_CODE.substring(2, 4);
              let cityID = res.ORG_CODE.substring(2, 6);
              let province = that.data.org_cities[provinceID];
              let city = that.data.org_cities[cityID];
              that.setData({
                "form.province": province,
                "form.city": city,
                'form.provinceCode': provinceID,
                'form.cityCode': cityID,
                "provinceName": province,
                "cityName": city
              })
           
          }).catch(err=>{
              //console.log(err)
          })
    
    },
});
