// sub8/pages/agriculture/marketAnalysis.js
const app = getApp();
import * as echarts from '../../static/ec-canvas/echarts'
import talent from './talent';
import requestYT from '../../../api/requestYT';

const citys = {
  浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  福建: ['福州', '厦门', '莆田', '三明', '泉州'],
};

function initChart(chart, width, height) {
  console.log('width', width + 10);
  console.log('height', height);
  // console.log('canvas',canvas);
  // const chart = echarts.init(canvas, null, {
  //   width: 380,
  //   height: 350
  // });
  let BASKET_LIST = []
  let GRAIN_OIL_LIST = []
  let TOTAL_LIST = []
  let data = {}
  var xAxisData = []; //x轴数据\
  talent.getAllMarketData(data).then(res => {
    console.log(res);
    res.BASKET_LIST.forEach(element => {
      xAxisData.push(element.DATA_TIME)
      BASKET_LIST.push(Number(element.BASKET_PRICE_INDEX))
    });
    res.GRAIN_OIL_LIST.forEach(element => {
      GRAIN_OIL_LIST.push(Number(element.GRAIN_OIL_INDEX))
    });
    res.TOTAL_LIST.forEach(element => {
      TOTAL_LIST.push(Number(element.TOTAL_INDEX))
    });
    // canvas.setChart(chart);
    let max = []
    let min = []
    max.push(Math.max(...BASKET_LIST))
    max.push(Math.max(...GRAIN_OIL_LIST))
    max.push(Math.max(...TOTAL_LIST))
    min.push(Math.min(...BASKET_LIST))
    min.push(Math.min(...GRAIN_OIL_LIST))
    min.push(Math.min(...TOTAL_LIST))
    var endPercent = (29 / xAxisData.length) * 100;
    var option = {
      //定义图标的标题和颜色
      title: {
        // text: '今日访问量',
        left: 'center'
      },
      color: ["#507AFF", "#44D7B6", "#FF6262"],
      //定义你图标的线的类型种类
      legend: {
        // data: ['A'],
        // animation: false,
        top: 10,
        // left: 'center',
        // calculable: false,
        // backgroundColor: 'red',
        // z: 100
      },
      calculable: false,
      grid: {
        containLabel: true
      },
      dataZoom: [ //给x轴设置滚动条  
        {
          start: 0, //默认为0  
          end: endPercent,
          type: 'slider',
          show: false,
          // xAxisIndex: [0],
          handleSize: 0, //滑动条的 左右2个滑动条的大小  
          height: 8, //组件高度  
          left: 0, //左边的距离  
          right: 0, //右边的距离  
          bottom: 26, //右边的距离  
          handleColor: '#BAC4D7', //h滑动图标的颜色  
          handleStyle: {
            borderColor: "#cacaca",
            borderWidth: "1",
            shadowBlur: 2,
            background: "#BAC4D7",
            shadowColor: "#BAC4D7",
          },
          fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变  
            //给第一个设置0，第四个设置1，就是垂直渐变  
            offset: 0,
            color: '#333'
          }]),
          backgroundColor: '#ebf2ff', //两边未选中的滑动条区域的颜色  
          showDataShadow: true, //是否显示数据阴影 默认auto  
          showDetail: false, //即拖拽时候是否显示详细数值信息 默认true  
          handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
          filterMode: 'filter'
        },
        //下面这个属性是里面拖到  
        {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          start: 0, //默认为1  
          end: 50
        },
      ],
      //当你选中数据时的提示框
      tooltip: {
        show: true,
        trigger: 'axis',

      },

      //	x轴
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData, //x轴数据
        dataZoom: [

        ],
        // x轴的字体样式
        axisLabel: {
          show: true,
          textStyle: {
            color: '#7881a8',
            fontSize: '9',
          }
        },

        // 控制网格线是否显示
        splitLine: {
          show: true,
          //  改变轴线颜色
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#8b92ac']
          }
        },
        // x轴的颜色和宽度
        axisLine: {
          lineStyle: {
            color: '#8b92ac',
            width: 1, //这里是坐标轴的宽度,可以去掉
          }
        },
        // show: false //是否显示坐标
      },
      yAxis: {
        x: 'center',

        type: 'value',
        min: Math.min(...min),
        max: Math.max(...max),
        // data:BASKET_LIST,
        //网格线
        splitLine: {
          lineStyle: {
            type: 'dashed',
            option: 1,
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#7881a8',
            fontSize: '9',
          }
        },
        // show: false
      },

      series: [{
          // name: '农产品200指数',
          type: 'line',
          smooth: true,
          data: TOTAL_LIST,

        },
        {
          // name: '菜篮子指数',
          type: 'line',
          smooth: true,
          data: BASKET_LIST
        },
        {
          // name: '粮油指数',
          type: 'line',
          smooth: true,
          data: GRAIN_OIL_LIST
        }
      ]
    };
    chart.setOption(option);
  })
  return chart;
}

