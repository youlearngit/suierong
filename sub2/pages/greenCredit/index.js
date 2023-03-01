// sub2/pages/greenCredit/index.js
const util = require('../../utils/util');
const app = getApp();
const api = require('../../../utils/api');
import user from "../../../utils/user";
var encr = require('../../utils/encrypt.js'); //国密3段式加密
var aeskey = encr.key //随机数
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag: true,
        navTop: app.globalData.statusBarTop,
        navHeight: app.globalData.statusBarHeight,
        preffixUrl: app.globalData.URL,
        cdnUrl: '',
        searchValue: '',
        projectName: '',
        businessCategory: '',
        select1: '',
        select2: '',
        select3: '',
        select4: '',
        select5: '',
        dataArr: [],
        setValue: '',
        type: '',
        init: false,
        isSearch: false,
        isResult: false,
        showPicker: false,
        isShowProjectName: false,
        isToast: true,
        imgurl: '',
        resultList: [],
        fieldName: '',
        resultArr: [],
        calculate_result: '测算结果',
        no_msg: '未匹配到相关绿色信贷认定分类',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.demopicker = that.selectComponent("#myPicker");
        that.setData({
            pageFlag: getCurrentPages().length,
            cdnUrl: app.globalData.CDNURL,
            imgurl: `${app.globalData.CDNURL}/static/wechat/img/greenBusinessQuery/conditions-not-met.png`,
        });
    },
    getData(keyword, flag) {
        const { fieldName,type } = this.data;
        var parentOption = '';
        if(type == 1){
          parentOption = this.data.businessCategory;
          if(parentOption == ''){
            wx.showToast({
              title: '请先选择业务品种',
              icon:'none'
            })
            return;
          }
        }else if(type == 2 || type == 3){
          parentOption = this.data.select5;
          if(parentOption == ''){
            wx.showToast({
              title: '请先选择新国标行业一级分类',
              icon:'none'
            })
            return;
          }
        }else if(type == 4){
          parentOption = this.data.select3;
          if(parentOption == ''){
            wx.showToast({
              title: '请先选择新国标行业四级分类',
              icon:'none'
            })
            return;
          }
        }

        let params = {
          parentOption,
            fieldName,
            keyword,
        }
        this.setData({
            dataArr: [],
        })
        api.greenGetField(params).then(res => {
          if(res.code == 200){
            if (res.optionList) {
              let result = JSON.parse(res.optionList);
              let dataArr = result.map((item, index) => {
                  return {
                      name: item,
                      code: index + 1,
                  }
              })
              this.setData({
                  dataArr
              })
              wx.hideLoading();
              flag && this.demopicker.showDatePicker();
          } else {
              wx.hideLoading();
          }
          }else if(res.code == 201){
            wx.hideLoading();
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
          }else{
            wx.hideLoading();
            wx.showToast({
              title: '加载失败',
              icon:'error'
            })
          }
            
        })
    },


    searchContent(e) {
        let that = this;
        if (e.detail.value) {
            that.setData({
                searchValue: e.detail.value,
                resultArr: e.detail.value.split(''),
            })
        } else {
            that.setData({
                searchValue: '',
                resultArr: [],
            })
        }
        //模糊查询
        that.getData(e.detail.value, false);
    },
    onClose() {
        this.setData({
            showPicker: !this.data.showPicker,
        })
    },
    geselect(parentOption,fieldName,keyword){
      let params = {
        parentOption,
          fieldName,
          keyword,
      }
      api.greenGetField(params).then(res => {
        if(res.code == 200){
          if (res.optionList) {
            let result = JSON.parse(res.optionList);
            // let result = res.optionList;
            let dataArr = result.map((item, index) => {
                return {
                    name: item,
                    code: index + 1,
                }
            })
            if(fieldName == 'varietyIdentification'){
              if(dataArr.length >1){
                this.setData({
                  select1:dataArr[1].name
              })
              }else{
                this.setData({
                  select1:dataArr[0].name
              })
              }
            }else if(fieldName == 'levelOneIdentification'){
              if(dataArr.length >1){
                this.setData({
                  select2:dataArr[1].name
              })
              }else{
                this.setData({
                  select2:dataArr[0].name
              })
              }
            }else if(fieldName == 'levelFour'){
              if(dataArr.length >1){
                this.setData({
                  select3:dataArr[1].name
              })
              }else{
                this.setData({
                  select3:dataArr[0].name
              })
              }
            }

        }
        }else if(res.code == 201){
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }else{
          wx.showToast({
            title: '加载失败',
            icon:'error'
          })
        }
          
      })
    },
    onConfirm(e) {
        const {
            name,
            code,
            type
        } = e.detail;
        switch (type) {
            case 0:
                this.setData({
                    businessCategory: name,
                    select1: '',
                })
                if (code == 1 || code == 2 || code == 3 || code == 5 || code == 6 || code == 7 ) {
                    this.setData({
                        isShowProjectName: true,
                        projectName: '',
                    })
                } else {
                    this.setData({
                        isShowProjectName: false,
                        projectName: '',
                    })
                }
              //  this.geselect(name,'varietyIdentification','');
                break;
            case 1:
                this.setData({
                    select1: name,
                })
                break;
            case 2:
                this.setData({
                    select2: name,
                })
                break;
            case 3:
                this.setData({
                    select3: name,
                    select4: '',
                })
                break;
            case 4:
                this.setData({
                    select4: name,
                })
                break;
                case 5:
                  this.setData({
                      select5: name,
                      select2: '',
                      select3: '',
                      select4: '',
                  })
              //    this.geselect(name,'levelOneIdentification','');
             //     this.geselect(name,'levelFour','');
                  break;
        }
        this.demopicker.hiddeDatePicker();
    },
    cancel(e) {
        // console.log('关闭弹窗', e.detail)
        this.setData({
            isToast: true,
            searchValue: '',
            resultArr: [],
        })
    },
    pickSelect(e) {
        const id = Number(e.currentTarget.dataset.id);
        const {
            businessCategory,
            select1,
            select2,
            select3,
            select4,
            select5,
        } = this.data;
        wx.showLoading({
            title: '请稍后...',
            mask: true
        })
        if (id) {
            this.setData({
                isSearch: true,
            })
        } else {
            this.setData({
                isSearch: false,
            })
        }
        this.setData({
            type: id,
            setValue:'',
            isToast: false,
        })
        switch (id) {
            case 0:
                this.setData({
                    setValue: businessCategory,
                    fieldName: 'variety',
                });
                break;
            case 1:
                this.setData({
                    setValue: select1,
                    fieldName: 'varietyIdentification',
                });
                break;
            case 2:
                this.setData({
                    setValue: select2,
                    fieldName: 'levelOneIdentification',
                });
                break;
            case 3:
                this.setData({
                    setValue: select3,
                    fieldName: 'levelFour',
                });
                break;
            case 4:
                this.setData({
                    setValue: select4,
                    fieldName: 'levelFourIdentification',
                });
                break;
                case 5:
                  this.setData({
                      setValue: select5,
                      fieldName: 'levelOne',
                  });
                  break;
        }
        //打开下拉框
        this.getData('', true);
    },
    //重置
    reset() {
        this.setData({
            businessCategory: '',
            projectName: '',
            select1: '',
            select2: '',
            select3: '',
            select4: '',
            select5: '',
            setValue: '',
            init: false,
            isResult: false,
            isShowProjectName: false,
            imgurl: `${app.globalData.CDNURL}/static/wechat/img/greenBusinessQuery/conditions-not-met.png`,
        })
    },
    //测量
    calculate() {
        const { cdnUrl, businessCategory, projectName, select1, select2, select3, select4 } = this.data;
        if (!businessCategory) {
            wx.showToast({
                title: '业务品种不能为空',
                icon: 'none'
            })
            return
        }
        let params = {
            variety: businessCategory,
            projectName,
            varietyIdentification: select1,
            levelOneIdentification: select2,
            levelFour: select3,
            levelFourIdentification: select4,
        }
        wx.showLoading({
            title: '请稍后...',
            mask: true
        })
        api.greenCogn(params).then(res => {
            // console.log('greenCogn', res)
            if (res.code === '200') {
                this.setData({
                    isResult: true,
                    init: true,
                    imgurl: `${cdnUrl}/static/wechat/img/greenBusinessQuery/conditions-meet.png`,
                    resultList: [{
                            "id": 1,
                            "title": "绿色产业指导目录分类",
                            "content": res.industryClassification || ""
                        },
                        {
                            "id": 2,
                            "title": "绿色产业指导目录",
                            "content": res.industryCatalogue || ""
                        },
                        {
                            "id": 3,
                            "title": "绿色融资统计目录分类",
                            "content": res.financingClassification || ""
                        },
                        {
                            "id": 4,
                            "title": "绿色融资统计目录",
                            "content": res.financingCatalogue || ""
                        },
                    ]

                })
            } else{
                this.setData({
                    init: true,
                    isResult: false,
                    imgurl: `${cdnUrl}/static/wechat/img/greenBusinessQuery/conditions-not-met.png`,
                })
            }
            wx.hideLoading();
        })
    },
})