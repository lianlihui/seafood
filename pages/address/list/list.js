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
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    }
    console.log('cc');
    var self = this;
    var postData = {
      token: app.globalData.token
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