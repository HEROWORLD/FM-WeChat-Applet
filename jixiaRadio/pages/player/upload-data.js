import {
  Base
} from '../../utils/base.js';
import { Token } from '../../utils/token.js';
class Upload extends Base {
  constructor() {
    super();
  }


  uploadUserCollection(data,callback){
    var token = wx.getStorageSync('token');
    var that = this;
    var params = {
      url: 'user/updatecollection',
      type: 'PUT',
      data: {
        data:data,
      },
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }

  updatePlayerNumber(data,callback){
    var that = this;
    var params = {
      url: 'radio/update/playnumber',
      type: 'PUT',
      data: {
        data: data,
      },
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    this.request(params);
  }

}

export { Upload }