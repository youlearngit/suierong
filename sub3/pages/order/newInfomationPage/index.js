// pages/carLoans/order/InformationPage/index.js

import requestYT from "../../../../api/requestYT";
import user from "../../../../utils/user";
import api from '../../../../utils/api';
const citys = require("../../../../pages/public/city");
const util = require('../../../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        preffixUrl: "",
        userId: "",
        workAddress: '', //单位地址转换
        regAddress: '', //户籍地址
        liveAddress: '', //住所地址转换
        conmitDate: '',
        declareData: [],
        carList: [],
        homeList: [],
        findList: [],
        params: {},
        comfirmedStatus: '',
        loanType: '',
        //担保方式类型
        guarWayList: [{
                label: '1',
                value: '质押'
            },
            {
                label: '2',
                value: '抵押'
            },
            {
                label: '3',
                value: '保证'
            },
            {
                label: '4',
                value: '信用'
            },
        ],
        //贷款用途类型
        loanUsingList: [{
                label: '01',
                value: '购买住房'
            },
            {
                label: '02',
                value: '购买商铺'
            },
            {
                label: '03',
                value: '住房装修'
            },
            {
                label: '04',
                value: '购买耐用消费品'
            },
            {
                label: '05',
                value: '生产经营周转'
            },
            {
                label: '06',
                value: '购买汽车'
            },
            {
                label: '07',
                value: '旅游消费'
            },
            {
                label: '08',
                value: '教育培训'
            },
            {
                label: '09',
                value: '购买设备和工程机械'
            },
            {
                label: '10',
                value: '资金周转'
            },
            {
                label: '90',
                value: '用于支付购车过程中产生的物理附属设备、装饰、保养等相关合法款项'
            },
        ],
        floatOptList: [{
                label: '1',
                value: '百分点浮动'
            },
            {
                label: '2',
                value: '百分比浮动'
            },
        ],
        rateChangeTypeList: [{
                label: '0',
                value: '立即调整'
            },
            {
                label: '1',
                value: '下月调整'
            },
            {
                label: '2',
                value: '下年初调整'
            },
            {
                label: '3',
                value: '下季调整'
            },
            {
                label: '4',
                value: '固定不变'
            },
            {
                label: '5',
                value: '对年调整'
            },
        ],
        repayWayList: [{
                label: '01',
                value: '等额本息还款法'
            },
            {
                label: '02',
                value: '等额本金还款法'
            },
            {
                label: '03',
                value: '利随本清一次性还款法'
            },
            {
                label: '10',
                value: '按季结息、到期一次性还本法'
            },
            {
                label: '11',
                value: '按月结息、到期一次性还本法'
            },
            {
                label: '99',
                value: '自定义还款法'
            },
        ],
        // 婚姻状态
        marList: [{
                code: '10',
                name: '未婚'
            },
            {
                code: '20',
                name: '已婚'
            },
            {
                code: '30',
                name: '丧偶'
            },
            {
                code: '40',
                name: '离婚'
            },
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
        //借款人关系
        borrowerRelationshipList: [{
                code: '1',
                name: '配偶'
            },
            {
                code: '2',
                name: '父母'
            },
            {
                code: '3',
                name: '子女'
            },
            {
                code: '4',
                name: '兄弟姐妹'
            },
            {
                code: '7',
                name: '同事'
            },
            {
                code: '9',
                name: '朋友'
            },
        ],
        //居住状态
        addressStatusList: [{
                code: "1",
                name: '自置'
            },
            {
                code: "2",
                name: '按揭'
            },
            {
                code: "3",
                name: '亲属楼宇'
            },
            {
                code: "4",
                name: '集体宿舍'
            },
            {
                code: "5",
                name: '租住房'
            },
            {
                code: "6",
                name: '共有住宅'
            },
            {
                code: "7",
                name: '其他'
            }, {
                code: "8",
                name: '未知'
            },
        ],
        //身份证类型
        certTypeList: [{
            code: "0",
            name: '身份证'
        }, ],
        rvehiclePowerList: [{
                label: '0',
                value: '燃油'
            },
            {
                label: '1',
                value: '混合动力'
            },
            {
                label: '2',
                value: '纯电动（暂不展示）'
            },
        ],
        //国籍
        nationalityList: [{
                code: 'CHN',
                name: '中国'
            }, {
                code: 'TWN',
                name: '中国台湾'
            }, {
                code: 'HKG',
                name: '中国香港'
            },
            {
                code: 'MAC',
                name: '中国澳门'
            }, {
                code: 'IND',
                name: '印度'
            }, {
                code: 'CAN',
                name: '加拿大'
            }, {
                code: 'USA',
                name: '美国'
            },
        ]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let params = JSON.parse(options.params);
        let conmitDate = util.formatTime2(new Date());
        console.log(24, params);
        let {
            applyDate,
            prdName,
            applyAmt,
            applyTerm,
            loanUsing,
            provideGuarWay,
            repayWay,
            floatOpt,
            rateChangeType,
            sedPrdName,
            cusSedApplyAmt,
            cusSedApplyTerm,
            sedLoanUsing,
            sedRepayWay,
            cusName,
            certType,
            certCode,
            mobilePhone,
            liveStatus,
            occupation,
            yearIncome,
            workUnitName,
            regAddrStreet,
            workAddrStreet,
            liveAddrStreet,
            emergencyContact,
            emergencyContactnumber,
            borrowerRelationship,
            vehicleBrand,
            carDealerName,
            vehicleModel,
            vehicleLicensedCity,
            vehicleFrameNum,
            engineNumeber,
            comfirmedStatus,
            countryCode,
            marStatus,
            prdCode,
            housePurchaseInfo,
            paymentPer,
            contactPersonList,
        } = params;
        let {
            guarWayList,
            loanUsingList,
            floatOptList,
            rateChangeTypeList,
            repayWayList,
            marList,
            addressStatusList,
            professionList,
            borrowerRelationshipList,
            certTypeList,
            nationalityList,
        } = that.data;
        vehicleLicensedCity = vehicleLicensedCity.substr(0, 4);
        let listData = [{
                "id": '11',
                "title": "个人二手汽车消费贷款",
                "arr": [{
                        "id": '1',
                        "title": '申请日期',
                        "content": applyDate,
                    },
                    {
                        "id": '2',
                        "title": '申请产品',
                        "content": prdName,
                    },
                    {
                        "id": '3',
                        "title": '申请车贷金额',
                        "content": that.converAmount(applyAmt),
                    },
                    {
                        "id": '4',
                        "title": '申请车贷期限',
                        "content": applyTerm ? applyTerm + '月' : '',
                    },
                    {
                        "id": '5',
                        "title": '贷款用途',
                        "content": that.findElement(loanUsing, loanUsingList),
                    },
                    {
                        "id": '6',
                        "title": '担保方式',
                        "content": that.findElement(provideGuarWay, guarWayList),
                    },
                    {
                        "id": '7',
                        "title": '还款方式',
                        "content": that.findElement(repayWay, repayWayList),
                    },
                    {
                        "id": '8',
                        "title": '利率浮动方式',
                        "content": floatOpt,
                    },
                    {
                        "id": '9',
                        "title": '利率调整方式',
                        "content": rateChangeType,
                    },

                ]
            },
            {
                "id": '12',
                "title": "消费随e贷",
                "arr": [{
                        "id": '1',
                        "title": '申请产品',
                        "content": sedPrdName,
                    }, {
                        "id": '2',
                        "title": '申请随e贷金额',
                        "content": that.converAmount(cusSedApplyAmt),
                    },
                    {
                        "id": '3',
                        "title": '申请随e贷期限',
                        "content": cusSedApplyTerm ? cusSedApplyTerm + '月' : '',
                    },
                    {
                        "id": '4',
                        "title": '贷款用途',
                        "content": that.findElement(sedLoanUsing, loanUsingList),
                    },
                    {
                        "id": '5',
                        "title": '担保方式',
                        "content": that.findElement(provideGuarWay, guarWayList),
                    },
                    {
                        "id": '6',
                        "title": '还款方式',
                        "content": that.findElement(sedRepayWay, repayWayList),
                    },
                    {
                        "id": '7',
                        "title": '利率浮动方式',
                        "content": floatOpt,
                    },
                    {
                        "id": '8',
                        "title": '利率调整方式',
                        "content": rateChangeType,
                    }
                ]
            }
        ];
        let listData1 = [{
                "title": "姓名",
                "content": cusName,
            },
            {
                "title": "国籍",
                "content": that.findElement(countryCode, nationalityList),
            },
            {
                "title": "身份证证件类型",
                "content": that.findElement(certType, certTypeList),
            },
            {
                "title": "证件号码",
                "content": certCode,
            },
            {
                "title": "手机号码",
                "content": mobilePhone,
            }, {
                "title": "居住状况",
                "content": that.findElement(liveStatus, addressStatusList),
            }, {
                "title": "职业",
                "content": that.findElement(occupation, professionList),
            },
            {
                "title": "月收入",
                "content": that.converAmount(yearIncome),
            },
            {
                "title": "工作单位",
                "content": workUnitName,
                "type": 1,
            },
            {
                "title": "单位地址",
                "content": workAddrStreet,
                "type": 1,
            },
            {
                "title": "户籍地址",
                "content": regAddrStreet,
                "type": 1,
            },
            {
                "title": "住所地址",
                "content": liveAddrStreet,
                "type": 1,
            },
            {
                "title": "紧急联系人姓名",
                "content": emergencyContact,
                "type": 2,
                "border1": 1,
            },
            {
                "title": "紧急联系人电话",
                "content": emergencyContactnumber,
                "type": 2,
            },
            {
                "title": "与借款人关系",
                "content": that.findElement(borrowerRelationship, borrowerRelationshipList),
                type: 2,
                border2: 1,
            },

        ];
        let listData2 = [{
                "title": "汽车经销商名称",
                "content": carDealerName,
            },
            {
                "title": "车辆品牌",
                "content": vehicleBrand,
            },
            {
                "title": "车辆型号",
                "content": vehicleModel,
            },
            {
                "title": "上牌城市",
                "content": vehicleLicensedCity ? citys.citys.find(k => k.regid === vehicleLicensedCity).regname : '',
                "type": 2,
                "border1": 1,
            },
            {
                "title": "车架号",
                "content": vehicleFrameNum,
                "type": 2,
            },
            {
                "title": "发动机号",
                "content": engineNumeber,
                "type": 2,
                "border2": 1,
            },
        ];
        let carList = [{
                "name": '贷款申请信息',
                "list": listData,
            },
            {
                "name": '借款人基本信息',
                "list": [{
                    "id": '111',
                    "title": '',
                    "arr": listData1
                }],
            },
            {
                "name": '购买车辆信息',
                "list": [{
                    "id": '222',
                    "title": '',
                    "arr": listData2
                }],
            },
        ];
        let homeList = [{
                "name": '贷款申请信息',
                "list": [{
                    "id": '123',
                    "title": '',
                    "arr": [{
                            "title": "申请日期",
                            "content": applyDate,
                        },
                        {
                            "title": "申请产品",
                            "content": prdName,
                        },
                        {
                            "title": "申请金额",
                            "content": that.converAmount(applyAmt),
                        },
                        {
                            "title": "申请期限",
                            "content": applyTerm ? applyTerm + '月' : '',
                        },
                        {
                            "title": "贷款用途",
                            "content": that.findElement(loanUsing, loanUsingList),
                        },
                        {
                            "title": "担保方式",
                            "content": that.findElement(provideGuarWay, guarWayList),
                        },
                        {
                            "title": "还款方式",
                            "content": that.findElement(repayWay, repayWayList),
                        },
                        {
                            "title": "利率浮动方式",
                            "content": floatOpt,
                        },
                        {
                            "title": "利率调整方式",
                            "content": rateChangeType,
                        },
                    ]
                }],
            },
            {
                "name": '借款人基本信息',
                "list": [{
                    "id": '201',
                    "title": '',
                    "arr": [{
                            "title": "姓名",
                            "content": cusName,
                        },
                        {
                            "title": "国籍",
                            "content": that.findElement(countryCode, nationalityList),
                        },
                        {
                            "title": "身份证件类型",
                            "content": that.findElement(certType, certTypeList),
                        },
                        {
                            "title": "证件号码",
                            "content": certCode,
                        },
                        {
                            "title": "手机号码",
                            "content": mobilePhone,
                        },
                        {
                            "title": "婚姻状况",
                            "content": that.findElement(marStatus, marList),
                        },
                        {
                            "title": "居住状况",
                            "content": that.findElement(liveStatus, addressStatusList),
                        },
                        {
                            "title": "职业",
                            "content": that.findElement(occupation, professionList),
                        },
                        {
                            "title": "月收入",
                            "content": that.converAmount(yearIncome),
                        },
                        {
                            "title": "工作单位",
                            "content": workUnitName,
                            "type": 1,
                        },
                        {
                            "title": "单位地址",
                            "content": workAddrStreet,
                            "type": 1,
                        },
                        {
                            "title": "户籍地址",
                            "content": regAddrStreet,
                            "type": 1,
                        },
                        {
                            "title": "住所地址",
                            "content": liveAddrStreet,
                            "type": 1,
                        },
                        {
                            "title": "紧急联系人姓名",
                            "content": emergencyContact,
                            "type": 2,
                            "border1": 1,
                        },
                        {
                            "title": "紧急联系人电话",
                            "content": emergencyContactnumber,
                            "type": 2,
                        },
                        {
                            "title": "与借款人关系",
                            "content": that.findElement(borrowerRelationship, borrowerRelationshipList),
                            "type": 2,
                            "border2": 1,
                        },
                    ]
                }],
            },
            {
                "name": '购买房屋信息',
                "list": [{
                    "id": '301',
                    "arr": [{
                            "title": '拟购房产地址',
                            "content": housePurchaseInfo && housePurchaseInfo.hOUSE_ADDR ? housePurchaseInfo.hOUSE_ADDR : '',
                            "type": 1,
                        },
                        {
                            "title": '认定套数',
                            "content": housePurchaseInfo && housePurchaseInfo.affirmHouseLaonNum ? that.affirmHouse(housePurchaseInfo.affirmHouseLaonNum) : '',
                            "type": 2,
                            "border1": 1,
                        },
                        {
                            "title": '贷款成数',
                            "content": that.chengshu(paymentPer),
                            "type": 2,
                        },
                        {
                            "title": '房屋单价',
                            "content": housePurchaseInfo && housePurchaseInfo.houseUnitPrice ? housePurchaseInfo.houseUnitPrice + '元' : '',
                            "type": 2,
                        },
                        {
                            "title": '建筑面积',
                            "content": housePurchaseInfo && housePurchaseInfo.buildArea ? housePurchaseInfo.buildArea + '平米' : '',
                            "type": 2,
                        },
                        {
                            "title": '购房总价',
                            "content": housePurchaseInfo && housePurchaseInfo.fullCost ? that.converAmount(housePurchaseInfo.fullCost) : '',
                            "type": 2,
                        },
                        {
                            "title": '月物业费支出',
                            "content": housePurchaseInfo && housePurchaseInfo.monMagExp ? that.converAmount(housePurchaseInfo.monMagExp) : '',
                            "type": 2,
                            "border2": 1,
                        },
                    ]
                }],
            },
        ];
        let spouseObj = contactPersonList.find(item => item.relRelation === "1");
        if (spouseObj && Object.keys(spouseObj).length) {
            //配偶信息
            let spouseInfo = {
                "id": '202',
                "title": '配偶基本信息',
                "arr": [{
                        "title": "姓名",
                        "content": spouseObj.relCusName,
                    },
                    {
                        "title": "国籍",
                        "content": that.findElement(spouseObj.relCountryCode, nationalityList),
                    },
                    {
                        "title": "身份证件类型",
                        "content": that.findElement(spouseObj.relCertType, certTypeList),
                    },
                    {
                        "title": "证件号码",
                        "content": spouseObj.relCertCode,
                    },
                    {
                        "title": "手机号码",
                        "content": spouseObj.relMobilePhone,
                    },
                    {
                        "title": "职业",
                        "content": that.findElement(spouseObj.relOccupation, professionList),
                    },
                    {
                        "title": "工作单位",
                        "content": spouseObj.relWorkUnitName,
                    },
                    {
                        "title": "月收入",
                        "content": that.converAmount(spouseObj.relyearIncome),
                    },
                    {
                        "title": "单位地址",
                        "content": spouseObj.relWorkAddrStreet,
                    },
                    {
                        "title": "户籍地址",
                        "content": spouseObj.relRegAddrStreet,
                    },
                ]
            };
            homeList[1].list.push(spouseInfo)
        };
        let declareData1 = [{
                "content": "向贵行提供的所有资料和所有提供的信息真实有效，如有虚假，所引起的一切法律后果由本人承担。"
            },
            {
                "content": "本人了解了借款人的权利、责任和义务的前提下，自愿向我行申请个人贷款。"
            },
            {
                "content": "本人知晓申贷资金不得用于购置房产、进入股市、购买理财、基金、保险、国债产品或进行其他股本权益性投资，不得从事非法活动,如发现您在贷后违规用款，贷款资金进入上述领域，本行有权采取提前收回贷款、终止额度或提高利率等措施。"
            },
            {
                "content": "本人知晓按照监管部门规定，所办理本笔贷款如须办理抵押登记，其产生的抵押登记费将由贵行承担。"
            },
            {
                "content": "若贵行在调查、审查、审批或贷后管理过程中，可能须查证本人的家庭信息、家庭房屋居住情况、收入等情况，本人及配偶将根据贵行要求主动或配合前往相关部门或机构查询。"
            },
            {
                "content": "本人承诺不会因与汽车经销商任何利益纠纷或争议拒绝履行向贵行还款的义务。"
            },
            {
                "content": '本人同意接受贵行通过短信、电子邮件、宣传单页、手机银行推送的金融产品营销以及服务信息。'
            },
            {
                "title": "借款申请人姓名",
                "content": cusName,
                "border1": 1,
                "type": 2,
            },
            {
                "title": "借款申请人身份证类型",
                "content": that.findElement(certType, certTypeList),
                "type": 2,
            },
            {
                "title": "借款申请人证件号码",
                "content": certCode,
                "type": 2,
            },
            {
                "title": "借款申请人确认时间",
                "content": conmitDate,
                "border2": 1,
                "type": 2,
            },
        ];
        let declareData2 = [{
                "content": "本人和本人的配偶（如有）向贵行提供的所有资料和所有提供的信息真实有效，如有虚假，所引起的一切法律后果由本人承担。"
            },
            {
                "content": "本人了解了借款人的权利、责任和义务的前提下，自愿向贵行申请个人贷款。"
            },
            {
                "content": "本人知晓按照监管部门规定，所办理本笔贷款如须办理抵押登记，其产生的抵押登记费将由贵行承担，如本人在办理贷款业务过程中，先行垫付抵押登记费，需将发票留存并提交给贵行经办人员报销。"
            },
            {
                "content": "若贵行在调查、审查、审批或贷后管理过程中，可能须查证本人的家庭信息、家庭房屋居住情况、收入等情况，本人及本人的配偶（如有）将根据贵行要求主动或配合前往相关部门或机构查询。"
            }, {
                "content": "已婚者的特别承诺：\n 我国《婚姻法》规定：“夫妻在婚姻关系存续期间所得财产，归夫妻共同所有，双方另有约定的除外”。因此，本人已知晓夫妻双方在婚姻关系存续期间所取得的一切收入及财产，除非本人与本人的配偶另有约定并告知贵行认可外，本人与本人的配偶就本贷款所设定的债务均有义务偿还。"
            }, {
                "content": "本人已知晓本人与本人的配偶均须同意将抵押物（如须抵押适用）给贵行作为贷款的担保并配合贵行就该抵押物的抵押或设定的担保办理相关事宜。如本人不能履行合同，贵行可依法处置抵押物，本人愿意接受强制执行。"
            }, {
                "content": "本人同意接受贵行通过短信、电子邮件、宣传单页、手机银行推送的金融产品营销以及服务信息。"
            }, {
                "content": "本人未使用商业性借款资金、未通过银行消费贷款、信用贷款或通过房地产中介、互联网平台、小贷公司等渠道筹集资金，充当向贵行申请个人住房贷款的首付款。本人保证上述声明真实有效，如贵行经核查诚信保证不实的，同意贵行将上述事项记入征信不良记录。"
            },
            {
                "title": "借款申请人姓名",
                "content": cusName,
                "border1": 1,
                "type": 2,
            },
            {
                "title": "借款申请人身份证类型",
                "content": that.findElement(certType, certTypeList),
                "type": 2,
            },
            {
                "title": "借款申请人证件号码",
                "content": certCode,
                "type": 2,
            },
            {
                "title": "借款申请人确认时间",
                "content": conmitDate,
                "border2": 1,
                "type": 2,
            },
        ];
        let declare_content1 = '本人因在贵行办理个人汽车消费贷款业务及消费随e贷业务（如有），作出如下承诺：';
        let declare_content2 = '本人因在贵行办理个人房屋类贷款业务，作出如下承诺：';
        let findList = [];
        let declareData = [];
        let declare_content = '';
        let loanType = '';
        //910201,200000026439
        if (prdCode === '910201' || prdCode === '200000026439') {
            findList = carList;
            declareData = declareData1;
            declare_content = declare_content1;
            loanType = 1;
        } else {
            findList = homeList;
            declareData = declareData2;
            declare_content = declare_content2;
            loanType = 0;
        }
        that.setData({
            params,
            conmitDate,
            comfirmedStatus,
            findList,
            declareData,
            declare_content,
            loanType,
            preffixUrl: app.globalData.CDNURL,
            userId: wx.getStorageSync('openid'),
        });
    },
    //数字转化为成数
    chengshu(val) {
        if (val) {
            return parseFloat(val) * 100 + '%'
        } else {
            return ''
        }
    },
    //金额每三位添加逗号
    converAmount(value) {
        return this.outputdollars(parseInt(value));
    },
    outputdollars(number) {
        number = String(number);
        if (number.length <= 3)
            return (number == '' ? '0' : number) + '元';
        else {
            var mod = number.length % 3;
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (var i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0))
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                else
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            return (output + '元');
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
    //认定套数转移
    affirmHouse(str){
        if(str){
            if(str == '2'){
                return '三套及以上'
            }else if(str == '1'){
                return '二套'
            }else {
                return '首次/首套'
            }
        }else{
            return ''
        }
    },
    //返回
    exit() {
        wx.navigateBack({
            delta: 1,
        })
    },
    // 人脸识别
    async getBatchId() {
        var that = this;
        try {
            const res = await api.getImageAndBatchId(that.data.params.cusName, that.data.params.certCode);
            that.setData({
                photo: res.image,
                batchId: res.batchID
            })
            await that.uploadPhoto();
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
    uploadPhoto() {
        wx.showLoading({
            title: '请稍候',
            mask: true,
        });
        var that = this;
        let options = {
            url: 'carloan/uploadPicToYxpy.do',
            data: JSON.stringify({
                certCode: that.data.params.certCode,
                batchId: that.data.batchId,
            }),
        };
        requestYT(options).then((res) => {
            if (res.msgCode == '0000') {
                that.nextPage();
            } else {
                wx.hideLoading();
                wx.showToast({
                    title: '影像获取失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        }).catch(err => {
            wx.hideLoading();
            wx.showToast({
                title: '影像获取失败',
                icon: 'none',
                duration: 1000
            })
        })
    },
    //签章调用
    nextPage() {
        let that = this;
        let { loanType } = that.data;
        let type = loanType ? 'b01' : 'c01';
        let options = {
            url: 'carloan/sign.do',
            data: {
                type: type.toLocaleUpperCase(),
                certCode: that.data.params.certCode,
                applyName: that.data.params.cusName,
                serialNo: that.data.params.serno,
                base64: that.data.photo,
            }
        };
        requestYT(options).then((res) => {
            if (res.msgCode === '0000') {
                //签章保存成功,提交补录申请
                this.setData({
                    batchNo: res.batchNo,
                });
                that.saveInfo();
            } else {
                wx.hideLoading();
                wx.showToast({
                    title: '签章失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        }).catch(res => {
            wx.hideLoading();
            wx.showToast({
                title: '签章失败',
                icon: 'none',
                duration: 1000
            })
        });
    },
    //调用补录接口
    saveInfo() {
        var that = this;
        let options = {
            url: 'carloan/signAuthor.do',
            data: {
                updateRole: "2",
                lendCertNo: that.data.params.certCode, //身份证号码
                certType: that.data.params.certType, //身份证类型
                lendName: that.data.params.cusName, //
                operateType: "07",
                serno: that.data.params.serno,
                imageLotNumber: that.data.batchNo,
            }
        };
        requestYT(options).then((res) => {
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
        let { loanType } = this.data;
        let str = '../InformationPage/resultPage?status=' + status + '&type=' + loanType;
        if (status != '1') {
            str = str + '&errorMsg=' + errorMsg
        }
        wx.navigateBack({
            delta: 1,
            success: function(res) {
                wx.navigateTo({
                    url: str,
                })
            }
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})