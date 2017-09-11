// roomservice.js
let app = getApp()
let detailId = 0
let globalData = app.globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageRootPath: '',
    list: [],
    products: [],
    scrollTop: { 
      category: 0,
      menu: 0
    },
    scrollIntoViewId: '', // 滚动选中分类id
    curMenuId: 0, // 当前选中分类
    spec: {}, // 规格弹窗数据
    specMenuIndex: 0,
    specProductIndex: 0,
    modalSpecShow: false, // 规格弹窗是否显示
    modalSpecPrice: 0, // 规格价格
    modalSpecIndex: 0, // 规格位置
    detailShow: false, // 单品详情是否显示
    detail: {}, // 单品详情数据
    cart: { // 购物车
      show: false,
      list: [],
      total: 0,
      freight: 0,
      amount: 0
    },
    limitAmount: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({title: '页面加载中', mask: true})
    if (options.id) {
      detailId = parseInt(options.id)
    }
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
    this.fetchData()
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

  fetchData () {    
    var that = this

    wx.request({
      url: globalData.serviceUrl + 'mwarelist.html',
      data: {},
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        res = res.data
        const {msg, code} = res
        const {warelablelist, waretypelist, imageRootPath} = res.data
        console.log(res)
        if (code == 0) {
          let list = []
          let products = []

          if (warelablelist) {
            list = list.concat(warelablelist)
          }
          if (waretypelist) {
            list = list.concat(waretypelist)
            waretypelist.forEach(v => {
              products = products.concat(v.warelist)
            })
          }
          that.setData({list, products, imageRootPath})

          if (detailId) {
            that.showDetail(null, detailId)
          }
        } else {
          console.error(msg)
        }
      }
    })
  },

  showMenu (e) {
    const id = e.target.dataset.menuid
    this.setData({
      scrollIntoViewId: 'Menu'+id,
      curMenuId: id
    })
  },

  // 加入购物车
  addToCart (e) {
    const data = e.target.dataset
    const product = data.product || this.data.list[data.menuindex].warelist[data.productindex]
    const sizelist = product.sizelist
    const add = data.modaladd || data.cartadd || false // 规格弹窗来源，购物车添加来源

    if (this.data.detailShow) {
      this.setData({detailShow: false})
    }

    if (sizelist && sizelist.length > 1 && !add) {
      this.setData({
        spec: product,
        modalSpecShow: true,
        modalSpecPrice: sizelist[0].price,
        specMenuIndex: data.menuindex,
        specProductIndex: data.productindex
      })
    } else {
      let index // 相同单品（含规格）的位置
      const specIndex = data.specindex || this.data.modalSpecIndex // 规格位置
      const list = this.data.cart.list.filter((v, i) => {
        if (v.id === product.id && (this.data.spec.sizelist ? v.size.id === this.data.spec.sizelist[specIndex].id : 1)) {
          index = i // 找到相同单品（含规格）
          return true
        } else{
          return false
        }
      })[0]
      let newList = list ? Object.assign(list, {
        len: list.len+1
      }) : Object.assign({
        size: product.sizelist[specIndex],
        len: 1,
        menuindex: data.menuindex,
        productindex: data.productindex,
        specIndex
      }, product)

      let productCart = product.cart || {}
      let newSizeId = product.sizelist[specIndex].id
      let newSize = Object.assign(productCart, {
        [newSizeId] : ((productCart[newSizeId] || 0) + 1),
        count: 0
      })
      for(let key in newSize) {
        if (key !== 'count') {
          newSize.count += newSize[key]
        }
      }
      this.setData({
        ['cart.list[' + (list ? index : this.data.cart.list.length) + ']'] : newList,
        ['list[' + data.menuindex + '].warelist[' + data.productindex + '].cart'] : newSize
      })

      this.calcTotal()
      this.calcAmount()

      if (add) {
        this.closeModal(null, 'specModal')
      }
    }
  },

  // 从购物车移除
  rmFromCart (e) {
    const data = e.target.dataset
    const product = data.product
    let inlineCart = this.data.list[data.menuindex].warelist[data.productindex].cart

    // 多规格的商品只能从购物车删除
    if (product.sizelist.length > 1 && !product.size) {
      wx.showToast({
        title: '多规格商品只能从购物车删除哦',
        image:'/images/warn.png'
      })
      return
    }

    delete inlineCart.count
    const key = product.size ? product.size.id : product.sizelist[0].id // 减少的商品规格id
    let newSize = Object.assign(inlineCart, {
      [key]: inlineCart[key] - 1,
      count: 0
    })
    for(let key in newSize) {
      if (key !== 'count') {
        newSize.count += newSize[key]
      }
    }

    let cartListRmIndex = this.data.cart.list.map((v, i) => (v.id === product.id && v.size.id == key) ? i : -1).filter(v => v >= 0)[0]
    let newCartListRm = this.data.cart.list[cartListRmIndex]
    if (newCartListRm.len - 1 === 0) {
      newCartListRm = null
    } else {
      newCartListRm.len -= 1
    }

    this.setData({
      ['list[' + data.menuindex + '].warelist[' + data.productindex + '].cart'] : newSize
    })
    if (newCartListRm) {
      this.setData({
        ['cart.list[' + cartListRmIndex + ']'] : newCartListRm
      })
    } else {
      let list = this.data.cart.list
      list.splice(cartListRmIndex, 1)
      this.setData({
        ['cart.list'] : list
      })
    }

    this.calcTotal()
    this.calcAmount()

  },

  // 计算购买数量
  calcTotal () {
    let total = 0
    this.data.cart.list.forEach(v => {
      total += v.len
    })
    this.setData({
      'cart.total' : total 
    })
  },

  // 计算总额
  calcAmount () {
    // 计算购买数量
    let amount = 0
    this.data.cart.list.forEach(v => {
      amount += v.len * v.size.price
    })
    this.setData({
      'cart.amount' : amount 
    })
  },

  selectSpec (e) {
    const data = e.target.dataset
    this.setData({
      modalSpecIndex: data.index,
      modalSpecPrice:  data.price
    })
  },

  // 关闭弹窗
  closeModal (e, modalName) {
    const modal = modalName || e.target.dataset.modal

    switch (modal) {
      case 'specModal':
        this.setData({
          modalSpecShow: false,
          spec: {},
          modalSpecPrice: 0,
          modalSpecIndex: 0
        })
      break
      case 'detailModal':
        this.setData({
          detailShow: false,
          detail: {}
        })
      break
      case 'cart':
        this.setData({
          'cart.show': false
        })
      break
    }
  },

  // 显示单品详情
  showDetail (e, id) {
    let detail = (id && this.data.products.filter(v => v.id === id)[0]) || e.target.dataset.detail

    detail = Object.assign(detail, {
      menuindex: this.data.list.map((v, i) => v.id === detail.waretypeid ? i : -1).filter(v => v > -1)[0],
      productindex: this.data.list.filter(v => v.id === detail.waretypeid)[0].warelist.map((v, i) => v.id === detail.id ? i : -1).filter(v => v > -1)[0]
    })

    this.setData({
      detail,
      detailShow: true
    })
  },

  showCart (e) {
    if (this.data.cart.total > 0) {
      this.setData({
        'cart.show': !this.data.cart.show
      })
    }
  },

  // 清空购物车
  clearCart (e) {
    let data = {}

    // 清空单品购物数据
    this.data.list.forEach((menu, menuindex) => {
      menu.warelist.forEach((v, productindex) => {
        if (v.cart) {
          v.cart = {}
          data['list[' + menuindex + '].warelist[' + productindex + ']'] = v
        }
      })
    })

    // 购物车初始化
    data.cart = {show: false, list: [], total: 0, freight: 0, amount: 0 }

    this.setData(data)  
  },

  // 结算
  buy () {
    const that = this;
    const cart = this.data.cart

    if (!app.globalData.token) {
      wx.redirectTo({ url: "/pages/login/login" });
      return false;
    }

    let postData = {
      token: app.globalData.token,
      wareids: cart.list.map(v => v.id).join(','),
      numbers: cart.list.map(v => v.len).join(','),
      waresizes: cart.list.map(v => v.size.id).join(','),
    }

    wx.showLoading({title: '正在创建订单', mask: true})

    app.ajax({
      url: globalData.serviceUrl + 'morderaffirm.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        wx.hideLoading()
        const {code, data, msg } = res
        if (code == 0) {
          globalData.newOrder = {data, postData}
          wx.navigateTo({
            url: '/pages/orderdetail/orderdetail'
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
