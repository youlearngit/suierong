// pages/screenwed/screenwed.js
import utils from '../../utils';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preffixUrl: utils.preffixUrl(),
    date:"2022-10-13",
    category:[
      {
        id:0,
        text:'全部'
      }, {
        id:1,
        text:'险资公司',
        ischecked:false
      }, {
        id:2,
        text:'信托公司',
        ischecked:false
      }, {
        id:3,
        text:'劵商公司',
        ischecked:false
      }, {
        id:4,
        text:'投资基金',
        ischecked:false
      }, {
        id:5,
        text:'租赁公司',
        ischecked:false
      }, {
        id:6,
        text:'央国企',
        ischecked:false
      }, {
        id:7,
        text:'其他',
        ischecked:false
      }
    ],
    issuingBranch:[
      {
        id:0,
        text:'全部'
      }, {
        id:1,
        text:'北京',
        ischecked:false
      }, {
        id:2,
        text:'上海',
        ischecked:false
      }, {
        id:3,
        text:'广州',
        ischecked:false
      }, {
        id:4,
        text:'深圳',
        ischecked:false
      }, {
        id:5,
        text:'南京',
        ischecked:false
      }, {
        id:6,
        text:'无锡',
        ischecked:false
      }, {
        id:7,
        text:'苏州',
        ischecked:false
      }
    ],
    currentCampus: -1,
    isSelect:0,
    startTime:'',
    endTime:'',
    keywords:'',
    INVEST_AMT_DOWN:'',
    INVEST_AMT_UP:'',
  },
  goBack(){
   wx.navigateBack()
  },
  getInvestAmtUp(e){
    this.setData({
      INVEST_AMT_UP:e.detail.value
    })
  },
  getInvestAmtDown(e){
    console.log(e)
    this.setData({
      INVEST_AMT_DOWN:e.detail.value
    })
  },
  bindDateFund: function (e) {
    this.setData({
        funudDate: e.detail.value
    })
  },
  bindselect(e) {
    this.setData({
      fontentub: true
    })
  },
  FbundDateFund: function (e) {
     
    this.setData({
      fbundDate: e.detail.value
    })
  },

  selectBranch(e){
    console.log(e)
    let index=e.currentTarget.dataset.index
    if(index==0 && this.data.issuingBranch[index].ischecked){
      this.data.issuingBranch.forEach((item,index)=>{
        if(index!==0){
          item.ischecked=false
        }
      })
    }else if(index==0 && !this.data.issuingBranch[index].ischecked){
      this.data.issuingBranch.forEach((item,index)=>{
        if(index!==0){
          item.ischecked=true
        }
      })
    }
    this.data.issuingBranch[index].ischecked=!this.data.issuingBranch[index].ischecked
    this.setData({
      issuingBranch:this.data.issuingBranch
    })

    console.log(
      this.data.issuingBranch.filter((item,index)=>{
        return item.ischecked && index!==0
      })
    )
    if(this.data.issuingBranch.filter(item=>{
      return item.ischecked && index!==0
    }).length===this.data.issuingBranch.length-1){
      this.data.issuingBranch[0].ischecked=true
    }

    if(this.data.issuingBranch.filter(item=>{
      return item.ischecked
    }).length!==this.data.issuingBranch.length){
      this.data.issuingBranch[0].ischecked=false
    }

    this.setData({
      issuingBranch:this.data.issuingBranch
    })
  },
  selectCategory(e) {
        console.log(e)
        let index=e.currentTarget.dataset.index
        if(index==0 && this.data.category[index].ischecked){
          this.data.category.forEach((item,index)=>{
            if(index!==0){
              item.ischecked=false
            }
          })
        }else if(index==0 && !this.data.category[index].ischecked){
          this.data.category.forEach((item,index)=>{
            if(index!==0){
              item.ischecked=true
            }
          })
        }
        this.data.category[index].ischecked=!this.data.category[index].ischecked
        this.setData({
          category:this.data.category
        })

        console.log(
          this.data.category.filter((item,index)=>{
            return item.ischecked && index!==0
          })
        )
        if(this.data.category.filter(item=>{
          return item.ischecked && index!==0
        }).length===this.data.category.length-1){
          this.data.category[0].ischecked=true
        }

        if(this.data.category.filter(item=>{
          return item.ischecked
        }).length!==this.data.category.length){
          this.data.category[0].ischecked=false
        }

        this.setData({
          category:this.data.category
        })
         
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
  
  },
  reset(){
    this.data.category.forEach(item=>{
      item.ischecked=false
    })
    this.data.issuingBranch.forEach(item=>{
      item.ischecked=false
    })
    this.setData({
      startTime:'',
      endTime:'',
      isSelect:0,
      INVEST_AMT_DOWN:'',
      INVEST_AMT_UP:'',
      category:this.data.category,
      issuingBranch:this.data.issuingBranch
    })
  },

  confirm(){
    let backData={
      startTime:this.data.startTime,
      endTime:this.data.endTime,
      INVEST_AMT_DOWN:this.data.INVEST_AMT_DOWN,
      INVEST_AMT_UP:this.data.INVEST_AMT_UP,
      selectCategory:this.data.category.filter((item,index)=>{
        return item.ischecked && index!==0
      }),
      selectBranch:this.data.issuingBranch.filter((item,index)=>{
        return item.ischecked && index!==0
      })
    }
    wx.setStorageSync("select_screen",backData)
   
    wx.navigateBack()
  },

  bindStartChange(e){
    console.log(e)
    this.setData({
      startTime:e.detail.value
    })
  },
  bindEndChange(e){
    this.setData({
      endTime:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
