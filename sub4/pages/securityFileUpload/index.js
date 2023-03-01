// sub4/pages/securityFileUpload/index.js
import api from '../../../utils/api';
var app = getApp();
import Toast from '../../static/vant/weapp/toast/toast';
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    atest:[],
    // testUrl: 'https://t-wmputest.jsbchina.cn:7207', /// 客服测试地址
    testUrl: 'https://wmpu.jsbchina.cn',//客服生产环境地址
    requestInterfaceUrls:{ //请求客服上传路径配置
      //会话交互
      login:{ //该API可以凭借微信Code登录
        url:'/api/external/user/login',
        method:'POST',
      },
      getSessionInfo:{ //该API可以获取某次文件上传会话的详情信息。
        url:'/api/external/session/info',
        method:'GET',
      },
      completeSession:{ //完成会话API
        url:'/api/external/session/complete',
        method:'POST',
      },
      downloadTemplate:{ //模版下载
        url:'/api/external/file/downloadTemplate',
        method:'GET',
      },
       //文件上传
      fileSeesionInfo:{ //该API可以获取某次文件上传会话的详情信息
        url:'/api/external/session/info',
        method:'GET',
      },
      fileUpload:{ //该API可以上传某一特定文件到后台。
        url:'/api/external/file/upload',
        method:'POST',
      },
      fileDownload:{//下载文件API
        url:'/api/external/file/downloadFile',
        method:'GET',
      },
      fileRemove:{//该API可以删除某一特定文件
        url:'/api/external/file/remove',
        method:'DELETE',
      }
    },
    preffixUrl: app.globalData.CDNURL,
    showTips: false,
    identityInfoFlag: false, //标记用户信息是否补录完毕
    faceFlag:false,//标记用户信息是否补录完毕
    telFlag:false, //标记用户手机好是否绑定
    canSubmit: true,
    isValidCardDialog: false,

    //客服服务会话使用参数
    token: '', //短链接登陆，合法token
    authorization_token:'', //客服服务会话token
    sessionInfo:{}, //获取会话信息
    sessionList:[], //上传文件类型结合
    sessionId:'', //会话标识
    scenario_id: '', // 场景id    
    completed: true, //文件上传表单提交是否完成

    pdfFile: '',

    iconEnum:[],

    showCircle: false, //显示上传进度条
    currentRate: 0,
    showIcon6: true, //是否显示身份证正反面上传模块
    firstOpen: 1, //是否第一次打开页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu(); //禁止分享
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    that = this;
    if(options.token == undefined){
        //不是合法登陆，退出
        this.showErrAndClose('链接失效',true);
    }else{
      this.setData({
        token:options.token
      });

    //查询会话token是否有效
    that.initIcon();
    }
  },
  text() {
    return this.currentRate.toFixed(0) + '%'
  },
  initIcon(){
    let items = [
      {value:'12',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/poor-proof.png'},
      {value:'11',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/income-proof.png'},
      {value:'10',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/personal-authenticity-commitment.png'},
      {value:'9',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/Isolation-certificate.png'},
      {value:'8',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/real-name-system-open-account.png'},
      {value:'7',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/recent-Payment-record.png'},
      {value:'6',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/id-card-front-and-back.png'},
      {value:'5',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/credit-report.png'},
      {value:'4',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/close-quota-screenshot.png'},
      {value:'3',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/overdue-customer-commitment-letter.png'},
      {value:'2',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/special-circumstances.png'},
      {value:'1',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/arbitrary-img.png'},
      {value:'0',path:that.data.preffixUrl+'/static/wechat/img/securityFileUpload/arbitrary-files.png'}
    ]
    that.setData({
      iconEnum:items
    });
    that.getWxUserCode();
  },
  /** 该API可以凭借微信Code登录
  *api/external/user/login | POST
	*参数：
	* wechat_user_code：微信登陆返回的code
	*响应：
	* code:200
	* desc:"状态"
	* data:{
	*	  authorization_token:""
	* }
  */
  getWxUserCode(){
    return new Promise((resolve, reject) => {
      wx.login({
        timeout: 10000,
        success: (res) => {
          var data = {
            wechat_user_code: res.code
          }
          // that.showErrAndClose('token:'+res.code,false);
          that.sendRequest(that.data.testUrl + that.data.requestInterfaceUrls.login.url,data,null,that.data.requestInterfaceUrls.login.method).then(res=>{
            console.log('客服会话token：' + res.authorization_token);
            that.setData({
              authorization_token:res.authorization_token,
            });
            that.getSessionInfo();
          }).catch(err=>{
            that.showErrAndClose('登陆失败',true);
          });
        },
        fail: (err) => {
          that.showErrAndClose('登陆失败',true);
        },
        complete: () => {},
      });
    });
  },
  /** 获取会话详情API
   * 
   * /api/internal/session/info | GET
   * 请求参数：
   * token
   * 响应：
   * code：200
   * desc: "状态"
   * "data": { //样例数据
        "id": 1,
        "token": "12344321",
        "completed": false,
        "scenario_id": 1,
        "name": {
            "category": "信用卡协议还款",
            "scenario": "贫困原因"
        },
        "requisitions": [{
            "id": 4,
            "name": "贫困证明",
            "type": 0,
            "icon": 0,
            "count_limit": 5,
            "size_limit": 10,
            "required": true,
            "template": {
                "name": "贫困证明",
                "token": "g3dj5fp23v" // accessed via http://current.domain/t/g3dj5fp23v
            },
            "comment": "请打印后手动填写，加盖公章并拍照上传。",
            "uploaded": [1, 175] // accessed via http://current.domain/f/1 http://current.domain/f/175
        }, {
            "id": 5,
            "name": "收入证明",
            "type": 0,
            "icon": 1,
            "count_limit": 5,
            "size_limit": 10,
            "required": true,
            "template": {
                "name": "收入证明",
                "token": "g3dj5fp23v" // accessed via http://current.domain/t/g3dj5fp23v
            },
            "comment": "请打印后手动填写，加盖公章并拍照上传。",
            "uploaded": []
        }],
        "created_at": "1926-08-17 12:34:56"
    }
   */
  getSessionInfo(){
    that.setData({
      showCircle:false,
    });
    var data = {
      token: that.data.token
    }
    var url = that.data.testUrl + that.data.requestInterfaceUrls.getSessionInfo.url;
    var requestMethod = that.data.requestInterfaceUrls.getSessionInfo.method;

    var header = {
      'content-type': 'application/json', // 默认值
      AUTHORIZATION: that.data.authorization_token
    }
    that.sendRequest(url,data,header,requestMethod).then(sessionRes=>{
      //检测是否需要人脸信息
      if(sessionRes.person_id != '' && sessionRes.person_id != null && sessionRes.person_name != '' && sessionRes.person_name != null && that.data.firstOpen == 1 ){
        //需要进行人脸
        wx.checkIsSupportFacialRecognition({
          success() {
            wx.startFacialRecognitionVerifyAndUploadVideo({
              name: sessionRes.person_name, //姓名
              idCardNumber: sessionRes.person_id, //身份证号码
              checkAliveType: 2,
              success: function (res) {
                debugger
                that.setData({
                  firstOpen: that.data.firstOpen + 1,
                  showIcon6: false,
                  currentRate:0,
                  sessionInfo:sessionRes,
                  sessionList:that.converListInfo(sessionRes.completed,sessionRes.requisitions),
                  sessionId:sessionRes.id,
                  scenario_id:sessionRes.scenario_id,
                  completed:sessionRes.completed
                })
                console.log('人脸success', res);
              },
              fail: function (err) {
                that.setData({
                  firstOpen: that.data.firstOpen + 1,
                  showIcon6: true,
                  currentRate:0,
                  sessionInfo:sessionRes,
                  sessionList:that.converListInfo(sessionRes.completed,sessionRes.requisitions),
                  sessionId:sessionRes.id,
                  scenario_id:sessionRes.scenario_id,
                  completed:sessionRes.completed
                })
                console.log('人脸fail', err);
              }
            });
          },
          fail(res) {
            that.showErrAndClose('您的微信版本暂不支持人脸识别，请您先升级。',true);
          }    
        });
      }else{
        that.setData({
          currentRate:0,
          sessionInfo:sessionRes,
          sessionList:that.converListInfo(sessionRes.completed,sessionRes.requisitions),
          sessionId:sessionRes.id,
          scenario_id:sessionRes.scenario_id,
          completed:sessionRes.completed
        })
      }
      wx.hideLoading();
    }).catch(err=>{
      that.showErrAndClose('链接失效',true);
    });
  },
  converListInfo(completed,beforList){
    var after = [];
    beforList.forEach(item=>{
      that.data.iconEnum.forEach(icon =>{
        if(icon.value == item.icon ){
          item.iconImgPath = icon.path
        }
      });
      let images = [];
      //用于完成会话后，提示要求上传显示的继续点击按钮
      if(completed){
        if(item.uploaded.length != item.count_limit){
          item.count_limit = (item.count_limit-item.uploaded);
        }
      }
      if(item.uploaded.length > 0){
        item.uploaded.forEach((ids,index)=>{
          var newFileInfo ={
            name:item.name+'文件'+(index+1),
            type: item.type == 0?'file':'image',
            status: 'done',
            message: '上传中',
          }
          if(item.type == 1){
            newFileInfo.thumb= that.data.testUrl + that.data.requestInterfaceUrls.fileDownload.url+'?AUTHORIZATION='+that.data.authorization_token+'&session_uploads_id='
            +ids;
            newFileInfo.url=that.data.testUrl + that.data.requestInterfaceUrls.fileDownload.url+'?AUTHORIZATION='+that.data.authorization_token+'&session_uploads_id='
            +ids
          }
          images.push(newFileInfo);
      });
    }
      item.showFlag = false;
      item.showFilePath = images;
      after.push(item);
    });
    return after;
  },
  /** 完成会话API
   * 
   * /api/external/session/complete | POST
   * 请求路径参数：
   * AUTHORIZATION：登录凭证对应获取的
   * 请求参数：
   * session_id
   * 响应：
   * code：200
   * desc: "状态"
   * "data": {
   *    "completed": true,
   * }
   */
  completeSession(){

    var data = {
      session_id: that.data.sessionId,
      face_result: that.data.showIcon6 == false ? 1 : 0, //人脸识别结果
    }
    var url = that.data.testUrl + that.data.requestInterfaceUrls.completeSession.url;
    var requestMethod = that.data.requestInterfaceUrls.completeSession.method;
    var header = {
      'content-type': 'application/json', // 默认值
       AUTHORIZATION: that.data.authorization_token
    }
    that.sendRequest(url,data,header,requestMethod).then(res=>{
      wx.hideLoading();
      // that.showErrAndClose('提交成功',false);
      wx.showToast({
      type: 'success',
      title: '提交成功',
      duration: 5000,
      complete: () => {
        that.getSessionInfo();
      },
    });
    }).catch(err=>{
      that.showErrAndClose('操作失败，请重新尝试',false);
    });
  },
  /** 获取某次文件上传会话的详情信息
   * 
   * /api/external/session/info｜GET
   * 请求路径参数：
   * AUTHORIZATION：登录凭证对应获取的
   * 请求参数：
   * token
   * 响应：
   * code：200
   * desc: "状态"
   *"data": {
        "id": 1,
        "token": "12344321",
        "completed": false,
        "scenario_id": 1,
        "name": {
            "category": "信用卡协议还款",
            "scenario": "贫困原因"
        },
        "requisitions": [{
            "id": 4,
            "name": "贫困证明",
            "type": 0,
            "icon": 0,
            "count_limit": 5,
            "size_limit": 10,
            "required": true,
            "template": {
                "name": "贫困证明",
                "token": "g3dj5fp23v" // accessed via http://current.domain/t/g3dj5fp23v
            },
            "comment": "请打印后手动填写，加盖公章并拍照上传。",
            "uploaded": [1, 2] // accessed via http://current.domain/f/1 http://current.domain/f/2
        }, {
            "id": 5,
            "name": "收入证明",
            "type": 0,
            "icon": 1,
            "count_limit": 5,
            "size_limit": 10,
            "required": true,
            "template": {
                "name": "收入证明",
                "token": "g3dj5fp23v" // accessed via http://current.domain/t/g3dj5fp23v
            },
            "comment": "请打印后手动填写，加盖公章并拍照上传。",
            "uploaded": [175] // accessed via http://current.domain/f/175
        }],
        "created_at": "1926-08-17 12:34:56"
    *}
   */
  fileSeesionInfo(){
    var data = {
      token: that.data.token
    }
    var url = that.data.testUrl + that.data.requestInterfaceUrls.fileSeesionInfo.url;
    var requestMethod = that.data.requestInterfaceUrls.fileSeesionInfo.method;
    var header = {
      'content-type': 'application/json', // 默认值
      AUTHORIZATION: that.data.authorization_token
    }
    that.sendRequest(url,data,header,requestMethod).then(res=>{
      console.log("获取某次文件上传会话的详情信息:"+ JSON.stringify(res));
      that.setData({
        sessionInfo:res,
        sessionId: res.id,
        scenario_id: res.scenario_id
      })
      return res;
    }).catch(err=>{
      wx.hideLoading();
      that.showErrAndClose('链接失效',true);
    });
  },
  /** 下载文件API
   * 
   * /api/external/file/downloadFile | GET
   * 请求路径参数：
   * AUTHORIZATION：登录凭证对应获取的
   * 请求体参数
   * session_uploads_id
   * 响应：
   * 文件流
   */
  downFile(fileId,fileType){
    wx.showLoading({
      title: '读取文件中...',
      mask:true
    })
      var url = that.data.testUrl + that.data.requestInterfaceUrls.fileDownload.url;

      wx.downloadFile({
        url: url +'?AUTHORIZATION='+that.data.authorization_token+'&session_uploads_id='+fileId,
        success: function (res) {
          if (res.statusCode === 200) { 
            wx.hideLoading()
            var tempFilePath =res.tempFilePath;
                that.setData({
                  testimg : res.tempFilePath
                });
                if(fileType == 0){
                  //判断文件类型，file打开方式
                  wx.openDocument({
                    filePath: tempFilePath, 	
                    showMenu: false,
                    success: function (res) {
                      console.log(res);
                    },
                    fail: res => {
                      console.log(res);
                    }
                  })
                }else{
                  //判断文件类型，图片打开方式
                  wx.previewImage({
                    //当前显示图片
                    urls: [tempFilePath], // 需要预览的图片 http 链接列表
                    success: function (res) {
                      console.log(res);
                    },
                    fail: res => {
                      console.log(res);
                    }
                    
                  })
                }
          }else{
            wx.hideLoading({
              success: (res) => {
                that.showErrAndClose('图片获取失败',false);
              },
            })
          }
        },
      });
  },
  /** 删除某一特定文件
   * 
   * /api/external/file/remove | DELETE
   * 请求路径参数：
   * AUTHORIZATION：登录凭证对应获取的
   * 请求体参数
   * session_id(会话ID)、scenario_requisition_id(场景具体上传项ID)、session_upload_id(具体上传的文件的二进制)
   * 响应：
   * code：200
   * desc: "状态"
   * "data": {
   *    "session_upload_id": 1
   * }
   */
  fileRemove(scenario_id,fileId){
    var data = {
      session_id: that.data.sessionId,
      scenario_requisition_id: scenario_id,
      session_upload_id:fileId,
    }
    var url = that.data.testUrl + that.data.requestInterfaceUrls.fileRemove.url;
    var requestMethod = that.data.requestInterfaceUrls.fileRemove.method;
    var header = {
      'content-type': 'application/json', // 默认值
      AUTHORIZATION: that.data.authorization_token
    }
    that.sendRequest(url,data,header,requestMethod).then(res=>{
      console.log("删除某一特定文件:"+ JSON.stringify(res));
      if(res.session_upload_id){
        that.getSessionInfo();
      }
    }).catch(err=>{
      that.showErrAndClose('操作失败，请重新尝试',false);
    });
  },
  /** 下载模版
   * 
   * /api/external/file/downloadTemplate | GET
   * 请求路径参数：
   * 请求体参数
   * template_token
   * 响应：
   * code：200
   * desc: "状态"
   * 文件流
   */
  downloadTemplate(e){
    //增加loading
    var template = e.currentTarget.dataset.template;
    var url = that.data.testUrl + that.data.requestInterfaceUrls.downloadTemplate.url;
    wx.downloadFile({
			url: url + '?template_token=' + template.token,
			success: function (res) {
				if (res.statusCode === 200) {
          wx.openDocument({
            filePath: res.tempFilePath,
            showMenu: true
          })
				}
				//console.log(res.tempFilePath);
			},
		});
  },
  // 上传文件
  uploadFile(e){
      var id = e.currentTarget.dataset.id;
      var newList = [];
      that.data.sessionList.forEach(item=>{
        if(item.id == id){
          item.showFlag = true
        }
        newList.push(item);
      })
      that.setData({
        sessionList : newList
      })
  },
  //图片预览
	prevViewImage: function (event) {
    let {id,item,info} = event.currentTarget.dataset;
    let {index} = event.detail;
    if(info.type == 0){
      that.downFile(item[index],info.type);
    }
  },
   //文件大小超出限制
  imageOver: function(e){
    let {size_limit} = e.currentTarget.dataset.info;
    if(e.type == 'oversize'){
      that.showErrAndClose('文件不得超出'+size_limit+'M',false);
    }
  },
  //小程序图片上传列表
  afterRead(event) {
    const { file } = event.detail;
    const {id,item,info} = event.currentTarget.dataset;
    var operationType = event.type; //操作类型
    if(operationType == "delete"){ // 删除
      const { index } = event.detail;
      const {sessionList} = that.data;
      //遍历上传文件分类
      sessionList.forEach(session=>{
        if(id == session.id){ //比对类型
          //执行图片删除操作
         that.fileRemove(session.id,session.uploaded[index]);
        }
      })
    }else{// 添加
      if(file.length> (info.count_limit - info.showFilePath.length)){
        that.showErrAndClose('超出可选数量',false);
        return;
      }
      // wx.showLoading({
      //   title: '上传中...',
      //   mask:true
      // })
       //重置进度条
       that.setData({
          showCircle:true,
      });
      file.forEach((f,index)=>{
            wx.uploadFile({
              url: that.data.testUrl + that.data.requestInterfaceUrls.fileUpload.url,
              filePath: f.url,
              header : {
                'content-type': 'multipart/form-data',
                AUTHORIZATION: that.data.authorization_token
              },
              name: 'file',
              formData: { 	
                session_id: that.data.sessionId,
                scenario_requisition_id: info.id,
              },
              success(res) {
                if (res.data != "" && res.data && res.data != undefined) {
                  console.log(res.data)
                  var resData = JSON.parse(res.data);
                  if(resData.code!=200){
                    that.setData({
                      showCircle:false
                    });
                    that.showErrAndClose('图片上传失败，请重试',false);
                  }else{
                    that.setData({
                      currentRate: (100/file.length*(index+1)).toFixed(2)
                    });
                  }
                }
              },
              fail(res){
                showCircle = false;
                that.setData({
                  showCircle
                });
                that.showErrAndClose('图片上传失败，请重试',false);
                wx.hideLoading();
                that.getSessionInfo();
              }
            });
      });
      setTimeout(function() {
        that.getSessionInfo();
      }, (2000 + (1500 * (file.length-1)))); //延迟时间
      // if(index == file.length){
        
      // }
    }    
  },

  //上传获取本地图、文件片地址
  // uploadFileToServe(e){
  //   var item = e.currentTarget.dataset.item;
  //   if(item.required && item.uploaded.length == 0){
  //     wx.showToast({
  //       title: item.name + "必传",
  //       icon: "none",
  //       mask: true,
  //       duration: 2000,
  //     });
  //     return;
  //   }
  //     const {sessionList} = that.data;
  //     sessionList.forEach(info=>{
  //       if(item.id == info.id){
  //         info.showFlag = false
  //       }
  //     })
  //     that.setData({sessionList})
  // },
  //提交上传文件表单
  submit(e){
    var canSubmit = true;
    that.data.sessionList.forEach(session=>{
      if(session.required && session.uploaded.length==0 && (session.icon != 6 || that.data.showIcon6 == true)){
        canSubmit = false;
        that.showErrAndClose(session.name+'为必传项',false);
        return ;
      }
    })
    if(canSubmit){
      wx.showLoading({
        title: '提交中...',
        mask:true
      })
      // 结束会话
      that.completeSession();
    }
  },
  /**微信原生接口请求
   * @param {*} url 请求路径
   * @param {*} data 请求参数
   * @param {*} requestType 请求类型GET、POST、DELETE
   */
  sendRequest(url,data,header,requestType){
    return new Promise((resolve, reject) => {
        wx.request(
          Object.assign(
            {
              url: url,
              data: data,
              method: requestType,
              header: header,
            },
            {
              success(r) {
                const isSuccess = that.isHttpSuccess(r.statusCode);
                if (isSuccess) {
                  if (r.data.code === 200) {
                    resolve(r.data.data);
                  } else {
                    console.log(url, r.data.desc);
                    that.showErrAndClose(r.data.desc,true);
                  }
                } else {
                  
                  reject({
                    msg: `网络错误:${r.statusCode}`,
                    detail: r,
                  });
                }
              },
              fail(err) {
                // that.showErrAndClose('5:'+JSON.stringify(err.errMsg),false);
                console.log('errYT', err);
                if (err.errMsg === 'request:fail ') {
                  wx.showToast({
                    title: '请检查网络',
                    icon: 'none',
                    image: '',
                    duration: 2500,
                    mask: false,
                  });
                }
                reject(err);
              },
            }
          )
        )
      });
  },
  /* 判断请求状态是否成功
 * 
 * 参数：http状态码
 * 返回值：[Boolen]
 */
  isHttpSuccess(status) {
    return (status >= 200 && status < 300) || status === 304;
  },  

  //关闭小程序
  popClose: function () {
    wx.exitMiniProgram({
      success: function() {
      },
      fail: function() {
      }
    })
  },

  //弹窗并且关闭小程序
  showErrAndClose(text,closeFlag){
    wx.hideLoading();
    wx.showModal({
      title: text,
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: () => {},
      fail: () => {},
      complete: (res) => {
        if(closeFlag){
          that.popClose();
        }
      },
    });
  },
  //读取文件二进制
  getFileBook(pdfPath,file){
    wx.getFileSystemManager().writeFile({
      filePath: wx.env.USER_DATA_PATH + pdfPath.split("book")[1], //创建一个临时文件名
      data: jsonData.PDF, //写入的文本或二进制数据
      encoding: 'base64', //写入当前文件的字符编码
      success: res => {
          wx.hideLoading({
              success: (res) => {},
          })
          wx.showToast({
              title: '授权书生成成功',
              icon: 'none',
              duration: 1500
          })
          that.setData({ pdfFile: wx.env.USER_DATA_PATH + pdfPath.split("book")[1], })
      },
      fail: err => {
          wx.hideLoading({
              success: (res) => {},
          })
          wx.showToast({
              title: '生成失败',
              icon: 'none'
          })
      }
  })
  return;
  },

  /*生命周期函数--监听页面初次渲染完成
   * 
   */
  onReady() {

  },

  /* 生命周期函数--监听页面显示
   * 
   */
  onShow(options) {
   
  },

  /* 生命周期函数--监听页面隐藏
   * 
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