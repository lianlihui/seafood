var app = getApp();

Page({
  data: {
    address: '定位中',
    imageRootPath: '',
    shopInfo: null,
    modalSpecShow: false, // 规格弹窗是否显示
    modalSpecIndex: 0,
    currentRoom: '',
    chooseRoom: '',
    time: '',  //用餐时间
    dinnerIdx: 0,
    shopId:'',
    modalSubShow:false,   //确定预约弹框
    timeArray:[[],[],[]],
    timeIndex:[0,0,0],
    timeTxt:'请选择用餐时间',
    dateArr:[],
    selTimeVal:[]
  },

  //用餐时间确定
  bindMultiPickerChange: function (e) {
    var selVal = e.detail.value;
    var timeArray = this.data.timeArray;
    var hh = timeArray[1][selVal[1]] < 10 ? '0' + timeArray[1][selVal[1]] : timeArray[1][selVal[1]] ;
    var mm = timeArray[2][selVal[2]] < 10 ? '0' + timeArray[2][selVal[2]] : timeArray[2][selVal[2]];
    var ss = timeArray[0][selVal[0]]+" "
      + hh + ":" + mm;
    this.setData({
      timeTxt: ss,
      selTimeVal: e.detail.value
    });
  }, 

  timeFormat: function (today){
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var week = "星期" + "日一二三四五六".charAt(today.getDay());
    var dates = month + '月' + day + '日 ' + week;
    return dates;
  },  

  onLoad: function(query) {
    var self = this;

    //用餐时间赋值
    var currentDd = new Date();
    var ddTimeFormat = currentDd.getTime();
    var arr = [];
    var endTime = new Date('2018/12/31 23:59:59');
    var allDay = Math.ceil((endTime.getTime() - currentDd.getTime())/(1000*60*60*24));
    var dd = null;

    arr[0] = [];
    for(var i=0;i<=allDay;i++){
      var dd = new Date();
      dd.setDate(dd.getDate() + i);

      var year = dd.getFullYear();
      var month = dd.getMonth() + 1;
      var day = dd.getDate();
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      var sday = year + '-' + month + '-' + day;
      self.data.dateArr.push(sday);  //保存时间组，用于获取

      var ss = this.timeFormat(dd);
      arr[0].push(ss);
    }
    
    arr[1]=[];
    arr[2]=[];
    for(var i=0;i<=23;i++){
      arr[1].push(i);
    }
    for (var i = 0; i <= 59; i++) {
      arr[2].push(i);
    }
    self.setData({
      timeArray: arr
    });
    
    self.setData({
      shopId: query.id
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        self.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        app.ajax({
          url: app.globalData.serviceUrl + 'mshopdetail.html',
          data: {
            id: query.id,
            latitude: res.latitude,
            longitude: res.longitude
          },
          successCallback: function(ress) {
            if (ress.code == 0) {
              self.setData({
                address: ress.data.address,
                imageRootPath: ress.data.imageRootPath,
                shopInfo: ress.data.shopbean
              });
              if (ress.data.shopbean.roomlist && ress.data.shopbean.roomlist.length > 0) {
                self.setData({
                  currentRoom: ress.data.shopbean.roomlist[0].name
                });
              }
            } else {
            }
          },
          failCallback: function(ress) {

          }
        });

      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  //打电话
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

  //用餐选择
  bindDinnerChange:function(e){
    var vl = e.detail.value;
    if (/^\d{1,2}$/.test(vl)) {
      this.setData({
        dinnerIdx: vl
      });
    } else {
      self.showMsg('请输入正确的就餐人数');
    }
  },

  //选择房间
  selectSpec: function(e) {
    var data = e.target.dataset;
    this.setData({
      modalSpecIndex: data.index,
      currentRoom: data.name
    });
  },

  //选好了
  addRoom: function(e) {
    var data = e.target.dataset;
    var room = data.room;

    this.setData({
      modalSpecShow: false,
      chooseRoom: room
    });
  },

  closeModal: function(e, modalName) {
    var modal = modalName || e.target.dataset.modal

    if (modal == 'specModal') {
      this.setData({
        modalSpecShow: false
      });
    } else if (modal == 'perModal') {
      this.setData({
        isShow: false
      });
    }
  },

  //选择房间
  bindChooseRoom: function() {
    this.setData({
      modalSpecShow: true
    });
  },

  //确定预约
  subClick:function(){
    var self = this;
    
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    } 

    if (!self.data.chooseRoom) {
      self.showMsg('请选择就餐房型');
      return false;
    }

    if (self.data.selTimeVal.length == 0) {
      self.showMsg('请选择用餐时间');
      return false;
    }

    var time = '';
    var selVal = self.data.selTimeVal;
    var timeArray = self.data.timeArray;
    var dateArr = self.data.dateArr;
    var hh = timeArray[1][selVal[1]] < 10 ? '0' + timeArray[1][selVal[1]] : timeArray[1][selVal[1]];
    var mm = timeArray[2][selVal[2]] < 10 ? '0' + timeArray[2][selVal[2]] : timeArray[2][selVal[2]];

    var oDate = new Date();
    var ss = oDate.getSeconds(); //秒
    time = dateArr[selVal[0]] + " " + hh + ":" + mm +":"+ (ss < 10 ? '0' + ss : ss);

    self.setData({
      time: time,
      modalSubShow: true
    });
  },

  //取消预约
  qxSub:function(){
    var self = this;
    self.setData({
      modalSubShow: false
    });
  },

  //确定预约
  qdSub: function () {
    var self = this;

    var postData = {
      token: app.globalData.token,
      shopid: self.data.shopId,
      room: self.data.chooseRoom,
      number: self.data.dinnerIdx,
      time: self.data.time
    }

    app.ajax({
      url: app.globalData.serviceUrl + 'msubscribeadd.htm',
      data: postData,
      successCallback: function (ress) {
        if(ress.code==0){
          app.globalData.orderTab='my';
          //跳转到我的私宴
          wx.switchTab({
            url: '/pages/order/list/list'
          });
        }else{
          console.log(ress.msg);
        }
      },
      failCallback: function (ress) {

      }
    });
  },

  showMsg:function(msg){
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    });
  }

});