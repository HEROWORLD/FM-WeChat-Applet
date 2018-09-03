import {
  Base
} from '../../utils/base.js';

class Theme extends Base {
  constructor() {
    super();
  }

  getThemeList(id,callback) {
    var that = this;
    var params = {
      url: 'theme/'+id,
      sCallback: function (res) {
        //设置列表缓存
        var currentList = "currentList";
        that._setStorageSync(currentList,res.theme);
        //设置单个数据缓存
        that._foreachSetStorageSync(res.theme);
        callback && callback(res);
      }
    }
    this.request(params);
  }

  getThemeListMore(id,page,callback){
    var that = this;
    var params = {
      url: 'theme/'+id+'/'+page,
      sCallback: function (res) {
        that._foreachSetStorageSync(res.theme);
        callback && callback(res);
      }
    }
    this.request(params);
  }

  getThemeTopicImg(callback){
    var params = {
      url: 'theme/top_img',
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }

  //加载缓存
  _loadStorageSync(id) {
    var value = wx.getStorageSync(id);
    return value;
  };
  //数据循环设置缓存
  _foreachSetStorageSync(res) {
    res.forEach((item) => {
      var id = item.id.toString();
      if (this._loadStorageSync(id)) {
        return true;
      } else {
        this._setStorageSync(id, item);
      }
    })
  };
  //设置缓存
  _setStorageSync(id, data) {
    wx.setStorageSync(id, data)
  };

}

export {
  Theme
};