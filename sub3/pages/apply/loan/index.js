// pages/carLoans/apply/loan/index.js
import api from '../../../../utils/api';
import user from '../../../../utils/user';
import WxValidate from '../../../../assets/plugins/wx-validate/WxValidate';
import { formatTimeWithSymbol } from '../../../../utils/util';
import { getRegionCode2 } from '../../../../api/region';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

    data: {
        scene: '',
        prdCode: '',
        preffixUrl: '',
        form: {
            name: '', //姓名
            number: '', //证件号
            date: '', //证件有效期
            gender: '', //性别
            certificate_type: '', //证件类型
            hyzk: '',
            profession: '', //职业
            company_name: '', //工作单位名称
            gjj_city: '', //公积金存缴城市
            tax_income: null, //税后收入
            company_city_code: '', //工作单位所属城市
            company_address: '', //工作单位地址
            select_ddress_status: '', //居住状态

        },
        showFlag: false,
        //职业选项
        profession: '',
        professionIndex: ['0'],
        //公积金存缴费城市选项
        gjjCity: '',
        gjjCityIndex: ['0'],
        gjjCityArray: [
            [
                { code: '3201', name: '南京市' },
                { code: '3202', name: '无锡市' },
                { code: '3203', name: '徐州市' },
                { code: '3204', name: '常州市' },
                { code: '3205', name: '苏州市' },
                { code: '3206', name: '南通市' },
                { code: '3207', name: '连云港市' },
                { code: '3208', name: '淮安市' },
                { code: '3209', name: '盐城市' },
                { code: '3210', name: '扬州市' },
                { code: '3211', name: '镇江市' },
                { code: '3212', name: '泰州市' },
                { code: '3213', name: '宿迁市' },
                { code: '4403', name: '深圳市' },
                { code: '1100', name: '北京市' },
                { code: '3100', name: '上海市' },
                { code: '3301', name: '杭州市' },
            ]
        ],
        //婚姻状况
        hyzk: '',
        hyzkIndex: ['0'],
        hyzkArray: [
            [
                { code: '10', name: '未婚' },
                { code: '20', name: '已婚' },
                { code: '30', name: '丧偶' },
                { code: '40', name: '离婚' },
            ]
        ],
        //居住状态选项
        addressStatu: '',
        addressStatuIndex: ['0'],
        addressStatuArr: [
            [
                { code: "1", name: '自购' },
                { code: "2", name: '自购（有按揭未结清）' },
                { code: "3", name: '亲属楼宇' },
                { code: "5", name: '租住房' },
            ]
        ],

    //工作单位所属城市
    region: [],
    customItem: '全部',

        multiIndex2: [0, 0, 0], //以下省市选择过度
        multiArray2: [],
        showRegionPicker: false,
        multiArray3: [],
        enterWorkStation: '',
        loanType: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            preffixUrl: app.globalData.CDNURL,
            scene: options.scene,
            prdCode: options.prdCode,
            loanType: wx.getStorageSync('loanType')
        });
        console.log('prdCode', options.prdCode)
        user.getIdentityInfo().then((res) => {
            this.setData({
                form: {
                    name: res.NAME,
                    number: res.ID_NUMBER,
                    date: res.VALID_DATE.substring(11).replace(/\./g, '-'),
                    certificate_type: res.CERTIFICATE_TYPE, //证件类
                    gender: res.GENDER
                },
            });
        });
    },
    //职业选择
    pickProfession(e) {
        let { professionArray, professionIndex } = this.data;
        professionIndex[0] = e.detail.value[0];
        var formtab = this.data.form;
        formtab.profession = professionArray[0][e.detail.value[0]].code
        this.setData({
            form: formtab,
            profession: professionArray[0][e.detail.value[0]].name,
            professionIndex,
        });
    },
    //保存工作单位名称
    inputCompanyName(e) {
        var formtab = this.data.form;
        formtab.company_name = e.detail.value;
        this.setData({
            form: formtab
        });
    },
    //公积金存缴城市选择
    gjjCityProfession(e) {
        let { gjjCityArray, gjjCityIndex } = this.data;
        gjjCityIndex[0] = e.detail.value[0];
        var formtab = this.data.form;
        formtab.gjj_city = gjjCityArray[0][e.detail.value[0]].code
        this.setData({
            form: formtab,
            gjjCity: gjjCityArray[0][e.detail.value[0]].name,
            gjjCityIndex,
        });
    },
    //婚姻状况类型选择
    hyzkProfession(e) {
        let { hyzkArray, hyzkIndex } = this.data;
        hyzkIndex[0] = e.detail.value[0];
        var formtab = this.data.form;
        formtab.hyzk = hyzkArray[0][e.detail.value[0]].code
        this.setData({
            form: formtab,
            hyzk: hyzkArray[0][e.detail.value[0]].name,
            hyzkIndex,
        });
    },
    //税后月收入金额
    inputTaxIncome(e) {
        var formtab = this.data.form;
        formtab.tax_income = e.detail.value.replace(/[^\d]/g, "");
        this.setData({
            form: formtab
        });
    },
    //工作单位所属城市选择 
    onChange(e) {
        const { picker, value, index } = e.detail;
        switch (index) {
            case 0:
                picker.setColumnValues(1, value[0].districts);
                picker.setColumnValues(2, value[0].districts[0].districts);
                break;
            case 1:
                let city = value[0].districts.find((e) => e.adcode === value[1].adcode);
                picker.setColumnValues(2, city.districts);
                break;
            default:
                break;
        }
    },
    onConfirm(e) {
        let region = e.detail.value;
        let adcode = region[2].adcode;
        let enterWorkStation = region.map((e) => e.name).join('');
        var formtab = this.data.form;
        formtab.company_city_code = adcode;
        this.setData({
            enterWorkStation,
            company_city_code: formtab,
        });
        this.onClose();
    },
    //控制显示省城区
    async selectRegion(e) {
        let arr = await getRegionCode2("");
        this.setData({
            multiArray3: arr,
            showRegionPicker: true,
        });
    },
    //输入工作单位详细地址
    inputCompanyAddress(e) {
        var formtab = this.data.form;
        formtab.company_address = e.detail.value;
        this.setData({
            form: formtab
        });
    },
    //居住状况选择
    addressStatuProfession(e) {
        let { addressStatuArr, addressStatuIndex } = this.data;
        addressStatuIndex[0] = e.detail.value[0];
        var formtab = this.data.form;
        formtab.select_ddress_status = addressStatuArr[0][e.detail.value[0]].code
        this.setData({
            form: formtab,
            addressStatu: addressStatuArr[0][e.detail.value[0]].name,
            addressStatuIndex,
        });
    },
    //提交表单，下一步
    nextStep() {
        let { loanType } = this.data;
        var formtab = this.data.form;
        if (!loanType && !formtab.hyzk) {
            this.alertError('请选择婚姻状况！')
            return;
        }
        if (formtab.profession == '' || formtab.profession == undefined) {
            this.alertError('请选择职业！')
            return;
        }
        if (formtab.company_name == '' || formtab.company_name == undefined || formtab.company_name.length <= 9) {
            this.alertError('工作单位不能为空且长度大于10！')
            return;
        }
        if (formtab.gjj_city == '' || formtab.gjj_city == undefined) {
            this.alertError('请选择公积金/纳税/社保缴存城市！')
            return;
        }
        if (formtab.tax_income == null || Number(formtab.tax_income) <= 999 || Number(formtab.tax_income) % 100 != 0) {
            this.alertError('月收入请输入整数且不小于1000！')
            return;
        }
        if (formtab.company_city_code == '' || formtab.company_city_code == undefined) {
            this.alertError('请选择工作单位所属城市！')
            return;
        }
        if (!formtab.company_address) {
            this.alertError('请输入工作单位地址');
            return;
        }
        if (this.countNumbers(formtab.company_address) < 20) {
            this.alertError('请录入的工作单位地址不少于10个汉字');
            return;
        }
        if (formtab.select_ddress_status == '' || formtab.select_ddress_status == undefined) {
            this.alertError('请选择居住状态')
            return;
        }
        var str = JSON.stringify(formtab);
        if (loanType) {
            wx.navigateTo({
                url: "../loan/index2?scene=" + this.data.scene + '&prdCode=' + this.data.prdCode + "&jsonStr=" + str,
            });
        } else {
            wx.navigateTo({
                url: "../loan/index3?scene=" + this.data.scene + '&prdCode=' + this.data.prdCode + "&jsonStr=" + str,
            });
        }

    },
    //识别工作单位输入字符长度，数字计算为0.5个字符，其他正常计算为1
    countNumbers(str) {
        // 计数变量
        let count = 0;
        if (str) {
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    count += 2;
                } else {
                    count++;
                }
            }
            return count
        } else {
            return 0
        }
    },
    //错误信息统一提示框
    alertError(content) {
        wx.showModal({
            title: '提示',
            content: content,
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                if (result.confirm) {}
            },
            fail: () => {},
            complete: () => {},
        });
    },
    selectProfession(e) {
        this.setData({
            showFlag: true
        });
    },
    selectProfessionResult(e) {
        var value = e.detail;
        var newForm = this.data.form
        newForm.profession = value.code;
        this.setData({
            profession: value.name,
            form: newForm
        });
    },
    /**
   * 关闭弹出框
   */
  onClose(e) {
    this.setData({
      showRegionPicker: false,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})