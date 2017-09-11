var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    syStatus:true,
    myStatus:false,
    syCls:'order-header-item active',
    myCls:'order-header-item',
    imageRootPath:'',
    orderlist:[],
    subscribelist:[],
    syPage:1,
    myPage:1,
    syLoading:false,
    syNoData:false,
    syLoad:true,   //私宴可以分页
    myLoading: false,
    myNoData: false,
    myLoad: true   //预约可以分页
  },

  syClick:function(){
    this.setData({
      syStatus:true,
      myStatus:false,
      syCls: 'order-header-item active',
      myCls: 'order-header-item',
      orderlist:[],
      syPage:1,
      syLoading: false,
      syNoData: false,
      syLoad: true   //私宴可以分页
    });
    this.getSyData();
  },

  myClick: function () {
    this.setData({
      syStatus: false,
      myStatus: true,
      syCls: 'order-header-item',
      myCls: 'order-header-item active',
      subscribelist:[],
      myPage:1,
      myLoading: false,
      myNoData: false,
      myLoad: true   //预约可以分页
    });
    this.getMyData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    }
    this.getSyData();
  },

  //获取我的私宴
  getSyData: function () {
    debugger
    var self = this;
    var postData = {
      token: app.globalData.token,
      page: self.data.syPage
    };

    app.ajax({
      url: app.globalData.serviceUrl + 'morderlist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {

        var list=[];
        if (self.data.orderlist.length==0){
          list = res.data.orderlist;
          //时间格式处理
          for (var i = 0; i < list.length;i++){
            if (list[i].createtime!=null){
              list[i].createtime = list[i].createtime.substring(0,16);
            }
          }
        }else{
          //时间格式处理
          var alist = res.data.orderlist;
          for (var i = 0; i < alist.length; i++) {
            if (alist[i].createtime != null) {
              alist[i].createtime = alist[i].createtime.substring(0, 16);
            }
          }
          list = self.data.orderlist.concat(alist);
        }

        self.setData({
          imageRootPath: res.data.imageRootPath,
          orderlist: list,
          syLoading: false  //隐藏加载
        });

        if (res.data.orderlist.length<10){
          self.setData({
            syNoData: true,  //显示已经没有数据
            syLoad: false  //滚动不用再触发
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //获取我的预约
  getMyData:function(){
    var self = this;
    var postData = {
      token: app.globalData.token,
      page: self.data.myPage
    };

    //获取首页数据    
    app.ajax({
      url: app.globalData.serviceUrl + 'msubscribelist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {

        var list = [];
        if (self.data.subscribelist.length == 0) {
          list = res.data.subscribelist;
          //时间格式处理
          for (var i = 0; i < list.length; i++) {
            if (list[i].time != null) {
              list[i].time = self.timeFormat(list[i].time);
            }
          }
        } else {
          //时间格式处理
          var alist = res.data.subscribelist;
          for (var i = 0; i < alist.length; i++) {
            if (alist[i].time != null) {
              alist[i].time = self.timeFormat(alist[i].time);
            }
          }
          list = self.data.subscribelist.concat(alist);
        }

        self.setData({
          imageRootPath: res.data.imageRootPath,
          subscribelist: list,
          myLoading: false  //隐藏加载
        });

        if (res.data.subscribelist.length < 10) {
          self.setData({
            myNoData: true,  //显示已经没有数据
            myLoad: false  //滚动不用再触发
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //我的预约时间格式化
  timeFormat:function(timeStr){
    var time = new Date(timeStr);
    var month = time.getMonth()+1;
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

  onReachBottom:function(){
    if (this.data.syStatus && this.data.syLoad){
      var page = this.data.syPage+1;
      this.setData({
        syPage: page,
        syLoading:true
      });
      this.getSyData();
    }
    if (this.data.myStatus) {
      if (this.data.myStatus && this.data.myLoad) {
        var page = this.data.myPage + 1;
        this.setData({
          myPage: page
        });
        this.getMyData();
      }
    }
  }
})