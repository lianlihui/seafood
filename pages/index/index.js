//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    'imgUrls': [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    'indicatorDots': true,
    'indicatorColor': '#bdaea7',
    'indicatorActiveColor': '#5eaaf9',
    'autoplay': true,
    'interval': 5000,
    'duration': 1000,
    'foodList': []
  },
  onShow: function() {
    var that = this;
    var postData = {
      token: ''
    };
    wx.request({
      url: app.globalData.serviceUrl + 'mindex.html',
      data: postData,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res);
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        console.log('complete');
      }
    })
  }
})