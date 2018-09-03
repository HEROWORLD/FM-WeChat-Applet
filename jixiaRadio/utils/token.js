import {
  Config
} from "config.js";

class Token {
  constructor() {
    this.verifyUrl = Config.restUrl + 'token/verify';
    this.tokenUrl = Config.restUrl + 'token/user';
  }

  verify() {
    var token = wx.getStorageSync('token');
    if (!token) {
      this.getTokenFromServer();
    } else {
      this._verifyTokenFromServer(token);
    }
  }

  //携带令牌去服务器校验令牌
  _verifyTokenFromServer(token) {
    var that = this;
    wx.request({
      url: that.verifyUrl,
      data: {
        token: token
      },
      method: 'POST',
      success: function(res) {
        var valid = res.data.isValid;
        if (!valid) {
          that.getTokenFromServer();
        }
      },
    })
  }

  //从服务器获取token
  getTokenFromServer(callBack) {
    var that = this;
    wx.login({
      success: function(res) {
        wx.request({
          url: that.tokenUrl,
          data: {
            code: res.code
          },
          method: 'POST',
          dataType: 'json',
          success: function(res) {
            wx.setStorageSync("token", res.data.token);
            callBack && callBack(res.data.token);
          },
        })
      },
    })
  }
}

export {
  Token
}