var app = getApp();

console.log('my');

Page({
  data: {
    myInfo: null
  },
  onShow: function() {
    var self = this;
    app.ajax({
      url: app.globalData.serviceUrl + 'muser.htm',
      data: {token: 'CFBD8A9B33942457B4F346F5756C5E59'},
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