// orderpay.js
let app = getApp()
let globalData = app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0, // 订单id
    amount: 0, // 支付总额
    selectIndex : 0 // 默认微信支付
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id, amount} = options
    this.setData({id, amount})
  },

  // 选择的支付方式
  select (e) {
    const selectIndex = parseInt(e.currentTarget.dataset.i)
    this.setData({selectIndex})
  },

  payOrder (e) {
    let url = ''
    const {id, selectIndex} = this.data // 订单id
    const postData = {
      token: 'CFBD8A9B33942457B4F346F5756C5E59',
      id
    }
    switch(selectIndex) {
      // 微信支付
      case 0:
        // TODO
      break

      // 货到付款
      case 1:
        url = globalData.serviceUrl + 'morderdeliverypay.htm'
      break
      default:
    }

    wx.showLoading({title: '正在请求支付', mask: true})

    app.ajax({
      url,
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        wx.hideLoading()
        const {code, data, msg } = res
        if (code == 0) {
          wx.showToast({
            title: '支付成功',
            icon: 'success'
          })
          setTimeout(function() {
            wx.redirectTo({
              url: '/pages/order/detail/detail?id=' + id
            })
          }, 1500);
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