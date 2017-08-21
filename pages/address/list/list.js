var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    'addressList':[]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    console.log('cc');
    var self = this;
    var postData = {
      token: 'CFBD8A9B33942457B4F346F5756C5E59'
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'maddresslist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        console.log(res);
        self.setData({
          addressList: res.data.addresslist
        });
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //编辑地址信息
  editAddress: function (event) {
    var id = event.target.dataset.id;
    wx.redirectTo({
      url: '../edit/edit?id=' + id
    })

  }
})