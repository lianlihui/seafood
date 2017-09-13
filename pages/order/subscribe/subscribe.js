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
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    }

    var self=this;
    self.setData({
      id: query.id
    });
    var postData = {
      token: app.globalData.token,
      id: query.id
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mSubscribeDetail.htm',
      data: postData,
      successCallback: function (ress) {
        if (ress.code == 0) {
          ress.data.subscribebean.time = self.timeFormat(ress.data.subscribebean.time);
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
              qxBtn: false,
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
      },
      failCallback: function (ress) {

      }
    });
  },

  //我的预约时间格式化
  timeFormat: function (timeStr) {
    var time = new Date(timeStr.replace(/-/gi, '/'));
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var day = time.getDay();
    var hour = time.getHours();
    var minutes = time.getMinutes();
    month < 10 ? month = '0' + month : month;
    hour < 10 ? hour = '0' + hour : hour;
    minutes < 10 ? minutes = '0' + minutes : minutes;

    var week = "星期" + "日一二三四五六".charAt(time.getDay());
    var now_time = month + '月' + date + '日'
      + ' ' + week + ' ' + hour + ':' + minutes;
    return now_time;
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
            token: app.globalData.token,
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