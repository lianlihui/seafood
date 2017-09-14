var app = getApp();
var globalData = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    statusTxt:'',
    payTxt:'',
    order:null,
    status: 1,
    actionTxt:'',
    qxStatus:false,
    actionCls:'order-detail-header-recur-btn'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    }

    var self = this;
    self.setData({
      id: options.id
    });
    var id = options.id;
    //获取数据
    var postData = {
      token: app.globalData.token,
      id: id
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'morderdetail.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        var obj = res.data.orderbean;
        var statusTxt = '';
        var payTxt = '';
        obj.createtime = obj.createtime.substring(0,16);
        
        self.setData({
          order: obj
        });

        switch(obj.status) {
          case 1: statusTxt = '未支付'; break;
          case 2: statusTxt = '待配送'; break;
          case 3: statusTxt = '配送中'; break;
          case 4: statusTxt = '已完成'; break;
          case 5: statusTxt = '备货中'; break;
          case 7: statusTxt = '已取消'; break;
          default: statusTxt = '未支付';
        }
        self.setData({ 
          statusTxt: statusTxt
        });

        switch(obj.type) {
          case 1: payTxt = '微信支付'; break;
          case 2: payTxt = '支付宝支付'; break;
          case 3: payTxt = '余额支付'; break;
          case 4: payTxt = '货到付款'; break;
          default: payTxt = '未支付';
        }
        self.setData({ payTxt: payTxt});
      },
      failCallback: function (res) {
      }
    });
  },

  action: function(e) {
    var actionTxt = e.target.dataset.txt;;
    switch(actionTxt) {
      case '立即支付':
        var amount = this.data.order.cost || 0
        var id = this.data.id
        wx.navigateTo({
          url: '/pages/orderpay/orderpay?id=' + id + '&amount=' + amount
        });
        break;
      case '取消订单':
      
      break;
      case '再来一单':
        // 传输订单数据到私宴页面
        globalData.repeatOrder = this.data.order.warelist;
        wx.navigateTo({
          url: '/pages/roomservice/roomservice'
        })
      break
      default:
    }
  },

  //取消订单
  qxOrder:function(){
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success: function (res) {
        if (res.confirm) {
          var id = self.data.id;
          var postData = {
            token: app.globalData.token,
            id: id
          };
          app.ajax({
            url: app.globalData.serviceUrl + 'mordercancel.htm',
            data: postData,
            method: 'POST',
            successCallback: function (res) {
              if (res.code == 0) {
                var obj = self.data.order;
                obj.status = 7;
                self.setData({ 
                  order: obj,
                  statusTxt: '已取消'
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
  },

  bindPhoneTab: function(event) {
    var phoneNumber = event.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function(res) {
      }, 
      fail: function(res) {
      }
    });
  },


})