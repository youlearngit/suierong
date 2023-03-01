import * as echarts from '../../components/ec-canvas/echarts';
import Get from '../../../api/Get';
const app = getApp();

function setOption(chart, piedata, datas) {
    var a = 0;
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            x: '65%',
            y: '16%',
            itemWidth: 10, // 设置图例图形的宽
            itemHeight: 10, // 设置图例图形的高
            itemGap: 50, //间距
            formatter: function (name) {
                let target;
                for (let i = 0; i < piedata.length; i++) {
                    if (piedata[i].name === name) {
                        target = piedata[i].value
                    }
                }
                let arr = [name + ' ', " " + target]
                return arr.join(" ")
            },
        },
        color: ['#4ae2ef', '#7384ff', '#6db8ff'],
        graphic: {
            type: 'text',
            // left: 'center',
            left: '23%',
            top: '42%',
            style: {
                text: '订单状态统计' +
                    '\n\n' +
                    String(
                        datas.map((item) => {
                            item.forEach((e) => {
                                a += parseInt(e.value);
                            });
                            return a;
                        })
                    ),
                textAlign: 'center',
                fill: ' #7881A8',
                width: 100,
                height: 30,
                fontSize: 12
            }
        },
        series: [{
            name: '',
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['32%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 0,
                borderColor: '#f6f7f9',
                borderWidth: 4
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                name: '11',
                label: {
                    show: false,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: piedata
        }]
    };

    chart.setOption(option);
    return chart;
}
Page({
    data: {
        preffixUrl: getApp().globalData.CDNURL,
        result: {
            merchantNumber: '', //商户数
            receivedNumber: '', //已收订单
            unreceivedNumber: '', //未收订单
            debtNumber: '', //欠款订单
            name: '',
            activeBarIndex: 1
        },
        ec: {
            // onInit: initChart,
            lazyLoad: true
        }
    },
    initpie: function (piedata, datas) {
        let ecComponent = this.selectComponent('#mychart-dom-pie');
        ecComponent.init((canvas, width, height, dpr) => {
            // 在这里初始化图表
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height,
                devicePixelRatio: dpr // new
            });
            setOption(chart, piedata, datas);
            return chart;
        });
    },
    onShow() {
        app.editTabBar1();    //显示自定义的底部导航
        console.log(app.globalData.userInfo)
        if (app.globalData.userInfo != null) {
            this.setData({
                userInfo: app.globalData.userInfo
            })
        }
        this.setData({
            name: app.globalData.NICK_NAME
        })
        let that = this;
        Get.companyMsgQuery().then(res => {
            if (res.code == '500' && res.msg == "无效的token") {
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
                                icon: 'none',
                                duration: 2000
                            })
                            setTimeout(() => {
                                wx.navigateTo({
                                    url: '../login/login',
                                })
                            }, 2000)
                        }
                    }
                });
            }
            that.setData({
                result: res
            })
            var p1 = {
                name: '已收订单'
            }
            var p2 = {
                name: '未收订单'
            }
            var p3 = {
                name: '欠款订单'
            }
            var piedata = [];
            p1.value = res.receivedNumber;
            p2.value = res.unreceivedNumber;
            p3.value = res.debtNumber;
            piedata.push(p1, p2, p3)
            var datas = [];
            datas.push(piedata);
            that.initpie(piedata, datas);
        })
    },
})
