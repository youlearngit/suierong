
import skip from "../../../utils/skip";

// sub1/component/product-box/index.js
var app = getApp();
Component({
	/**
	 * Component properties
	 */
	properties: {
		products: {
			type: Object,
			value: {},
		},
		edit: {
			type: Boolean,
			value: false,
		},
	},

	/**
	 * Component initial data
	 */
	data: {
        preffixUrl: app.globalData.URL,
        cndUrl:app.globalData.CDNURL,
		editChoice: [
			{
				name: "编辑",
				value: "edit",
                click: "edit",
                icon:'sui-2022.png',
			},
			{
				name: "上移",
				value: "moveUp",
                click: "moveUp",
                icon:'sui-2023.png',
                
			},
			{
				name: "下移",
				value: "moveDown",
                click: "moveDown",
                icon:'sui-2024.png',
                
			},
			{
				name: "删除",
				value: "delete",
                click: "delete",
                icon:'sui-2026.png',
			},
		],
	},

	/**
	 * Component methods
	 */
	methods: {
		showEditBox() {
			this.setData({
				"products.showEditChoice": !this.data.products.showEditChoice,
			});
			//console.log(this.data);
		},
		edit(e) {
			//console.log("edit");
			this.triggerEvent("edit", e);
		},
		moveUp(e) {
			//console.log("moveUp");
			this.triggerEvent("moveUp", e);
		},
		moveDown(e) {
			//console.log("moveDown");
			this.triggerEvent("moveDown", e);
		},
		delete(e) {
			//console.log("delete");
			this.triggerEvent("delete", e);
        },
        skip(e) {
            let code = e.currentTarget.dataset.code;
            skip.skipProduct(code);
        },
	},
});
