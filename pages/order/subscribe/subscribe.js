var app = getApp();

Page({
  data: {
    imageRootPath: '',
    subscribeInfo: null,
    qxBtn:false,
    status:'',
    id:''
  },

  onLoad: function (query) {
    var self=this;
    self.setData({
      id: query.id
    });
    var postData = {
      token: 'CFBD8A9B33942457B4F346F5756C5E59',
      id: query.id
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mSubscribeDetail.htm',
      data: postData,
      successCallback: function (ress) {
        console.log(ress);
        if (ress.code == 0) {
          self.setData({
            imageRootPath: ress.data.imageRootPath,
            subscribeInfo: ress.data.subscribebean
          });
          var obj = ress.data.subscribebean;
          if (obj.status ==0){
            self.setData({
              qxBtn: true,
              status: '等待到店'
            });
          } else if (obj.status == 1) {
            self.setData({
              qxBtn: true,
              status: '预约完成'
            });
          } else if (obj.status == 2) {
            self.setData({
              qxBtn: false,
              status: '已取消'
            });
          }
        } else {
        }
        console.log(ress.data.subscribebean);
      },
      failCallback: function (ress) {

      }
    });
  },

  bindPhoneTab: function (event) {
    var phoneNumber = event.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  //取消预约
  qxClick:function(){
    var self=this;
    wx.showModal({
      title: '提示',
      content: '确定取消预约？',
      success: function (res) {
        if (res.confirm) {
          var id = self.data.id;
          var postData = {
            token: 'CFBD8A9B33942457B4F346F5756C5E59',
            id: id
          };
          app.ajax({
            url: app.globalData.serviceUrl + 'mSubscribeCancle.htm',
            data: postData,
            method: 'POST',
            successCallback: function (res) {
              if (res.code == 0) {
                self.setData({
                  qxBtn: false,
                  status: '已取消'
                });
              }
            },
            failCallback: function (res) {
              console.log(res);
            }
          });
        }
      }
    })
  }
});