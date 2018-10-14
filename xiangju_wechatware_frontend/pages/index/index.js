//index.js
//获取应用实例
Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    startlati: 23.099994,
    startlongi: 113.324520,
    endlati: 23.099994,
    endlongi: 113.424520,
    travelmode:0,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/image/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/image/location.png'
    }],
    time: '00:00', //默认起始时间  
    time2: '24:00', //默认结束时间 
    radioValues: [{
        'value': '驾车',
        'selected': true
      },
      {
        'value': '公交',
        'selected': false
      },
      {
        'value': '步行',
        'selected': false
      },
    ],
    clazz1: ["selected", ""],
    selectIndex: 0,//0:聚餐,1:聚玩   
    selsectState: [1, 0], //聚餐or聚玩 
    jvcan_option: [0, 0, 0, 0, 0, 0], //聚餐选项
    jvwan_option: [0, 0, 0], //聚玩选项
    place_type: [0, 0, 0, 0, 0, 0, 0] //商家风格   
  },
  setInitialTime:function(){
    var date=new Date();
    var hour=date.getHours().toString();
    var minute=date.getMinutes().toString();
    minute = minute[1] ? minute : '0' + minute
    this.setData({time:hour+':'+minute})
  },
  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation()
    this.setInitialTime()
    // 开机定位
  },
  getCenterLocation: function() {
    this.mapCtx.getCenterLocation({
      success: function(res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
    // 定位
  },
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },
  showActiveType: function() {
    // 显示遮罩层 活动类型
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showActiveTypeStatus: true,
      showModalStatus: false,
      showPOIStatus: false
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  showPOI: function () {
    // 显示遮罩层 活动类型
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showActiveTypeStatus: false,
      showModalStatus: false,
      showPOIStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //显示选项框
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      showActiveTypeStatus: false,
      showPOIStatus:false
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false,
        showActiveTypeStatus: false,
        showPOIStatus:false
      })
    }.bind(this), 200)
  },

  // 时间段选择  
  bindDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      time: e.detail.value,
    })
  },
  bindDateChange2(e) {
    let that = this;
    that.setData({
      time2: e.detail.value,
    })
  },

  indexChanged: function(e) {
    // 点中的是组中第个元素
    var index = e.target.dataset.index;
    // 读取原始的数组
    var radioValues = this.data.radioValues;
    for (var i = 0; i < radioValues.length; i++) {
      // 全部改为非选中
      radioValues[i].selected = false;
    }
    // 当前那个改为选中
    radioValues[index].selected = true;
    
    // 写回数据
    this.setData({
      radioValues: radioValues
    });
    // clazz状态
    this.clazzStatus();

  },
  clazzStatus: function() {
    /* 此方法分别被加载时调用，点击某段时调用 */
    // class样式表如"selected last","selected"
    var clazz = [];
    // 参照数据源
    var radioValues = this.data.radioValues;
    for (var i = 0; i < radioValues.length; i++) {
      // 默认为空串，即普通按钮
      var cls = '';
      // 高亮，追回selected
      if (radioValues[i].selected) {
        cls += 'selected ';
      }
      // 最后个元素, 追加last
      if (i == radioValues.length - 1) {
        cls += 'last ';
      }
      //去掉尾部空格
      cls = cls.replace(/(\s*$)/g, '');
      clazz[i] = cls;
    }
    // 写回数据
    this.setData({
      clazz: clazz
    });

  },
  clickplace_type: function(e) {
    // 商家风格
    var place = e.currentTarget.dataset.place;
    var place_type = this.data.place_type;
    if (place_type[place] == 0) place_type[place] = 1;
    else place_type[place] = 0;
    this.setData({
      place_type: place_type,
      place_selected:place
    });
  },
  clickjvcan_option: function(e) {
    //聚餐类型选择
    var jvcan = e.currentTarget.dataset.jvcan;

    var jvcan_option = this.data.jvcan_option;
    if (jvcan_option[jvcan] == 0) jvcan_option[jvcan] = 1;
    else jvcan_option[jvcan] = 0;

    this.setData({
      jvcan_option: jvcan_option,
    });
  },
  clickjvwan_option: function(e) {
    //聚玩类型选择
    var jvwan = e.currentTarget.dataset.jvwan;

    var jvwan_option = this.data.jvwan_option;
    if (jvwan_option[jvwan] == 0) jvwan_option[jvwan] = 1;
    else jvwan_option[jvwan] = 0;

    this.setData({
      jvwan_option: jvwan_option,
    });
  },
  clickjvcan: function() {
    this.setData({
      selsectState: [1, 0],
      selectIndex: 0
    });

  },

  clickjvwan: function() {
    this.setData({
      selsectState: [0, 1],
      selectIndex: 1
    });

  },
  //移动选点 聚前位置
  onChangeAddressBefore: function() {
    var _page = this;
    wx.chooseLocation({
      success: function(res) {
        _page.setData({
          chooseAddressBefore: res.name,
          startlati:res.latitude,
          startlongi:res.longitude
        });
      },
      fail: function(err) {
        console.log(err)
      }
    });
  },
  //聚后位置
  onChangeAddressAfter: function() {
    var _page = this;
    wx.chooseLocation({
      success: function(res) {
        _page.setData({
          chooseAddressAfter: res.name,
          endlati:res.latitude,
          endlongi:res.longitude
        });
      },
      fail: function(err) {
        console.log(err)
      }
    });
  },
  
  //从服务器收到反馈，并显示推荐结果
  recommendPOI:function(e){
    var poi=this.getServer();
    this.setData({
      showPOIStatus:true
    })
    this.showPOI()
  },
  //与服务器通信
  getServer: function () { 
    var that = this;
    wx.request({
      url: 'https://wechatware.rxxxxx.net:2880/calculate_final_result', //
      method: 'POST',
      dataType: 'json',
      data: {
        starttime: that.data.time,
        endtime: that.data.time2,
        startlati: that.data.startlati,
        startlongi: that.data.startlongi,
        endlati: that.data.endlati,
        endlongi: that.data.endlongi,
        travelmode: that.data.travelmode,
        acttype: that.data.selectIndex,
        jvcan: that.data.jvcan_option,//聚餐选项  
        jvwan: that.data.jvwan_option,//聚玩选项
        place_type: that.data.place_type//商家风格
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      },
    })
    console.log("jvcan:" + that.data.jvcan_option.toString()+'\n'+
      "jvwan:" + that.data.jvwan_option.toString())
  }
})