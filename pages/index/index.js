//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    'imgUrls': [],
    'imageRootPath': '',
    'warelablelist': [],
    'indicatorDots': true,
    'indicatorColor': '#bdaea7',
    'indicatorActiveColor': '#5eaaf9',
    'autoplay': true,
    'interval': 5000,
    'duration': 1000,
    'foodList': []
  },
  onShow: function() {
    var self = this;
    var postData = {
      token: ''
    };
    
    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'mindex.html',
      data: postData,
      method: 'GET',
      successCallback: function(res) {
        console.log(res);
        self.setData({
          imgUrls: res.data.poslinklist,
          imageRootPath: res.data.imageRootPath,
          warelablelist: res.data.warelablelist
        });
      },
      failCallback: function(res) {
        console.log(res);
      }
    });
  }
})