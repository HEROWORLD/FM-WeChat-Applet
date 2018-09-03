import {
  Base
} from '../../utils/base.js';

class PlayList extends Base {
  constructor() {
    super();
  }
  
  getDefaultRadio(callback){
    var params ={
      url:'radio/default',
      sCallback: function (res) {
        var id = res.id.toString();
        if (!wx.getStorageSync(id)){
          wx.setStorageSync(id, res);
        }
        callback && callback(res);
      }
    }
    this.request(params);
  }

  getNewUpdateList(callback) {
    var that = this;
    var params = {
      url: 'radio/orderByNewUpdate',
      sCallback: function(res) {
        if (res instanceof Array) {
          that._foreachSetStorageSync(res);
        }
        callback && callback(res);
      }
    }
    this.request(params);
  }

  getCollectionList(callback) {
    var that = this;
    var params = {
      url:'radio/orderByCollection',
      sCallback:function(res){
        if (res instanceof Array) {
          that._foreachSetStorageSync(res);
        }
        callback&&callback(res)
      }
    }
    this.request(params)
  }

  getShareList(callback){
    var that = this;
    var params = {
      url:'radio/orderByShare',
      sCallback:function(res){
        if (res instanceof Array) {
          that._foreachSetStorageSync(res);
        }
        callback&&callback(res)
      }
    }
    this.request(params)
  }

  getCommentList(callback) {
    var that = this;
    var params = {
      url: 'radio/orderByComment',
      sCallback: function (res) {
        if (res instanceof Array) {
          that._foreachSetStorageSync(res);
        }
        callback && callback(res)
      }
    }
    this.request(params)
  }

  //数据循环设置缓存
  _foreachSetStorageSync(res){
    res.forEach((item) => {
      var id = item.id.toString();
      if (wx.getStorageSync(id)){
        return true;
      }else{
        wx.setStorageSync(id, item);
      }
    })
  }
}

export {
  PlayList
};