var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _code:'',  //微信小程序code
    phone:'',
    smscode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getCurrentPages());
    var self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          self.setData({
            _code: res.code
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
        console.log('_code:'+self.data._code);
      }
    });
    
  },

  //输入手机号码
  phoneClick:function(e){
    var val = e.detail.value;
    this.setData({
      phone: val
    });
  },

  //输入验证码
  smsCodeClick:function(e){
    var val = e.detail.value;
    this.setData({
      smscode: val
    });
  },

  //发送验证码
  sendSmsCode: function(){
    var self = this;
    console.log('phone:' + self.data.phone);

    if (!/^1d{10}$/.test(self.data.phone)) {
      self.showMsg('请输入正确的手机号码');
      return false;
    }

    var postData = {
      phone: self.data.phone
    };

    app.ajax({
      url: app.globalData.serviceUrl + 'msmscodeapp.html',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        console.log(res);
        if(res.code!=0){
          self.showMsg(res.msg);
        }else{
          self.showMsg('验证码已发送');
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //绑定
  loginClick:function(){
    var self = this;
    var postData = {
      phone: self.data.phone,
      smscode: self.data.smscode,
      _code: self.data._code
    };

    if (!/^1d{10}$/.test(self.data.phone)) {
      self.showMsg('请输入正确的手机号码');
      return false;
    }

    if (!self.data.smscode) {
      self.showMsg('请输入验证码');
      return false;
    }

    app.ajax({ 
      url: app.globalData.serviceUrl + 'mwxregist.html',
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        console.log(res);
        if (res.code == 0) {
          //注册成功后设置token
          app.globalData.token = res.data;

          wx.switchTab({
            url: '/pages/index/index'
          });
        }else{
          self.showMsg(res.msg);
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //取消绑定
  cancelClick: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  //弹框提示
  showMsg: function (msg){
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '关闭'
    })
  }
})