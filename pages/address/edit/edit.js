var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    provinces: [],
    cities: [],
    counties: [],
    province:0,
    city:0,
    county:0,
    selAreaVal:'',   //区域选中的值
    address:'',
    bcShow:true,   //显示保存按钮
    ddShow:false,   //显示删除按钮
    isShow: false, // 显示区域选择框
    showDistrict: true, // 默认为省市区三级区域选择
    ordername:'',  //收货人姓名
    mobile:'',  //手机号码
    detailaddress:'', //详细地址
    isdefault:0  //是否默认
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this;
    var title = "编辑地址";
    if (options.id == -1) {
      title = "新增地址";
    }else{
      var self = this;
    }
    self.setData({
      id: options.id,
      ddShow: true
    });
    wx.setNavigationBarTitle({
      title: title
    })
    var id = options.id;
    //获取地址数据
    var postData = {
      token: 'CFBD8A9B33942457B4F346F5756C5E59',
      id:id
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'maddressdetail.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code==0){
          var obj = res.data.addressbean;
          var address = obj.province + '/' 
            + obj.city + '/' + obj.area;
          self.setData({
            ordername: obj.ordername,
            mobile: obj.mobile,
            detailaddress: obj.detailaddress,
            isdefault: obj.isdefault,
            address: address,
            province: obj.province,
            city: obj.city,
            county: obj.area
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //选择地市
  selArea:function(){
    var self=this;
    self.setData({
      bcShow:false,
      ddShow:false,
      isShow:true
    });
    //获取省份
    self.getProvince();
  },

  //获取省份
  getProvince:function(){
    var provinces = new Array();
    var thisPage = this;
    wx.request({
      url: app.globalData.serviceUrl + 'getProvince.html',
      data: {},
      method: 'GET',
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          provinces = data.data.provincelist;
          //根据第一个省份获取地市
          thisPage.getCityByProvinceCode(provinces[0].code);
        }
        thisPage.setData({
          provinces: provinces,
          province:0
        });
      },
      fail: function () {
        console.log('init district information failed');
      }
    })
  },
  //获取地市
  getCityByProvinceCode:function(code){
    var thisPage = this;
    var cities = new Array();
    wx.request({
      url: app.globalData.serviceUrl + 'getArea.html',
      data: { 'code': code },
      method: 'GET',
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          cities = data.data.list;
          //根据第一个地市获取区
          thisPage.getCountiesByCityCode(cities[0].code);
        }
        thisPage.setData({
          cities: cities,
          city: 0
        })
      },
      fail: function () {
        console.log('init district information failed');
      }
    })
  },
  //获取区
  getCountiesByCityCode: function (code) {
    var thisPage = this;
    var counties = new Array();
    wx.request({
      url: app.globalData.serviceUrl + 'getArea.html',
      data: { 'code': code },
      method: 'GET',
      success: function (res) {
        var data = res.data;
        if (data.code == 0) {
          counties = data.data.list;
        }
        thisPage.setData({
          counties: counties,
          county: 0
        })
      },
      fail: function () {
        console.log('init district information failed');
      }
    })
  },

  //选择区域触发
  bindChangeArea: function (e) {
    const current_value = e.detail.value;
    var self=this;
    self.data.selAreaVal = current_value;

    if (current_value.length > 2) {
      if (self.data.province !== current_value[0] 
        && self.data.city === current_value[1] 
        && self.data.county === current_value[2]) {
        // 滑动省份
        var provinceCode = self.data.provinces[current_value[0]].code;
        self.getCityByProvinceCode(provinces[0].code);
      } else if (self.data.province === current_value[0]
        && self.data.city !== current_value[1]
        && self.data.county === current_value[2]) {
        // 滑动城市
        var cityCode = self.data.cities[current_value[1]].code;
        self.getCountiesByCityCode(cityCode);
      } else if (self.data.province === current_value[0]
        && self.data.city === current_value[1]
        && self.data.county !== current_value[2]) {
        // 滑动地区
        var address = self.data.provinces[current_value[0]].name 
          + '/' + self.data.cities[current_value[1]].name 
          + '/' + self.data.counties[current_value[2]].name;
      }
    }
  },

  //取消选择
  qxSelArea:function(){
    var self = this;
    self.setData({
      bcShow: true,
      isShow: false
    });
    //显示删除按钮
    if(self.data.id!=-1){
      self.setData({
        ddShow: true
      });
    }
  },

  //确定选择
  qdSelArea: function () {
    var self = this;
    var current_value = self.data.selAreaVal;
    if (current_value==''){
      current_value=[0,0,0];  //如果没有触发选择，默认第一个
    }
    var address = self.data.provinces[current_value[0]].name
      + '/' + self.data.cities[current_value[1]].name
      + '/' + self.data.counties[current_value[2]].name;
    //重新设置选中的值
    self.setData({
      province: current_value[0],
      city: current_value[1],
      county: current_value[2],
      address: address
    });
    self.setData({
      bcShow: true,
      isShow: false
    });
    //显示删除按钮
    if (self.data.id != -1) {
      self.setData({
        ddShow: true
      });
    }
  },

  //默认地址切换
  defaultChange:function(){
    if (this.data.isdefault==0){
      this.setData({
        isdefault: 1
      });
    }else{
      this.setData({
        isdefault: 0
      });
    }
  },

  //表单提交
  formSubmit: function (e) {
    var self = this;
    var formData = e.detail.value;
    formData.isdefault = self.data.isdefault;
    formData.province ='';
    if (self.data.provinces.length!=0){
      formData.province = self.data.provinces[self.data.province].name;
    }
    formData.city ='';
    if (self.data.cities.length != 0) {
      formData.city = self.data.cities[self.data.city].name;
    }
    formData.area ='';
    if (self.data.counties.length != 0) {
      formData.area = self.data.counties[self.data.county].name;
    }
    self.saveOrUpdate(formData);
  },

  saveOrUpdate: function (postData){
    postData.token ='CFBD8A9B33942457B4F346F5756C5E59';
    var url = app.globalData.serviceUrl + 'maddressadd.htm';
    if(this.data.id!=-1){
      url = app.globalData.serviceUrl + 'maddressupdate.htm';
      postData.id = this.data.id;
    }
    //添加地址   
    app.ajax({
      url: url,
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        if(res.code==0){
          wx.redirectTo({
             url: '../list/list'
          })
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //删除地址
  deleteAddress:function(){
    var self=this;
    wx.showModal({
      title: '提示',
      content: '确定删除该地址？',
      success: function (res) {
        if (res.confirm) {
          var id = self.data.id;
          var postData = {
            token: 'CFBD8A9B33942457B4F346F5756C5E59',
            id: id
          };
          app.ajax({
            url: app.globalData.serviceUrl + 'maddressdel.htm',
            data: postData,
            method: 'POST',
            successCallback: function (res) {
              if (res.code == 0) {
                wx.redirectTo({
                  url: '../list/list'
                })
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
})