// sub2/pages/photovoltaicLoanApply/index.js
const util = require('../../utils/util');
const app = getApp();
const api = require('../../../utils/api');
import Org from '../../../api/Org';
import user from "../../../utils/user";
import requestYT from '../../../api/requestYT';
import optionsSycz from '../../utils/city-collection'
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
const nowDate = new Date();
const citys = optionsSycz.citys;
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag: true,
        showShop: false,
        cdnUrl: app.globalData.CDNURL,
        navTop: app.globalData.statusBarTop,
        navHeight: app.globalData.statusBarHeight,
        preffixUrl: app.globalData.URL,
        SUPPORT_LEVEL: ['国家级', '省级', '市级', '区县级'],
        SUPPORT_LEVELTxt: '',
        RATE_AREA_ID: '15',
        RATE_AREA_NAME: '',
        isDisable: true,
        IS_SELF_FLAG: false,
        isSubmit: 0,
        selectWd: {},
        // degree picker 融资项目情况
        degree: '',
        degreeIndex: [],
        degreeArray: [
            [
                { name: '200KW-1MW', code: '0' },
                { name: '1MW-3MW', code: '1' },
                { name: '3MW以上', code: '2' },
            ],
        ],
        //profession picker 项目类型
        profession: '',
        professionIndex: [],
        professionArray: [
            [
                { name: '自发自用、余电上网', code: '0' },
                { name: '全额上网', code: '1' },
            ],
        ],
        //poweruser picker 用电方企业类型
        poweruser: '',
        poweruserIndex: [],
        poweruserArray: [
            [
                { name: '民营企业', code: '0' },
                { name: '国企央企', code: '1' },
                { name: '上市公司', code: '2' },
                { name: '自己的企业', code: '3' },
                { name: '其他', code: '4' },
            ]
        ],
        //position picker 项目投资类型
        position: '',
        positionIndex: [],
        positionArray: [
            [
                { name: '业主自投', code: '0' },
                { name: '第三方投资', code: '1' },
                { name: '其他', code: '2' },
            ],
        ],
        isGovernmentTalent: false, //是否是政府人才
        showBaseEnter: false,
        // enterprise fuzzy query
        enterpriseCardInfo: [],
        enterpriseAdded: [],
        enterpriseInfo: {},
        cityCanApply: ['32', '11', '31', '44', '33'],
        multiIndex2: [0, 0, 0], //以下省市选择过度
        multiArray2: [],
        multiArray3: [],
        // 联系方式
        tel: "",
        // 联系人姓名
        real_name: "",
        currentYear: nowDate.getFullYear(),
        //项目所在城市(省市区)
        columns: [{
                values: Object.keys(citys),
                className: 'column1',
            },
            {
                values: citys['江苏省'],
                className: 'column2',
                defaultIndex: 0,
            },
            {
                values: [],
                className: 'column3',
                defaultIndex: 0,
            },
            // {
            //     values: [],
            //     className: 'column4',
            //     defaultIndex: 0,
            // },
        ],
        //项目所在城市
        fieldValue: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.getData('320100', '');
    },
    pickDegree(e) {
        let { degreeArray, degreeIndex } = this.data;
        degreeIndex[0] = e.detail.value[0];
        this.setData({
            degree: degreeArray[0][e.detail.value[0]].name,
            degreeIndex,
        });
    },
    pickProfession(e) {
        let { professionArray, professionIndex } = this.data;
        professionIndex[0] = e.detail.value[0];
        this.setData({
            profession: professionArray[0][e.detail.value[0]].name,
            professionIndex,
        });
    },
    pickPoweruser(e) {
        let { poweruserArray, poweruserIndex } = this.data;
        poweruserIndex[0] = e.detail.value[0];
        this.setData({
            poweruser: poweruserArray[0][e.detail.value[0]].name,
            poweruserIndex,
        });
    },
    pickPosition(e) {
        let { positionArray, positionIndex } = this.data;
        positionIndex[0] = e.detail.value[0];
        this.setData({
            position: positionArray[0][e.detail.value[0]].name,
            positionIndex,
        });
    },
    pickCity(e) {
        this.setData({
            showShop: true
        })
    },
    onCancel: function(e) {
        this.setData({
            showShop: !this.data.showShop
        });
    },
    onChangeWd(event) {
        var that = this;
        const {
            picker,
            value,
            index
        } = event.detail;
        picker.setColumnValues(1, citys[value[0]]);
        if (index == 1) {
            that.getData(value[1].value, index)
        }
        if (index == 0) {
            let d = that.data.columns
            d[1].values = citys[value[0]]
            that.setData({
                columns: d
            })
            that.getData(that.data.columns[1].values[0].value, '')
        }
        if (index == 2) {
            that.getData(value[2] && value[2].ID ? value[2].ID : '320102', index)
        }

    },
    confirmWd(event) {
        let that = this;
        const {
            picker,
            value,
            index
        } = event.detail;
        that.setData({
            selectWd: value[2],
            fieldValue: `${value[0]}${value[1].text}${value[2].text}`
        })
        this.setData({
            showShop: !this.data.showShop
        });
    },
    async getData(value, index) {
        return new Promise((resolve, reject) => {
            let that = this;
            let params = {
                id: value
            }
            api.talentSelectLocation(params).then(data => {
                // console.log('talentSelectLocation', params, data);
                if (data && data.LIST && data.LIST.length) {
                    let col = that.data.columns;
                    let result = data.LIST;
                    result.forEach(item => {
                        item.text = item.NAME
                    })
                    if (index === 2) {
                        col[3].values = result;
                    } else {
                        col[2].values = result;
                    }
                    that.setData({
                        columns: col
                    })
                }

            })

            // let custnameTwo = encr.jiami(dataJson, aeskey) //3段加密

            // wx.request({
            //     url: app.globalData.YTURL + 'open/getOaInfo.do',
            //     data: encr.gwRequest(custnameTwo),
            //     method: 'POST',
            //     success(res) {
            //         if (res.data.head.H_STATUS != '1') {
            //             wx.hideLoading({
            //                 success: (res) => {},
            //             })

            //             reject({
            //                 err: 0
            //             });
            //             return;
            //         }
            //         let json = encr.aesDecrypt(res.data.body, aeskey) //解密返回的报文

            //         if (json.result_code === "0000") {
            //             let data = JSON.parse(json.list);
            //             data.forEach((item, index) => {
            //                 item.text = item.text.substr(4)
            //             })
            //             let col = that.data.columns;
            //             col[2].values = data

            //             that.setData({
            //                 columns: col
            //             })

            //         } else {
            //             reject()
            //             wx.showToast({
            //                 title: json.result_msg,
            //                 icon: 'none'
            //             })
            //         }
            //     }
        })
    },
    editOrgCode(e) {
        this.setData({
            'enterpriseInfo.orgCode': e.detail,
            multiArray3: [],
        });
    },
    showBaseEnter(e) {
        console.log(e);
        if (e.detail.value.length == '') {
            Org.getLocalEnterpriseList(null, '14').then((res) => {
                this.setData({
                    enterpriseCardInfo: res,
                    enterpriseAdded: res,
                    showBaseEnter: true,
                });
            });
        } else {
            this.setData({
                showBaseEnter: true,
            });
        }
    },

    searchEnter(e) {
        this.setData({
            'enterpriseInfo.orgCode': '',
            'enterpriseInfo.orgName': e.detail,
        });
        let companyName = e.detail;
        if (companyName.length >= 4 && /^[\u4E00-\u9FA5-（）()]{4,50}$/.test(companyName)) {
            Org.getEnterpriseList(companyName)
                .then((enterpriseCardInfo) => {
                    this.setData({
                        enterpriseCardInfo,
                        showBaseEnter: true,
                    });
                })
                .catch(() => {
                    this.setData({
                        showBaseEnter: false,
                    });
                });
        }
    },
    async chooseEnter(e) {
        var that = this;
        wx.showLoading({
            title: '加载中 ',
            mask: true,
        });
        let index = e.currentTarget.dataset.index;
        let companyName = that.data.enterpriseCardInfo[index].ORG_NAME;
        try {
            const res = await Org.getEnterpriseInfo({
                //   openid: wx.getStorageSync('openid'),
                type: '1', //1 企业名称  2统一码
                companyName,
            });

            console.log('授权人身份校验结果', res);

            if (!(res.enterpriseInfo.eNTNAME && res.enterpriseInfo.cREDITCODE)) {
                wx.showToast({
                    title: '企业信息异常，请手动录入',
                    icon: 'none',
                });
                throw new Error('enterpriseInfo error');
            }

            let {
                eNTSTATUS, //企业经营状态,
            } = res.enterpriseInfo;

            const STATUS = ['存续', '在营', '开业'];
            if (STATUS.findIndex((e) => eNTSTATUS.indexOf(e) > -1) === -1) {
                wx.showToast({
                    title: '经营状态不正常',
                    icon: 'none',
                    image: '',
                    duration: 1500,
                    mask: false,
                });
                return;
            }

            that.setData({
                enterWorkStation: '',
            });

            let orgCode = res.enterpriseInfo.cREDITCODE;

            let enterpriseInfo = {
                fRNAME: res.enterpriseInfo.fRNAME,
                orgName: res.enterpriseInfo.eNTNAME,
                orgCode: orgCode,
                province: orgCode.substring(2, 4),
                city: orgCode.substring(2, 6),
                country: orgCode.substring(2, 8),
            };

            if (that.data.cityCanApply.indexOf(enterpriseInfo.province) < 0) {
                wx.hideLoading();
                wx.showModal({
                    title: '提示',
                    content: '暂不支持该地区企业申请业务',
                    showCancel: false,
                    confirmText: '确定',
                });
                return;
            }

            that.setData({
                enterpriseInfo,
            });
            let arr = await that.getRegionCode3(enterpriseInfo.orgCode.substring(2, 8));
            let country = arr[2].values.find((e) => e.adcode === enterpriseInfo.country);
            if (country) {
                this.setData({
                    multiArray3: arr,
                    enterWorkStation: arr[0].values[0].name + arr[1].values[0].name + country.name,
                });
            } else {
                this.setData({
                    multiArray3: arr,
                });
            }
        } catch (err) {
            console.log(err);
        } finally {
            that.setData({
                showBaseEnter: false,
            });
            wx.hideLoading();
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let imgPath = that.data.cdnUrl + "/static/wechat/img/zm/zm_109.png"
        let params = "&empNo=" + that.data.shareEmpNo + "&intId=" + app.globalData.int_id;
        return api.shareApp(imgPath, params);
    },
    /**
     *
     * @param {*} 返回所有地区 第一列为查询到的地区
     * @returns vant pciker数据格式
     */
    async getRegionCode3(regionCode) {
        console.log(regionCode);
        let arr = [];
        let provinceCode = regionCode.substring(0, 2);
        let cityCode = this.getCityCode(regionCode.substring(0, 4));
        //查询所有列表
        let adCodeList = await api.getDistarct('100000', '3');
        //
        let provice = adCodeList.districts[0].districts.find((e) => e.adcode === `${provinceCode}0000`);

        let allProvince = adCodeList.districts[0].districts.filter((e) => ['11', '32', '44', '33', '31'].includes(e.adcode.substring(0, 2)), );

        if (!provice) {
            let proviceList = ['11', '32', '44', '33', '31']; // provice limie
            provice = adCodeList.districts[0].districts.filter((e) => proviceList.includes(e.adcode.substring(0, 2)));
            // city limit
            provice.forEach((e) => {
                let adcode = e.adcode;
                if (adcode === '440000' || adcode === '330000') {
                    e.districts = e.districts.filter((e) => e.adcode === '330100' || e.adcode === '440300');
                }
            });

            arr.push({
                values: provice,
            });

            arr.push({
                values: provice[0].districts,
            });

            arr.push({
                values: provice[0].districts[0].districts,
            });
        } else {
            for (let i = 0; i < allProvince.length; i++) {
                if (allProvince[i].adcode === provice.adcode) {
                    let temp = allProvince[0];
                    allProvince[0] = allProvince[i];
                    allProvince[i] = temp;
                    break;
                }
            }

            arr.push({
                values: allProvince,
            });
            let city = provice.districts.find((e) => e.adcode === `${cityCode}00`);
            if (!city) {
                arr.push({
                    values: provice.districts,
                });
                arr.push({
                    values: provice.districts[0].districts,
                });
                return arr;
            }
            arr.push({
                values: [city],
            });
            arr.push({
                values: city.districts,
            });
        }

        return arr;
    },
    getCityCode(cityID) {
        switch (cityID) {
            case '3305':
            case '3306':
            case '3300':
                cityID = '3301';
                break;
            case '4400':
                cityID = '4403';
                break;
            case /^310/.test(cityID):
                cityID = '3101';
                break;
            case /^110/.test(cityID):
                cityID = '1101';
                break;
            default:
                break;
        }
        return cityID;
    },
    exit() {
        wx.navigateBack({});
    },
    //提交表单
    submitForm(e) {
        let that = this;
        let {
            degreeArray,
            degreeIndex,
            positionArray,
            positionIndex,
            professionArray,
            professionIndex,
            poweruserIndex,
            poweruserArray,
            fieldValue,
            enterpriseInfo,
            real_name,
            tel,
        } = this.data;
        // console.log(degreeArray[0], degreeIndex)
        if (!enterpriseInfo.orgName) {
            wx.showToast({
                title: '请输入公司名称',
                icon: 'none'
            })
            return
        }
        if (!enterpriseInfo.orgCode) {
            wx.showToast({
                title: '请输入社会统一信用代码',
                icon: 'none'
            })
            return
        }

        if (!real_name) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none'
            })
            return
        }
        if (!tel) {
            wx.showToast({
                title: '请输入联系方式',
                icon: 'none'
            })
            return
        }
        if (!fieldValue) {
            wx.showToast({
                title: '请选择项目所在城市',
                icon: 'none'
            })
            return
        }
        if (!degreeIndex.length) {
            wx.showToast({
                title: '请选择融资项目情况',
                icon: 'none'
            })
            return
        }
        if (!professionIndex.length) {
            wx.showToast({
                title: '请选择项目类型',
                icon: 'none'
            })
            return
        }
        if (!poweruserIndex.length) {
            wx.showToast({
                title: '请选择用电方企业类型',
                icon: 'none'
            })
            return
        }
        if (!positionIndex.length) {
            wx.showToast({
                title: '请选择项目投资类型',
                icon: 'none'
            })
            return
        }
        //控制提交次数
        // wx.showLoading({
        //     title: '请稍后...',
        //     mask: true
        // })
        let data = {
            customerName: enterpriseInfo.orgName ? enterpriseInfo.orgName : '',
            socialCreditCode: enterpriseInfo.orgCode ? enterpriseInfo.orgCode : '',
            contactPerson: real_name,
            contactWay: tel,
            itemBelongCity: fieldValue,
            itemFinancing: degreeIndex.length ? degreeArray[0][degreeIndex[0]].code : '',
            itemType: professionIndex.length ? professionArray[0][professionIndex[0]].code : '',
            enterpriseType: poweruserIndex.length ? poweruserArray[0][poweruserIndex[0]].code : '',
            itemInvestType: positionIndex.length ? positionArray[0][positionIndex[0]].code : '',
            openId: wx.getStorageSync('openid'),
        };
        // console.log("data", data)
        wx.showModal({
            title: "提示",
            content: '请确认填写信息准确性，如确修改需要，需等待对接后向客户经理反馈!',
            showCancel: true, //是否显示取消按钮
            success: function(res) {
                // console.log(res)
                if (res.confirm) {
                    try {
                        api.greenPvloan(data).then(res => {
                            console.log('greenPvloan', res)
                            if (res && res.code == '200') {
                                wx.hideLoading();
                                wx.showModal({
                                    title: "提示",
                                    content: '信息登记成功',
                                    showCancel: false, //是否显示取消按钮
                                    success: function(res) {
                                        // wx.navigateBack({});
                                        wx.switchTab({
                                            url: "/pages/shop/index2",
                                        });
                                    },
                                });
                            } else {
                                wx.hideLoading();
                                wx.showToast({
                                    title: res.message,
                                    icon: 'none'
                                })
                            }
                        })
                    } catch (err) {
                        wx.hideLoading();
                        wx.showToast({
                            title: '保存失败,系统异常!',
                            icon: 'none'
                        })
                    }
                }

            },
        })
    }

})