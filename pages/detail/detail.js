Page({

  /**
   * 页面的初始数据
   */
  data: {
    currIndex: 0,
    coverImage: null,
    list: [{
        "typeid": 1,
        "videoimg": "https://educate-res.babybus.com/Educate/ResourceFile/20220706/33a08dc719514223b8a24c53190f18b0.png",
        "videoname": "测试视频1",
        "videourl": "https://media.w3.org/2010/05/sintel/trailer.mp4"
      },
      {
        "typeid": 2,
        "videoimg": "https://educate-res.babybus.com/Educate/ResourceFile/20220706/036ebb6288264cdd960b716616455f2f.png",
        "videoname": "测试视频2",
        "videourl": "https://educate-res.babybus.com/Educate/ResourceFile/20220706/b2a7612d8631478595b50cd1bb031ace.mp4"
      },
    ],
    hiddenCover: false,
    playing: false,
    showPlayBtn: false,
    currTimeStr: '00:00',
    endTimeStr: '00:00',
    canUpdateSlider: true,
    duration: 0,
    sliderValue: 0,
    showOperation: true, //显示点赞收藏
    operationData: null,
  },
  touchTimeStart: 0, //timeStart
  touchTimeEnd: 0, //timeEnd
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const index = parseInt(options.index || 0);
    this.setData({
      coverImage: options.coverImage || '',
      currIndex: index,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //错误处理
  bindError(e) {
    console.log('catch video error:');
    console.log(e);
    wx.showToast({
      title: '视频播放错误',
      icon: 'none'
    })
  },

  //播放时的处理
  bindPlay(e) {
    let hc = this.data.hiddenCover;
    this.data.playing = true;
    if (hc === false) {
      setTimeout(() => {
        this.setData({
          hiddenCover: true
        });
      }, 200)
    }
  },

  //触摸屏幕时记录一个时间
  bindTouchStart(e) {
    console.log('触摸屏幕时记录一个时间:', e)
    this.touchTimeStart = e.timeStamp;
  },

  /**
   * 离开屏幕时判断，如果间隔小于100ms则认为是普通点击，触发暂停/播放操作；
   * 否则认为是拖拽或者滑动屏幕操作，不触发暂停/播放；
   */
  bindTouchEnd(e) {
    console.log('点击bindtouchend', e, this.touchTimeStart)
    this.touchTimeEnd = e.timeStamp;

    let cost = this.touchTimeEnd - this.touchTimeStart;
    if (cost < 100) {
      let ctx = wx.createVideoContext(`myVideo_${this.data.currIndex}`);
      if (this.data.playing) {
        ctx.pause();
        this.data.playing = false;
        this.setData({
          showPlayBtn: true
        })
      } else {
        ctx.play();
        this.data.playing = true;
        this.setData({
          showPlayBtn: false
        })
      }
    } else {
      //console.log('drag...')
    }
  },

  swiperChange(e) {

  },

  //滑动屏幕结束时加载下一个视频
  swiperAnimateEnd(e) {
    const ci = e.detail.current;
    if (ci !== this.data.currIndex) {
      this.data.sliderValue = 0;
      this.setData({
        currIndex: ci,
        hiddenCover: false,
        showGoodsList: false,
        showPlayBtn: false,
        showOperation: true,
      })
    }
  },

  //video时间更新触发
  bindTimeUpdate(e) {
    // console.log('bindtimeupdate', e)
    if (this.data.canUpdateSlider) { //判断拖拽完成后才触发更新，避免拖拽失效
      let d = e.detail.duration;
      let sliderValue = e.detail.currentTime / d * 100;
      let ct = this.getSMPTEbySeconds(parseInt(d * (sliderValue / 100)));
      let et = this.getSMPTEbySeconds(parseInt(d));
      this.setData({
        currTimeStr: ct,
        sliderValue: sliderValue,
        duration: e.detail.duration,
        endTimeStr: et
      })
    }
  },

  //进度条滑块变化时触发视频seek定位
  sliderChange(e) {
    if (this.data.duration) {
      let ctx = wx.createVideoContext(`myVideo_${this.data.currIndex}`);
      ctx.seek(e.detail.value / 100 * this.data.duration);
      this.setData({
        sliderValue: e.detail.value,
        canUpdateSlider: true //完成拖动后允许更新滚动条
      })
    }
  },

  //滑块拖动过程处理
  sliderChanging(e) {
    const sv = e.detail.value;
    const d = this.data.duration;
    const res = this.getSMPTEbySeconds(parseInt(d * (sv / 100)));

    this.setData({
      currTimeStr: res,
      canUpdateSlider: false //拖拽过程中，不允许更新进度条
    });
  },

  //获取形如 xx:xx 的时间格式
  getSMPTEbySeconds(seconds) {

    let s = Math.floor(seconds);
    let m = Math.floor(s / 60);

    m = m % 60;
    s = s % 60;

    if (s < 10) {
      s = 0 + '' + s;
    }
    if (m < 10) {
      m = 0 + '' + m;
    }

    return m + ':' + s;

  },

  //点赞处理
  toggleLike(e) {
    let { index, item } = e.currentTarget.dataset
    this.setData({
      [`list[${index}].isLiked`]: !status
    });
  },
  // 点赞
  togglePraise(e) {
    let { index, item } = e.currentTarget.dataset
    console.log('点赞', index, item)
  }
});