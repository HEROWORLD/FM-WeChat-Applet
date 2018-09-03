import {Theme} from "theme-model.js";
var theme = new Theme;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeid:1,
    page:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    this.data.themeid = id;
    this._loadData();
  },

  _loadData:function(){
    theme.getThemeTopicImg((res)=>{
      this.setData({
        themeTopicImg : res
      });
    });

    theme.getThemeList(this.data.themeid,(res)=>{
      this.setData({
        themeList:res
      });
    });
  },

  //滑动swiper改变主题号,根据当前主题号加载数据
  changeSwiper: function (event) {
    var current = event.detail.current;
    this.setData({
      themeid: current + 1
    })
    theme.getThemeList(this.data.themeid, (res) => {
      this.setData({
        themeList: res,
        page:2
      });
    });
  },

  //加载更多数据,id为主题号,page为页码
  loadMoreData:function(event){
    let that = this;
    var id = theme.getDataSet(event,'id');
    let page = that.data.page;   
    theme.getThemeListMore(id,page,(res)=>{
      if (Object.keys(res.theme).length==0){
        wx.showToast({
          title: '亲，已经加载到底啦',
          icon: 'none',
        });
      }else{
        res.theme.forEach((item) => {
          //入栈追加数据
          that.data.themeList.theme.push(item);
          var moreData = that.data.themeList;
          //设置当前列表的缓存
          var currentList = "currentList";
          that._setStorageSync(currentList,moreData.theme);
          that.setData({
            themeList: moreData,
            page:page++,
          })
        })
      }
    });
  },

  //跳转到播放页面
  navigateToPlayer:function(event){
    var id = theme.getDataSet(event,'id');
    var index = theme.getDataSet(event,'index');
    wx.redirectTo({
      url: '../player/player?id=' + id + '&index=' + index,
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
  //设置缓存
  _setStorageSync(id, data) {
    wx.setStorageSync(id, data)
  },
})