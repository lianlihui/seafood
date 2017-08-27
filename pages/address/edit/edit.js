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
    address:'请选择(省)/请选择(市)/请选择(区)',
    bcShow:true,   //显示保存按钮
    ddShow:false,   //显示删除按钮
    isShow: false, // 显示区域选择框
    showDistrict: true, // 默认为省市区三级区域选择
    ordername:'',  //收货人姓名
    mobile:'',  //手机号码
    detailaddress:'', //详细地址
    isdefault:0,  //是否默认

    areaArray: [[],[],[]],
    areaIndex: [0, 0, 0],

  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var self = this;
    var current_value = e.detail.value;

    var address = self.data.areaArray[0][current_value[0]].name
      + '/' + self.data.areaArray[1][current_value[1]].name
      + '/' + self.data.areaArray[2][current_value[2]].name;
    self.setData({
      areaIndex: current_value,
      address: address
    });
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var self=this;
    
    var col = e.detail.column;
    var val = e.detail.value;
    //切换省份
    if (col == 0){
      var code = self.data.areaArray[0][val].code;
      self.getCityByProvinceCode(code);
    }
    //切换地市
    if (col == 1) {
      var code = self.data.areaArray[1][val].code;
      console.log('code:'+code);
      self.getCountiesByCityCode(code);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    }

    var self=this;
    self.getProvince();

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
    if (options.id != -1) {
      var id = options.id;
      //获取地址数据
      var postData = {
        token: app.globalData.token,
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
            
            self.getAreaByName(obj.province, obj.city, obj.area);

            self.setData({
              ordername: obj.ordername,
              mobile: obj.mobile,
              detailaddress: obj.detailaddress,
              isdefault: obj.isdefault,
              address: address
            });
          }
        },
        failCallback: function (res) {
          console.log(res);
        }
      });
    }
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
          
          var areaArray = thisPage.data.areaArray;
          areaArray[0] = provinces;
          thisPage.setData({
            areaArray: areaArray
          });

          //根据第一个省份获取地市
          thisPage.getCityByProvinceCode(provinces[0].code);
        }
        
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

          var areaArray = thisPage.data.areaArray;
          areaArray[1] = cities;
          thisPage.setData({
            areaArray: areaArray
          });

          if (thisPage.data.id==-1){
            //根据第一个地市获取区
            thisPage.getCountiesByCityCode(cities[0].code);
          }   
        }
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

          var areaArray = thisPage.data.areaArray;
          areaArray[2] = counties;
          thisPage.setData({
            areaArray: areaArray
          });
        }
      },
      fail: function () {
        console.log('init district information failed');
      }
    })
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

    if (!formData.ordername) {
      self.showMsg('请输入收货人');
      return false;
    }

    if (!/^1[34578]\d{9}$/.test(formData.mobile)) {
      self.showMsg('请输入正确的手机号码');
      return false;
    }

    if (!formData.detailaddress) {
      self.showMsg('请输入详细信息');
      return false;
    }

    formData.isdefault = self.data.isdefault;
    var cv = self.data.areaIndex;

    formData.province ='';
    var arr0 = self.data.areaArray[0];
    if (arr0.length!=0){
      formData.province = arr0[cv[0]].name;
    }

    formData.city ='';
    var arr1 = self.data.areaArray[1];
    if (arr1.length != 0) {
      formData.city = arr1[cv[1]].name;
    }

    formData.area ='';
    var arr2 = self.data.areaArray[2];
    if (arr2.length != 0) {
      formData.area = arr2[cv[2]].name;
    }
    self.saveOrUpdate(formData);
  },

  saveOrUpdate: function (postData){
    postData.token = app.globalData.token;
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
            token: app.globalData.token,
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
  },

  //弹框提示
  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '关闭'
    })
  },

  //地址获取code
  getAreaByName: function (provinceName,cityName, countyName) {
    var thisPage = this;
    var areaIndex = thisPage.data.areaIndex;

    wx.request({
      url: app.globalData.serviceUrl + 'getProvince.html',
      data: {},
      method: 'GET',
      success: function (res) {
        var data = res.data;
        var provinces = data.data.provincelist;
        for (var i = 0; i < provinces.length; i++) {
          if (provinceName == provinces[i].name) {
            areaIndex[0] = i;
            break;
          }
        }

        wx.request({
          url: app.globalData.serviceUrl + 'getArea.html',
          data: { 'code': provinces[areaIndex[0]].code },
          method: 'GET',
          success: function (res) {
            var data = res.data;    
            var cities = data.data.list;
            for (var ii = 0; ii < cities.length; ii++) {
              if (cityName == cities[ii].name) {
                areaIndex[1] = ii;
                break;
              }
            }

            if (thisPage.data.id != -1) {
              //根据第一个地市获取区
              thisPage.getCountiesByCityCode(cities[areaIndex[1]].code);
            } 
            
            wx.request({
              url: app.globalData.serviceUrl + 'getArea.html',
              data: { 'code': cities[areaIndex[1]].code },
              method: 'GET',
              success: function (res) {
                var data = res.data;
                var counties = data.data.list;
                for (var iii = 0; iii < counties.length; iii++) {
                  if (countyName == counties[iii].name) {
                    areaIndex[2] = iii;
                    break;
                  }
                }
                thisPage.setData({
                  areaIndex: areaIndex
                });
                console.log(areaIndex);
              }
            });
          }
        });
      },
      fail: function () {
        console.log('init district information failed');
      }
    })
  },
})