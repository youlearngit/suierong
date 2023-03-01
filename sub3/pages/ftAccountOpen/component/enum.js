//开户类型种类
var type = {
  formAccountTypeItems : [ //开户类型种类
  {value: 'FTE', name: 'FTE账户', checked: true, marginRight:'120' },
  {value: 'FTN', name: 'FTN账户',checked: false},
  ],

  //是否有上级机构选择类型
   hasInstitutionsItems : [ 
  {value: '1', name: '有', checked: false, marginRight:'50' },
  {value: '2', name: '无', checked: true},
   ],

  //上级代码种类选择类型
   sjdmzlItems : [[
  { value:"0" , name:'统一社会信用代码（营业执照）' },
  { value:"1" , name:'统一社会信用代码（非营业执照）' },
  { value:"2" , name:'部门批文' },
  { value:"3" , name:'组织机构代码' },
  ]],

  //上级法定代表人证件类型
   sjfddbrzjItems : [[
  { value:"011" , name:'第一代居民身份证' },
  { value:"021" , name:'第二代居民身份证' },
  { value:"031" , name:'临时身份证' },
  { value:"042" , name:'中国护照' },
  { value:"056" , name:'户口簿' },
  { value:"155" , name:'香港通行证' },
  { value:"165" , name:'澳门通行证' },
  { value:"175" , name:'台湾通行证或有效旅行证件' },
  { value:"18A" , name:'外国人永久居留证' },
  { value:"202" , name:'外国护照' },
  { value:"218" , name:'其它' },
   ]],

  //证明文件种类
   zmwjzlItems : [[
  {value:"0",name:"营业执照"},
  {value:"1",name:"部门批文"},
  {value:"2",name:"登记证书"},
  {value:"3",name:"开户证明"},
  {value:"4",name:"特殊行业许可证"},
  {value:"5",name:"其他商业登记条例"},
  {value:"6",name:"注册证书"},
  {value:"7",name:"其他"},
   ]],
   //其他证明文件种类
   qtzmwjzlItems : [[
    {value:"-1",name:"无"},
    {value:"0",name:"营业执照"},
    {value:"1",name:"部门批文"},
    {value:"2",name:"登记证书"},
    {value:"3",name:"开户证明"},
    {value:"4",name:"特殊行业许可证"},
    {value:"5",name:"其他商业登记条例"},
    {value:"6",name:"注册证书"},
    {value:"7",name:"其他"},
     ]],

   //存款人类别
   ckrlbItems:[[
    {value:"101",name:"企业法人"},
    {value:"10101",name:"法人企业分支机构"},
    {value:"102",name:"非法人企业"},
    {value:"103",name:"个体工商户"},
    {value:"104",name:"事业单位"},
    {value:"105",name:"社会团体"},
    {value:"106",name:"党政机关"},
    {value:"107",name:"金融机构"},
    {value:"108",name:"境外机构"},
    {value:"199",name:"其他"},
  ]],

  //注册资金币种
  zczjbzItems:[[
    {value:"01",name:"人民币"},
    {value:"12",name:"英镑"},
    {value:"13",name:"港币"},
    {value:"14",name:"美元"},
    {value:"15",name:"瑞士法郎"},
    {value:"16",name:"德国马克"},
    {value:"17",name:"法国法郎"},
    {value:"18",name:"新加坡元"},
    {value:"20",name:"荷兰盾"},
    {value:"21",name:"瑞士克朗"},
    {value:"22",name:"丹麦克朗"},
    {value:"23",name:"挪威克朗"},
    {value:"24",name:"奥地利先令"},
    {value:"25",name:"比利时法郎"},
    {value:"26",name:"意大利里拉"},
    {value:"27",name:"日元"},
    {value:"28",name:"加拿大元"},
    {value:"29",name:"澳大利亚元"},
    {value:"31",name:"比塞塔"},
    {value:"32",name:"马来西亚林吉特"},
    {value:"33",name:"欧洲货币单位"},
    {value:"42",name:"芬兰马克"},
    {value:"81",name:"澳门元"},
    {value:"84",name:"泰国铢"},
    {value:"87",name:"新西兰元"},
    {value:"95",name:"清算瑞士法郎"},
    {value:"96",name:"欧元"},
  ]],

  //证明文件有效期选择
  businessValidityItem:[[
    {value:"0",name:"固定有效期",corrVlaue:""},
    {value:"1",name:"长期",corrVlaue:"9999-12-31"},
    {value:"2",name:"无有效期",corrVlaue:"9999-12-30"}
  ]],

  //账户性质
  zhxzItems:[[
    {value:'00',name:'基本存款账户'}, //0
    // {value:'10',name:'一般存款账户'}, //1
    // {value:'20',name:'临时存款账户(注册验资)'}, //2
    // {value:'21',name:'临时存款账户（其他）'}, //3
    // {value:'30',name:'预算单位专用存款账户'}, //4
    {value:'01',name:'非预算单位专用存款账户'}, //5
  ]],

   //资金性质选择
   zjxzItems:[[
    {value:'1',name:'无'},
    // {value:'1',name:'更新改造资金'},
    // {value:'2',name:'财政预算外资金'},
    // {value:'3',name:'粮、棉、油收购资金'},
    // {value:'4',name:'证券交易结算资金'},
    // {value:'5',name:'期货交易保证金'},
    // {value:'6',name:'信托基金'},
    // {value:'7',name:'金融机构存放同业资金'},
    // {value:'8',name:'政策性房地产开发资金'},
    // {value:'9',name:'单位银行卡备用金'},
    // {value:'10',name:'住房基金'},
    // {value:'11',name:'社会保障基金'},
    // {value:'12',name:'收入汇缴资金和业务支出资金'},
    // {value:'13',name:'党、团、工会设在单位的组织机构经费'},
    {value:'2',name:'其他需要专项管理和使用的资金'}, 
  ]],

  //开户原因
  khyyItems:[[
    {value:'0',name:'日常结算'},
    {value:'1',name:'办理授信业务'},
    {value:'2',name:'其他'},
  ]],

  //开户电话核实人类型选择
  khdhhsrItems:[[
    {value:'0',name:'法人'},
    {value:'1',name:'财务负责人'},
  ]],

  

   //单位信息错误名称提示头
   erroNames:{
      custName: "客户名称:",
      shxydm : "社会统一信用代码:",
      zmwjzl : "证明文件种类:",
      identityFileNo: "证明文件编号:",
      specialorgNo: "特殊机构赋码编号:",
      identityFileDate: "证明文件有效期:",
      orgCode: "组织机构代码:",
      stateTaxRegisterNo: "国税登记证号:",
      landTaxRegisterNo: "地税登记证号:",
      depositorType: "存款人类别:",
      industryType: "行业类别:",
      registerCapitalType: "注册资金币种:",
      registerCapital: "注册资金:",
      businessScope: "经营范围:",
      registerAddress: "注册地址:",
      registerPhone: "注册电话:",
      workAddress: "办公地址:",
      workAddressCode: "办公邮编:",
      establishDate: "成立日期:",
      licenceApproveOrg: "执照批准机关:"
  },

  // 账户信息字段提示错误头
  accountErrorName: {

  }

}


export default {type};