let app = getApp()
let globalData = app.globalData

// orderdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist: [], // 全部地址
    address: {}, // 填充的地址
    imageRootPath: '', // 图片根路径
    couponslist: [],
    list: [], // 订单商品
    freight: 0, // 配送费
    date: '2017-01-01',
    day: '日',
    time: '12:00',
    addressid: 0,
    couponsid: 0,
    remarks: '',
    sendtime: '',
    amount: 0 // 总金额 = 商品 + 运费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const d = new Date()
    const {imageRootPath, warelist, addressbean, couponslist} = globalData.newOrder.data
    const list = warelist
    const date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
    const day = ['日','一','二','三','四','五','六'][d.getDay()]
    const sendtime = date + ' ' + this.data.time
    let addressid
    let address
    let freight
    let amount = 0

    if (addressbean) {
      addressid = addressbean.id
      freight = addressbean.freight
      address = addressbean
    }

    list.forEach(v => {
      amount += v.number * v.sizeprice
    })

    if (addressbean === undefined) {
      this.calcDefaultFreight()
    } else {
      amount += parseInt(freight)
    }

    this.setData({
      imageRootPath, list, freight, date, day, address, sendtime, addressid, couponslist ,amount
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 时间
  bindTimeChange (e) {
    this.setData({
      time: e.detail.value
    })
  },

  // 日期
  bindDateChange (e) {
    const date = e.detail.value
    const dateArr = date.split('-')
    let day = new Date(dateArr[0], dateArr[1]-1, dateArr[2]).getDay()
    day = ['日','一','二','三','四','五','六'][day]
    this.setData({
      date,
      day
    })
  },

  // 提交订单
  confirmOrder (e) {
    const that = this;
    const {addressid, couponsid, remarks, sendtime, amount} = that.data
    let postData = Object.assign(globalData.newOrder.postData, {
      addressid,
      remarks,
      sendtime
    })
    if (couponsid) {postData.couponsid = couponsid}

    wx.showLoading({title: '正在提交订单', mask: true})
    console.log({postData})

    app.ajax({
      url: globalData.serviceUrl + 'mordersub.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        wx.hideLoading()
        // data为订单id
        const {code, data, msg } = res

        if (code == 0) {
          wx.navigateTo({
            url: `/pages/orderpay/orderpay?id=${data}&amount=${amount}`
          })
        } else {
          console.error(msg) 
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    })
  },

  // 计算默认地址的运费
  calcDefaultFreight (token) {
    const that = this
    app.ajax({
      url: globalData.serviceUrl + 'maddresslist.htm',
      data: {
        token: globalData.token
      },
      method: 'GET',
      successCallback: function (res) {
        const {code, data, msg } = res

        if (code == 0) {
          const defaultAddress = data.addresslist.filter(v => v.isdefault)
          const freight = defaultAddress.length && defaultAddress[0].freight || 0
          that.setData({
            freight,
            amount: that.data.amount + freight
          })
        } else {
          console.error(msg) 
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    })
  }
})