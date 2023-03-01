const App = getApp();
const computedBehavior = require('miniprogram-computed').behavior;
import { Wx } from '../../../utils/Wx';
import api from '../../../utils/api';
import Emp from '../../../utils/Emp';
import Toast from '@vant/weapp/toast/toast';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    media: {
      type: Array,
      value: [],
    },
    empNo: {
      type: String,
      value: '',
    },
  },

  behaviors: [computedBehavior],
  watch: {
    'empNo': async function (val) {
      if (!val) { return }
      let emp_info = await Emp.getCardInfoByEmp(val);
      this.setData({emp_info});
    },
  },
  computed: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    cndUrl: App.globalData.CDNURL,

    media_cache: {},
    
    poster_idx: -1,
    poster_img: '',

    poster_shareBox: 'shareBox',
    poster_hidePoster: true,

    emp_info: {},

  },

  /**
   * 组件的方法列表
   */
  methods: {

    onClosePosters(e) {
      this.setData({
        show: false,
      })
    },
  
    async choosePoster(e) {
      let {id} = e.currentTarget.dataset;
      if (id==this.data.poster_idx) {
        return;
      }
      this.setData({poster_idx:id});

      let cache = this.data.media_cache[id];
      if (cache) {
        this.setData({poster_img:cache});
        return;
      }
      this.setData({poster_img:''});

      let res_sysinfo = await api.getSystemInfo2(750, 1225, 1.3);
      let height = res_sysinfo.posterBoxHeight;
      let width = res_sysinfo.posterBoxWidth;
      let unit = res_sysinfo.unit;

      wx.createSelectorQuery().in(this)
        .select('#myCanvas')
        .fields({ node: true, size: true })
        .exec(async (res)=>{
          let canvas = res[0].node
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext('2d')

          for (let i=0; i<this.data.media[id].length; i++) {
            let media = this.data.media[id][i];
            switch(media.type) {
              case 'bg': {
                if (media.img) {
                  let imgbg_src = media.img;
                  let imgbg_info = await Wx.getImageInfo(imgbg_src);
                  let imgbg_path = imgbg_info.path;
                  let imgbg = canvas.createImage();
                  imgbg.src = imgbg_path;
                  await Wx.imageOnload(imgbg);
                  ctx.drawImage(imgbg, 0, 0, width, height);
                }
              } break;
              case 'qr': {
                if (media.img && media.xyr) {
                  let imgqr = canvas.createImage();
                  imgqr.src = media.img;
                  await Wx.imageOnload(imgqr);
                  let qr_x = media.xyr.x*unit;
                  let qr_y = media.xyr.y*unit;
                  let qr_r = media.xyr.r*unit;
                  ctx.arc(qr_x+qr_r, qr_y+qr_r, qr_r, 0, 2*Math.PI);
                  ctx.fillStyle = '#FFFFFF';
                  ctx.fill();
                  ctx.drawImage(imgqr, qr_x, qr_y, qr_r*2, qr_r*2);
                }
              } break;
              default: {
                if (media.img && media.xywh) {
                  let imgbg_src = media.img;
                  let imgbg_info = await Wx.getImageInfo(imgbg_src);
                  let imgbg_path = imgbg_info.path;
                  let imgbg = canvas.createImage();
                  imgbg.src = imgbg_path;
                  await Wx.imageOnload(imgbg);
                  let img_x = media.xywh.x*unit;
                  let img_y = media.xywh.y*unit;
                  let img_w = media.xywh.w*unit;
                  let img_h = media.xywh.h*unit;
                  ctx.drawImage(imgbg, img_x, img_y, img_w, img_h);
                }
              } break;
            }
          }

          let res_tofile = await Wx.canvasToTempFilePath(canvas);
          let poster_img = res_tofile.tempFilePath;
          let media_cache = this.data.media_cache;
          media_cache[id] = poster_img;
          this.setData({
            poster_img,
            media_cache,
          });
        })
    },
  
    createPoster() {
      this.setData({
        show: false,
        poster_shareBox: 'shareBox on',
        poster_hidePoster: false,
      })
    },

    cancelPoster(e) {
      this.setData({
        show: true,
      });
    },

  }
})
