// pages/carLoans/contract/carcontract/detail/detail-waiting.js
import requestYT from '../../../api/requestYT';
import log from '../../../log.js';
import api from '../../../utils/api.js'

const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: '',
        item: {},
        dialogflag: '',
        flag: '',
        nbsp: '&nbsp;&nbsp;&nbsp;&nbsp;',
        guarOption: [
            { key: "01", value: "父母" },
            { key: "02", value: "配偶" },
            { key: "03", value: "子女" },
            { key: "99", value: "其他关系" },
        ],
        signOption: [
            { key: "", value: "未签约" },
            { key: "0", value: "未签约" },
            { key: "1", value: "已签约" },
        ],
        //职业
        professionList: [{
                code: '100',
                name: '党的机关、国家机关、群众团体和社会组织、企事业单位负责人'
            }, {
                code: '101',
                name: '中国共产党机关负责人'
            }, {
                code: '102',
                name: '国家机关负责人'
            },
            {
                code: '103',
                name: '民主党派和工商联负责人'
            },
            {
                code: '104',
                name: '人民团体和群众团体、社会组织及其他成员组织负责人'
            },
            {
                code: '105',
                name: '基层群众自治组织负责人'
            },
            {
                code: '106',
                name: '企事业单位负责人'
            },
            {
                code: '200',
                name: '专业技术人员'
            },
            {
                code: '201',
                name: '科学研究人员'
            },
            {
                code: '202',
                name: '工程技术人员'
            },
            {
                code: '203',
                name: '农业技术人员'
            },
            {
                code: '204',
                name: '农业技术人员'
            },
            {
                code: '205',
                name: '卫生专业技术人员'
            },
            {
                code: '206',
                name: '经济和金融专业人员'
            },
            {
                code: '207',
                name: '法律、社会和宗教专业人员'
            },
            {
                code: '208',
                name: '教学人员'
            },
            {
                code: '209',
                name: '文学艺术、体育专业人员'
            },
            {
                code: '210',
                name: '新闻出版、文化专业人员'
            },
            {
                code: '299',
                name: '其他专业技术人员'
            },
            {
                code: '300',
                name: '办事人员和有关人员'
            },
            {
                code: '301',
                name: '办事人员'
            },
            {
                code: '302',
                name: '安全和消防人员'
            },
            {
                code: '399',
                name: '其他办事人员和有关人员'
            },
            {
                code: '400',
                name: '社会生产服务和生活服务人员'
            },
            {
                code: '401',
                name: '批发与零售服务人员'
            },
            {
                code: '402',
                name: '交通运输、仓储和邮政业服务人员'
            },
            {
                code: '403',
                name: '住宿和餐饮服务人员'
            },
            {
                code: '404',
                name: '信息运输、软件和信息技术服务人员'
            },
            {
                code: '405',
                name: '金融服务人员'
            },
            {
                code: '406',
                name: '房地产服务人员'
            },
            {
                code: '407',
                name: '租赁和商务服务人员'
            },
            {
                code: '408',
                name: '技术辅助服务人员'
            },
            {
                code: '409',
                name: '水利、环境和公共设施管理服务人员'
            },
            {
                code: '410',
                name: '居民服务人员'
            },
            {
                code: '411',
                name: '电力、燃气及水供应服务人员'
            },
            {
                code: '412',
                name: '修理及制作服务人员'
            },
            {
                code: '413',
                name: '文化、体育及娱乐服务人员'
            },
            {
                code: '414',
                name: '健康服务人员'
            },
            {
                code: '499',
                name: '其他社会生产和生活服务人员'
            },
            {
                code: '500',
                name: '农、林、牧、渔业生产及辅助人员'
            },
            {
                code: '501',
                name: '农业生产人员'
            },
            {
                code: '502',
                name: '林业生产人员'
            },
            {
                code: '503',
                name: '畜牧业生产人员'
            },
            {
                code: '504',
                name: '渔业生产人员'
            },
            {
                code: '505',
                name: '农林牧渔生产辅助人员'
            },
            {
                code: '599',
                name: '其他农、林、牧、渔、水利业生产人员'
            },
            {
                code: '600',
                name: '生产制造及有关人员'
            },
            {
                code: '601',
                name: '农副产品加工人员'
            },
            {
                code: '602',
                name: '食品、饮料生产加工人员'
            },
            {
                code: '603',
                name: '烟草及其制品加工人员'
            },
            {
                code: '604',
                name: '纺织、针织、印染人员'
            },
            {
                code: '605',
                name: '纺织品、服装和皮革、毛皮制品加工制作人员'
            },
            {
                code: '606',
                name: '木材加工、家具与木制品制作人员'
            },
            {
                code: '607',
                name: '纸及纸制品生产加工人员'
            },
            {
                code: '608',
                name: '印刷和记录媒介复制人员'
            },
            {
                code: '609',
                name: '文教、工美、体育和娱乐用品制作人员'
            },
            {
                code: '610',
                name: '石油加工和炼焦、煤化工制作人员'
            },
            {
                code: '611',
                name: '化学原料和化学制品制造人员'
            },
            {
                code: '612',
                name: '医药制造人员'
            },
            {
                code: '613',
                name: '化学纤维制造人员'
            },
            {
                code: '614',
                name: '橡胶和塑料制品制造人员'
            },
            {
                code: '615',
                name: '非金属矿物制品制造人员'
            },
            {
                code: '616',
                name: '采矿人员'
            },
            {
                code: '617',
                name: '金属冶炼和压延加工人员'
            },
            {
                code: '618',
                name: '机械制造基础加工人员'
            },
            {
                code: '619',
                name: '金属制品制造人员'
            },
            {
                code: '620',
                name: '通用设备制造人员'
            },
            {
                code: '621',
                name: '专用设备制造人员'
            },
            {
                code: '622',
                name: '汽车制造人员'
            },
            {
                code: '623',
                name: '铁路、船舶、航空设备制造人员'
            },
            {
                code: '624',
                name: '电气机械和器材制造人员'
            },
            {
                code: '625',
                name: '计算机、通信和其他电子设备制造人员'
            },
            {
                code: '626',
                name: '仪器仪表制造人员'
            },
            {
                code: '627',
                name: '废弃资源综合利用人员'
            },
            {
                code: '628',
                name: '电力、热力、气体、水生产和输配人员'
            },
            {
                code: '629',
                name: '建筑施工人员'
            },
            {
                code: '630',
                name: '运输设备和通用工程机械操作人员及有关人员'
            },
            {
                code: '631',
                name: '生产辅助人员'
            },
            {
                code: '699',
                name: '其他生产制造及有关人员'
            },
            {
                code: '700',
                name: '军人'
            },
            {
                code: '800',
                name: '不便分类的其他从业人员'
            },
            {
                code: '801',
                name: '退休'
            },
            {
                code: '802',
                name: '失业'
            },
            {
                code: '803',
                name: '无业'
            },
            {
                code: '804',
                name: '学龄前儿童'
            },
            {
                code: '805',
                name: '学生'
            },
            {
                code: '806',
                name: '灵活就业人员'
            },
        ],
        //关系
        relRelationList: [{
                code: '1',
                name: '配偶',
            },
            {
                code: '2',
                name: '父母',
            },
            {
                code: '3',
                name: '子女',
            },
            {
                code: '4',
                name: '兄弟姐妹',
            },
            {
                code: '7',
                name: '同事',
            },
            {
                code: '8',
                name: '其他关系',
            },
        ],
        signList: [],
        authorList: [],
        signListDesc: [],
        authorListDesc: [],
        authType: 1,
        itemType: 'b09',
        signType: 'b08',
        isAuthor: '',
        // 获取年月日
        Y: '',
        M: '',
        D: '',
        contractPageFlag: false, //协议弹窗标记
        contractPageFlags: false, //协议弹窗标记
        backBtnName: 5,
        showContractFlag: 1,
        showContractFlags: 1,
        topNum: 0, //返回顶部
        batchNo: '', //征信授权返回的唯一表示
        photo: '',
        batchId: '',
        loanType: 0, //贷款类型
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: '请稍候',
            mask: 'true',
        })
        let { professionList, relRelationList } = that.data;
        let item = JSON.parse(options.item);
        let flag = options.flag ? Number(options.flag) : '';
        item.occupation = that.findElement(item.relOccupation, professionList);
        item.relyearIncomes = that.converAmount(item.relyearIncome);
        item.applyAmts = that.converAmount(item.applyAmt);
        item.relation = that.findElement(item.relRelation, relRelationList);
        let { relIsGuarantor, relIsColoaner, relRelation } = item;
        let authType, itemType, signType;
        if (relRelation === '1') {
            if (relIsGuarantor === '1') {
                authType = 1;
            } else {
                authType = 0;
            }
            itemType = 'b11';
            signType = 'b08';
        } else {
            authType = 1;
            if (relIsColoaner === '1') {
                itemType = 'b10';
            } else {
                itemType = 'b09';
            }
            signType = 'b07';
        }
        let authorList = [{
                "title": '借款人姓名',
                "content": item.cusName,
            },
            {
                "title": '借款人证件号码',
                "content": item.certCode,
            }, {
                "title": '申请贷款产品',
                "content": item.prdName,
            }, {
                "title": '与借款人关系',
                "content": item.relation,
            }, {
                "title": '授权人姓名',
                "content": item.relCusName,
            }, {
                "title": '授权人证件号码',
                "content": item.relCertCode,
            }, {
                "title": '授权人类型',
                "content": item.rauthType == '01' ? '借款人' : item.rauthType == '02' ? '借款人配偶' : '担保人',
            }, {
                "title": '授权状态',
                "content": item.isAuthorisee == '0' ? '未授权' : '已授权',
            }
        ]
        let signList = [{
                "title": '借款人姓名',
                "content": item.cusName,
            },
            {
                "title": '借款人证件号码',
                "content": item.certCode,
            }, {
                "title": '申请贷款产品',
                "content": item.prdName,
            }, {
                "title": '与借款人关系',
                "content": item.relation,
            }, {
                "title": '是否作为共还人',
                "content": item.relIsColoaner === '1' ? '是' : '否',
            }, {
                "title": '是否作为保证人',
                "content": item.relIsGuarantor === '1' ? '是' : '否',
            },
        ]
        let listDesc = [{
                "title": '业务流水号',
                "content": item.serno,
            },
            {
                "title": '申请日期',
                "content": item.applyDate,
            }, {
                "title": '申请贷款产品',
                "content": item.prdName,
            }, {
                "title": '借款人姓名',
                "content": item.cusName,
            }
        ]
        let authorStatus = [{
            "title": '授权状态',
            "content": '已授权',
        }];
        let signStatus = [{
            "title": '是否签署承诺书',
            "content": '已签署',
        }];
        that.setData({
            preffixUrl: app.globalData.CDNURL,
            flag,
            item,
            authType,
            itemType,
            signType,
            signList,
            authorList,
            signListDesc: [...listDesc, ...signStatus],
            authorListDesc: [...listDesc, ...authorStatus],
            loanType : item.prdName === '个人一手汽车消费贷款' || item.prdName === '个人二手汽车消费贷款' ? 1 : 0,
        });
        console.log('item', item)
        //获取年份  
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        this.setData({
            Y: date.getFullYear(),
            M: (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
            D: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        });
        wx.hideLoading();
        // that.goDetail(); 
    },

  // 获取合同详情
  goDetail: function(){
    var that = this;
    let options = {
      url: 'carloan/searchContInfo.do',
      data: JSON.stringify({
        contType:'2',
        contNo: that.data.contNo,
        guaranteeContNo: that.data.guarContNo,
      }),
    };
    requestYT(options).then((res)=>{
      if(res.STATUS === '1'){
        if(res.msgCode != '1111'){
          var detail = JSON.parse(res.contInfo);
          var guarInfo = detail.guarContNoList[0];
          var dateList = detail.startDate.split("-");
          guarInfo.guarObligation = that.converStatus("guarObligation",guarInfo.guarObligation);
          guarInfo.guarContSigningStatus = that.converStatus("signStatus",guarInfo.guarContSigningStatus);
          detail.countContAmt = that.convertNum(Number(detail.contAmt) + (detail.followContAmt=="0"||detail.followContAmt==""?0:Number(detail.followContAmt)));
          var timestamp = Date.parse(new Date());
          var date = new Date(timestamp);
          //获取年份  
          var Y =date.getFullYear();
          //获取月份  
          var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          //获取当日日期 
          var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
          detail.signDate =Y+"年"+M+"月"+D+"日"; 

          that.setData({
            detail: detail,
            guarContInfo: guarInfo,
            dateList:dateList,
            signDate:Y+"-"+M+"-"+D
          });
          wx.hideLoading();
        }else{
          wx.hideLoading();
          that.alertError(res.msg);
          setTimeout(function () {
            that.cancel();
          }, 2000)
        }
      }else{
        that.cancel();
      }
    }).catch(err=>{
      wx.hideLoading();

        });
    },
    //提示错误信息
    alertError(content) {
        wx.showModal({
            title: '授权失败',
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
    //金额每三位添加逗号
    converAmount(value) {
        return this.outputdollars(parseInt(value));
    },
    outputdollars(number) {
        number = String(number);
        if (number.length <= 3)
            return (number == '' ? '0' : number);
        else {
            var mod = number.length % 3;
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (var i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0))
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                else
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            return (output);
        }
    },
    //转义
    findElement(str, arr) {
        if (str) {
            let obj = arr.find(item => item.code === str || item.label == str);
            if (obj && Object.keys(obj).length) {
                return obj.name || obj.value
            } else {
                return ''
            }
        } else {
            return ''
        }
    },
    // 大写转换
    convertNum(money){
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(money)){
        return "数据非法";  //判断数据是否大于0
      }
      var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
      var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
      var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
      var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
      var cnInteger = "整"; //整数金额时后面跟的字符
      var cnIntLast = "元"; //整型完以后的单位
      var maxNum = 999999999999999.9999; //最大处理的数字
      var IntegerNum; //金额整数部分
      var DecimalNum; //金额小数部分
      var ChineseStr = ""; //输出的中文金额字符串
      var parts; //分离金额后用的数组，预定义    
      var Symbol="";//正负值标记
      if (money == "") {
          return "";
      }
  
      money = parseFloat(money);
      if (money >= maxNum) {
          alert('超出最大处理数字');
          return "";
      }
      if (money == 0) {
          ChineseStr = cnNums[0] + cnIntLast + cnInteger;
          return ChineseStr;
      }
      if(money<0)
      {
          money=-money;
          Symbol="负 ";        
      }
      money = money.toString(); //转换为字符串
      if (money.indexOf(".") == -1) {
          IntegerNum = money;
          DecimalNum = '';
      } else {
          parts = money.split(".");
          IntegerNum = parts[0];
          DecimalNum = parts[1].substr(0, 4);
      }
      if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
          var zeroCount = 0;
          var IntLen = IntegerNum.length;
          for (var i = 0; i < IntLen; i++) {
              var n = IntegerNum.substr(i, 1);
              var p = IntLen - i - 1;
              var q = p / 4;
              var m = p % 4;
              if (n == "0") {
                  zeroCount++;
              }
              else {
                  if (zeroCount > 0) {
                      ChineseStr += cnNums[0];
                  }
                  zeroCount = 0; //归零
                  ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
              }
              if (m == 0 && zeroCount < 4) {
                  ChineseStr += cnIntUnits[q];
              }
          }
          ChineseStr += cnIntLast;
          //整型部分处理完毕
      }
      if (DecimalNum != '') { //小数部分
          var decLen = DecimalNum.length;
          for (var i = 0; i < decLen; i++) {
              var n = DecimalNum.substr(i, 1);
              if (n != '0') {
                  ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
              }
          }
      }
      if (ChineseStr == '') {
          ChineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (DecimalNum == '') {
          ChineseStr += cnInteger;
      }
      ChineseStr = Symbol +ChineseStr;
      
      return ChineseStr;
    },
  // 状态转换
  converStatus(label,status){
    var value = "";
    var options = [];
    if(label == "guarObligation"){
      options = this.data.guarOption
    }else if (label=="signStatus"){
      options = this.data.signOption
    }
    options.forEach(item=>{
      if(item.key == status){
        value = item.value
      }
    })
    return value;
  },

    // 返回上一层
    cancel: function() {
        wx.navigateBack({
            delta: 1,
        })
    },
    // 提交合同
    goSubmit(e) {
        let id = e.currentTarget.dataset.id || '';
        if (this.data.backBtnName === 0) {
            this.getBatchId(id);
        }

  },
  // 按钮倒计时5秒
  readingCoundDown() {
    let time = 5;
    this.setData({
      backBtnName: time,
    });
    let cutDown = setInterval(() => {
      time--;
      console.log(time);
      if (time < 1 ) {
        this.setData({
          dialogflag : false,
        });
        clearInterval(cutDown);
      }
      this.setData({
        backBtnName: time,
      });
    }, 1000);
  },

    // 人脸识别
    async getBatchId(id) {
        var that = this;
        if (that.data.dialogflag == true) {
            return;
        }
        try {
            const res = await api.getImageAndBatchId(that.data.item.relCusName, that.data.item.relCertCode);
            that.setData({
                photo: res.image, //todo base64问题解决后放开
                batchId: res.batchID //todo base64问题解决后放开
                    // batchId:res
            })
            await that.uploadPhoto(id);
        } catch (error) {
            console.log('123', error);
            wx.showModal({
                title: '提示',
                content: error.message || error,
                showCancel: false,
                confirmText: '确定',
                success: (result) => {
                    if (result.confirm) {}
                },
            });
        }
    },
    //上传影像
    uploadPhoto(id) {
        wx.showLoading({
            title: '请稍候',
            mask: true,
        });
        var that = this;
        let options = {
            url: 'carloan/uploadPicToYxpy.do',
            data: JSON.stringify({
                certCode: that.data.item.relCusName,
                batchId: that.data.batchId,
            }),
        };
        requestYT(options).then((res) => {
            console.log('uploadPicToYxpy', res)
            if (res.msgCode == '0000') {
                let { signType, itemType } = that.data;
                if (id) {
                    that.nextPage(signType, id);
                } else {
                    that.nextPage(itemType, id);
                }

            } else {
                wx.hideLoading();
                wx.showToast({
                    title: '影像获取失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        }).catch(err => {
            console.log(err)
            wx.hideLoading();
            wx.showToast({
                title: '影像获取失败',
                icon: 'none',
                duration: 1000
            })
        })
    },
    //签章调用
    nextPage(type, id) {
        console.log(type);
        let that = this;
        let options = {
            url: 'carloan/sign.do',
            data: {
                type: type.toLocaleUpperCase(),
                certCode: that.data.item.relCertCode,
                applyName: that.data.item.relCusName,
                serialNo: that.data.item.serno,
                subSerno: that.data.item.relCertCode,
                base64: that.data.photo,
            }
        };
        let promise1 = requestYT(options);
        Promise.all([promise1]).then((res) => {
            console.log(res[0]);
            if (res[0].msgCode === '0000') {
                that.saveInfo(id);
            } else {
                wx.hideLoading();
                that.alertError('请重新提交授权，如多次未提交成功，请联系您的客户经理');
                return;
            }
        })
    },
    //调用授权接口
    saveInfo(id) {
        var that = this;
        let options = {
            url: 'carloan/signAuthor.do',
            data: {
                updateRole: '2',
                authorCertNo: that.data.item.relCertCode, //担保人身份证
                certType: that.data.item.relCertType, //担保人身份证类型
                authorName: that.data.item.relCusName, //担保人姓名
                lendCertNo: that.data.item.certCode, //借款人身份证
                lendName: that.data.item.cusName, //借款人姓名
                imageLotNumber: that.data.batchId,
                operateType: id ? '03' : '10',
                serno: that.data.item.serno,
                authorType: '03',
            }
        };
        requestYT(options).then((res) => {
            console.log('signAuthor', options.data, res)
            if (res.msgCode === '0000') {
                that.toResultPage('1', '');
            } else {
                that.toResultPage('0', res.msg);
            }
        }).catch((err) => {
            that.toResultPage('0', "系统正在维护中，请稍后再试");
        });
    },
    //结果相应页面
    toResultPage(status, errorMsg) {
        var str = 'resultPage?status=' + status;
        if (status != '1') {
            str = str + '&errorMsg=' + errorMsg
        }
        wx.navigateTo({
            url: str,
        })
    },
    //立即授权
    openAction(e) {
        console.log(e)
        let type = e.currentTarget.dataset.id == '1' ? true : false;
        this.setData({
            showContractFlag: 1,
            contractPageFlag: true,
            isAuthor: type
        });
        this.readingCoundDown();
    },
  //下一份授权
  nextAction(e){
    if(this.data.backBtnName > 0){
      return 
    }
    this.setData({
      showContractFlag:this.data.showContractFlag +1,
      backBtnName: 5,
      topNum: 0
    });
    this.readingCoundDown();
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