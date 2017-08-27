var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _code:'',  //微信小程序code
    phone:'',
    smscode:'',
    smscodeTxt: '发送验证码',
    smscodeTime: 60  //验证码倒计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var self = this;
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

  //发送验证码倒计时
  smscodeTimeCli: function () {
    var self = this;
    var countdown = self.data.smscodeTime;

    if (countdown == 0) {
      self.setData({
        smscodeTxt: '发送验证码',
        smscodeTime: 60
      });
      return false;
    } else {
      var time = countdown - 1;
      self.setData({
        smscodeTxt: countdown + "s重新发送",
        smscodeTime: time
      });
    }
    setTimeout(function () {
      self.smscodeTimeCli()
    }, 1000)
  },

  //发送验证码
  sendSmsCode: function(){

    wx.navigateBack({
      delta: 1
    })

    var self = this;

    if (!/^1[34578]\d{9}$/.test(self.data.phone)) {
      self.showMsg('请输入正确的手机号码');
      return false;
    }

    //60秒发送一次
    if (self.data.smscodeTime < 60) {
      return false;
    }
    self.smscodeTimeCli();

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

    if (!/^1[34578]\d{9}$/.test(self.data.phone)) {
      self.showMsg('请输入正确的手机号码');
      return false;
    }

    if (!self.data.smscode) {
      self.showMsg('请输入验证码');
      return false;
    }

    wx.login({
      success: function (res) {
        if (res.code) {
          var _code = res.code;
          
          var postData = {
            phone: self.data.phone,
            smscode: self.data.smscode,
            _code: _code
          };

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
              } else {
                self.showMsg(res.msg);
              }
            },
            failCallback: function (res) {
              console.log(res);
            }
          });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
        console.log('_code:' + self.data._code);
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