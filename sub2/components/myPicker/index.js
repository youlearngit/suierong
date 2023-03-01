Component({
    options: {
        // 在组件定义时的选项中启用多slot支持
        multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        // 初始化值
        initValue: {
            type: String,
            value: ''
        },
        // 父组件传递过来的数据列表
        items: {
            type: Array,
            value: []
        },
        imgUrl: {
            type: String,
            value: ''
        },
        isSearch: {
            type: Boolean,
            value: false,
        },
        type: {
            type: Number,
            value: 0,
        },
        arr: {
            type: Array,
            value: []
        }

    },
    /**
     * 组件的初始数据
     */
    data: {
        //控制picker的显示与隐藏
        flag: true,
        disable:true,
        // 用户输入的内容关键词
        searchValue: '',
        // 滚动选择的内容
        setValues: [],
        // 滚动选择的内容索引
        selectContentIndex: '',
        placeHolderWord: '请输入需要查询的内容',
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * @name: 搜索内容
         * @author: camellia
         * @date: 
         */
        searchContent(e) {
            let self = this;
            self.triggerEvent('searchContent', e.detail);
        },
        /**
         * @name: 隐藏picker
         * @author: camellia
         * @date: 
         */
        hiddeDatePicker() {
            let self = this;
            self.data.arr = [];
            self.setData({
                flag: !self.data.flag,
                searchValue: '',
            })
            self.triggerEvent('cancel', self.data.flag);
        },
        /**
         * @name: 展示picker
         * @author: camellia
         * @date: 
         */
        showDatePicker() {
            let self = this;
            self.setData({
                flag: !self.data.flag,
                searchValue: '',
            })
            self.getItems()
        },
        /**
         * @name: 选择好内容后，点击确定
         * @author: camellia
         * @date: 
         */
        confirm() {
            let self = this;
            // 获取用户选择的内容
            // let item = self.data.items[self.data.selectContentIndex] ? self.data.items[self.data.selectContentIndex] : self.data.items[0];
            let item = self.data.items[self.data.selectContentIndex];
            if(item == undefined){
              item = self.data.items[0];
            }
            item.type = self.data.type;
            // 通过发送自定义事件把用户选择的内容传递到父组件
            self.triggerEvent('confirm', item);
        },
        /**
         * @name: 用户滚动picker时，获取滚动选择的索引
         * @author: camellia
         * @date: 
         */
        bindChange(e) {
            let self = this;
            self.setData({
               disable:true,
                // 用户选择的内容索引
                selectContentIndex: e.detail.value[0]
            })
        },
        /**
         * @name: 获取初始化信息
         * @author: camellia
         * @date: 
         */
        getItems(e) {
            let self = this;
            if (self.data.items.length && self.data.initValue) {
                let items = self.data.items
                for (let i = 0; i < items.length; i++) {
                    if (self.data.initValue === items[i].name) {
                      if(self.data.initValue ===items[0].name || self.data.initValue ===items[items.length-0].name){
                        self.setData({
                          selectContentIndex:i,
                          setValues: [i]
                        })
                      }else{
                        self.setData({
                          disable:false,
                          selectContentIndex:i,
                          setValues: [i]
                        })
                      }
                        return
                    }
                }
            }
            self.setData({
              selectContentIndex:'',
              setValues: [0]
            })
        },
    },
})