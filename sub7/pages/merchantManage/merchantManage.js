import Get from '../../../api/Get';
import Dialog from '../../static/vant-weapp/dialog/dialog'
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: getApp().globalData.CDNURL,
        leftWidth:0,
        function2:false,
        isopen:0,
        checked:false,
        list:[],
        noMore:false, // 是否还有数据
        isPage:false, // 是否还有下一页
        page: '1', // 默认页
        size: '10', // 默认每页10条数据
        myScrollTop:'', // 滚动条的位置
        pageTips: '上拉加载更多',
        search: '',
        downsearch:false,
        height:'',
        allList: [],  //搜索所有的list
        filterList:[] //匹配到的list
    },
    onShow(){
        app.editTabBar1();    //显示自定义的底部导航
    },
    async onLoad(){
      await this.getList();
      this.getAllList();
    },
     //获取所有商户
     async getAllList(){
        let data = {}
        data.Authorization=wx.getStorageSync('token');
        data.currentPage = '1';
        data.pageSize ='0';
        var that=this;
        await Get.getMerchantList(data).then(res => {
          that.setData({
            allList:JSON.parse(res.list)
          });
        })
      console.log(this.data.allList)
    },
    //获取商户列表
    async getList(isPage) { // 首次调用的时候没有传参isPage为undefined
      // debugger;
      console.log(isPage)
      if(isPage) { // 滑到下一页时isPage为true
        console.log(11)
        this.data.isPage = isPage
      } else { // 只加载第一页时isPage为false，并且page重置为1
        console.log(22)
        this.data.isPage = false
        this.setData({page:1})
      }
      let data = {}
      data.Authorization=wx.getStorageSync('token');
      data.currentPage = this.data.page.toString();
      data.pageSize = this.data.size.toString();
      console.log(data)
      var that=this;
      wx.showLoading({
        title: '加载中...'
      })
      await Get.getMerchantList(data).then(res => {
        wx.hideLoading();
        console.log(JSON.parse(res.list))
        console.log(JSON.parse(res.data))
          console.log(11)
          if(that.data.isPage) { // 有下一页时，要展示的数据为已加载出来的合并下一页获取的数据
            that.setData({
               list: that.data.list.concat(JSON.parse(res.list))
             })
             that.addItem();
             if(this.data.function2){
              this.data.list.forEach((item,index)=>{
                console.log(index)
                  this.selectComponent(`#swipe-cell${index}`).open('left');
              })
            }
           } else { // 只有一页时直接获取数据展示
            that.setData({
               list:JSON.parse(res.list),
               myScrollTop:0 // 滚动条的位置重置为顶部
             })
             console.log(that.data.list)
            that.addItem();
           }
           if(JSON.parse(res.list).length < that.data.size){ 
            that.setData({noMore: true,page:1}) // noMore重置为true表示后面没有数据了
          }else{
            // 否则还有数据可以下拉加载下一页
            that.setData({noMore:false})
          }
      }).catch(res=>{
        console.log(res)
        that.setData({
          pageTips: '已无更多数据',
        });
        wx.hideLoading();
        if(res=='流程任务执行失败'){
          wx.showModal({
            title: '提示',
            content: 'token失效，请退出重新登录!',
            showCancel: false,
            cancelColor: '#000000',
            confirmText: '确定',
            success: (result) => {
              if (result.confirm) {
                wx.removeStorageSync('token');
                wx.showToast({
                  title: '退出成功！',
                  icon:'none',
                  duration:2000
                })
                setTimeout(()=>{
                  wx.navigateTo({
                    url: '../login/login',
                  })
                },2000)
              }
            }
          });
        }
      });
    },
    scrollToLower: function (e) {
      if (!this.data.noMore){ // 还有数据的时候才会请求下一页
        this.setData({ page: this.data.page + 1})
        this.getList(true); // 调用方法获取下一页的数据，参数传true表示还有下一页
      }else{
        this.setData({
          pageTips: '已无更多数据',
        });
        console.log("已无更多数据")
      }
    },
    addItem(){
      var newArr=[];
      var that=this;
      that.data.list.forEach(item=>{
        newArr.push(Object.assign(item,{checked:false}))
      })
      console.log('newArr',newArr)
      that.setData({
        list:newArr
      })
    },
    // 批量管理
    manager(){
        this.setData({
          function2:true,
          leftWidth:35
        });
          this.data.list.forEach((item,index)=>{
            this.selectComponent(`#swipe-cell${index}`).open('left');
            this.setData({
              [`list[${index}].checked`]:false
            })
        })
       
    },
    // 完成时
    complete(){
      this.setData({
        function2:false,
        leftWidth:0
      })
      this.data.list.forEach((item,index)=>{
        this.selectComponent(`#swipe-cell${index}`).close('left');
      })
    },
    // 跳转新增或编辑商户页面
    jumpUserPage(e){
      console.log(e)
      let val=e.currentTarget.dataset.msg;
      let listvalue=e.currentTarget.dataset.listvalue;
      let index=e.currentTarget.dataset.index;
      console.log(val)
      //跳新增
      if(val==0){
        wx.navigateTo({
          url: '../merchantManage/addMerchant?msg='+val,
        })
      }else if(val==1){  //跳编辑
        wx.navigateTo({
          url: '../merchantManage/addMerchant?msg='+val+"&listvalue="+JSON.stringify(listvalue),
        })
        this.selectComponent(`#swipe-cell${index}`).close('right');
      }
    },
    // 单选框选中事件
    checkedTap: function (e) {
      console.log(e)
      let index=e.currentTarget.dataset.index;
        this.setData({
          [`list[${index}].checked`]: !this.data.list[index].checked
        })
    },
    onClose(event) {
        console.log(event)
      const { position, instance } = event.detail;
      switch (position) {
        case 'left':
            // instance.close();
            break;
        case 'cell':
          instance.close();
          break;
        case 'right':
          break;
      }
    },
    // 删除
    deleteEvent(e){
      console.log(e)
      let val=e.currentTarget.dataset.value;
      if(val=='all'){
        console.log(this.data.list)
        let ids=[];
          this.data.list.forEach((item,index)=>{
              if(item.checked==true){
                console.log(item)
                ids.push(item.id)
              }
          })
          if(ids.length==0){
            wx.showToast({
              title: '请至少选择一条数据',
              icon:'none'
            })
          }else{
          console.log('ids:',ids.join())
          Dialog.confirm({
            message: '该商户删除后，订单信息会一并删除',
          }).then(() => {
            var data={
              Authorization:wx.getStorageSync('token'),
              ids:ids.join()
            }
            console.log(data)
            var that=this;
            Get.deleteMerchant(data).then(res=>{
              wx.showToast({
                title: '删除成功',
                icon:'success'
              });
              // that.data.list.forEach((item,index)=>{
              //   that.selectComponent(`#swipe-cell${index}`).close('left');
              // })
              that.getList();
              that.setData({
                allList:[],
                search:''
              })
              that.getAllList();
            })
          }).catch(()=>{
            //   this.data.list.forEach((item,index)=>{
            //   this.selectComponent(`#swipe-cell${index}`).close('left');
            // })
          });
        }
      }else{
        let id=e.currentTarget.dataset.listvalue.id;
        let index=e.currentTarget.dataset.index;
        console.log(val)
        var arrid=[];
        arrid.push(id.toString())
          Dialog.confirm({
              message: '该商户删除后，订单信息会一并删除',
            }).then(() => {
              var data={
                Authorization:wx.getStorageSync('token'),
                ids:id.toString()
                // ids:'800,799'
              }
              console.log(data)
              var that=this;
              Get.deleteMerchant(data).then(res=>{
                wx.showToast({
                  title: '删除成功',
                  icon:'success'
                });
                that.selectComponent(`#swipe-cell${index}`).close('left');
                that.getList();
                that.setData({
                  allList:[],
                  search:''
                })
                that.getAllList();
              })
            }).catch(()=>{
              this.selectComponent(`#swipe-cell${index}`).close('left');
            });
      }
    },
    swipeOpen(e){
      console.log(e)
        this.setData({
            isopen:1
        });
        let index = e.currentTarget.dataset.index;
        this.selectComponent(`#swipe-cell${index}`).open('right');
    },
    swipeClose(e){
      console.log(e)
        this.setData({
            isopen:0
        });
        let index = e.currentTarget.dataset.index;
        this.selectComponent(`#swipe-cell${index}`).close('right');
    },
    getValue(e){
      let val = e.detail.value.trim();
      this.setData({ search: val });
      console.log(this.data.search)
      if (val.length > 0) {
        let arr = [];
        for (let i = 0; i < this.data.allList.length; i++) {
          if (this.data.allList[i].customerName.indexOf(val) > -1) {
            arr.push(
              {
                acctno:this.data.allList[i].acctno,
                bankAccountNumber: this.data.allList[i].bankAccountNumber==undefined?'':this.data.allList[i].bankAccountNumber,
                checked: false,
                createBy: this.data.allList[i].createBy,
                createTime: this.data.allList[i].createTime,
                currency: this.data.allList[i].currency,
                customerName: this.data.allList[i].customerName,
                id:this.data.allList[i].id,
                linkman:this.data.allList[i].linkman,
                subAccount: this.data.allList[i].subAccount,
                telephone:this.data.allList[i].telephone,
                seller:this.data.allList[i].seller==undefined?'':this.data.allList[i].seller,
                sellerPhone:this.data.allList[i].sellerPhone==undefined?'':this.data.allList[i].sellerPhone
              })
          }
        }
        this.setData({ 
          filterList: arr,
          downsearch:true
        })
        console.log(this.data.filterList)
        
      } else {
        console.log('2222')
        this.setData({ 
          filterList: [],
          downsearch:false
        })
        this.getList();
      }
      if(this.data.filterList.length>=5){
        this.setData({height:'385rpx'});
      }else{
        this.setData({height:'auto'});
      }
    },
    jumpcustomerName(e){
      console.log(e)
      let arr=[];
      let only=e.currentTarget.dataset.item;
      let customerName=e.currentTarget.dataset.item.customerName;
      console.log(only)
      arr.push(only)
      this.setData({
        list:arr,
        downsearch:false,
        search:customerName
      })
    },
    async clear_input() {
      this.setData({
        search: "",
        downsearch:false
      })
      await this.getList();
    }
})