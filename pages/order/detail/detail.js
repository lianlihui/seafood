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
        obj.createtime = obj.createtime.substring(0,16);
        
        self.setData({
          order: obj
        });

        if (obj.status == 1){
          self.setData({ 
            statusTxt: '未支付', 
            actionTxt: '立即支付', 
            qxStatus:true,
            actionCls: 'order-detail-header-recur-btn-other'
          });
        }
        if (obj.status == 2) {
          self.setData({ 
            statusTxt: '待配送' , 
            actionTxt: '再来一单',
            qxStatus: true,
            actionCls: 'order-detail-header-recur-btn-other'
          });
        }
        if (obj.status == 3) {
          self.setData({ statusTxt: '配送中' , actionTxt: '再来一单'});
        }
        if (obj.status == 4) {
          self.setData({ statusTxt: '已完成' , actionTxt: '再来一单'});
        }
        if (obj.status == 5) {
          self.setData({ statusTxt: '备货中' , actionTxt: '再来一单'});
        }
        if (obj.status == 7) {
          self.setData({ statusTxt: '已取消' , actionTxt: '再来一单'});
        }

        if (obj.type == 1) {
          self.setData({ payTxt: '微信支付' });
        }
        if (obj.type == 2) {
          self.setData({ payTxt: '支付宝支付' });
        }
        if (obj.type == 3) {
          self.setData({ payTxt: '余额支付' });
        }
        if (obj.type == 4) {
          self.setData({ payTxt: '货到付款' });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  action: function () {
    switch(this.data.actionTxt) {
      case '立即支付':
        var amount = this.data.order.cost || 0
        var id = this.data.id
        wx.navigateTo({
          url: '/pages/orderpay/orderpay?id=' + id + '&amount=' + amount
        })
      break
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
                self.setData({ 
                  statusTxt: '已取消', 
                  actionTxt: '再来一单',
                  qxStatus: false,
                  actionCls: 'order-detail-header-recur-btn' });
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
    console.log(event);
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
  },


})