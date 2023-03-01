var app = getApp();
import utils from './utils';
import rcrz from './rcrz';
import user from '../../../utils/user';

Page({

    /**
     * 页面的初始数据
     */
    data: {
		preffixUrl: utils.preffixUrl(),
        mine: {},

        nowDate: {},

        apply_openid: '', // 发起人的openid，不是待授权的授权人
        isCheck: false,

        edus: { // 筋斗云码值表
            '博士研究生': '01',
            '硕士研究生': '02',
            '研究生班': '02',
            '第二学士学位': '03',
            '第二本科': '03',
            '本科': '03',
            '高升本': '03',
            '专升本': '03',
            '夜大电大函大普通班': '03',
            '第二专科': '04',
            '专科': '04',
            '专科(高职)': '04',
            '大学': '05',
            '其他形式': '05',
        },
        
    },

    handleChange(e) {
        this.setData({
            isCheck: e.detail.value.length == 0 ? false : true
        })
    },

    async submitApply(e) {
        let {
            apply_openid,
			mine,

			// 1.实名认证
			node_auth, // 个人信息
			node_face, // 人脸识别
			node_id_card, // 证件拍照
			// 2.是否本人申请
			node_is_self_flag, // 是否本人申请 1-是 0-否
			node_person_name, // 人才姓名
			node_cert_type, // 证件类型 1-身份证
			node_cert_no, // 证件号码
			node_cust_phone_no, // 联系号码
			node_cust_occ, // 职业码
			node_tal_rel_type, // 与企业关系码
			node_company_name, // 工作单位名称
			node_credit_code, // 统一信用机构代码
			node_cust_cadr, // 工作地区码
			node_cust_cadr_info, // 工作地区
			// 3.是否列入政府人才计划
			node_inc_flag, // 是否列入政府人才计划 1-是 0-否
			// 4.人才计划信息录入
			node_support_level, // 人才等级数 5-无
			node_levelname, // 人才等级名
			node_rate_area, // 人才评定地区码
			node_areaname, // 人才评定地区名
			node_rate_year, // 人才评定年份
			node_plan_name, // 人才计划名称
			// 5.影像资料录入
			node_batchs, // 影像资料集
			node_batchs_id, // 影像资料集BatchId
			// 6.客户授权
			node_empower, // 是否已授权 1-是 0-否

			node_cust_edu, // 学历码
			node_cust_inc, // 年收入(税前 万元)
			node_sto_flag, // 是否在省人才库内 1-是 0-否

			node_step, // 第几步 1~6
			node_steps, // 步骤步数数组
        } = this.data;
        let res;

        wx.showLoading({
            title: '正在提交',
            mask: true,
        });

        let apply_user = await user.getCustomerInfo(apply_openid);
        
        // 是否在省人才库内 （来自某入口带参数 若带参数进入则为1 否则为0）
        node_sto_flag = '0';

        // 学历
        try {
            let { edus } = this.data;
            res = await rcrz.educationSearch({ 
                idcard: node_cert_no, 
                name: node_person_name 
            });
            node_cust_edu = edus[res.cc] || '05';
        } catch (err) {
            node_cust_edu = '05'
        }

        // 年收入
        try {
            res = await rcrz.interactTaxInfo({applyName:node_person_name, applyCard:node_cert_no});
            node_cust_inc = res.j12ysrje || '0'
        } catch (err) {
            node_cust_inc = '0'
        }

        this.setData({ node_sto_flag, node_cust_edu, node_cust_inc })
            //await this.dataSave();

        // 重复提交
        res = await rcrz.queryRencaiMsg({openid:apply_user.OPEN_ID, cert_no:node_cert_no});
        if (res == '0') {
            wx.hideLoading();
            wx.showToast({ title:"已有待认证信息，无需重复提交", icon:"none" });
            return;
        }

        try {
            let rencai = {
                ORDER_NUMBER: '', // 认证订单编号 ''
        
                // 申请人
                OPEN_ID: apply_user.OPEN_ID, // 申请人openid
                APPLY_NAME: apply_user.REAL_NAME, // 申请人名
                APPLY_CERT_NO: apply_user.ID_CARD, // 申请人证件号码
                PHONE_NO: apply_user.TEL, // 申请人联系方式
        
                IS_SELF_FLAG: node_is_self_flag=='1'?'是':'否', // 是否本人申请 '是'/'否'
        
                // 人才
                REQTB2: node_cert_type, // 证件类型 1-身份证 (REQTB2)
                CERT_NO: node_cert_no, // 证件号码
                PERSON_NAME: node_person_name, // 人才姓名
                CUST_PHONE_NO: node_cust_phone_no, // 人才联系号码
                CUST_EDU: node_cust_edu, // 学历码
                CUST_OCC: node_cust_occ, // 职业码
                CUST_CADR: node_cust_cadr, // 工作地区码 统一码.substring(2, 8)
                CUST_INC:JSON.stringify(Number(node_cust_inc)), // 年收入(税前 万元)
                COMPANY_NAME: node_company_name, // 工作单位名称
                CREDIT_CODE: node_credit_code, // 统一信用机构代码
                TAL_REL_TYPE: node_tal_rel_type, // 与企业关系码
        
                // 影像
                NODE_INFO: node_batchs_id, // BatchId 人才身份证件
                NODE_INFO_SP: node_batchs_id, // BatchId 人才资质证明材料
        
                // 人才计划
                STO_FLAG: node_sto_flag, // 是否在省人才库内 1-是 0-否
                INC_FLAG: node_inc_flag, // 是否列入政府人才计划 1-是 0-否
                SUPPORT_LEVEL: node_support_level, // 列入政府人才计划时 人才等级数 否则为'5'
                LEVELNAME: node_levelname, // 列入政府人才计划时 人才等级名称 否则为''
                RATE_AREA: node_rate_area, // 列入政府人才计划时 人才评定地区码 否则为''
                AREANAME: node_areaname, // 列入政府人才计划时 人才评定地区名 否则为''
                PLAN_NAME: node_plan_name, // 列入政府人才计划时 人才计划名称 否则为''
                RATE_YEAR: node_rate_year, // 列入政府人才计划时 人才评定年份 否则为''
        
            }
            if (rencai.INC_FLAG != '1') { // 未列入政府人才计划
                rencai.SUPPORT_LEVEL = '';
                rencai.LEVELNAME = '';
                rencai.RATE_AREA = '';
                rencai.AREANAME = '';
                rencai.PLAN_NAME = '';
                rencai.RATE_YEAR = '';
            }
            await rcrz.addRencai(rencai);

            wx.hideLoading();
            wx.showModal({
                title: '',
                content: '提交成功',
                showCancel: false,
                confirmText: '确定',
                success: (result) => {
                    if (result.confirm) {
                        wx.reLaunch({
                            url: '/pages/shop/index2',
                        })
                    }
                },
            });

        } catch (err) {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: err.message || err,
                showCancel: false,
                confirmText: '确定',
            });
            return;
        }
    },

    async submit(e) {
        let {isCheck} = this.data;
        if (!isCheck) {
            wx.showToast({ title:"请勾选'我已读阅所有授权书'", icon:"none" });
            return;
        }

        let {node_empower} = this.data;
        node_empower = '1';
        this.setData({node_empower});

        await this.submitApply();

    },

	async dataSave(e) {
		let {apply_openid,node_batchs_id} = this.data;
		let nodes_wx = {};
		Object.keys(this.data).forEach((k)=>{
			if (k.substr(0,5) == 'node_') {
				nodes_wx[k] = this.data[k];
			}
		})
		nodes_wx.updated = Date.parse(new Date()) / 1000;
		nodes_wx.node_batchs = []; // 图片太大 获取暂存时 通过batchid重新获取base64
		await rcrz.saveRcrzData({
			openId: apply_openid,
			batchId: node_batchs_id || '',
			requestData: JSON.stringify(nodes_wx),
		})
	},

    async dataInit(options) {
        let { apply_openid } = options;
        //odypO5X5JhDf0Ziilve21QxqaYeQ
        //apply_openid = 'odypO5SET8lZ4260BSs17n-ZtfSY' //test@xwl
        //apply_openid = 'odypO5RRw22bYP4sm9dlLgBFt-X8' //test@刘凯
        //apply_openid = 'odypO5X_165Lsfq0QNQ_ImKOPkiE' //test@syt
        if (!apply_openid) {
            wx.showModal({
                title: '',
                content: '无效的人才认证信息',
                showCancel: false,
                confirmText: '确定',
                success: (result) => {
                    wx.reLaunch({
						url: '/pages/shop/index2',
					})
                },
            });
            return;
        }
        this.setData({apply_openid})

        wx.showLoading({
            mask: true,
        });

        /* 初始化数据 */
        let now_date = new Date()
        let yy = now_date.getFullYear()
        let mm = now_date.getMonth() + 1 < 10 ? '0' + (now_date.getMonth() + 1) : now_date.getMonth() + 1
        let dd = now_date.getDate() < 10 ? ('0' + now_date.getDate()) : now_date.getDate()
        this.setData({
            nowDate: {yy,mm,dd},
            nowDateStr: `${yy}年${mm}月${dd}日`
        })

		let {mine} = this.data;
		mine = await rcrz.getMine();
		this.setData({mine});
        let res;
        
        /* 读取暂存数据 */
        let nodes_save = {};
        res = await rcrz.selectRcrzData({ openId: apply_openid });
        nodes_save = res && res.data && JSON.parse(JSON.parse(res.data));
        console.log('暂存数据', nodes_save);

        // try {
        //     nodes_save = JSON.parse(JSON.parse(res.data));
        //     if (nodes_save.node_batchs_id) {
        //         res = await rcrz.showPic({ openId: apply_openid });
        //         let picList;
        //         picList = res.picList && JSON.parse(res.picList)
        //         nodes_save.node_batchs = picList.map(x => { return { base64: x.replace(/[\r\n]/g, '') } });
        //     }
        // } catch (err) {
        //     nodes_save = {};
        // }

		let nodes_save_filter = {};
		Object.keys(nodes_save).forEach((k)=>{
			if (k.substr(0,5) == 'node_') {
				nodes_save_filter[k] = nodes_save[k];
			}
        })
        
        if (Object.keys(nodes_save_filter).length) {
            let nodes_wx = {};
            Object.keys(this.data).forEach((k)=>{
                if (k.substr(0,5) == 'node_') {
                    nodes_wx[k] = this.data[k];
                }
            })
            Object.assign(nodes_wx,nodes_save_filter);
            this.setData(nodes_wx);
        }

        /* 判断数据和权限 */
        if (Object.keys(nodes_save_filter).length == 0) {
            wx.hideLoading();
            wx.showModal({
                title: '',
                content: '人才认证信息异常',
                showCancel: false,
                confirmText: '确定',
                success: (result) => {
                    wx.reLaunch({
						url: '/pages/shop/index2',
					})
                },
            });
            return;
        }

        let {node_cert_no} = this.data;
        if (mine.ID_CARD != node_cert_no) {
            wx.hideLoading();
            wx.showModal({
                title: '',
                content: '您不是待授权人',
                showCancel: false,
                confirmText: '确定',
                success: (result) => {
                    wx.reLaunch({
						url: '/pages/shop/index2',
					})
                },
            });
            return;
        }

        wx.hideLoading();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.dataInit(options);
        console.log(options);
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