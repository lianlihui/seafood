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
      subscribelist:[],
      syPage:1,
      myPage:1
    });
    this.getSyData();
  },

  myClick: function () {
    this.setData({
      syStatus: false,
      myStatus: true,
      syCls: 'order-header-item',
      myCls: 'order-header-item active',
      orderlist:[],
      subscribelist:[],
      syPage:1,
      myPage:1
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
        }else{
          list = self.data.orderlist.concat(res.data.orderlist);
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
        } else {
          list = self.data.subscribelist.concat(res.data.subscribelist);
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