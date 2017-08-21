var app = getApp();
// var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
// var qqmapsdk;

Page({
  data: {
    address: '定位中',
    imageRootPath: '',
    shoplist: [],
    loading: '加载中'
  },
  onLoad: function() {
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res);
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        app.ajax({
          url: app.globalData.serviceUrl + 'mshoplist.html',
          data: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          successCallback: function(ress) {
            console.log(ress);
            if (ress.code == 0) {
              var shoplist = ress.data.shoplist;
              for (var i = 0, len = shoplist.length; i < len; i++) {
                shoplist[i]['distance'] = (shoplist[i]['distance']/1000).toFixed(2);
              }
              self.setData({
                shoplist: shoplist,
                imageRootPath: ress.data.imageRootPath,
                address: ress.data.address,
                loading: '加载完成'
              });
            } else {
              self.setData({
                loading: '加载失败，请重新加载'
              });
            }
            console.log(ress.data.shoplist);
          },
          failCallback: function(ress) {
            self.setData({
              loading: '加载失败，请重新加载'
            });
          }
        });

      },
      fail: function() {
        self.setData({
          address: '定位失败'
        });
      }
    });
  },
  bindRefreshTab: function() {
    wx.redirectTo({
      url: '/pages/appointment/list/list'
    });
    //location.reload();
  },
  onShow: function() {
    //var self = this;

  }

});