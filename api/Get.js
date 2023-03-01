import requestYT from './requestYT';
export default class Get {
    // 登录接口
    static async Login(mobile, code) {
        let options = {
            url: 'ddt/login.do',
            data: JSON.stringify({
                openId: wx.getStorageSync('openid'),
                phone: mobile,
                smsCode: code
            }),
        };
        console.log(options.data)
        return requestYT(options).then((res) => {
            console.log(res)
            if (res.STATUS === '1') {
                return res;
            } else {
                return Promise.reject(res.msg);
            }
        });
    }

    /**
     * 判断用户是否登录
     * @param {*} p
     */
    static async isLogin() {
        let options = {
            url: 'ddt/judgeLogin.do',
            data: JSON.stringify({
                openId: wx.getStorageSync('openid')
            }),
        };
        const res = await requestYT(options);
        console.log('判断用户是否登录res', res);
        if (res.STATUS === '1') {
            return res;
        } else {
            return Promise.reject(res.MSG);
        }
    }

    /**
     * 退出登录
     * @param {*} p
     */
    static async loginOut() {
        let options = {
            url: 'ddt/logout.do',
            data: JSON.stringify({
                Authorization: wx.getStorageSync('token')
            }),
        };
        console.log(options.data)
        const res = await requestYT(options);
        console.log('退出res', res);
        if (res.STATUS === '1') {
            return res;
        } else {
            return Promise.reject(res.MSG);
        }
    }

    /**
     * 企业信息查询
     * @param {*} p
     */
    static async companyMsgQuery() {
        let options = {
            url: 'ddt/companyMsgQuery.do',
            data: JSON.stringify({
                Authorization: wx.getStorageSync('token')
            }),
        };
        console.log(options.data)
        const res = await requestYT(options);
        console.log('企业信息res', res);
        if (res.STATUS === '1') {
            return res;
        } else {
            return Promise.reject(res.MSG);
        }
    }
    // 获取商户列表
    static async getMerchantList(data) {
        let options = {
            url: 'ddt/getMerchantList.do',
            data: JSON.stringify(data),
        };
        const res = await requestYT(options);
        console.log(res)
        if (res.STATUS === '1' && res.code === '200') {
            return res;
        } else {
            return Promise.reject(res);
        }
    }
    /**
     * 新增商户
     * @param {*} p
     */
    static async newMerchant(data) {
        let options = {
            url: 'ddt/newMerchant.do',
            data: JSON.stringify(data),
        };
        console.log(options.data)
        const res = await requestYT(options);
        console.log('新增商户', res);
        if (res.STATUS === '1' && res.code === '200') {
            return res;
        } else {
            return Promise.reject(res.msg);
        }
    }
    //更新商户
    static async updateMerchant(data) {
        let options = {
            url: 'ddt/updateMerchant.do',
            data: JSON.stringify(data),
        };
        console.log(options.data)
        const res = await requestYT(options);
        console.log('更新商户', res);
        if (res.STATUS === '1' && res.code === '200') {
            return res;
        } else {
            return Promise.reject(res.msg);
        }
    }
    // 删除商户列表
    static async deleteMerchant(data) {
        let options = {
            url: 'ddt/deleteMerchant.do',
            data: JSON.stringify(data)
        };
        const res = await requestYT(options);
        console.log(res)
        if (res.STATUS === '1' && res.code === '200') {
            return res.data;
        } else {
            return Promise.reject(res.msg);
        }
    }
    //获取用户信息
    static async getCustomerInfo() {
        let options = {
            url: 'customer/getcustomer.do',
            data: JSON.stringify({
                openId: wx.getStorageSync('openid')
            }),
        };
        const res = await requestYT(options);
        console.log(res)
        if (res.STATUS === '1' && res.resultVo.code === 1) {
            return res.resultVo.data[0];
        } else {
            return Promise.reject('unCustomerInfo');
        }
    }

    /**
     * 订单信息查询
     * @param {*} 
     */
    static async orderMsgQuery(data) {
        let options = {
            url: 'ddt/orderMsgQuery.do',
            data: JSON.stringify(data),
        };
        console.log(options.data)
        const res = await requestYT(options);
        console.log('订单列表查询', res)
        if (res.code === '200' && res.STATUS == '1') {
            return res;
        } else {
            return Promise.reject(res);
        }
    }

    /**
     * 新增订单
     * @param {*} 
     */
    static async newOrder(data) {
        let options = {
            url: 'ddt/newOrder.do',
            data: JSON.stringify(data),
        };
        console.log(options.data)
        const res = await requestYT(options);
        console.log('新增订单', res)
        if (res.code === '200' && res.STATUS == '1') {
            return res;
        } else {
            return Promise.reject(res.msg);
        }
    }

    /**
     * 更新订单
     * @param {*}
     */
    static async updateOrder(data) {
        let options = {
            url: 'ddt/updateOrder.do',
            data: JSON.stringify(data),
        };
        console.log(options.data)
        const res = await requestYT(options);
        console.log('更新订单', res)
        if (res.code === '200' && res.STATUS == '1') {
            return res;
        } else {
            return Promise.reject(res.msg);
        }
    }

    /**
     * 删除订单
     * @param {*} 
     */
    static async deleteOrder(data) {
        let options = {
            url: 'ddt/deleteOrder.do',
            data: JSON.stringify(data),
        };
        console.log(options.data)
        const res = await requestYT(options);
        console.log('删除订单', res)
        if (res.code === '200' && res.STATUS == '1') {
            return res;
        } else {
            return Promise.reject(res.msg);
        }
    }
}