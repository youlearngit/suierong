import Get from "../../../api/Get"
var BIN=require("../../../utils/bankcardinfo");
Page({

    /**
     * 页面的初始数据
     */
    data: {
          preffixUrl: getApp().globalData.CDNURL,
          shType:0,  //0新增  1修改
          shType1:0,  //针对有些不能修改0可修改 1查看  2提示不能修改
          info:0, //0确认新增 1确认修改
          listvalue:{
            customerName:'', //商户名
            bankAccountNumber:'',       //银行账号
            linkman:'',      //联系人
            telephone:'',    //联系方式
            // email:'123@163.com',          //邮箱
            seller:'',        //营销人员
            sellerPhone:'',    //营销人员手机号
            openBankName:'',//开户行名称
          },
          TimeID: -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // var str='*';
      // item.failyName+str.fontcolor('red')
      console.log(options)
      if(options.msg=='0'){
        wx.setNavigationBarTitle({
             title: "添加商户"
        })
        this.setData({
          shType:0,
          shType1:0
        })
      }else{
        wx.setNavigationBarTitle({
             title: "修改商户"
        })
        this.setData({
          shType:1,
          shType1:1
        })
        console.log(JSON.parse(options.listvalue))
        if(options.listvalue){
          this.setData({
            listvalue:JSON.parse(options.listvalue)
          });
        }
      }
      console.log(this.data.shType)
    },
    funInput(e){
      console.log(e)
      var getValue=e.currentTarget.dataset.name;
      var item='listvalue.'+getValue;
        this.setData({
          [item]:e.detail.value.trim()
        })
        console.log(this.data.listvalue)
        if(getValue=='bankAccountNumber'){
          var card=e.detail.value.trim().replace(/\s+/g, '');
          console.log(card)
          var a=BIN.bankCardAttribution(e.detail.value.trim().replace(/\s+/g, '').toString())
          console.log('识别卡类型',a)
          if(a=='error'){
            this.setData({
              [`listvalue.openBankName`]:''
            })
          }else{
            this.setData({
              [item]:card,
              [`listvalue.openBankName`]:a.bankName
            })
          }
        }
    },
    cancle(){
      wx.navigateTo({
        url: '../../pages/merchantManage/merchantManage',
      })
    },
    // 编辑
    editorEvent(e){
      console.log(e)
      let val=e.currentTarget.dataset.message;
      if(val=='editor'){
        this.setData({
          info:1,
          shType:0,
          shType1:2
        })
      }
    },
    uneditor(){
      wx.showToast({
        title: '数据不能修改',
        icon:'none'
      })
    },
    sureAdd(){
      console.log(this.data.info)
      let {customerName,bankAccountNumber,linkman,telephone,seller,sellerPhone}=this.data.listvalue;
      if(!customerName){
        wx.showToast({
          title: '请输入商户名！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      // if(!bankAccountNumber){
      //   wx.showToast({
      //     title: '请输入银行账号！',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   return false;
      // }
      if(!linkman){
        wx.showToast({
          title: '请输入联系人姓名！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
     
      const regex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if(!telephone){
        wx.showToast({
          title: '请输入联系人方式！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }else if (telephone.length !== 0) {
        if (telephone.length !== 11 || !regex.test(telephone)) {
            wx.showToast({
                title: '请输入正确的联系方式！',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
    };
    // var regEmail =/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    //   if(!regEmail.test(email)){
    //     wx.showToast({
    //       title: '请输入正确的邮箱格式！',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //     return false;
    //   }
      console.log('sellerPhone:'+sellerPhone)
      if (sellerPhone&&sellerPhone.length !== 0) {
        if (sellerPhone.length !== 11 || !regex.test(sellerPhone)) {
            wx.showToast({
                title: '请输入正确的营销人员联系方式！',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
      };
      if(customerName.length<4){
        if(bankAccountNumber&&!this.checkBankno(bankAccountNumber)){
          wx.showToast({
            title: '请输入正确的银行卡号！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
    }
      console.log('chenggong')
      // return;
      //确认修改
      if(this.data.info==1){
          console.log(this.data.listvalue.bankAccountNumber)
        if(this.data.listvalue.bankAccountNumber){
          let b=BIN.bankCardAttribution(this.data.listvalue.bankAccountNumber.replace(/\s+/g, '').toString())
          console.log('识别卡类型',b)
          var name;
          if(b=='error'){
            name=''
          }else{
            name=b.bankName;
          }
        }
        const data={
          Authorization:wx.getStorageSync('token'),
          customerId:this.data.listvalue.id.toString(),
          bankAccountNumber:this.data.listvalue.bankAccountNumber,  //银行账号
          openBankName:this.data.listvalue.openBankName?this.data.listvalue.openBankName:name //开户行名称
        }
        if(this.data.listvalue.seller!=''){
          data.seller=this.data.listvalue.seller//营销人员姓名
        }
        if(this.data.listvalue.sellerPhone!=''){
          data.sellerPhone=this.data.listvalue.sellerPhone//营销人员手机号
        }
        console.log(data)
          clearTimeout(this.TimeID);
          this.TimeID = setTimeout(() => {
            Get.updateMerchant(data).then(res=>{
              wx.showToast({
                title: '更新成功',
                icon:'success',
                duration:2000
            });
                setTimeout(()=>{
                  wx.reLaunch({
                    url: '../merchantManage/merchantManage',
                  })
                },2000)
            }).catch(res=>{
              wx.showToast({
                title: res,
                duration:2000,
                icon:'none'
              });
              setTimeout(()=>{
                wx.reLaunch({
                  url: '../merchantManage/merchantManage',
                })
              },2000)
            })
        },1000)
      }else{
        //确认新增
        const data={
          Authorization:wx.getStorageSync('token'),
          customerName:this.data.listvalue.customerName, //商户名
          linkman:this.data.listvalue.linkman,      //联系人
          telephone:this.data.listvalue.telephone,    //联系方式
          bankAccountNumber:this.data.listvalue.bankAccountNumber,  //银行账号
          openBankName:this.data.listvalue.openBankName //开户行名称
        }
        if(this.data.listvalue.seller!=''){
          data.seller=this.data.listvalue.seller//营销人员姓名
        }
        if(this.data.listvalue.sellerPhone!=''){
          data.sellerPhone=this.data.listvalue.sellerPhone//营销人员手机号
        }
        console.log(data)
        // return;
          clearTimeout(this.TimeID);
          this.TimeID = setTimeout(() => {
            Get.newMerchant(data).then(res=>{
              wx.showToast({
                title: '新增成功',
                icon:'success',
                duration:2000
            });
                setTimeout(()=>{
                  wx.reLaunch({
                    url: '../merchantManage/merchantManage',
                  })
                },1000)
            }).catch(res=>{
              wx.showToast({
                  title: res,
                  icon:'none',
                  duration:2000
              });
                  setTimeout(()=>{
                    wx.reLaunch({
                      url: '../merchantManage/merchantManage',
                    })
                  },1000)
          })
        },1000)
      }
     
    },
    //银行卡正则校验
  checkBankno(bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhm进行比较）
    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
    var newArr = [];
 
    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
      newArr.push(first15Num.substr(i, 1));
    }
 
    var arrJiShu = []; //奇数位*2的积 <9
    var arrJiShu2 = []; //奇数位*2的积 >9
    var arrOuShu = []; //偶数位数组
    for (var j = 0; j < newArr.length; j++) {
      if ((j + 1) % 2 == 1) { //奇数位
        if (parseInt(newArr[j]) * 2 < 9)
          arrJiShu.push(parseInt(newArr[j]) * 2);
        else
          arrJiShu2.push(parseInt(newArr[j]) * 2);
      } else //偶数位
        arrOuShu.push(newArr[j]);
    }
 
    var jishu_child1 = []; //奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = []; //奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
      jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
      jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }
 
    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
    var sumOuShu = 0; //偶数位数组之和
    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
      sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }
    for (var n = 0; n < arrOuShu.length; n++) {
      sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }
    for (var p = 0; p < jishu_child1.length; p++) {
      sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
      sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
    //计算Luhm值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhm = 10 - k;
    if (lastNum == luhm) {
      return true;
    } else {
      return false;
    }
  }
})