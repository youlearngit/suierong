import api from '../../../utils/api';
import myCanvas from '../../../utils/canvas';
import requestP from '../../../utils/requsetP';
import skip from '../../../utils/skip';
import user from '../../../utils/user';
import emp from '../../../utils/Emp';
import Config from '../../../api/Config';
import Chat from '../../../api/Chat';
var encr = require('../../../utils/encrypt/encrypt');
var myPerformance = require('../../../utils/performance.js');
var aeskey = encr.key; //随机数
var app = getApp();
Page({
  data: {
    maskHidden: true, //控制遮罩层
    hidePoster: true, //隐藏海报
    cardInfo: {}, //员工名片信息
    empPhotoHeight: 1, //
    defaultAvatar: '',
    topNum: '0',
    intId: '', //推荐人int_it
    empNo: '', //推荐人员工号
    ifSelf: false, //是否是本人
    posterBoxHeight: '',
    posterBoxWidth: '',
    unit: 0,
    imagePath: '', //海报路径
    cndUrl: app.globalData.CDNURL,
    posterImgs: [],
    posterIdselected: -1,
    showPosterBox: false,
    img1: '',
    img2: '',
    img3: '',
    img4: '',
    img5: '',
    img6: '',

    block1: { name: '贷款融资', detail: [] },
    block2: { name: '', detail: [] },
    block3: { name: '', detail: [] },
    block4: { name: '', detail: [] },
    block5: { name: '', detail: [] },
    block6: { name: '', detail: [] },
    block7: { name: '', detail: [] },
    block8: { name: '', detail: [] },
    block9: { name: '', detail: [] }, //我增加了三个
    editingBlock: { name: '', detail: [] },
    blockNum: 0,
    zh_products: [//综合服务
      {
        name: '网点查询',
        code: 'CP001',
      },
      {
        name: '房产评估',
        code: 'AP001',
      },
      {
        name: '企业手机银行',
        code: 'BP002',
      },
      {
        name: '企业网银',
        code: 'BP001',
      },
      {
        name: '对公账户查询',
        code: 'CP002',
      },
      {
        name: '创业家卡',
        code: 'GP001',
      },
      {
        name: '开户资料查询',
        code: 'CP003',
      },
    ],
    edit: false,
    showEditBox: false,

    loginFlag: true,
    tpyeArray: [
      '热门推荐', //m
      '贷款融资', //m
      '资金结算', //o
      "国际结算", //s
      "贸易融资", //z
      "资金交易", //y
      // "综合服务", //p
      '个人金融', //r
    ],
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    products: [], //所有产

    productAll: [],
    showProducts: false, //先加载 在展示
    showChatComponent: false,
    // 产品底图
    img1: [
      app.globalData.URL + '/static/wechat/img/sui/sui_337.png',
      app.globalData.URL + '/static/wechat/img/sui/sui_338.png',
      app.globalData.URL + '/static/wechat/img/sui/sui_339.png',
      app.globalData.URL + '/static/wechat/img/sui/sui_340.png',
    ],
    currentPage: '',
    currentEditBlockIndex: 0,
    shareCount: 0, //营销数量
    serviceCount: 0, //服务数量
  },

  onLoad(e) {
    //console.log("传递的值", e);
    this.setData({
      currentPage: getCurrentPages().length,
      preffixUrl: app.globalData.URL,
    });

    api.getLocation().then(() => {
      this.setData({
        showChatComponent: app.globalData.showChatComponent,
      });
    });
    myPerformance.reportBegin(2017, 'sub1_shop_index');
    // 二维码进入
    if (e.scene) {
      var scene = decodeURIComponent(e.scene).split('a');
      this.setData({
        intId: scene[0],
        empNo: scene[2],
      });
    }

    //分享链接进入
    if (typeof e.intId != 'undefined') {
      this.setData({
        intId: e.intId,
      });
    }

    // 除了扫二维码进入都会带empno
    if (e.empNo) {
      this.setData({
        empNo: e.empNo,
      });
    }
    myPerformance.reportEnd(2017, 'sub1_shop_index');
    if (this.data.empNo) {
      this.getEmpInfo(this.data.empNo);
    }

    api.getSystemInfo2(750, 1334, 1.3).then(res => {
      this.setData({
        posterBoxHeight: res.posterBoxHeight,
        posterBoxWidth: res.posterBoxWidth,
        unit: res.unit,
        screenWidth: res.systemInfo.screenWidth,
      });
    });

    // 加载产品列表
    this.initOnloadData();

    Config.getFundConfig()
      .then(fundConfig => {
        this.setData({
          fundConfig,
        });
      })
      .catch(err => {});
  },

  initOnloadData() {
    var that = this;
    // 加载产品配置
    let getConfig = that.getConfigInfo(that.data.empNo);
    let getProducts = that.getProductInfo();
    Promise.all([getConfig, getProducts])
      .then(() => {
        let { block1, block2, block3, block4, block5, block6, block7, productAll } = that.data;
        // 未配置过，初始化配置
        if (block1.detail.length === 0) {
          block1.name = '热门推荐';
          block2.name = '国际结算';
          block3.name = '贸易融资';
          block4.name = '资金交易';
          block5.name = '贷款融资';
          block6.name = '公司业务';//这个不属于热门推荐这一栏
          block7.name = '资金结算';

          let blcok1Code = ['AM001', 'FM001'];
          let blcok5Code = ['AM003', 'AM008'];
          let blcok6Code = ['BO005', 'BM010', 'BO002', 'BO003'];
          let blcok7Code = ['CO001', 'DO001', 'EO001'];
          for (let i = 0; i < productAll.length; i++) {
            if (blcok1Code.indexOf(productAll[i].CODE) > -1) {
              block1.detail.push({
                summary: productAll[i].SUMMARY,
                code: productAll[i].CODE,
                name: productAll[i].NAME,
              });
            }
            if (blcok5Code.indexOf(productAll[i].CODE) > -1) {
              block5.detail.push({
                summary: productAll[i].SUMMARY,
                code: productAll[i].CODE,
                name: productAll[i].NAME,
              });
            }
            if (blcok6Code.indexOf(productAll[i].CODE) > -1) {
              block6.detail.push({
                summary: productAll[i].SUMMARY,
                code: productAll[i].CODE,
                name: productAll[i].NAME,
              });
            }
            if (blcok7Code.indexOf(productAll[i].CODE) > -1) {
              block7.detail.push({
                summary: productAll[i].SUMMARY,
                code: productAll[i].CODE,
                name: productAll[i].NAME,
              });
            }
            that.setData({
              block1,
              block2,
              block3,
              block4,
              block5,
              block6,
              block7,
            });
          }
          return that.submitProductConfig({ action: 'init' });
        }
      })
      .catch(err => {
        //console.log("初始化配置错误", err);
      });
  },

  inDevelop() {
    wx.showToast({
      title: '敬请期待',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false,
      success: result => {},
      fail: () => {},
      complete: () => {},
    });
  },

  async getMineShareList() {
    var that = this;
    const res = await requestP({
      url: app.globalData.URL + 'getAwardLists1',
      data: {
        openid: that.data.cardInfo.OPEN_ID,
        empNo: that.data.empNo,
        currentPage: '1',
        pageSize: '5',
      },
      header: {
        'content-type': 'application/json',
        key: Date.parse(new Date()).toString().substring(0, 6),
        sessionId: wx.getStorageSync('sessionid'),
        transNo: 'XC022',
      },
    });
    //console.log(res);
    if (res.code == '1') {
      //console.log("count: ", res.count);
      that.setData({
        shareCount: res.count,
      });
    } else {
      //console.log("/getMineShareList not found customerInfo openId:" + wx.getStorageSync("openid"));
      return Promise.reject('noAwardLists1');
    }
  },

  /**
   * 获取员工名片信息
   * @param {*} empNo
   */
  getEmpInfo(empNo) {
    var that = this;
    let promise1 = that.getCardInfo(empNo);
    let promise2 = '';
    if (wx.getStorageSync('openid') === '') {
      promise2 = api.getSessionInfo().then(() => {
        user.getCustomerInfo().then(res => {
          that.setData({
            ifSelf: res.USERID && res.USERID === empNo ? true : false,
          });
        });
      });
    } else {
      promise2 = user.getCustomerInfo().then(res => {
        that.setData({
          ifSelf: res.USERID && res.USERID === empNo ? true : false,
        });
      });
    }

    Promise.all([promise1, promise2])
      .then(() => {
        // that.getMineShareList();
        that.initPosterImgs();
      })
      .catch(err => {});
  },

  /**
   * 获取产品库信息
   */
  getProductInfo() {
    var that = this;
    if (wx.getStorageSync('products') != '') {
      that.setData({
        products: wx.getStorageSync('products'), //按类别分好的产品
        productAll: wx.getStorageSync('productAll'), //所有的产品
        showProducts: true,
      });
      return Promise.resolve();
    }
    return api
      .getProducts()
      .then(res => {
        let productAll = res.sort((a, b) => a.SEQUENCE - b.SEQUENCE);
        let products = [[], [], [], [], [], [], [], []];

        let hotProducts = ['AM001', 'FM001', 'DS002', 'DZ001', 'DY001'];
        for (let i = 0; i < productAll.length; i++) {
          if (productAll[i].SUMMARY != '' && res[i].SUMMARY) {
            productAll[i].SUMMARY = productAll[i].SUMMARY.replace(/_/g, ' ');
          }

          if (hotProducts.indexOf(productAll[i].CODE) > -1) {
            //add top products
            products[0].push(productAll[i]);
          }
          switch (productAll[i].TYPE) {
            case "S":
							products[3].push(productAll[i]);
							break;
						case "Z":
							products[4].push(productAll[i]);
							break;
						case "Y":
							products[5].push(productAll[i]);
							break;
						case "M":
							products[1].push(productAll[i]);
							break;
						case "O":
							products[2].push(productAll[i]);
							break;
            case 'P':
              products[6].push(productAll[i]); //这个不知道有没有问题
              break;
            case 'R':
              products[7].push(productAll[i]);
              break;
            default:
              break;
          }
        }

        that.setData({
          productAll,
          products,
          showProducts: true,
        });
        wx.setStorageSync('products', products);
        wx.setStorageSync('productAll', productAll);
      })
      .catch(err => {
        //console.log(err);
      });
  },
//更改截止于此，下面需继续修改。
  /**
   * 更具员工好获取员工名片信息
   * @param {员工号} empNo
   */
  getCardInfo(empNo) {
    var that = this;

    return emp
      .getCardInfoByEmp(empNo)
      .then(res => {
        let cardInfo = res;
        cardInfo.TAG2 = cardInfo.TAG.split('_');
        cardInfo.TAG3 = cardInfo.TAG.replace(/\_/g, ' ');
        that.setData({
          cardInfo,
        });
        if (cardInfo.PHOTO && cardInfo.TEXT2 && cardInfo.TEXT2 == '1') {
          that.setData({
            posterImgs: [
              {
                img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1060.png',
                title: '经营贷',
                poster: '',
              },
              {
                img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1062.png',
                title: '消费贷',
                poster: '',
              },
              {
                img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1061.png',
                title: '个人名片',
                poster: '',
              },
            ],
          });

          api.downloadFile(cardInfo.PHOTO).then(res => {
            cardInfo.PHOTO2 = res;
            that.setData({
              cardInfo,
            });
            wx.getImageInfo({
              src: cardInfo.PHOTO2,
              success(res) {
                let empPhotoHeight = (res.height / res.width) * 750;
                that.setData({
                  empPhotoHeight,
                });
              },
            });
          });
        } else {
          let avatarName = '';
          if (cardInfo.GENDER == '男') {
            avatarName = 'sui_502.png';
          } else if (cardInfo.GENDER == '女') {
            avatarName = 'sui_503.png';
          } else {
            avatarName = 'sui_501.png';
          }
          cardInfo.PHOTO2 = app.globalData.CDNURL + '/static/wechat/img/sui/' + avatarName;
          that.setData({
            cardInfo,
            posterImgs: [
              {
                img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1064.png',
                title: '经营贷',
                poster: '',
              },
              {
                img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1065.png',
                title: '消费贷',
                poster: '',
              },
              {
                img: app.globalData.CDNURL + '/static/wechat/img/sui/sui-1063.png',
                title: '个人名片',
                poster: '',
              },
            ],
          });
        }
      })
      .catch(err => {
        //console.log("获取名片失败", err);
      });
  },

  /**
   * 更具员工号配置信息
   * @param {员工号} empNo
   */
  getConfigInfo(empNo) {
    var that = this;
    return api.getProductConfig(empNo).then(res => {
      let configInfo = res;
      let blockNum = 0;
      let summary = '';
      let block = '';
      for (let j = 1; j <= 6; j++) {
        block = 'BLOCK' + j;
        if (configInfo[block] === null) {
          break;
        }
        let block2 = configInfo[block];
        for (let i = 0; i < block2.detail.length; i++) {
          summary = block2.detail[i].summary;
          block2.detail[i].summary = summary.indexOf('_') > -1 ? summary.replace('_', ' ') : summary;
        }
        block2.showEditChoice = false;
        that.setData({
          ['block' + j]: block2,
          blockNum: ++blockNum,
        });
      }
    });
  },

  /**
   * 关闭弹出层
   */
  closePopUp() {
    //console.log("111");
    this.setData({
      showPosterBox: false,
      showEditBox: false,
      showPosterBox: false,
    });
  },

  /**
   * 产品跳转
   * @param {*} e
   */
  skip(e) {
    let code = e.currentTarget.dataset.code;
    skip.skipProduct(code);
  },

  contact() {
    var that = this;

    if (that.data.showChatComponent) {
      wx.showLoading({
        title: '正在跳转',
        mask: true,
      });
      let chat = new Chat();
      return chat
        .contact(that.data.empNo)
        .then(() => {
          wx.hideLoading();
        })
        .catch(err => {
          if (err === 'unLogin') {
            that.setData({
              loginFlag: false,
            });
            wx.hideLoading();
          }
        });
    } else {
      wx.showToast({
        title: '敬请期待',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  },

  /**
   * 选择产品类别
   * @param {*} e
   */
  tabSelect(e) {
    var that = this;
    that.setData({
      TabCur: e.currentTarget.dataset.id === 3 ? 4 : e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id === 3 ? 4 : e.currentTarget.dataset.id,
    });
  },

  /**
   * 编写模块名称
   * @param {*} e
   */
  productNameInput(e) {
    this.setData({
      'editingBlock.name': e.detail.value,
    });
  },

  /**
   * 编辑模式切换
   */
  editProduct() {
    this.setData({
      edit: !this.data.edit,
    });
  },

  /**
   * 新增模块
   * @param {} e
   */
  async addBlock() {
    let block = {
      name: '',
      detail: [],
    };
    await this.refreashInfo([]);
    this.setData({
      editingBlock: block,
      showEditBox: true,
      currentEditBlockIndex: this.data.blockNum + 1,
    });
  },

  /**
   * 编辑模块
   * @param {} e
   */
  async editBlock(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let block = that.data['block' + id];
    await that.refreashInfo(block.detail);
    this.setData({
      editingBlock: block,
      showEditBox: true,
      currentEditBlockIndex: parseInt(id),
    });
  },
  /**
   * 上移模块
   * @param {} e
   */
  moveUpBlock(e) {
    let id = e.currentTarget.dataset.id;
    let block = this.data['block' + id];
    this.setData({
      editingBlock: block,
      currentEditBlockIndex: parseInt(id),
    });
    this.submitProductConfig({ action: 'moveUp' });
  },
  /**
   * 下移模块
   * @param {} e
   */
  moveDownBlock(e) {
    let id = e.currentTarget.dataset.id;
    let block = this.data['block' + id];
    this.setData({
      editingBlock: block,
      currentEditBlockIndex: parseInt(id),
    });
    this.submitProductConfig({ action: 'moveDown' });
  },
  /**
   * 删除模块
   * @param {} e
   */
  deleteBlock(e) {
    let id = e.currentTarget.dataset.id;
    let block = this.data['block' + id];
    this.setData({
      editingBlock: block,
      currentEditBlockIndex: parseInt(id),
    });
    this.submitProductConfig({ action: 'delete' });
  },

  /**
   * 模块中添加产品
   * @param {*} e
   */
  addProduct(e) {
    var that = this;
    let index = e.currentTarget.dataset.id;
    let block = that.data.editingBlock;

    let products = that.data.products;
    let productChoosed = block.detail;

    let name = products[that.data.TabCur][index].NAME;
    let isRepeat = p => p.name === name;
    if (productChoosed.findIndex(isRepeat) > -1) {
      products[that.data.TabCur][index].choosed = false;
      let index2 = productChoosed.findIndex(p => p.name === name);
      productChoosed.splice(index2, 1);
      block.detail = productChoosed;
      that.setData({
        editingBlock: block,
        products,
      });
      return;
    }

    if (productChoosed.length === 4) {
      wx.showToast({
        title: '最多添加4个',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return;
    }

    let product = {
      choosed: true,
      code: products[that.data.TabCur][index].CODE,
      summary: products[that.data.TabCur][index].SUMMARY,
      name: products[that.data.TabCur][index].NAME,
    };
    products[that.data.TabCur][index].choosed = true;
    productChoosed.push(product);
    block.detail = productChoosed;
    that.setData({
      editingBlock: block,
      products,
    });
  },
  /**
   * 模块中删除产品
   * @param {*} e
   */
  async deleteProduct(e) {
    var that = this;
    let index = e.currentTarget.dataset.id;
    //console.log(index);
    let block = that.data.editingBlock;
    let productChoosed = block.detail;
    let newProductChoosed = [];
    for (let i = 0; i < productChoosed.length; i++) {
      if (i != index) {
        newProductChoosed.push(productChoosed[i]);
      }
    }
    block.detail = newProductChoosed;
    await that.refreashInfo(newProductChoosed);
    that.setData({
      editingBlock: block,
    });
  },
  /**
   * 刷新产品的选中状态
   * @param {当前模块的所有产品} newProductChoosed
   */
  refreashInfo(newProductChoosed) {
    var that = this;
    let products = that.data.products;
    let productChoosed = newProductChoosed;
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].length; j++) {
        //改列表是否存在
        let index = productChoosed.findIndex(e => e.name === products[i][j].NAME);
        if (index == -1) {
          products[i][j].choosed = false;
        } else {
          products[i][j].choosed = true;
        }
      }
    }
    that.setData({
      products,
    });
  },

  /**
   * 修改配置
   * @param {*} param0
   */
  submitProductConfig({ action = 'edit' }) {
    var that = this;
    //console.log("type", action);
    let type = action;
    let block = that.data.editingBlock;
    if (block.name === '' && type != 'init') {
      wx.showToast({
        title: '请填写模块名称',
        icon: 'none',
      });
      return;
    }
    if (block.detail.length === 0 && type != 'init') {
      wx.showToast({
        title: '请选择产品',
        icon: 'none',
      });
      return;
    }

    block = JSON.stringify(block);
    let blockIndex = that.data.currentEditBlockIndex;
    let blockNum = that.data.blockNum;
    let { block1, block2, block3, block4, block5, block6 } = that.data;
    if (type === 'delete') {
      for (let i = blockIndex; i <= that.data.blockNum; i++) {
        //console.log("i", i);
        if (i === 1) {
          let temp = {};
          temp = block2;
          block1 = temp;
        } else if (i === 2) {
          let temp = {};
          temp = block3;
          block2 = temp;
        } else if (i === 3) {
          let temp = {};
          temp = block4;
          block3 = temp;
        } else if (i === 4) {
          let temp = {};
          temp = block5;
          block4 = temp;
        } else if (i === 5) {
          let temp = {};
          temp = block6;
          block5 = temp;
        } else if (i === 6) {
          block6 = {
            name: '',
            detail: [],
          };
        }
      }
    } else if (type === 'moveDown') {
      //这是最后一个
      if (blockIndex != blockNum) {
        //console.log("开始交换");
        if (blockIndex === 1) {
          let temp = block1;
          block1 = block2;
          block2 = temp;
        } else if (blockIndex === 2) {
          let temp = block2;
          block2 = block3;
          block3 = temp;
        } else if (blockIndex === 3) {
          let temp = block3;
          block3 = block4;
          block4 = temp;
        } else if (blockIndex === 4) {
          let temp = block4;
          block4 = block5;
          block5 = temp;
        } else if (blockIndex === 5) {
          let temp = block5;
          block5 = block6;
          block6 = temp;
        }
      } else {
        wx.showToast({
          title: '这是最后一个模块',
          icon: 'none',
        });
        return;
      }
    } else if (type === 'moveUp') {
      //这是最后一个
      //console.log("开始交换");
      if (blockIndex === 1) {
        wx.showToast({
          title: '这是第一个模块',
          icon: 'none',
        });
        return;
      } else if (blockIndex === 2) {
        let temp = block2;
        block2 = block1;
        block1 = temp;
      } else if (blockIndex === 3) {
        let temp = block3;
        block3 = block2;
        block2 = temp;
      } else if (blockIndex === 4) {
        let temp = block4;
        block4 = block3;
        block3 = temp;
      } else if (blockIndex === 5) {
        let temp = block5;
        block5 = block4;
        block4 = temp;
      } else if (blockIndex === 6) {
        let temp = block6;
        block6 = block5;
        block5 = temp;
      }
    }

    var dataJson = JSON.stringify({
      emp_no: that.data.empNo,
      block1: blockIndex === 1 && type === 'edit' ? block : block1.detail.length != 0 ? JSON.stringify(block1) : '',
      block2: blockIndex === 2 && type === 'edit' ? block : block2.detail.length != 0 ? JSON.stringify(block2) : '',
      block3: blockIndex === 3 && type === 'edit' ? block : block3.detail.length != 0 ? JSON.stringify(block3) : '',
      block4: blockIndex === 4 && type === 'edit' ? block : block4.detail.length != 0 ? JSON.stringify(block4) : '',
      block5: blockIndex === 5 && type === 'edit' ? block : block5.detail.length != 0 ? JSON.stringify(block5) : '',
      block6: blockIndex === 6 && type === 'edit' ? block : block6.detail.length != 0 ? JSON.stringify(block6) : '',
    }); //要加密的参数

    //console.log(dataJson);
    var custname = encr.jiami(dataJson, aeskey); //3段加密
    requestP({
      url: app.globalData.YTURL + 'sui/productConfig.do',
      data: encr.gwRequest(custname),
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值x
      },
    }).then(res => {
      var jsonData = encr.aesDecrypt(res.body, aeskey); //解密返回的报文
      //console.log(jsonData);

      if (jsonData.result_code === '1' || jsonData.result_code === '2') {
        //console.log("type", type);
        if (type === 'delete') {
          for (let i = blockIndex; i <= that.data.blockNum; i++) {
            that.setData({
              ['block' + i]:
                i != that.data.blockNum
                  ? that.data['block' + (i + 1)]
                  : {
                      name: '',
                      detail: [],
                    },
            });
          }
          that.setData({
            blockNum: that.data.blockNum - 1,
          });
        } else if (type === 'moveDown') {
          let temp = that.data['block' + blockIndex];
          that.setData({
            ['block' + blockIndex]: that.data['block' + (blockIndex + 1)],
            ['block' + (blockIndex + 1)]: temp,
          });
        } else if (type === 'moveUp') {
          let temp = that.data['block' + blockIndex];
          that.setData({
            ['block' + blockIndex]: that.data['block' + (blockIndex - 1)],
            ['block' + (blockIndex - 1)]: temp,
          });
        } else if (type === 'init') {
          return;
        } else {
          that.setData({
            ['block' + blockIndex]: JSON.parse(block),
            blockNum: blockIndex,
          });
        }

        wx.showToast({
          title: jsonData.result_msg,
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        that.setData({
          showEditBox: false,
        });
      } else {
        wx.showToast({
          title: jsonData.result_msg,
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
    });
  },

  /**
   * 致电
   */
  openPhoneDialog() {
    var that = this;
    let cardInfo = that.data.cardInfo;
    if (cardInfo.TEXT5 != '0') {
      api.call(cardInfo.PHONE, cardInfo.USERNAME);
    } else {
      wx.showToast({
        title: '敬请期待！',
        icon: 'none',
        mask: true,
        duration: 1000,
      });
    }
  },

  /**
   * 0.预加载海报图片资源
   */
  initPosterImgs() {
    var that = this;
    let cardInfo = that.data.cardInfo;
    let img1 = '';
    let img2 = '';
    let img3 = '';
    let img4 = '';
    let img5 = '';
    let img6 = '';
    let img7 = '';

    if (cardInfo.TEXT2 == 1) {
      let promise3 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: that.data.cndUrl + '/static/wechat/img/sui/sui_6002.png',
          success: function (res) {
            //console.log("promise3");

            img3 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      let promise4 = new Promise(function (resolve, reject) {
        if (that.data.ifSelf) {
          img4 = '/static/wechat/img/sui/sui_6005.png';
        } else {
          img4 = '/static/wechat/img/sui/sui_6004.png';
        }
        wx.getImageInfo({
          src: that.data.cndUrl + img4,
          success: function (res) {
            //console.log("promise4");
            img4 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      let promise5 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: that.data.cndUrl + '/static/wechat/img/sui/sui_6003.png',
          success: function (res) {
            //console.log("promise5");

            img5 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      Promise.all([promise3, promise4, promise5])
        .then(() => {
          that.setData({
            img1,
            img2,
            img3,
            img4,
            img5,
            img6,
          });
          //console.log("初始化图片资源完成");
        })
        .catch(err => {
          //console.log(err);
        });
    } else {
      let avatarName = '';
      if (cardInfo.GENDER == '男') {
        avatarName = 'sui_502.png';
      } else if (cardInfo.GENDER == '女') {
        avatarName = 'sui_503.png';
      } else {
        avatarName = 'sui_501.png';
      }

      let promise1 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: that.data.cndUrl + '/static/wechat/img/sui/' + avatarName,
          success: function (res) {
            img1 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      let promise4 = new Promise(function (resolve, reject) {
        img4 = '/static/wechat/img/sui/sui-1056.png';
        wx.getImageInfo({
          src: that.data.cndUrl + img4,
          success: function (res) {
            img4 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      let promise7 = new Promise(function (resolve, reject) {
        if (that.data.ifSelf) {
          img7 = '/static/wechat/img/sui/sui_6006.png';
        } else {
          img7 = '/static/wechat/img/sui/sui_6007.png';
        }
        wx.getImageInfo({
          src: that.data.cndUrl + img7,
          success: function (res) {
            img7 = res.path;
            resolve(res);
          },
          fail: function (res) {
            reject(res);
          },
        });
      });

      Promise.all([promise1, promise4, promise7])
        .then(() => {
          that.setData({
            img1,
            img2,
            img3,
            img4,
            img5,
            img6,
            img7,
          });
          //console.log("初始化图片资源完成");
        })
        .catch(err => {
          //console.log(err);
        });
    }
  },

  /**
   * 1.弹出海报选择框
   */
  showShare() {
    var that = this;
    that.setData({
      showPosterBox: true,
    });
  },

  /**
   * 2.选择并生成海报
   * @param {*} e
   */
  choosePoster(e) {
    var that = this;
    let index = e.currentTarget.dataset.id;
    that.setData({
      posterIdselected: index,
    });
    let templateType = that.data.cardInfo.TEXT2;
    let posterimg = that.data.posterImgs;
    let poster = posterimg[index].poster;
    if (poster && poster != null && typeof poster != 'undefined') {
      that.setData({
        imagePath: posterimg[index].poster,
      });
    } else {
      that.setData({
        imagePath: '',
      });
      switch (index) {
        case 0:
          templateType == '0' ? that.generateCardPoster41() : that.generateCardPoster31();
          break;
        case 1:
          templateType == '0' ? that.generateCardPoster42() : that.generateCardPoster32();
          break;
        case 2:
          templateType == '0' ? that.generateCardPoster4() : that.generateCardPoster3();
          break;
        default:
          break;
      }
    }
  },

  /**
   * 3.查看海报
   */
  createPoster() {
    var that = this;
    that.closePopUp();
    that.setData({
      shareBox: 'shareBox on',
      hidePoster: false,
    });
  },

  generateCardPoster3() {
    var that = this;
    let cardInfo = that.data.cardInfo;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;
    let unit = that.data.unit;

    let { img1, img2, img3, img4, img5, img6 } = that.data;
    img1 = that.data.cardInfo.PHOTO2;

    let promise2 = api.generateMiniCode('sub1/pages/shop/index', that.data.empNo).then(res => {
      if (res) {
        img2 = res;
        return res;
      } else {
        return Promise.reject();
      }
    });

    let promise6 = new Promise(function (resolve, reject) {
      img6 = '/static/wechat/img/sui/sui-1058.png';

      wx.getImageInfo({
        src: that.data.cndUrl + img6,
        success: function (res) {
          img6 = res.path;
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    Promise.all([promise2, promise6])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');

        myCanvas.roundRectColor(context, '#FFFFFF', 0, 0, width, height, 0);
        context.save();

        context.drawImage(img1, unit * 0, unit * 0, unit * 750, that.data.empPhotoHeight * unit);
        context.save();
        context.drawImage(img4, unit * 0, unit * 518, unit * 750, unit * 816);
        context.save();

        context.drawImage(img5, unit * 30, unit * 20, unit * 181, unit * 45);
        context.save();

        context.drawImage(img3, unit * 29, unit * 932, unit * 690, unit * 360);
        context.save();

        context.drawImage(img2, unit * 442.8, unit * 950, unit * 183, unit * 189);
        context.save();

        context.drawImage(img6, unit * 62, unit * 991, unit * 217, unit * 65);
        context.save();

        myCanvas.roundRectColor(context, '#E7B888', unit * 63, unit * 1183, unit * 8, unit * 22, unit * 4);
        context.save();

        myCanvas.roundRectColor(context, '#E7B888', unit * 405, unit * 1183, unit * 8, unit * 22, unit * 4);
        context.save();

        myCanvas.roundRectColor(context, '#EEEEEE', unit * 375, unit * 1201, unit * 1, unit * 45, '');
        context.save();

        if (cardInfo.USERNAME.length == '2') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 205, unit * 735);
            context.save();
          }
        } else if (cardInfo.USERNAME.length == '3') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 255, unit * 735);
            context.save();
          }
        } else if (cardInfo.USERNAME.length == '4') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 305, unit * 735);
            context.save();
          }
        }

        cardInfo.ORG = cardInfo.ORG.replace('/', '').replace('（普惠金融部）', '').replace('(普惠金融部)', '');
        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFEFF');
        context.fillText(cardInfo.ORG + cardInfo.POSITION, unit * 56, unit * 800);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFFFF');
        context.fillText(cardInfo.PRO_FIELD.substring(0, 20), unit * 56, unit * 860);
        context.save();

        if (cardInfo.PRO_FIELD.length > 20) {
          context.setTextAlign('left');
          context.setFontSize(32 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.PRO_FIELD.substring(20), unit * 56, unit * 900);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('开放式智慧金融服务平台', unit * 60, unit * 1106);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#2F425D');
        context.fillText('经营随e贷', unit * 80, unit * 1203);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#2F425D');
        context.fillText('消费随e贷', unit * 423, unit * 1203);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#2F425D');
        context.fillText('贷款金额最高', unit * 60, unit * 1254);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(40 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('1000', unit * 220, unit * 1254);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 315, unit * 1254);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#2F425D');
        context.fillText('贷款金额最高', unit * 405, unit * 1254);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(40 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('30', unit * 567, unit * 1254);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 620, unit * 1254);
        context.save();

        context.strokeStyle = '#B68D63';
        context.lineWidth = 1 * unit;
        context.strokeRect(638 * unit, 960 * unit, 43 * unit, 167 * unit);

        let shareDesc = ['长', '按', '有', '惊', '喜'];
        for (let i = 0; i < shareDesc.length; i++) {
          context.setFontSize(24 * unit);
          context.setTextAlign('center');

          context.setFillStyle('#EDC59C');

          context.fillText(shareDesc[i], unit * 660, unit * (990 + 30 * i));
          context.save();
        }

        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              quality: 1,
              success: a => {
                //console.timeEnd();
                //console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;
                posterImgs[2].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: err => {
                //console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch(err => {
        //console.log(err);
        wx.hideToast();
      });
  },
  generateCardPoster31() {
    //console.time();
    var that = this;
    let cardInfo = that.data.cardInfo;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;
    let unit = that.data.unit;
    let { img1, img2, img3, img4, img5, img6 } = that.data;
    img1 = that.data.cardInfo.PHOTO2;
    let promise2 = api
      .generateMiniCode('sub1/pages/sui/index', that.data.empNo)
      .then(res => {
        if (res) {
          //console.log("promise2");

          img2 = res;
          return res;
        } else {
          return Promise.reject();
        }
      })
      .catch(err => {
        //console.log(err);
      });

    let promise6 = new Promise(function (resolve, reject) {
      img6 = '/static/wechat/img/sui/sui-1056.png';
      wx.getImageInfo({
        src: that.data.cndUrl + img6,
        success: function (res) {
          //console.log("promise6");

          img6 = res.path;
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    Promise.all([promise2, promise6])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');

        myCanvas.roundRectColor(context, '#FFFFFF', 0, 0, width, height, 0);
        context.save();

        context.drawImage(img1, unit * 0, unit * 0, unit * 750, that.data.empPhotoHeight * unit);
        context.save();
        context.drawImage(img4, unit * 0, unit * 518, unit * 750, unit * 816);
        context.save();

        context.drawImage(img5, unit * 30, unit * 20, unit * 181, unit * 45);
        context.save();

        context.drawImage(img3, unit * 29, unit * 932, unit * 690, unit * 360);
        context.save();

        context.drawImage(img2, unit * 442.8, unit * 950, unit * 183, unit * 189);
        context.save();

        context.drawImage(img6, unit * 62, unit * 983, unit * 281, unit * 52);
        context.save();

        if (cardInfo.USERNAME.length == '2') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 205, unit * 735);
            context.save();
          }
        } else if (cardInfo.USERNAME.length == '3') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 255, unit * 735);
            context.save();
          }
        } else if (cardInfo.USERNAME.length == '4') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 305, unit * 735);
            context.save();
          }
        }

        cardInfo.ORG = cardInfo.ORG.replace('/', '').replace('（普惠金融部）', '').replace('(普惠金融部)', '');
        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFEFF');
        context.fillText(cardInfo.ORG + cardInfo.POSITION, unit * 56, unit * 800);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFFFF');
        context.fillText(cardInfo.PRO_FIELD.substring(0, 20), unit * 56, unit * 860);
        context.save();

        if (cardInfo.PRO_FIELD.length > 20) {
          context.setTextAlign('left');
          context.setFontSize(32 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.PRO_FIELD.substring(20), unit * 56, unit * 900);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('让您的融资不再难', unit * 60, unit * 1082);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('最高可贷', unit * 60, unit * 1137);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(48 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('1000', unit * 183, unit * 1140);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 295, unit * 1137);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('年利率低至4.35%，借款1万元每日还息1.2元', unit * 60, unit * 1187);
        context.save();

        context.strokeStyle = '#B68D63';
        context.lineWidth = 1 * unit;
        context.strokeRect(638 * unit, 960 * unit, 43 * unit, 167 * unit);

        let shareDesc = ['长', '按', '有', '惊', '喜'];
        for (let i = 0; i < shareDesc.length; i++) {
          context.setFontSize(24 * unit);
          context.setTextAlign('center');

          context.setFillStyle('#EDC59C');

          context.fillText(shareDesc[i], unit * 660, unit * (990 + 30 * i));
          context.save();
        }

        let descs = ['线上申请', '秒速审批', '循环额度', '随借随还'];
        for (let i = 0; i < 4; i++) {
          context.setTextAlign('center');
          context.strokeStyle = '#D5A97C';
          context.lineWidth = 1 * unit;
          context.strokeRect((60 + 163 * i) * unit, 1216 * unit, 140 * unit, 46 * unit);
          context.save();
        }
        for (let i = 0; i < descs.length; i++) {
          context.setTextAlign('center');
          context.setFillStyle('#B68D63');
          context.fillText(descs[i], unit * (130 + 163 * i), unit * 1247);
          context.save();
        }

        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              quality: 1,
              success: a => {
                //console.timeEnd();
                //console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;
                posterImgs[0].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: err => {
                //console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch(err => {
        //console.log(err);
        wx.hideToast();
      });
  },
  generateCardPoster32() {
    var that = this;
    let cardInfo = that.data.cardInfo;
    let width = that.data.posterBoxWidth;
    let height = that.data.posterBoxHeight;
    let unit = that.data.unit;
    let { img1, img2, img3, img4, img5, img6 } = that.data;
    img1 = that.data.cardInfo.PHOTO2;

    let promise2 = api.generateMiniCode('sub1/pages/consumer/index', that.data.empNo).then(res => {
      if (res) {
        img2 = res;
        return res;
      } else {
        return Promise.reject();
      }
    });

    let promise6 = new Promise(function (resolve, reject) {
      img6 = '/static/wechat/img/sui/sui-1057.png';
      wx.getImageInfo({
        src: that.data.cndUrl + img6,
        success: function (res) {
          img6 = res.path;
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    Promise.all([promise2, promise6])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');

        myCanvas.roundRectColor(context, '#FFFFFF', 0, 0, width, height, 0);
        context.save();

        context.drawImage(img1, unit * 0, unit * 0, unit * 750, that.data.empPhotoHeight * unit);
        context.save();
        context.drawImage(img4, unit * 0, unit * 518, unit * 750, unit * 816);
        context.save();

        context.drawImage(img5, unit * 30, unit * 20, unit * 181, unit * 45);
        context.save();

        context.drawImage(img3, unit * 29, unit * 932, unit * 690, unit * 360);
        context.save();

        context.drawImage(img2, unit * 442.8, unit * 950, unit * 183, unit * 189);
        context.save();

        context.drawImage(img6, unit * 62, unit * 983, unit * 281, unit * 52);
        context.save();

        if (cardInfo.USERNAME.length == '2') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 205, unit * 735);
            context.save();
          }
        } else if (cardInfo.USERNAME.length == '3') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 255, unit * 735);
            context.save();
          }
        } else if (cardInfo.USERNAME.length == '4') {
          context.setTextAlign('left');
          context.setFontSize(54 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.USERNAME, unit * 56, unit * 727);
          context.save();

          if (cardInfo.TEXT5 != '0') {
            context.setTextAlign('left');
            context.setFontSize(42 * unit);
            context.setFillStyle('#E0B283');
            context.fillText(cardInfo.PHONE, unit * 305, unit * 735);
            context.save();
          }
        }

        cardInfo.ORG = cardInfo.ORG.replace('/', '').replace('（普惠金融部）', '').replace('(普惠金融部)', '');
        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFEFF');
        context.fillText(cardInfo.ORG + cardInfo.POSITION, unit * 56, unit * 800);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#FFFFFF');
        context.fillText(cardInfo.PRO_FIELD.substring(0, 20), unit * 56, unit * 860);
        context.save();

        if (cardInfo.PRO_FIELD.length > 20) {
          context.setTextAlign('left');
          context.setFontSize(32 * unit);
          context.setFillStyle('#FFFFFF');
          context.fillText(cardInfo.PRO_FIELD.substring(20), unit * 56, unit * 900);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('您的专属备用金', unit * 60, unit * 1082);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('最高可贷', unit * 60, unit * 1142);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(48 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('30', unit * 180, unit * 1145);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 245, unit * 1142);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('随你做哪行，e样都能贷', unit * 60, unit * 1192);
        context.save();

        context.strokeStyle = '#B68D63';
        context.lineWidth = 1 * unit;
        context.strokeRect(638 * unit, 960 * unit, 43 * unit, 167 * unit);

        let shareDesc = ['长', '按', '有', '惊', '喜'];
        for (let i = 0; i < shareDesc.length; i++) {
          context.setFontSize(24 * unit);
          context.setTextAlign('center');

          context.setFillStyle('#EDC59C');

          context.fillText(shareDesc[i], unit * 660, unit * (990 + 30 * i));
          context.save();
        }

        let descs = ['线上申请', '秒速审批', '循环额度', '随借随还'];
        for (let i = 0; i < 4; i++) {
          context.setTextAlign('center');
          context.strokeStyle = '#D5A97C';
          context.lineWidth = 1 * unit;
          context.strokeRect((60 + 163 * i) * unit, 1216 * unit, 140 * unit, 46 * unit);
          context.save();
        }
        for (let i = 0; i < descs.length; i++) {
          context.setTextAlign('center');
          context.setFillStyle('#B68D63');
          context.fillText(descs[i], unit * (130 + 163 * i), unit * 1247);
          context.save();
        }

        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              quality: 1,
              success: a => {
                //console.timeEnd();
                //console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;
                posterImgs[1].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: err => {
                //console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch(err => {
        //console.log(err);
        wx.hideToast();
      });
  },

  generateCardPoster4() {
    var that = this;
    let cardInfo = that.data.cardInfo;

    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;

    let { img1, img2, img3, img4, img5, img6, img7 } = that.data;

    let promise4 = new Promise(function (resolve, reject) {
      img4 = '/static/wechat/img/sui/sui-1058.png';
      wx.getImageInfo({
        src: that.data.cndUrl + img4,
        success: function (res) {
          img4 = res.path;
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    let promise3 = api.generateMiniCode('sub1/pages/shop/index', that.data.empNo).then(res => {
      //console.log(app.globalData.int_id + "a" + util.formatTime(new Date()) + "a" + that.data.empNo);
      if (res) {
        img3 = res;
        return res;
      } else {
        return Promise.reject();
      }
    });

    Promise.all([promise3, promise4])
      .then(() => {
        let context = wx.createCanvasContext('mycanvas');
        myCanvas.roundRectColor(context, '#EEEEEE', 0, 0, width, height, 0);

        context.drawImage(img7, unit * 0, unit * 0, width, height);
        context.save();

        if (cardInfo.GENDER == '男' || cardInfo.GENDER == '女') {
          context.drawImage(img1, unit * 510, unit * 110, unit * 115, unit * 195.385);
          context.save();
        } else {
          context.drawImage(img1, unit * 495, unit * 133, unit * 147, unit * 141);
          context.save();
        }

        context.drawImage(img3, unit * 442.8, unit * 966, unit * 183, unit * 189);
        context.save();

        context.drawImage(img4, unit * 40, unit * 991, unit * 217, unit * 65);
        context.save();

        myCanvas.roundRectColor(context, '#E7B888', unit * 43, unit * 1213, unit * 8, unit * 22, unit * 4);
        context.save();

        myCanvas.roundRectColor(context, '#E7B888', unit * 405, unit * 1213, unit * 8, unit * 22, unit * 4);
        context.save();

        myCanvas.roundRectColor(context, '#EEEEEE', unit * 375, unit * 1231, unit * 1, unit * 45, '');
        context.save();

        context.setTextAlign('left');
        context.setFontSize(74 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.USERNAME, unit * 55, unit * 385);
        context.save();

        cardInfo.ORG = cardInfo.ORG.replace('/', '').replace('（普惠金融部）', '').replace('(普惠金融部)', '');
        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.ORG + cardInfo.POSITION, unit * 55, unit * 558);
        context.save();

        if (cardInfo.TEXT5 != '0') {
          context.setTextAlign('left');
          context.setFontSize(36 * unit);
          context.setFillStyle('#30435E');
          context.fillText(cardInfo.PHONE, unit * 55, unit * 492);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(30 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.PRO_FIELD.substring(0, 20), unit * 55, unit * 626);
        context.save();

        if (cardInfo.PRO_FIELD.length > 20) {
          context.setTextAlign('left');
          context.setFontSize(30 * unit);
          context.setFillStyle('#30435E');
          context.fillText(cardInfo.PRO_FIELD.substring(20), unit * 55, unit * 676);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('开放式智慧金融服务平台', unit * 40, unit * 1106);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#2F425D');
        context.fillText('经营随e贷', unit * 60, unit * 1233);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#2F425D');
        context.fillText('消费随e贷', unit * 423, unit * 1233);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#2F425D');
        context.fillText('贷款金额最高', unit * 40, unit * 1284);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(45 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('1000', unit * 200, unit * 1284);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 305, unit * 1284);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#2F425D');
        context.fillText('贷款金额最高', unit * 405, unit * 1284);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(45 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('30', unit * 567, unit * 1284);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(26 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 628, unit * 1284);
        context.save();

        context.strokeStyle = '#B68D63';
        context.lineWidth = 1 * unit;
        context.strokeRect(638 * unit, 982 * unit, 43 * unit, 167 * unit);

        let shareDesc = ['长', '按', '有', '惊', '喜'];
        for (let i = 0; i < shareDesc.length; i++) {
          context.setFontSize(24 * unit);
          context.setTextAlign('center');
          context.setFillStyle('#EDC59C');
          context.fillText(shareDesc[i], unit * 660, unit * (1012 + 30 * i));
          context.save();
        }

        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              quality: 1,
              success: a => {
                //console.timeEnd();
                //console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;
                posterImgs[2].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: err => {
                //console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch(err => {
        wx.hideToast();
        //console.log("生成海报结果", err);
      });
  },

  generateCardPoster41() {
    var that = this;
    let cardInfo = that.data.cardInfo;

    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;

    let { img1, img2, img3, img4, img5, img6, img7 } = that.data;

    let promise3 = api.generateMiniCode('sub1/pages/sui/index', that.data.empNo).then(res => {
      //console.log(app.globalData.int_id + "a" + util.formatTime(new Date()) + "a" + that.data.empNo);
      if (res) {
        img3 = res;
        return res;
      } else {
        return Promise.reject();
      }
    });

    let promise4 = new Promise(function (resolve, reject) {
      img4 = '/static/wechat/img/sui/sui-1056.png';
      wx.getImageInfo({
        src: that.data.cndUrl + img4,
        success: function (res) {
          img4 = res.path;
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    Promise.all([promise3, promise4])
      .then(res => {
        //console.log("img3", img3); //二维码
        let context = wx.createCanvasContext('mycanvas');
        myCanvas.roundRectColor(context, '#EEEEEE', 0, 0, width, height, 0);

        context.drawImage(img7, unit * 0, unit * 0, width, height);
        context.save();

        if (cardInfo.GENDER == '男' || cardInfo.GENDER == '女') {
          context.drawImage(img1, unit * 510, unit * 110, unit * 115, unit * 195.385);
          context.save();
        } else {
          context.drawImage(img1, unit * 495, unit * 133, unit * 147, unit * 141);
          context.save();
        }

        context.drawImage(img3, unit * 442.8, unit * 966, unit * 183, unit * 189);
        context.save();

        context.drawImage(img4, unit * 57, unit * 983, unit * 281, unit * 52);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(74 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.USERNAME, unit * 55, unit * 385);
        context.save();

        cardInfo.ORG = cardInfo.ORG.replace('/', '').replace('（普惠金融部）', '').replace('(普惠金融部)', '');
        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.ORG + cardInfo.POSITION, unit * 55, unit * 558);
        context.save();

        if (cardInfo.TEXT5 != '0') {
          context.setTextAlign('left');
          context.setFontSize(36 * unit);
          context.setFillStyle('#30435E');
          context.fillText(cardInfo.PHONE, unit * 55, unit * 492);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(30 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.PRO_FIELD.substring(0, 20), unit * 55, unit * 626);
        context.save();

        if (cardInfo.PRO_FIELD.length > 20) {
          context.setTextAlign('left');
          context.setFontSize(30 * unit);
          context.setFillStyle('#30435E');
          context.fillText(cardInfo.PRO_FIELD.substring(20), unit * 55, unit * 676);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('让您的融资不再难', unit * 60, unit * 1082);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('最高可贷', unit * 60, unit * 1167);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(48 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('1000', unit * 183, unit * 1170);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 295, unit * 1167);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('年利率低至4.35%，借款1万元每日还息1.2元', unit * 60, unit * 1217);
        context.save();

        context.strokeStyle = '#B68D63';
        context.lineWidth = 1 * unit;
        context.strokeRect(638 * unit, 982 * unit, 43 * unit, 167 * unit);

        let shareDesc = ['长', '按', '有', '惊', '喜'];
        for (let i = 0; i < shareDesc.length; i++) {
          context.setFontSize(24 * unit);
          context.setTextAlign('center');
          context.setFillStyle('#EDC59C');
          context.fillText(shareDesc[i], unit * 660, unit * (1012 + 30 * i));
          context.save();
        }

        let descs = ['线上申请', '秒速审批', '循环额度', '随借随还'];
        for (let i = 0; i < 4; i++) {
          context.setTextAlign('center');
          context.strokeStyle = '#D5A97C';
          context.lineWidth = 1 * unit;
          context.strokeRect((60 + 163 * i) * unit, 1246 * unit, 140 * unit, 46 * unit);
        }
        for (let i = 0; i < descs.length; i++) {
          context.setTextAlign('center');
          context.setFillStyle('#D5A97C');
          context.fillText(descs[i], unit * (130 + 163 * i), unit * 1277);
          context.save();
        }

        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              quality: 1,
              success: a => {
                //console.timeEnd();
                //console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;
                posterImgs[0].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: err => {
                //console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch(err => {
        wx.hideToast();
        //console.log("生成海报结果", err);
      });
  },
  generateCardPoster42() {
    var that = this;
    let cardInfo = that.data.cardInfo;
    const width = that.data.posterBoxWidth;
    const height = that.data.posterBoxHeight;
    const unit = that.data.unit;
    let { img1, img2, img3, img4, img5, img6, img7 } = that.data;

    let promise4 = new Promise(function (resolve, reject) {
      img4 = '/static/wechat/img/sui/sui-1057.png';

      wx.getImageInfo({
        src: that.data.cndUrl + img4,
        success: function (res) {
          img4 = res.path;
          resolve(res);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });

    let promise3 = api.generateMiniCode('sub1/pages/consumer/index', that.data.empNo).then(res => {
      //console.log(app.globalData.int_id + "a" + util.formatTime(new Date()) + "a" + that.data.empNo);
      if (res) {
        img3 = res;
        return res;
      } else {
        return Promise.reject();
      }
    });

    Promise.all([promise3, promise4])
      .then(res => {
        //console.log("img3", img3); //二维码
        let context = wx.createCanvasContext('mycanvas');
        myCanvas.roundRectColor(context, '#EEEEEE', 0, 0, width, height, 0);

        context.drawImage(img7, unit * 0, unit * 0, width, height);
        context.save();

        if (cardInfo.GENDER == '男' || cardInfo.GENDER == '女') {
          context.drawImage(img1, unit * 510, unit * 110, unit * 115, unit * 195.385);
          context.save();
        } else {
          context.drawImage(img1, unit * 495, unit * 133, unit * 147, unit * 141);
          context.save();
        }

        context.drawImage(img3, unit * 442.8, unit * 966, unit * 183, unit * 189);
        context.save();

        context.drawImage(img4, unit * 57, unit * 983, unit * 281, unit * 52);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(74 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.USERNAME, unit * 55, unit * 385);
        context.save();

        cardInfo.ORG = cardInfo.ORG.replace('/', '').replace('（普惠金融部）', '').replace('(普惠金融部)', '');
        context.setTextAlign('left');
        context.setFontSize(32 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.ORG + cardInfo.POSITION, unit * 55, unit * 558);
        context.save();

        if (cardInfo.TEXT5 != '0') {
          context.setTextAlign('left');
          context.setFontSize(36 * unit);
          context.setFillStyle('#30435E');
          context.fillText(cardInfo.PHONE, unit * 55, unit * 492);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(30 * unit);
        context.setFillStyle('#30435E');
        context.fillText(cardInfo.PRO_FIELD.substring(0, 20), unit * 55, unit * 626);
        context.save();

        if (cardInfo.PRO_FIELD.length > 20) {
          context.setTextAlign('left');
          context.setFontSize(30 * unit);
          context.setFillStyle('#30435E');
          context.fillText(cardInfo.PRO_FIELD.substring(20), unit * 55, unit * 676);
          context.save();
        }

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('您的专属备用金', unit * 60, unit * 1082);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('最高可贷', unit * 60, unit * 1167);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(48 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('30', unit * 180, unit * 1170);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#D5A97C');
        context.fillText('万元', unit * 245, unit * 1167);
        context.save();

        context.setTextAlign('left');
        context.setFontSize(28 * unit);
        context.setFillStyle('#30435E');
        context.fillText('随你做哪行，e样都能贷', unit * 60, unit * 1217);
        context.save();

        context.strokeStyle = '#B68D63';
        context.lineWidth = 1 * unit;
        context.strokeRect(638 * unit, 982 * unit, 43 * unit, 167 * unit);

        let shareDesc = ['长', '按', '有', '惊', '喜'];
        for (let i = 0; i < shareDesc.length; i++) {
          context.setFontSize(24 * unit);
          context.setTextAlign('center');
          context.setFillStyle('#EDC59C');
          context.fillText(shareDesc[i], unit * 660, unit * (1012 + 30 * i));
          context.save();
        }

        let descs = ['线上申请', '秒速审批', '循环额度', '随借随还'];
        for (let i = 0; i < 4; i++) {
          context.setTextAlign('center');
          context.strokeStyle = '#D5A97C';
          context.lineWidth = 1 * unit;
          context.strokeRect((60 + 163 * i) * unit, 1246 * unit, 140 * unit, 46 * unit);
        }
        for (let i = 0; i < descs.length; i++) {
          context.setTextAlign('center');
          context.setFillStyle('#D5A97C');
          context.fillText(descs[i], unit * (130 + 163 * i), unit * 1277);
          context.save();
        }

        context.draw(false, function () {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'mycanvas',
              x: 0,
              y: 0,
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              quality: 1,
              success: a => {
                //console.timeEnd();
                //console.log(a.tempFilePath);
                let posterImgs = that.data.posterImgs;
                posterImgs[1].poster = a.tempFilePath;
                that.setData({
                  imagePath: a.tempFilePath,
                  posterImgs,
                });
                wx.hideToast();
              },
              fail: err => {
                //console.log(err);
                wx.hideToast();
              },
            });
          }, 200);
        });
      })
      .catch(err => {
        wx.hideToast();
        //console.log("生成海报结果", err);
      });
  },

  onShareAppMessage() {
    var that = this;
    let imagePath = '';
    if (that.data.imagePath) {
      imagePath = that.data.imagePath;
    }
    let params = '&empNo=' + that.data.empNo + '&intId=' + app.globalData.int_id;
    return api.shareApp(imagePath, params);
  },
});
