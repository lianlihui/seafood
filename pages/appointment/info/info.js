var app = getApp();

Page({
  data: {
    address: '定位中',
    imageRootPath: '',
    shopInfo: null
  },

  onLoad: function(query) {
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
          url: app.globalData.serviceUrl + 'mshopdetail.html',
          data: {
            id: query.id,
            latitude: res.latitude,
            longitude: res.longitude
          },
          successCallback: function(ress) {
            console.log(ress);
            if (ress.code == 0) {
              self.setData({
                address: ress.data.address,
                imageRootPath: ress.data.imageRootPath,
                shopInfo: ress.data.shopbean
              });
            } else {
            }
            console.log(ress.data.shopbean);
          },
          failCallback: function(ress) {

          }
        });

      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  bindPhoneTab: function(event) {
    var phoneNumber = event.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function(res) {
        console.log(res);
      }, 
      fail: function(res) {
        console.log(res);
      }
    });
  }
});