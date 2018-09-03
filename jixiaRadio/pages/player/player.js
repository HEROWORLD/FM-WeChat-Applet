const app = getApp();

import { PlayList } from 'player-model.js';
import { Person } from 'person-model.js';
import { Audio } from '../../utils/audio.js';
import { Upload } from 'upload-data.js';
var playlist = new PlayList;
var person = new Person;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 1, //当前页
    isCollection: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userCollection:[],
    currentList: {},
    playingIndex: 0, //当前播放索引
    currentTime: '00:00',
    duration: '00:00',
    progress: 0,
    playing: false,
    waiting: true,
    showList: false,  //todo::展示当前播放列表
    play_number:[],
  },
  //收藏事件
  isCollectionChange: function(event) {
    var collectionStatus = this.data.isCollection;
    var userCollection = this.data.userCollection;
    var currentPlay = this.data.currentPlay;
    var id = currentPlay.id.toString();
    if (collectionStatus) {
      var index = this.data.collectionIndex;
      userCollection.splice(index,1);
      this.setData({
        isCollection: false,
        userCollection: userCollection,
        currentPlay: currentPlay
      });
    } else {
      //如果当前播放字段过长，截取字符
      var unshiftdata = currentPlay;
      if (unshiftdata.audio_title.length > 19) {
        unshiftdata.audio_title = unshiftdata.audio_title.slice(0, 19) + "..."; //要截取字段的字符串
      }
      userCollection.unshift(unshiftdata);
      //重置当前的播放的信息
      var currentPlay = wx.getStorageSync(id);
      this.setData({
        isCollection: true,
        userCollection: userCollection,
        currentPlay: currentPlay,
        collectionIndex:0
      });
    }
  },

  // 导航切换事件
  navItemsChange: function(event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      currentIndex: index
    });
  },

  //列表页传参
  navigateToPlayView: function(event) {
    //根据id去缓存中取数据
    
    var audioId = playlist.getDataSet(event, "currentid");
    var currentListdata = playlist.getDataSet(event, "currentlist");
    this._setStorageSync("currentList", currentListdata);
    var currentList = this._loadStorageSync("currentList");
    var currentPlay = this._loadStorageSync(audioId.toString());
    var index = parseInt(playlist.getDataSet(event, "index")); //当前播放索引
    var audio = new Audio(currentPlay);

    this.setData({
      currentIndex: 1,
      currentList: currentList,
      currentPlay: currentPlay,
      playing: true,
      playingIndex: index,
    });
    //重置数据后检测是否为收藏过的音频
    this._isCollection();
  },


  //播放或者暂停
  changePlayerStatus: function(event) {
    if (!this.backgroundPlayer.src) {
      var audio = new Audio(this.data.currentPlay);
      var duration = this.backgroundPlayer.duration;
      var durationTime = this.secondToDate(duration);
      this.setData({
        playing: !this.data.playing,
        duration: durationTime,
      });
    } else if (this.data.playing) {
      this.backgroundPlayer.pause();
      this.setData({
        playing: !this.data.playing,
      });
    } else if (!this.data.playing) {
      this.backgroundPlayer.play();
      this.setData({
        playing: !this.data.playing,
      });
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        if(res.screenHeight>736){
          that.setData({
            screenHeight:true,
          });
        }
      },
    })

    //登录检测
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //获取全局音频管理
    this.backgroundPlayer = app.globalData.backgroundPlayer;
    
    //由主题页面跳转
    if (options.id) {
      var id = options.id;
      var index = parseInt(options.index); //当前播放索引
      var currentList = this._loadStorageSync("currentList");
      var currentPlay = this._loadStorageSync(id);
      var NewUpdateList = this._loadStorageSync("NewUpdateList");
      var CollectionList = this._loadStorageSync("CollectionList");
      var ShareList = this._loadStorageSync("ShareList");
      var userCollection = this.data.userCollection;
      var audio = new Audio(currentPlay);
      

      this.setData({
        currentList: currentList,
        currentPlay: currentPlay,
        NewUpdateList: NewUpdateList,
        CollectionList: CollectionList,
        ShareList: ShareList,
        userCollection: userCollection,
        playing: true,
        playingIndex: index,
      });
      //重置数据后，检测当前播放是否为收藏过的音频
      this._isCollection();
    } else {
      //默认加载
      this._loadPlayListData();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const that = this;

    // 音频开始播放
    this.backgroundPlayer.onPlay(() => {
      that.setData({
        playing: true
      });
      this.duration = this.backgroundPlayer.duration * 1000 || 0;
    });

    //音频可以播放时
    this.backgroundPlayer.onCanplay(() => {
      //获取音频时间
      var duration = this.backgroundPlayer.duration;
      var durationTime = this.secondToDate(duration);

      //记录当前播放id，传后台记录播放数量
      var player_id = this.data.currentPlay.id;
      this.data.play_number.push(player_id);
      that.setData({
        duration: durationTime,
      });
    });

    // 音频暂停后
    this.backgroundPlayer.onPause(() => {
      that.setData({
        playing: false
      });
    });

    // 音频停止后
    this.backgroundPlayer.onStop(() => {
      that.setData({
        playing: false,
        progress: 0,
      });
    });

    // 自然播放后，自动切换到下一首
    this.backgroundPlayer.onEnded(() => {
      var index = this.data.playingIndex;
      var currentList = this.data.currentList;
      //默认列表为空
      if (JSON.stringify(currentList) == "{}") {
        wx.showToast({
          title: '当前列表无更多内容',
          icon: 'none'
        })
      } else if (index < currentList.length - 1) {
        var currentPlayid = currentList[(index + 1)].id.toString();
        var currentPlay = wx.getStorageSync(currentPlayid);
        var audio = new Audio(currentPlay);
        this.setData({
          playingIndex: index + 1,
          currentPlay: currentPlay,
        })
        this._isCollection();
      } else {
        wx.showToast({
          title: '列表无更多内容',
          icon: 'none'
        })
      }
    });

    //播放进度更新
    this.backgroundPlayer.onTimeUpdate(() => {
      var current = this.backgroundPlayer.currentTime;
      var duration = this.backgroundPlayer.duration;
      var currentTime = this.secondToDate(current);
      //播放进度
      var progress = (current / duration * 10000).toFixed(0);
      that.setData({
        currentTime: currentTime,
        progress: progress,
      });
    });

    this.backgroundPlayer.onPrev(() => {

    });

    this.backgroundPlayer.onNext(() => {

    });

    //音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
    this.backgroundPlayer.onWaiting(() => {
      //  wx.showToast({
      //    title: '加载中',
      //    icon:'loading',
      //  })
    });

    this.backgroundPlayer.onError((res) => {
      let msg = '';
      switch (res.errCode) {
        case 10001:
          msg = '系统错误';
          break;
        case 10002:
          msg = '网络错误';
          break;
        case 10003:
          msg = '文件错误';
          break;
        case 10004:
          msg = '格式错误';
          break;
        default:
          msg = '未知错误';
          break;
      }
      wx.showToast({
        title: msg,
        icon: "none",
      })
      that.setData({
        waiting: true
      });
    });


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var upload = new Upload;
    upload.updatePlayerNumber(this.data.play_number); 
    upload.uploadUserCollection(this.data.userCollection);
    this.setData({
      play_number:{},
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    
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

  //获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //播放列表页截取字符串
  _subStr(res) {
    res.forEach((item) => {
      if (item.audio_title.length > 19) {
        item.audio_title = item.audio_title.slice(0, 19) + "..."; //要截取字段的字符串
      } else {
        item.audio_title = item.audio_title.slice(0, 19)
      }
    })
  },

  //获取默认加载的数据
  _loadPlayListData() {
    playlist.getNewUpdateList((res) => {
      this._subStr(res);
      this._setStorageSync("NewUpdateList", res);
      this.setData({
        NewUpdateList: res
      })
    });
    playlist.getCollectionList((res) => {
      this._subStr(res);
      this._setStorageSync("CollectionList", res);
      this.setData({
        CollectionList: res
      })
    });
    playlist.getShareList((res) => {
      this._subStr(res);
      this._setStorageSync("ShareList", res);
      this.setData({
        ShareList: res
      })
    });
    playlist.getDefaultRadio((res) => {
      this.setData({
        currentPlay: res,
      });
    });
    person.getUserCollectionList((res) => {
      this._subStr(res);
      this._setStorageSync("userCollection", res);
      this.setData({
        userCollection: res,
      });
      //加载个人中心的数据后，检测默认是否为个人收藏
      this._isCollection();
    });  
  },

  //主题页跳转
  navigateToTheme: function(event) {
    var id = playlist.getDataSet(event, "themeid");
    wx.navigateTo({
      url: '../theme/theme?id=' + id,
    })
  },
  //文章页跳转
  navigateToArticle: function(event) {
    var wxurl = playlist.getDataSet(event, "wxurl");
    wx.navigateTo({
      url: '../article/article?wxurl=' + wxurl,
    })
  },
  //设置缓存
  _setStorageSync(id, data) {
    wx.setStorageSync(id, data)
  },
  _loadStorageSync(id) {
    var value = wx.getStorageSync(id);
    return value;
  },
  //时间转换
  secondToDate(date) {
    if (Math.floor(date / 60) < 10) {
      var m = '0' + Math.floor(date / 60);
    } else {
      var m = Math.floor(date / 60);
    }
    var s = Math.floor((date % 60)) < 10 ? '0' + Math.floor((date % 60)) : Math.floor((date % 60));
    return date = m + ":" + s;
  },
  //改变当前进度事件
  changeprogress: function(event) {
    var progress = event.detail.value / 10000;
    var duration = this.backgroundPlayer.duration;
    var playStatus = this.data.playing;
    if (!duration || !playStatus) {
      wx.showToast({
        title: '请先播放音频',
        icon: 'none',
      })
    }
    var currentSeek = progress * duration;
    this.backgroundPlayer.seek(currentSeek);
  },
  //上一曲
  onPrev: function(event) {
    var index = this.data.playingIndex;
    var currentList = this.data.currentList;
    if (index === 0) {
      wx.showToast({
        title: '已经是第一首啦',
        icon: 'none'
      })
    } else {
      var currentPlayid = currentList[index - 1].id.toString();
      var currentPlay = wx.getStorageSync(currentPlayid);
      var audio = new Audio(currentPlay);
      this.setData({
        playingIndex: (index - 1),
        currentPlay: currentPlay,
      })
      this._isCollection();
    }
  },
  //下一曲
  onNext: function(event) {
    var index = this.data.playingIndex;
    var currentList = this.data.currentList;
    //默认列表为空
    if (JSON.stringify(currentList) == "{}") {
      wx.showToast({
        title: '列表无更多内容',
        icon: 'none'
      })
    } else if (index < currentList.length - 1) {
      var currentPlayid = currentList[(index + 1)].id.toString();
      var currentPlay = wx.getStorageSync(currentPlayid);
      var audio = new Audio(currentPlay);
      this.setData({
        playingIndex: (index + 1),
        currentPlay: currentPlay,
      })
      this._isCollection();
    } else {
      wx.showToast({
        title: '列表无更多内容',
        icon: 'none'
      })
    }
  },
  //swiper切换事件
  changeSwiper:function(event){
    var currentIndex = event.detail.current;
    this.setData({
      currentIndex:currentIndex,
    })
  },
  //评论跳转
  navigateToComment:function(event){
    wx.showToast({
      title: '暂未开放',
      icon:'none',
    })
  },
  //跳转分享
  navigateToShare:function(event){
    wx.showToast({
      title: '下个版本即将更新，敬请期待',
      icon: 'none',
    })
  },
  //个人中心页-删除收藏
  deleteCollection:function(event){
v
  },
  //个人中心页-删除收藏
  deleteCollection:function(event){
    var index = person.getDataSet(event,'index');
    var collectionList = this.data.userCollection;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此条收藏吗？',
      showCancel:true,
      success:function(res){
        if (res.confirm) {
          collectionList.splice(index, 1);
          that.setData({
            userCollection: collectionList
          });
        } else if (res.cancel) {
          return true;
        }
      }
    })  
  },
  //播放页-当前播放是否为收藏
  _isCollection(){
    var currentPlay = this.data.currentPlay;
    var collectionList = this.data.userCollection;
    function checkDup(array, obj) {
      var id = obj.id;
      for (var i = 0; i < array.length; i++) {
        if (obj) {
          if (array[i]) {
            var arrayid = array[i].id;
            if (id === arrayid) {
              return {
                status:true,
                collectionIndex:i
              };
            }
          }
        }
      }
      return false;
    };
    var result = checkDup(collectionList, currentPlay).status;
    var collectionIndex = checkDup(collectionList, currentPlay).collectionIndex;
    if (result) {
      this.setData({
        isCollection: true,
        collectionIndex: collectionIndex
      });
    } else {
      this.setData({
        isCollection: false,
        collectionIndex: {},
      });
    }
  }

})