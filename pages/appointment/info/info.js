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
    dinnerArr:[1,2,3,4,5,6,7,8],
    dinnerIdx:0
  },

  onLoad: function(query) {
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res);
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
            console.log(ress);
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
            console.log(ress.data.shopbean);
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

  bindPhoneTab: function(event) {
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

  //用餐选择
  bindDinnerChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      dinnerIdx: e.detail.value
    });
  },

  selectSpec: function(e) {
    console.log('ee');
    var data = e.target.dataset;
    this.setData({
      modalSpecIndex: data.index,
      currentRoom: data.name
    });
  },

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

  bindChooseRoom: function() {
    this.setData({
      modalSpecShow: true
    });
  },

  //选择就餐人数
  selectNum: function() {
    var self = this;
    self.setData({
      isShow: true
    });
  },

});