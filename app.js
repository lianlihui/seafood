//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  //获取token
  getToken: function() {
  },

  ajax: function (obj) {
    wx.request({
        url: obj.url,
        data: obj.data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: obj.method || 'POST',
        success: function (res) {
          obj.successCallback && obj.successCallback(res.data);
        },
        fail: function(res) {
          obj.failCallback && obj.failCallback(res);
        }
    });
  },

  getUserInfo: function(cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    serviceUrl: 'http://hjx.pnkoo.cn/'
  }
})
