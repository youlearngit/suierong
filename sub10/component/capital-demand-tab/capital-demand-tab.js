Component({
  data: {
    currentIndex: 0, // 当前选中项的索引
    left: '', // 选中项的下划线的位置
    show: false,
    scrollLeft:0,
  },
  properties: {
    tabList: {
      type: Array,
      value: []
    }
  },
  observers: {
    'tabList'(val) {
      if (val && val.length) {
        this.changeline()
      }
    }
  },
  methods: {
    changeTab(e) {
      let index = e.currentTarget.dataset.index
      let value = e.currentTarget.dataset.value
      this.setData({
        currentIndex: e.currentTarget.dataset.index,
      })
      // 自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项
      // this.triggerEvent(事件名, detail对象, 事件选项)，
      // detail对象可以是基本数据类型值，也可以是一个对象
      this.triggerEvent("getCurrentValue", value)
      this.changeline(index)
    },
    // 渲染横线位置的方法
    changeline(index) {
      let _this = this
      // SelectorQuery.in(Component component): 将选择器的选取范围更改为自定义组件 component 内
      let query = wx.createSelectorQuery().in(this)
      // select() 在当前页面下选择第一个匹配选择器 selector 的节点
      // boundingClientRect() 添加节点的布局位置的查询请求。相对于显示区域，以像素为单位
      query.selectAll(".tab-item").boundingClientRect()
      // SelectorQuery.exec(function callback) 执行所有的请求
      // 请求结果按请求次序构成数组，在callback的第一个参数中返回

      // query.exec(function (res) {
      //   console.log(res)
      //   _this.setData({
      //     left: res && res[0].left + res[0].width / 2 - 15,
      //     show: true,
      //     scrollLeft: index*res[0].width,
      //   })   
      // })
      
      query.exec((res) => {
       
        let num = 0;
        for (let i = 0; i < index; i++) {
          num += res[0][i].width;
        }
        console.log(num)
        // 计算当前currentTab之前的宽度总和
        this.setData({
          scrollLeft: Math.ceil(num)
        });
      });
    }
  }
})