function initChart2(chart, ydata) {
  console.log('ydata', ydata);
  console.log('chart', chart);


  var option = {
    //定义图标的标题和颜色
    title: {
      text: '',
      left: 'center'
    },
    color: ["#507AFF", "#44D7B6", "#FF6262"],
    // fontSize:'3',
    //定义你图标的线的类型种类
    legend: {
      // data: ['B'],
      top: 10,
      left: 'center',
      // backgroundColor: 'red',
      z: 100
    },
    grid: {
      containLabel: true
    },

    calculable: true,
    //当你选中数据时的提示框
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    //	x轴
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ydata.time, //x轴数据
      dataZoom: [

      ],
      // x轴的字体样式
      axisLabel: {
        show: true,
        textStyle: {
          color: '#7881a8',
          fontSize: '9',
        }
      },

      // 控制网格线是否显示
      splitLine: {
        show: true,
        //  改变轴线颜色
        lineStyle: {
          // 使用深浅的间隔色
          color: ['#8b92ac']
        }
      },
      // x轴的颜色和宽度
      axisLine: {
        lineStyle: {
          color: '#8b92ac',
          width: 1, //这里是坐标轴的宽度,可以去掉
        }
      },
      // show: false //是否显示坐标
    },
    yAxis: {
      x: 'center',
      type: 'value',
      //网格线
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#7881a8',
          fontSize: '9',
        }
      },
      // show: false
    },
    series: [{
        type: 'line',
        smooth: true,
        data: ydata.product,

        areaStyle: {
          color: '#b7c7ff',
          opacity: 0.5
        }
        // data: res.LIST,

      },

    ]
  };
  chart.setOption(option);
  return chart;

}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      ['粮食', '棉花', '油料', '食糖', '蔬菜', '水果', '畜禽', '水产品'],
      ['稻谷', '小麦', '玉米', '玉米棒', '大豆', '马铃薯'],
      []
    ],
    endSTime: '',
    multiIndex: [0, 0, 0],
    cndUrl: app.globalData.CDNURL,
    checked: true,
    selectProduct: '稻谷',
    RDList: [],
    before: {},
    YDList: [],
    date: '2016-09-01',
    GXList: [],
    productShow: false,
    dataShow: false,
    ec: {
      // onInit: initChart
    },
    productFrom: {
      // onInit: initChart2,
    },
    streetlinechartec: {
      lazyLoad: true,
    },
    startTime: '2016-09-01',
    endTime: '',
    columns: [{
        values: Object.keys(citys),
        className: 'column1',
      },
      {
        values: citys['浙江'],
        className: 'column2',
        defaultIndex: 2,
      },
    ],
    lazyLoad: true,
    product: '粮食',
    types: '稻谷',
    query: '',
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let seleter = ''
    if (this.data.multiArray[2].length == 0) {
      seleter = this.data.multiArray[1][e.detail.value[1]]
    } else {
      seleter = this.data.multiArray[2][e.detail.value[2]]
    }

    this.setData({
      multiIndex: e.detail.value,
      selectProduct: seleter,
      product: this.data.multiArray[0][e.detail.value[0]],
      types: this.data.multiArray[1][e.detail.value[1]],
      query: this.data.multiArray[2][e.detail.value[2]] ? this.data.multiArray[2][e.detail.value[2]] : '',
      // productFrom:{
      //   onInit: initChart2
      // },
    })
    // console.log('this.chart',document.getElementById('mychart-dom-lines'));
    this.ecComponent = this.selectComponent('#mychart-dom-lines');
    this.init()
  },
  init2: function () {
    let chart;
    this.ecComponent2.init((canvas, width, height, dpr) => {
      console.log('width1', width);
      console.log('height', height);
      console.log();
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });

      initChart(chart)
      console.log(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;


      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  // 点击按钮后初始化图表
  init: function () {

    let chart;
    this.ecComponent.init((canvas, width, height, dpr) => {
      console.log('width1', width);
      console.log('height', height);
      console.log();
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      let data = {
        product: this.data.product,
        start: this.data.startTime,
        end: this.data.endTime,
        query: this.data.query,
        type: this.data.types,
        flag: '1'
      }
      let time = []
      let product = []
      let datas = {}
      console.log(data);
      talent.selectPriceIndex(data).then(res => {
        console.log('res', res.List);
        if (res.List) {
          res.List.forEach(item => {
            time.push(item.DATE_TIME)
            product.push(item.PRICE)
          });

        }
        datas = {
          time,
          product
        }
        console.log('time', time);
        initChart2(chart, datas);

      })


      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;


      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  bindMultiPickerColumnChange: function (e) {
    console.log(e);
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['稻谷', '小麦', '玉米', '玉米棒', '大豆', '马铃薯'];
            data.multiArray[2] = [];
            break;
          case 1:
            data.multiArray[1] = ['棉纱', '棉壳', '棉短绒', '绵粕', '棉油'];
            data.multiArray[2] = [];
            break;
          case 2:
            data.multiArray[1] = ['花生'];
            data.multiArray[2] = [];
            break;
          case 3:
            data.multiArray[1] = ['甘蔗'];
            data.multiArray[2] = [];
            break;
          case 4:
            data.multiArray[1] = ['食用菌类', '芽、花类', '瓜果类', '叶菜类', '根和根茎类'];
            // data.multiArray[1] = ['大白菜', '黄瓜', '光皮黄瓜', '大蒜'];
            data.multiArray[2] = ['平菇', '香菇'];
            break;
          case 5:
            data.multiArray[1] = ['仁果类', '浆果类', '热带及亚热带水果', '瓜果'];
            // data.multiArray[1] = ['大白菜', '黄瓜', '光皮黄瓜', '大蒜'];
            data.multiArray[2] = ['富士苹果'];
            break;
          case 6:
            data.multiArray[1] = ['猪', '牛', '羊', '禽类', '禽蛋'];
            data.multiArray[2] = ['猪肉', '生猪', '仔猪', '母猪'];
            break;
          case 7:
            data.multiArray[1] = ['淡水产品', '海水产品'];
            data.multiArray[2] = ['草鱼', '鲢鱼', '鳙鱼', '鲤鱼', '鲫鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        data.multiIndex[2] = 0;
        break;
    }
    if (data.multiIndex[0] == 4) {
      if (data.multiIndex[1] == 0) {
        data.multiArray[2] = ['平菇', '香菇'];
      } else if (data.multiIndex[1] == 1) {
        data.multiArray[2] = ['菜花'];
      } else if (data.multiIndex[1] == 2) {
        data.multiArray[2] = ['西红柿', '青椒', '茄子', '黄瓜', '光皮黄瓜', '西葫芦', '南瓜', '冬瓜', '豆角'];
      } else if (data.multiIndex[1] == 3) {
        data.multiArray[2] = ['大白菜', '洋白菜', '油菜', '生菜', '菠菜', '韭菜'];
      } else if (data.multiIndex[1] == 4) {
        data.multiArray[2] = ['白萝卜', '胡萝卜', '土豆', '葱头', '大葱', '生姜','大蒜', '芹菜', '莴笋', '莲藕'];
      }
    } else if (data.multiIndex[0] == 5) {
      if (data.multiIndex[1] == 0) {
        data.multiArray[2] = ['富士苹果','鸭梨'];
      } else if (data.multiIndex[1] == 1) {
        data.multiArray[2] = ['巨峰葡萄'];
      } else if (data.multiIndex[1] == 2) {
        data.multiArray[2] = ['香蕉', '菠萝'];
      } else if (data.multiIndex[1] == 3) {
        data.multiArray[2] = ['西瓜'];
      } 
    } else if (data.multiIndex[0] == 6) {
      if (data.multiIndex[1] == 0) {
        data.multiArray[2] = ['猪肉', '生猪', '仔猪', '母猪'];
      } else if (data.multiIndex[1] == 1) {
        data.multiArray[2] = ['黄牛', '牦牛', '水牛'];
      } else if (data.multiIndex[1] == 2) {
        data.multiArray[2] = ['山羊','绵羊'];
      } else if (data.multiIndex[1] == 3) {
        data.multiArray[2] = ['活鸡', '活鸭', '活鹅'];
      } else if (data.multiIndex[1] == 4) {
        data.multiArray[2] = ['鸡蛋', '鸭蛋'];
      }
    } else if (data.multiIndex[0] == 7) {
      if (data.multiIndex[1] == 0) {
        data.multiArray[2] = ['草鱼', '鲢鱼', '鳙鱼', '鲤鱼', '鲫鱼'];
      } else if (data.multiIndex[1] == 1) {
        data.multiArray[2] = ['带鱼', '大黄花鱼'];
      }
    }
    console.log(data.multiIndex);

    console.log(data);
    this.setData(data);
  },
  startBindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
    this.ecComponent = this.selectComponent('#mychart-dom-lines');
    this.init()
  },
  endBindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
    this.ecComponent = this.selectComponent('#mychart-dom-lines');
    this.init()
  },
  getProduct() {
    this.setData({
      productShow: true
    })
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
  },
  productSelect(a) {
    console.log(a);
  },
  onClose() {
    this.setData({
      productShow: false
    });
  },
  getNum() {
    let data = {}
    talent.getMarketData(data).then(res => {
      console.log(res);
      this.setData({
        before: res
      })
    })
  },
  getArticle(e) {
    console.log(e.currentTarget.dataset.type);
    wx.navigateTo({
      url: "./report?ID=" + e.currentTarget.dataset.type + "&POLICY_CATEGORY=" + this.data.POLICY_CATEGORY
    })
  },
  getList(e) {
    let data = {
      REPORT_TYPE: JSON.stringify(e),
      IS_RECOMMEND: '1'
    }
    console.log(data);
    talent.getReportList(data).then(res => {
      if (res.LIST) {
        let list = []
        for (let i = 0; i < res.LIST.length; i++) {
          if (i < 3) {
            list.push(res.LIST[i])
          }

        }
        if (e == 0) {

          this.setData({
            RDList: list
          })

        } else if (e == 1) {
          this.setData({
            YDList: list
          })
        } else if (e == 2) {
          this.setData({
            GXList: list
          })
        }
      }


    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let newTime = new Date()
    var year = newTime.getFullYear()
    var month = newTime.getMonth() + 1
    var strDate = newTime.getDate()
    console.log(year + '-' + month + '-' + strDate);
    console.log(newTime.getHours());
    this.setData({
      endSTime: year + "-" + month + "-" + (strDate > 10 ? strDate : '0' + strDate),
      endTime: year + '-' + month + '-' + (strDate > 10 ? strDate : '0' + strDate),

    })
    if (options.product) {
      this.setData({
        product: options.product ? options.product : '',
        selectProduct: options.query || options.types || options.product,
        types: options.types ? options.types : '',
        query: options.query ? options.query : ''
      })
    }
    if (month == 1) {
      year--
      month = 12
    } else if (month == 3 && strDate > 28) {
      //三月要考虑是否为闰年
      month--
      if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
        strDate = 29
      } else {
        strDate = 28
      }
    } else if (month != 12 || month != 8 && strDate == 31) {
      //31号的月份要考虑上个月是否有31号
      month--
      strDate == 30
    } else {
      month--
    }
    //最后拼接年月日
    let date = year + "-" + month + "-" + (strDate > 10 ? strDate : '0' + strDate)
    console.log(date)
    this.setData({

      startTime: year + "-" + month + "-" + (strDate > 10 ? strDate : '0' + strDate)
    })
    this.getList(0)
    this.getList(1)
    this.getList(2)
    this.getNum()
    this.ecComponent = this.selectComponent('#mychart-dom-lines');
    this.init()
    this.ecComponent2 = this.selectComponent('#mychart-dom-line');
    this.init2()
    // this.initBasicEcharts()
  },
  getReport(e) {
    console.log(e.currentTarget.dataset.type);
    wx.navigateTo({
      url: "./reportList?type=" + e.currentTarget.dataset.type
    })
  },
  getChecked(e) {
    let {
      checked
    } = this.data
    if (e.currentTarget.dataset.type == 0) {
      checked = true
    } else {
      checked = false
    }
    this.setData({
      checked: checked
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
    this.ecComponent = this.selectComponent('#mychart-dom-lines');
    this.init()
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