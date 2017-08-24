var app = getApp();

console.log('my');

Page({
  data: {
    myInfo: null
  },

  onLoad: function (options) {
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    } 
    this.getMyData();
  },

  getMyData: function() {
    var self = this;
    app.ajax({
      url: app.globalData.serviceUrl + 'muser.htm',
      data: { token: app.globalData.token},
      method: 'POST',
      successCallback: function(res) {
        self.setData({
          myInfo: res.data.userbean
        });
      },
      failCallback: function(res) {
        console.log('fail' + res);
      }
    });
  }

});