//logs.js
Page({
  data: {
    steps: [],
  },
  onLoad() {
    let steps = wx.getStorageSync("steps");
    this.setData({ steps })
  },
});
