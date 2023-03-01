// component/selectProfession/index1.js
Component({
  /** 
  * 组件的属性列表
  */
   properties: {
    showFlag:{
      type: Boolean
    },  
   },

    /**
     * 页面的初始数据
     */
    data: {
        array1: [ //常用职业
            {
                code: '106',
                name: '企事业单位负责人'
            },
            {
                code: '201',
                name: '科学研究人员'
            },
            {
                code: '206',
                name: '经济和金融专业人员'
            },
            {
                code: '210',
                name: '新闻出版、文化专业人员'
            },
            {
                code: '301',
                name: '办事人员'
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
                code: '501',
                name: '农业生产人员'
            },
            {
                code: '700',
                name: '军人'
            },
            {
                code: '805',
                name: '学生'
            },
            {
                code: '000',
                name: '选择更多'
            },
        ],
        array2: [{
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
        selectShow: false, //初始option不显示
        selectText: "请选择", //初始内容
        propArray: [ //常用职业
            {
                code: '106',
                name: '企事业单位负责人'
            },
            {
                code: '201',
                name: '科学研究人员'
            },
            {
                code: '206',
                name: '经济和金融专业人员'
            },
            {
                code: '210',
                name: '新闻出版、文化专业人员'
            },
            {
                code: '301',
                name: '办事人员'
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
                code: '501',
                name: '农业生产人员'
            },
            {
                code: '700',
                name: '军人'
            },
            {
                code: '805',
                name: '学生'
            },
            {
                code: '000',
                name: '选择更多'
            },
        ],
    },
    onLoad: function(options) {},
    methods: {
        //option的显示与否
        select: function(e) {
            var code = e.target.dataset.dataset.code;
            if (code == '000') {
                this.setData({
                    propArray: this.data.array2
                });
            } else {
                this.triggerEvent('success', e.target.dataset.dataset);
                this.cancel();
            }
        },
        cancel: function(e) {
            this.setData({
                propArray: this.data.array1,
                showFlag: false,
            });
        }
    }

});