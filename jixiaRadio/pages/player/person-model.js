import {
  Base
} from '../../utils/base.js';
import { Token } from '../../utils/token.js';
class Person extends Base{
  constructor(){
    super();
  }
  
  getUserCollectionList(callback){
    var that = this;
    var params = {
      url: 'user/collection',
      type:'POST',
      sCallback: function (res) {
        if (res instanceof Array){
          that._foreachSetStorageSync(res);
        }
        callback && callback(res);
      }
    }
    this.request(params);
  }

  //数据循环设置缓存
  _foreachSetStorageSync(res) {
    res.forEach((item) => {
      var id = item.id.toString();
      if (wx.getStorageSync(id)) {
        return true;
      } else {
        wx.setStorageSync(id, item);
      }
    })
  }
}

export {Person}