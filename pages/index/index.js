//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    core: [
      { id: 'kb', name: '活动查询', disabled: false, teacher_disabled: false },
      { id: 'kjs', name: '空功能室', disabled: false, teacher_disabled: false },
      { id: 'xs', name: '学生查询', disabled: false, teacher_disabled: false },
      { id: 'jy', name: '物资借用', disabled: false, teacher_disabled: false },
      { id: 'bx', name: '寝室报修', disabled: false, teacher_disabled: false }
    ],
    card: {
      'kb': {
        show: false,
        time_list: [
          { begin: '8:00', end: '8:45' },
          { begin: '8:55', end: '9:40' },
          { begin: '10:05', end: '10:50' },
          { begin: '11:00', end: '11:45' },
          { begin: '14:00', end: '14:45' },
          { begin: '14:55', end: '15:40' },
          { begin: '16:05', end: '16:50' },
          { begin: '17:00', end: '17:45' },
          { begin: '19:00', end: '19:45' },
          { begin: '19:55', end: '20:40' },
          { begin: '20:50', end: '21:35' },
          { begin: '21:45', end: '22:30' }
        ],
        data: {}
      },
      
      'jy': {
        show: false,
        data: {}
      },
    },
    user: {},
    disabledItemTap: false //点击了不可用的页面
  },
  //下拉更新
  onPullDownRefresh: function(){
    if(app._user.is_bind){
      this.getCardData();
    }
  },
  onShow: function(){
    var _this = this;
    function isEmptyObject(obj){ for(var key in obj){return false;} return true; }
    function isEqualObject(obj1, obj2){ if(JSON.stringify(obj1) != JSON.stringify(obj2)){return false;} return true; }
    var l_user = _this.data.user,  //本页用户数据
        g_user = app._user; //全局用户数据
    //排除第一次加载页面的情况（全局用户数据未加载完整 或 本页用户数据与全局用户数据相等）
    if(isEmptyObject(l_user) || !g_user.openid || isEqualObject(l_user.we, g_user.we)){
      return false;
    }
    //全局用户数据和本页用户数据不一致时，重新获取卡片数据
    if(!isEqualObject(l_user.we, g_user.we)){
      //判断绑定状态
      if(!g_user.is_bind){
        _this.setData({
          'remind': '未登录'
        });
      }else{
        _this.setData({
          'remind': '加载中'
        });
        //清空数据
        _this.setData({
          user: app._user,
          'card.kb.show': false,
          'card.jy.show': false,
          'card.sdf.show': false
        });
        _this.getCardData();
      }
    }
  },
  onLoad: function(){
    this.login();
  },
  login: function(){
    var _this = this;
    //如果有缓存
    if(!!app.cache){
      try{
        _this.response();
      }catch(e){
        //报错则清除缓存
        wx.removeStorage({ key: 'cache' });
      }
    }
    //然后通过登录用户, 如果缓存更新将执行该回调函数
    app.getUser(_this.response);
  },
  response: function(){
    var _this = this;
    _this.setData({
      user: app._user
    });
    //判断绑定状态
    if(!app._user.is_bind){
      _this.setData({
        'remind': '未登录'
      });
    }else{
      _this.setData({
        'remind': '加载中'
      });
      _this.getCardData();
    }
  },
  disabled_item: function(){
    var _this = this;
    if(!_this.data.disabledItemTap){
      _this.setData({
        disabledItemTap: true
      });
      setTimeout(function(){
        _this.setData({
          disabledItemTap: false
        });
      }, 2000);
    }
  },
  getCardData: function(){
    var _this = this;
    var kb_data = {
      id: app._user.we.info.id,
    };
    if(app._user.teacher){ kb_data.type = 'teacher'; }
  }
});