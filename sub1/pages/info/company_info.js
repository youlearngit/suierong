import WxValidate from "../../../assets/plugins/wx-validate/WxValidate";
var citys = require("../../../pages/public/city.js");
var util = require("../../../utils/util.js");
import Org from '../../../api/Org'

const App = getApp();
const date = new Date();

var list = [];
Page({
    data: {
        showNon1: true,
        orgNameInput: "",
        falg1: "",
        companylist: [],
        busiCardList: [],
        cardlist: [], //企业名片列表
        cardname: [], //企业名片名称列表，用于展示
        idcard: "", //身份证号码
        phone1: "",
        no: "",
        nick_name: "",
        real_name: "",
        tel: "",

        form: {
            name: "", //申请人姓名(法人)
            cardType: "二代身份证", //申请人证件类型
            idCard: "", //申请人证件号码

            orgName: "", //企业名称
            orgID: "", //企业统一信用代码
            orgAddress: "", //企业地址
            province: "", //省
            city: "", //市
            jine: "", //贷款额度
            timeIndex: "", //申请期限
            rencaiName: "", //人才姓名
            rencaiPlan: "", //人才计划类型
            rencaiPlanGrade: "", //人才计划等级，提交后前端评估策略用
            relationIndex: "", //人才与企业关系
            saleIndex: "", //企业上年销售收入
            tel: "", //法人代表手机
            provinceCode: "", //地区省码
            cityCode: "", //地区市码
        },
        provinceName: "", //省
        provinceNameID: "", //省ID
        cityName: "", //市
        cityNameID: "", //市ID
        multiIndex: ["", ""],
        multiArray: [],
        objectMultiArray: [],
        org_cities: {},
        trbsName: "",
        times: [
            "12个月",
            "11个月",
            "10个月",
            "9个月",
            "8个月",
            "7个月",
            "6个月",
            "5个月",
            "4个月",
            "3个月",
            "2个月",
            "1个月",
        ],
        relation: ["法定代表人", "实际控制人", "股东", "其他"],
        sale: [
            "3000万元以上",
            "1000万元-3000万元",
            "200万元-1000万元",
            "不超过200万元",
        ],
        pingfen: [],
        rencaiList: [
            ["国家级", "省级", "市级", "区（县）级"],
            ["国家级人才计划"],
        ],
        objectrencaiList: [
            [
                {
                    id: 0,
                    name: "国家级",
                },
                {
                    id: 1,
                    name: "省级",
                },
                {
                    id: 2,
                    name: "市级",
                },
                {
                    id: 3,
                    name: "区（县）级",
                },
            ],
            [
                {
                    id: 0,
                    name: "国家级人才计划",
                },
            ],
        ],
        rencaiIndex: [],
        rencaiGrade: "",
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
        page: "",
    },
    onLoad: function (options) {
        if (options.page) {
            this.setData({
                page: options.page,
            });
        }
      
    },
    onShow: function () {
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

    // 遮罩层显示
    show: function () {
        var that = this;
        that.setData({
            showModalStatus: true,
        });
        wx.showActionSheet({
            itemList: [
                "《江苏银行信贷业务申请书》",
                "《个人征信查询授权书》",
                "《个人综合信息查询授权委托书》",
                "《企业征信查询授权书》",
                "《综合信息查询授权委托书》",
            ],
            itemColor: "#0066b3",
            success(res) {
                that.setData({
                    pagescroll: ".page .noscroll",
                });
                if (res.tapIndex == 0) {
                    that.setData({
                        flag: false,
                        flag_0: false,
                        flag_1: true,
                        flag_2: true,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 1) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: false,
                        flag_2: true,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 2) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: true,
                        flag_2: false,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 3) {
                    that.setData({
                        flag_0: true,
                        flag_1: true,
                        flag_2: true,
                        flag_3: false,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 4) {
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
    },
    // 遮罩层隐藏
    conceal: function () {
        var that = this;
        that.setData({
            showModalStatus: true,
        });
        wx.showActionSheet({
            itemList: [
                "《江苏银行信贷业务申请书》",
                "《个人征信查询授权书》",
                "《个人综合信息查询授权委托书》",
                "《企业征信查询授权书》",
                "《综合信息查询授权委托书》",
            ],
            itemColor: "#0066b3",
            success(res) {
                that.setData({
                    showModalStatus: true,
                });
                if (res.tapIndex == 0) {
                    that.setData({
                        flag: false,
                        flag_0: false,
                        flag_1: true,
                        flag_2: true,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 1) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: false,
                        flag_2: true,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 2) {
                    that.setData({
                        flag: false,
                        flag_0: true,
                        flag_1: true,
                        flag_2: false,
                        flag_3: true,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 3) {
                    that.setData({
                        flag_0: true,
                        flag_1: true,
                        flag_2: true,
                        flag_3: false,
                        flag_4: true,
                    });
                } else if (res.tapIndex == 4) {
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

    //调取拍照控件或选择图片方法控件
    creatPhoto(e) {
        //选取id号sfz--身份证，yyzz--营业执照
        const c = e.target.id;
        var that = this;
        //点击后调取拍照/选已有sheet
        wx.showActionSheet({
            itemList: ["立即拍照", "从手机相册选择"],
            success(res) {
                //营业执照提示
                that.setData({
                    takephoto: {
                        coverImg: "img/camera_box_org.png",
                        noticeTxt: "请将营业执照（竖版）放入框内",
                        id: "yyzz_take",
                    },
                });

                var _ind = res.tapIndex;
                //拍照界面弹出方法0--立即拍照调取takephoto；1选取已有
                if (_ind == "0") {
                    that.setData({
                        camera_flag: false,
                        v: "1",
                    });
                } else if (_ind == "1") {
                    const c = that.data.takephoto.id;
                    wx.chooseImage({
                        count: 1,
                        sizeType: ["compressed"], //compressed压缩图，original原图
                        sourceType: ["album"],

                        success(res) {
                            var tempFilePaths = res.tempFilePaths;
                            //压缩图片处理
                            var size = res.tempFiles[0].size;
                            wx.getImageInfo({
                                src: tempFilePaths[0],
                                success: function (res) {
                                    var ctx = wx.createCanvasContext(
                                        "attendCanvasId"
                                    );
                                    var ratio = 1;
                                    var canvasWidth = res.width;
                                    var canvasHeight = res.height;
                                    var quality = 1;
                                    while (canvasWidth > 700) {
                                        canvasWidth = Math.trunc(
                                            res.width / ratio
                                        );
                                        canvasHeight = Math.trunc(
                                            res.height / ratio
                                        );
                                        ratio += 0.1;
                                    }
                                    quality = (quality + ratio / 10).toFixed(1);
                                    //console.log(quality);
                                    if (quality > 1) {
                                        quality = 0.7;
                                    }
                                    that.setData({
                                        canvasWidth: canvasWidth,
                                        canvasHeight: canvasHeight,
                                    });
                                    ctx.drawImage(
                                        tempFilePaths[0],
                                        0,
                                        0,
                                        canvasWidth,
                                        canvasHeight
                                    );
                                    ctx.draw();
                                    setTimeout(function () {
                                        wx.canvasToTempFilePath({
                                            canvasId: "attendCanvasId",
                                            width: 0,
                                            height: 0,
                                            destWidth: canvasWidth,
                                            destHeight: canvasHeight,
                                            fileType: "jpg",
                                            quality: quality,
                                            success(res) {
                                                //这里是将图片上传到服务器中并识别
                                                //console.log(res.tempFilePath);
                                                ////console.log(res)
                                                that.setData({
                                                    "takephoto.tempImage":
                                                        res.tempFilePath,
                                                });
                                                if (c == "sfz_take") {
                                                    wx.showToast({
                                                        title: "智能识别中...",
                                                        icon: "loading",
                                                        duration: 20000,
                                                    });
                                                    wx.uploadFile({
                                                        url:
                                                            App.globalData.URL +
                                                            "upload", // 仅为示例，非真实的接口地址
                                                        filePath:
                                                            that.data.takephoto
                                                                .tempImage,
                                                        name: "file",
                                                        formData: {
                                                            option: "1",
                                                        },
                                                        header: {
                                                            key: Date.parse(
                                                                new Date()
                                                            )
                                                                .toString()
                                                                .substring(
                                                                    0,
                                                                    6
                                                                ),
                                                            sessionId: wx.getStorageSync(
                                                                "sessionid"
                                                            ),
                                                        },
                                                        success: (res) => {
                                                            wx.hideToast();
                                                            if (
                                                                res.data !=
                                                                "null"
                                                            ) {
                                                                var result = JSON.parse(
                                                                    res.data
                                                                );
                                                                that.setData({
                                                                    flag_self_diy: false,
                                                                    flag_self_ocr: true,
                                                                    "form.name":
                                                                        result.rE_CUST_NAME,
                                                                    "form.idCard":
                                                                        result.rE_CUST_ID,
                                                                });
                                                            } else {
                                                                wx.showToast({
                                                                    title:
                                                                        "您上传的图片太大啦，请您重新上传。",
                                                                    icon:
                                                                        "none",
                                                                    mask: true,
                                                                    duration: 2000,
                                                                });
                                                            }
                                                        },
                                                    });
                                                } else if (c == "yyzz_take") {
                                                    wx.showToast({
                                                        title: "智能识别中...",
                                                        icon: "loading",
                                                        duration: 20000,
                                                    });
                                                    wx.uploadFile({
                                                        url:
                                                            App.globalData.URL +
                                                            "upload", // 仅为示例，非真实的接口地址
                                                        filePath:
                                                            that.data.takephoto
                                                                .tempImage,
                                                        name: "file",
                                                        formData: {
                                                            option: "2",
                                                        },
                                                        header: {
                                                            key: Date.parse(
                                                                new Date()
                                                            )
                                                                .toString()
                                                                .substring(
                                                                    0,
                                                                    6
                                                                ),
                                                            sessionId: wx.getStorageSync(
                                                                "sessionid"
                                                            ),
                                                        },
                                                        success: (res) => {
                                                            wx.hideToast();
                                                            if (
                                                                res.data != ""
                                                            ) {
                                                                var result = JSON.parse(
                                                                    res.data
                                                                );
                                                                var provinceID = result.rE_REGISTER_ID.substring(
                                                                    2,
                                                                    4
                                                                );
                                                                var cityID = result.rE_REGISTER_ID.substring(
                                                                    2,
                                                                    6
                                                                );
                                                                var province =
                                                                    that.data
                                                                        .org_cities[
                                                                        provinceID
                                                                    ];
                                                                var city =
                                                                    that.data
                                                                        .org_cities[
                                                                        cityID
                                                                    ];
                                                                that.setData({
                                                                    flag_org_diy: false,
                                                                    flag_org_ocr: true,
                                                                    "form.orgID":
                                                                        result.rE_REGISTER_ID,
                                                                    "form.orgName":
                                                                        result.rE_COMPANY_NAME,
                                                                    "form.orgAddress":
                                                                        result.rE_ADDRESS,
                                                                    "form.province": province,
                                                                    "form.city": city,
                                                                    "form.provinceCode": result.rE_REGISTER_ID.substring(
                                                                        2,
                                                                        4
                                                                    ),
                                                                    "form.cityCode": result.rE_REGISTER_ID.substring(
                                                                        2,
                                                                        6
                                                                    ),
                                                                    provinceName: province,
                                                                    cityName: city,
                                                                });
                                                            } else {
                                                                wx.showToast({
                                                                    title:
                                                                        "您上传的图片太大啦，请您重新上传。",
                                                                    icon:
                                                                        "none",
                                                                    mask: true,
                                                                    duration: 2000,
                                                                });
                                                            }
                                                        },
                                                    });
                                                    // //console.log(
                                                    //     that.data.takephoto
                                                    //         .tempImage
                                                    // ); //请上传这个图片并调用营业执照识别
                                                }
                                            },
                                            fail(e) {
                                                wx.hideLoading();
                                                wx.showToast({
                                                    title: "上传失败",
                                                    icon: "success",
                                                    duration: 2000,
                                                });
                                            },
                                        });
                                    }, 1000);
                                },
                            });
                            //压缩结束
                        },
                        fail(res) {
                            //console.log(res.errMsg);
                            wx.showToast({
                                title: "请拍照上传",
                                icon: "none",
                                duration: 1000,
                            });
                        },
                    });
                }
            },
            fail(res) {
                //console.log(res.errMsg);
            },
        });
    },
    //拍照调取原生组件方法
    takePhoto(e) {
        var that = this;
        //选取id号sfz--身份证，yyzz--营业执照
        const c = e.target.id;
        const ctx = wx.createCameraContext();
        ctx.takePhoto({
            quality: "high",
            success: (res) => {
                ////console.log(res)
                var tempImg = res.tempImagePath;

                wx.getImageInfo({
                    src: tempImg,
                    success: function (res) {
                        //console.log(res.path);
                        var _w = res.width;
                        var _h = res.height;
                        var relW = 700;
                        var relH = parseInt((relW * _h) / _w);
                        ////console.log(relH)
                        that.setData({
                            canvasHeight2: 0.75 * relH,
                            canvasWidth2: relW,
                        });
                        var ctx = wx.createCanvasContext("attendCanvasId2");
                        ctx.drawImage(res.path, 0, 0, relW, relH);
                        ctx.draw();

                        setTimeout(function () {
                            wx.canvasToTempFilePath({
                                canvasId: "attendCanvasId2",
                                x: 0,
                                y: 0.2 * relH,
                                width: relW,
                                height: 0.6 * relH,
                                destWidth: 600, //最终图片大小
                                destHeight: parseInt((360 * relH) / relW),
                                fileType: "jpg",
                                quality: 0.7,
                                success(res) {
                                    //这里是将图片上传到服务器中并识别
                                    //console.log(res.tempFilePath);

                                    //传值并关闭拍照界面
                                    that.setData({
                                        "takephoto.tempImage": res.tempFilePath,
                                        camera_flag: true, //隐藏拍照界面
                                        v: "0",
                                    });
                                    //判断调用身份证还是营业执照
                                    if (c == "sfz_take") {
                                        wx.showToast({
                                            title: "智能识别中...",
                                            icon: "loading",
                                            duration: 20000,
                                        });
                                        wx.uploadFile({
                                            url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
                                            filePath:
                                                that.data.takephoto.tempImage,
                                            name: "file",
                                            formData: {
                                                option: "1",
                                            },
                                            header: {
                                                key: Date.parse(new Date())
                                                    .toString()
                                                    .substring(0, 6),
                                                sessionId: wx.getStorageSync(
                                                    "sessionid"
                                                ),
                                            },
                                            success: (res) => {
                                                wx.hideToast();
                                                if (res.data != "") {
                                                    var result = JSON.parse(
                                                        res.data
                                                    );
                                                    that.setData({
                                                        flag_self_diy: false,
                                                        flag_self_ocr: true,
                                                        "form.name":
                                                            result.rE_CUST_NAME,
                                                        "form.idCard":
                                                            result.rE_CUST_ID,
                                                    });
                                                } else {
                                                    wx.showToast({
                                                        title:
                                                            "您上传的图片太大啦，请您重新上传。",
                                                        icon: "none",
                                                        mask: true,
                                                        duration: 2000,
                                                    });
                                                }
                                            },
                                        });
                                        wx.showToast({
                                            title: "智能识别中...",
                                            icon: "loading",
                                            duration: 20000,
                                        });
                                        wx.uploadFile({
                                            url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
                                            filePath:
                                                that.data.takephoto.tempImage,
                                            name: "file",
                                            formData: {
                                                option: "1",
                                            },
                                            header: {
                                                key: Date.parse(new Date())
                                                    .toString()
                                                    .substring(0, 6),
                                                sessionId: wx.getStorageSync(
                                                    "sessionid"
                                                ),
                                            },
                                            success: (res) => {
                                                wx.hideToast();
                                                if (
                                                    res.data != "" &&
                                                    res.data != undefined &&
                                                    res.data != null
                                                ) {
                                                    var result = JSON.parse(
                                                        res.data
                                                    );
                                                    this.setData({
                                                        flag_self_diy: false,
                                                        flag_self_ocr: true,
                                                        "form.name":
                                                            result.rE_CUST_NAME,
                                                        "form.idCard":
                                                            result.rE_CUST_ID,
                                                    });
                                                } else {
                                                    wx.showToast({
                                                        title:
                                                            "您上传的图片太大啦，请您重新上传。",
                                                        icon: "none",
                                                        mask: true,
                                                        duration: 2000,
                                                    });
                                                }
                                            },
                                        });
                                    } else if (c == "yyzz_take") {
                                        wx.showToast({
                                            title: "智能识别中...",
                                            icon: "loading",
                                            duration: 20000,
                                        });
                                        wx.uploadFile({
                                            url: App.globalData.URL + "upload", // 仅为示例，非真实的接口地址
                                            filePath:
                                                that.data.takephoto.tempImage,
                                            name: "file",
                                            formData: {
                                                option: "2",
                                            },
                                            header: {
                                                key: Date.parse(new Date())
                                                    .toString()
                                                    .substring(0, 6),
                                                sessionId: wx.getStorageSync(
                                                    "sessionid"
                                                ),
                                            },
                                            success: (res) => {
                                                wx.hideToast();
                                                if (res.data != "") {
                                                    var result = JSON.parse(
                                                        res.data
                                                    );
                                                    var provinceID = result.rE_REGISTER_ID.substring(
                                                        2,
                                                        4
                                                    );
                                                    var cityID = result.rE_REGISTER_ID.substring(
                                                        2,
                                                        6
                                                    );
                                                    var province =
                                                        that.data.org_cities[
                                                            provinceID
                                                        ];
                                                    var city =
                                                        that.data.org_cities[
                                                            cityID
                                                        ];
                                                    that.setData({
                                                        flag_org_diy: false,
                                                        flag_org_ocr: true,
                                                        "form.orgID":
                                                            result.rE_REGISTER_ID,
                                                        "form.orgName":
                                                            result.rE_COMPANY_NAME,
                                                        "form.orgAddress":
                                                            result.rE_ADDRESS,
                                                        "form.province": province,
                                                        "form.city": city,
                                                        "form.provinceCode": result.rE_REGISTER_ID.substring(
                                                            2,
                                                            4
                                                        ),
                                                        "form.cityCode": result.rE_REGISTER_ID.substring(
                                                            2,
                                                            6
                                                        ),
                                                        provinceName: province,
                                                        cityName: city,
                                                        //'form.faren': result.rE_LEGAL_REPRESENTATIVE,
                                                    });
                                                } else {
                                                    wx.showToast({
                                                        title:
                                                            "您上传的图片太大啦，请您重新上传。",
                                                        icon: "none",
                                                        mask: true,
                                                        duration: 2000,
                                                    });
                                                }
                                            },
                                        });
                                        // //console.log(
                                        //     that.data.takephoto.tempImage
                                        // ); //请上传这个图片并调用营业执照识别
                                    }
                                },
                            });
                        }, 1000);
                    },
                });
            },

            fail: (res) => {
                //console.log(res);
            },
        });
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
        //console.log(e.detail);
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
        } else if (idname == "province") {
            this.setData({
                "form.province": e.detail.value,
            });
        } else if (idname == "jine") {
            this.setData({
                "form.jine": e.detail.value,
            });
        } else if (idname == "city") {
            this.setData({
                "form.city": e.detail.value,
            });
        } else if (idname == "rencaiPlan") {
            this.setData({
                "form.rencaiPlan": e.detail.value,
            });
        } else if (idname == "orgAddress") {
            this.setData({
                "form.orgAddress": e.detail.value,
            });
        } else if (idname == "idCard") {
            this.setData({
                "form.idCard": e.detail.value,
            });
        } else if (idname == "name") {
            this.setData({
                "form.name": e.detail.value,
            });
        } else if (idname == "faren") {
            this.setData({
                "form.faren": e.detail.value,
            });
        } else if (idname == "tel") {
            this.setData({
                "form.tel": e.detail.value,
            });
        }
    },

    prePage() {
        wx.navigateBack();
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

    getBusInfo() {
        var that = this;
        wx.request({
            url: App.globalData.URL + "getBusInfo", //?companyName = ' + this.data.orgNameInput, //获取工商信息
            data: {
                companyName: that.data.orgNameInput,
                openid: wx.getStorageSync("openid"),
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                key: Date.parse(new Date()).toString().substring(0, 6),
                sessionId: wx.getStorageSync("sessionid"),
				transNo: "XC023",
            },
            method: "POST",
            success(res) {
                //console.log(res.data);
				//console.log(util.dect(res.data.stringData));
				// res.data = util.dect(res.data.stringData);
                // //console.log(res.data);
                
                if(res.data.code == 1){
                    let decryptData = util.dect(res.data.stringData);
                  var cardlist = JSON.parse(decryptData);
                  //console.log(cardlist);
                  //console.log(cardlist.length);
                  if (cardlist.length > 0) {
                    // for (let i = 0; i < cardlist.length; i++) {
                    //     for (let j = 0; j < that.data.cardlist.length; j++) {
                    //         if (
                    //             cardlist[i].info.cREDITCODE ==
                    //             that.data.cardlist[j].ORG_CODE
                    //         ) {
                    //             cardlist.splice(i, 1);
                    //         }
                    //     }
                    // }
                    //console.log(cardlist);
                    that.setData({
                      companylist: cardlist,
                    });
                    if (cardlist != null && cardlist != undefined) {
                    }
                  } else {
                    wx.showToast({
                      title: "未查询到相关企业信息",
                      icon: "none",
                      duration: 2000,
                    });
                  }
                } else if (res.data.code == 2 || res.data.code == -1){
                  wx.showToast({
                    title: "暂只支持法定代表人添加企业",
                    icon: "none",
                    duration: 2000,
                  });
                } else if (res.data.code == 3) {
                  wx.showToast({
                    title: "您输入的企业名称有误",
                    icon: "none",
                    duration: 2000,
                  });
                }
                
                // that.setData({
                //   'form.orgID': res.data.data[0].basic.cREDITCODE,
                //   'form.name': res.data.data[0].basic.fRNAME,
                //   'form.orgAddress': res.data.data[0].basic.dOM,
                //   showNon1:true
                // })
            },
            error(res) {
                //console.log(res);
                wx.showToast({
                    title: "暂只支持法定代表人手工添加企业名片",
                    icon: "none",
                    duration: 2000,
                });
            },
        });
    },

    getOrgName: function (e) {
        this.setData({
            orgNameInput: e.detail.value,
        });
    },

    saveBusiness() {
        var that = this;
        //企业名片
        let str = JSON.stringify({
            id_org_id: "id",
            string_org_name: that.data.orgNameInput, //企业名称
            string_org_code: that.data.form.orgID, //统一吗
            string_org_address: that.data.form.orgAddress, //企业地址
            string_artificial_name: that.data.form.name, //法人姓名
            string_org_tel: "", //申请人电话
            string_user_id: wx.getStorageSync("openid"),
        });
        var data = util.enct(str) + util.digest(str);
        wx.request({
            url: App.globalData.URL + "add/card", // 仅为示例，并非真实的接口地址
            data: {
                data: data,
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                key: Date.parse(new Date()).toString().substring(0, 6),
                sessionId: wx.getStorageSync("sessionid"),
                transNo: "XC007",
            },
            success(res) {
                //console.log(res);
            },
        });
    },
    company_detail: function (e) {
        var that = this;
        //console.log(e);
        //console.log(e.currentTarget.dataset.orgname);
        //console.log(this.data.companylist);
        for (var i = 0; i < that.data.companylist.length; i++) {
            if (
                e.currentTarget.dataset.orgname ==
                that.data.companylist[i].info.eNTNAME
            ) {
                wx.navigateTo({
                    //url: 'set_2?url=' + this.data.url + '&type=' + this.data.type,
                    url:
                        "../info/company?companyName=" +
                        e.currentTarget.dataset.orgname +
                        "&companyCode=" +
                        that.data.companylist[i].info.cREDITCODE +
                        "&companyAddress=" +
                        that.data.companylist[i].info.rEGORGPROVINCE +
                        "&name=" +
                        that.data.companylist[i].info.rYNAME +
                        "&status=" +
                        that.data.companylist[i].info.eNTSTATUS +
                        "&page=" +
                      that.data.page +
                      "&type=" +
                      that.data.companylist[i].info.eNTTYPE,
                });
            }
        }
    },
});
