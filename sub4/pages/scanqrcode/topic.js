import utils from './utils';
import log from '../../../log';
Page({
  data: {
    preffixUrl: utils.preffixUrl(),
    like: true,
    gainent:true,
    curring: -1,
    index:'',
    // 下一题
    nextcontent:'下一题',
    // 提交
    tijiao:'答完了提交',
    // 新页面获得的手机号
    newtelnum:'',
    dou:'',//保存豆豆
    detail: [
      {
        id: '1',
        title: '汇率风险管理的意义不包括()',
        answer: '3',
        array: [{
            name: '降低经营成本以及利润的不确定性',
            usname: false,
          }, {
            name: '减少对会计报表和关键财务指标冲击',
            usname: false,
          },
          {
            name: '帮助企业实现资产增值',
            usname: false,
          }, {
            name: '平滑和保护企业现金流',
            usname: false,
          },
        ]
      },
      {
        id: '2',
        title: '套期保值会计核算方法包括()',
        answer: '4',
        array: [{
            name: '公允价值套期',
            usname: false, 
          }, {
            name: '现金流量套期',
            usname: false,
          },
          {
            name: '境外经营净投资套期',
            usname: false,
          }, {
            name: '以上都是',
            usname: false,
          },
        ]
      },
      {
        id: '3',
        title: '银行与企业约定在未来某一日期或某一时间段（期限大于两个工作日）以约定价格、金额进行人民币与外币的兑换交易，是哪种产品',
        answer: '3',
        array: [{
            name: '即期结售汇',
            usname: false,
          }, {
            name: '挂单结售汇',
            usname: false,
          },
          {
            name: '远期结售汇',
            usname: false,
          }, {
            name: '外汇掉期',
            usname: false,
          },
        ]
      },
      {
        id: '4',
        title: '汇率风险中性，是指企业把汇率波动纳入日常的财务决策，聚焦主业，尽可能降低汇率波动对主营业务以及企业财务的负面影响，实现提升经营可预测性以及管理投资风险等主营业务目标。',
        answer: '1',
        array: [{
          name: '正确',
          usname: false,
        }, {
          name: '错误',
          usname: false,
        }, ]
      },
      {
        id: '5',
        title: '企业初期制定套期保值方案，可设定简单易行的“固定保值”策略，即按照一定的百分比对风险敞口进行保值；积累经验后，可以选择“动态保值”，设置一定的套保比例区间，但区间不宜过宽，避免人为主观因素对保值产生过多干扰。',
        answer: '1',
        array: [{
          name: '正确',
          usname: false,
        }, {
          name: '错误',
          usname: false,
        }, ]
      },
    ],
    number: 0,
    answer: 0,//答对题的数量
    currentCampus: -1,
  },
  previous: function (e) {
    this.setData({
      number: this.data.number - 1,
      curring: this.data.curring - 1,
    })
  },
 
  radioChange: function (e) {
    console.log(e);

    // 下标
    let index = e.currentTarget.dataset.index
    // 没题id
    let id = e.currentTarget.dataset.id
    let detail = this.data.detail
    for (let i = 0; i < detail.length; i++) {
      if (detail[i].id == id) {
        detail[i].array[index].usname = true
        for (let j = 0; j < detail[i].array.length; j++) {
          if (j != index) {
            detail[i].array[j].usname = false
          }
        }
      }
    }
    this.setData({
      detail: detail,
      index:index,
      currentCampus:index
    });
  },
  nextstep: function (e) {
    //   console.log(this.data.newtelnum);
    let detail = this.data.detail
    let number = this.data.number
    let curring = this.data.curring
    let usname = 0;
    this.setData({
      currentCampus:-999
    })
    for (let i = 0; i < detail[number].array.length; i++) {
      if (!detail[number].array[i].usname) {
        usname++
      }
    }
    if (usname == detail[number].array.length) {
      wx.showToast({
        title: '答题选项不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    curring++
    number++
    if (curring > 3) {
      curring = -1
    }
    this.setData({
      curring: curring,
      number: number,
    })
    if(number ==5){
      let detail = this.data.detail
      let answer = 0
      let letter = ''
      for (let i = 0; i < detail.length; i++) {
        for (let j = 0; j < detail[i].array.length; j++) {
          if (detail[i].array[j].usname) {
            letter = detail[i].answer - 1
            if (letter == j) {
              answer++
            }
          }
        }
      }
      // answer答对正确数量
      const num = answer * 20
      this.setData({
        like: !this.data.like,
        answer: num
      })
      wx.navigateTo({
        
        // url: 
        // '../success/success?a=' + 
        // this.
        // data.name + 
        // '&b=' + 
        // this.
        // data.phone+
        // '&c='+
        // this.
        // data.phone+
        // '&d='+ 
        // this.dataidNumber
        url: './grade?answer='+ this.data.answer + '&newtelnum='+this.data.newtelnum,//把正确分数传过去
        // url: `./verifiedDetail/index?shopUid=${shopUid}&cardUid=${cardUid}`
      })
    }
  },
  // subsic: function (e) {
  //   let detail = this.data.detail
  //   let answer = 0
  //   let letter = ''
  //   for (let i = 0; i < detail.length; i++) {
  //     for (let j = 0; j < detail[i].array.length; j++) {
  //       if (detail[i].array[j].usname) {
  //         letter = detail[i].answer - 1
  //         if (letter == j) {
  //           answer++
  //         }
  //       }
  //     }
  //   }
  //   // answer答对正确数量
  //   const num = answer * 20
  //   this.setData({
  //     like: !this.data.like,
  //     answer: num
  //   })
  // },
//   correct:function () {//跳转答案
//     wx.navigateTo({
//       url: './answer',
//     })
//   },
  // 点击弹出已经获得的苏银do
//   extrat:function() {
//     this.setData({
//       gainent: !this.data.gainent,
//     })
//     console.log(this.data.answer);
//     if(this.data.answer === 60){
//       this.setData({
//         dou: 1000
//       })
//     }else if(this.data.answer === 80){
//       this.setData({
//         dou: 1500
//       })
//     }else if(this.data.answer === 100){
//       this.setData({
//         dou: 2000
//       })
//     }
//   },
//   immwdiately:function () {//立即提取
//     console.log(1111111111111);
//     let dataInfo = {
//       OPEN_ID:wx.getStorageSync('openid'),//微信id
//       PHONE_NUMBER:this.data.newtelnum,//手机号码
//       AWARD_NUMBER:this.data.dou//苏银豆奖励数量
//     }
//     console.log(dataInfo);
//     addAnswerAward(dataInfo).then(item => {
//     console.log(11111);
//     console.log(dataInfo);
//     console.log(item);
//     // if(item.H_TIME_OFFSET==0){//判断提取的苏银do是否成功
//     //   wx.showToast({
//     //     title: '没有提取苏银豆成功喔~',
//     //     icon: 'none',
//     //     duration: 2000
//     //   })
//     // }else if(item.H_TIME_OFFSET==1){
//     //   wx.showToast({
//     //     title: '成功啦成功啦',
//     //     icon: 'none',
//     //     duration: 2000
//     //   })
//     // }
//     })
//   },
//   close(){//关闭提取页面
//     console.log(11111);
//     this.setData({
//       gainent: !this.data.gainent,
//     })
    // if(){//从这里判断是否提取成功也可以
    //   wx.showToast({
    //         title: '成功啦成功啦',
    //         icon: 'none',
    //         duration: 2000
    //       })
    // }
//   },
  onLoad: function (options) {
    console.log(options);//手机号
    this.setData({
      newtelnum:options.tel
    })
  }
})




