/**
* 同程日历
*
*     @example
*      new Calendar({
*        days: 60,
*        onCreate: function(dom) {
*       
*        },
*        onChange: function(value) {
*          document.getElementById("test").innerHTML = (value);
*        }
*     });
*
* {@link  http://10.14.40.14:51/pingtai-hcp/#p=日历}
* {@link https://www.tapd.cn/20001051/prong/tasks/view/1120001051001016653?left_tree=1}
* @class Calendar
* @author colacao <cy14477@ly.com>
*/
var Calendar = function(options) {
  if(Calendar.prototype.run) return;

  var defaults = {
    id:"__calendars__",
    /**
     * 可用日期范围
     * @type {Array}
     */
    range:[],
    /**
    * 起始日期
    * @cfg {Date} date
    */
    date: new Date(),
    /**
    * 在日历显示的选中日期
    * @cfg {Date} select
    */
    select:"",
    /**
    * 插入日历的元素
    * @cfg {HTMLElement} wrapper
    */
    wrapper: document.documentElement,
    target: null,
    dateAttr:"data-day",
    dayTagName:"A",
    lastValue: -1,
    run:false,
    dely:100,
    todayInfos: ["今天", "", ""],
    /**
    * 显示的日历个数
    * @cfg {Number} count
    */
    count: 3,
    /**
    * 显示多少天的日历
    * @cfg {Number} days
    */
    days: 0,
    /**
    * 日历类型
    * @cfg {String} type
    */
    type:"假",//假/抢
    /**
    * 提示层信息
    * @cfg {Object} tips
    */
    tips: {
      text: "<p class='buyDate'>今天是{$month}月{$day}号，可购买{$month_end}月{$day_end}日的火车票</p>",
      level: 1
    },
    /**
    * 事件
    * @cfg {Object} events
    */
    events: {
      touchstart: "touchstart",
      touchmove: "touchmove",
      touchend: "touchend"
    },
    /**
    * 事件
    * @cfg {Object} template
    */
    template: {
    	header:'<h3 class="float-header"></h3>',
      parent: '<ul class="calendar-header"><li class="sunday">日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li> <li class="saturday">六</li></ul>',
      wrappers:"<div class='calendars-wrapper' id='calendars-wrapper'>{$wrapper}</div>",
      wrapper: '{$calendar}',
      calendar: '<dl class="calendar"><dt class="calendar-wrapper" data-year="{$year}" data-month="{$month}"><h3 class="thin-border-top">{$year}年{$month}月</h3>{$item}</dt></dl>',
      item: '<a  data-day="{$day1}"><div  {$Class}>{$day}</div></a>',
      tips: '<div class="tip">{$tip}{$parent}</div>',
      festival: '<span class="fest_{$festival}">{$day}</span>',
      tip:{
        "抢":'<div class="tag_primary"><span class="tag_content">{$type}</span></div>',
        "假":'<div class="tag_rest"><span class="tag_content">{$type}</span></div>'
      }
    },
    /**
    * 样式名
    * @cfg {Object} classNames
    */
    classNames: {
    	all:"calendars",
      sunday: "sunday",
      disabled:"disabled",
      saturday: "saturday",
      today: "nian_select",
      select:"nian_select",
      tomorrow: "",
      festival:"festival",
      enter:"fadeInRightBig",
      out:"fadeOutRightBig"
    },
    /**
    * 节日
    * @cfg {Object} festival
    */
    festival: {
      "2015-1-1":["元旦",3],
      "2015-2-18":["春节",7],
      '2015-4-4':["清明",0],
      '2015-5-1':["劳动节",0],
      '2015-6-20':["端午",0],
      '2015-9-3':["胜利日",0],
      '2015-9-26':["中秋",2],
      "2015-10-1":["国庆",7],
      "2016-2-7":["除夕",0],
      "2016-2-8":["春节",6],
      "2016-2-14":["情人节",1],
      "2016-2-22":["元宵节",0],
      "2016-4-4":["清明节",0],
      "2016-6-9":["端午节",0],
      "2016-8-9":["七夕",0],
      "2016-9-15":["中秋节",2],
      "2016-10-1":["国庆节",7],
      "2016-10-19":["重阳节",0],
      "2017-1-27":["除夕",0],
      "2017-1-28":["春节",7],
      "2017-2-11":["元宵节",0],
      "2017-4-4":["清明节",0],
      "2017-5-30":["端午节",0],
      "2017-8-28":["七夕",0],
      "2017-10-1":["国庆节",7],
      "2017-10-4":["中秋节",2],
      "2017-10-28":["重阳节",0],
      "2018-2-15":["除夕",0],
      "2018-2-16":["春节",7],
      "2018-3-2":["元宵节",0],
      "2018-4-5":["清明节",0],
      "2018-6-18":["端午节",0],
      "2018-8-17":["七夕",0],
      "2018-9-24":["中秋节",2],
      "2018-10-1":["国庆节",7],
      "2018-10-17":["重阳节",0],
      "2019-2-4":["除夕",0],
      "2019-2-5":["春节",7],
      "2019-2-19":["元宵节",0],
      "2019-4-5":["清明节",0],
      "2019-6-7":["端午节",0],
      "2019-8-7":["七夕",0],
      "2019-9-13":["中秋节",2],
      "2019-10-1":["国庆节",7],
      "2019-10-7":["重阳节",0],
      "2020-1-24":["除夕",0],
      "2020-1-25":["春节",7],
      "2020-2-8":["元宵节",0],
      "2020-4-4":["清明节",0],
      "2020-6-25":["端午节",0],
      "2020-8-25":["七夕",0],
      "2020-10-1":["中秋节",2],
      "2020-10-25":["重阳",0],
      "2016-1-1":["元旦",3],
      "2017-1-1":["元旦",3],
      "2018-1-1":["元旦",3],
      "2019-1-1":["元旦",3],
      "2020-1-1":["元旦",3],
      "2017-2-14":["情人节",0],
      "2018-2-14":["情人节",0],
      "2019-2-14":["情人节",0],
      "2020-2-14":["情人节",0],
    },
    /**
     * 检查日期是否可选
     * @param  {String}  data       日期
     * @param  {HTMLElement} el 
     * @return {Boolean}          是否能选择
     */
    canChange:function(data,el){
        return true;
    },
    /**
    * 日期改变事件 
    * @event onChange  
    * 日期改变事件  
    */ 
    onChange: function() {},
    /**
    * 日历创建完成事件 
    * @event onCreate  
    * 日历创建完成事件  
    */ 
    onCreate:function(){}
  }
  var opt = extend(defaults, options);
  this.initialize(opt);
  var self = this;
  addEvent(window,"hashchange",function(){
     if(location.hash==""){
     self.close(true);
    }
  });
}
Calendar.prototype = {
  /**
   * 构造函数
   * @param  {Object} options
   */
  initialize: function(options) {
    this.setOptions(options);
    this.render();
    this.bind();

    location.hash="calContainer";
  },
   /**
   * 设置初始值
   * @param  {Object} options
   */
  setOptions: function(options) {
    extend(this, options);
      var t1  = new Date(this.date);
      if(this.date && typeof(this.date)=="object"){
          t1 = this.date;
      }else{
        t1 = new Date(this.date.replace(/-/g,"\/"));
      }
    if(t1.getDate()){
      this.date = t1;
    }else{
      this.date = new Date();
    }
    this.date.setHours(0);
    this.date.setMinutes(0);
    this.date.setSeconds(0);
    this.date.setMilliseconds(0);

    this.select  = this.select?new Date(this.select.replace(/-/g,"\/") +" 0:00:00"):"";

    // var t  = new Date(this.select.replace(/-/g,"\/"));
    // if(!t.getDate()){
    //   this.select = null;
    // }

    this.range = (this.range||[]).map(function(item){
      return new Date(item+" 0:00:00");
    })
  },
  /**
   * 计划两个日期相差的月数
   * @param  {Date} date1
   * @param  {Date} date2
   * @return {Number}
   */
  getMonths: function(date1, date2) {
    var year1 = parseInt(date1.getFullYear()),
      month1 = parseInt(date1.getMonth()),
      year2 = parseInt(date2.getFullYear()),
      month2 = parseInt(date2.getMonth()),
      months = (year2 - year1) * 12 + (month2 - month1) + 1;
      return months;
  },
  /**
   * 创建日历
   * 如果类型是抢,可用日期加5天。
   * 
   * @param  {Date} date
   * @return {String}
   */
  create: function(date) {
    var ret = [];
    var m = date.getMonth();

    if(this.type=="抢"){
       this.days+=5;
    }
    if (this.days) {
      var _count = new Date(date.getFullYear(), date.getMonth(), date.getDate() + this.days);
      this.count = (this.getMonths(date, _count));
    }
    for (var i = 0; i < this.count; i++) {
      var date1 = new Date(date.getFullYear(), m + i, 1);
      var bodyHtml = this.template.wrapper.replaceWith({
        year: date1.getFullYear(),
        month: (date1.getMonth() + 1).toString().padLeft(2),
        months: (date1.getMonth() + 1).toString().padLeft(2),
        calendar: this.template.calendar.replaceWith({
          year: date1.getFullYear(),
          month: (date1.getMonth() + 1).toString().padLeft(2),
          item: this.getDates(date1)
        })
      });
      ret.push(bodyHtml)
    }
    return this.template.wrappers.replaceWith({
      wrapper:ret.join("")
    })
  },
  craeteTips:function(){
    var _tempDate = new Date(this.date.getFullYear(), this.date.getMonth(),this.date.getDate() + this.days);
    var tips = this.template.tips.replaceWith({
      tip: this.tips.text.replaceWith({
        month: this.date.getMonth() + 1,
        day: this.date.getDate(),
        month_end:(_tempDate.getMonth() + 1),
        day_end:_tempDate.getDate()
      })
    });
    return tips;
  },
  /**
   * 触摸开始处理函数
   * @param  {Event} e
   */
  touchstart: function(e) {
    var px = (e.changedTouches.length ? e.changedTouches[0].pageX : 0);
    var py = (e.changedTouches.length ? e.changedTouches[0].pageY : 0);

    this.beginEL = e.target;
    this.px =  px;
    this.py =  py;
  },
  /**
   * 划动处理函数
   * @param  {Event} e
   */
  touchmove: function(e) {
    var px = (e.changedTouches.length ? e.changedTouches[0].pageX : 0);
    var py = (e.changedTouches.length ? e.changedTouches[0].pageY : 0);
    if(Math.abs(px-this.px)>10 || Math.abs(py-this.py)>10){
        this.beginEL = null;
    }
  },
  /**
   *触摸结束处理函数
   * @param  {Event} e
   */
  touchend: function(e) {
    var tag = parents(e.target,this.dayTagName);
    if (e.target == this.beginEL && tag) {
      
      var _value = tag.getAttribute(this.dateAttr);
      var check = this.canChange.call(this,_value,tag);
      if(check){
        addClass(tag.lastChild,this.classNames.select);
        this.onChange(_value);
        setTimeout(function(){
             this.close();
        }.bind(this),this.dely)
     
        //history.back();
      }
    }
    triggerEvent(this.wrapper,this.events.touchend);
  },
  /**
   * 关闭日历
   */
  close:function(noback){
    //"bounceOutDown   
    Calendar.prototype.run=true;
   
    removeClass(this.target,this.classNames.enter);
    addClass(this.target,this.classNames.out);
    setTimeout(function(){
      this.target.parentNode && this.target.parentNode.removeChild(this.target);
      // this.target = null;
      // this.wrapper = null;
      Calendar.prototype.run=false;
      //if(!noback){
        history.back();
      //}
   }.bind(this),400)

   
  },
  /**
  * 绑定事件 
  */
  bind: function() {
    addEvent(document.documentElement,this.events.touchmove,function(e){
        e.preventDefault();
    });

    addEvent(this.target, this.events.touchstart, function(e){
      this.touchstart(e);
    }.bind(this));
    addEvent(this.wrapper, this.events.touchmove, function(e) {
      this.touchmove(e);
    }.bind(this));
    addEvent(this.target, this.events.touchend, function(e) {
      this.touchend(e);
    }.bind(this));
  },
  /**
   * 将日期对象按传入的分隔符分隔
   * @param  {Date} date
   * @param  {String} split
   * @return {String}
   */
  getDateString: function(date, split) {
    split = split || "-";
    var tempArr = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    return tempArr.join(split);
  },
  /**
   * 返回日期的样式名
   * @param  {Date} date
   * @param  {String} tempDateStr
   * @return {Object}
   */
  getClass: function(date, tempDateStr) {
    var classList = [this.classNames.today, this.classNames.tomorrow, this.classNames.aftertomorrow];
    var tempDay = Math.round(((date - this.date) / (86400000)));
    var returnValue =  "";
    var day = date.getDay();
    var fest = this.festival[tempDateStr];

    if(!this.select){
       returnValue = this.range.length?"":(classList[tempDay] || "");
    }else if(this.select && +date == +this.select){
      returnValue += this.classNames.select;
    }

    if(fest && fest.length<=2){
        returnValue += " "+this.classNames.festival;
    }

    if(tempDay+1<=0 || tempDay>this.days){
      returnValue += " "+this.classNames.disabled;
    }

    returnValue += (day == 0) ? " " + this.classNames.sunday : (day == 6) ?  " " + this.classNames.saturday : "";

     
    if(+date == +this.range[0] && !this.select){
       returnValue += this.classNames.select;
    }
    //58
    if(this.range.length && (+date<+this.range[0] || +date>+this.range[1])){
      returnValue += " "+this.classNames.disabled;
    }

    return {
      'class': returnValue.trim()
    };
  },
  /**
   * 返回日期的显示内容
   * @param  {Date} tempDate
   * @param  {String} tempDateStr
   * @param  {Number} day
   * @return {String}
   */
  getDay:function(tempDate,tempDateStr,day){
    var fest = this.festival[tempDateStr];
    var today = this.setToday(tempDate);
    var select  = this.select;
    var ret = "";
    if(this.type == "抢"){
      var tempDay = Math.round(((tempDate - this.date) / (86400000))) + 1;
       var tip = this.template.tip["抢"];
       var d = tempDay-this.days
        if(d>-4 &&  tempDay<=this.days+1){
          ret =  tip.replaceWith({
            type:"抢"
          })+((today||day));
       }
    }
    if(fest && !ret){
      for(var i=1;i<fest[1];i++){
          var _tempDate = new Date(tempDate.getFullYear(),tempDate.getMonth(), tempDate.getDate()+i);
          var pDay = this.getDateString(_tempDate);
          this.festival[pDay]=[fest[0],fest[1]-i,true];
      }

      var tip = this.template.tip["假"];
      if(fest[1]>0){
        ret = tip.replaceWith({
          type:"假"
        })+(fest.length==2?fest[0]:(today||day));
      }else{
        ret = fest[0];
      }
    }else if(!ret){
      ret= today||day;
    }
    return ret;
  },
  /**
   * 生成传入日期当月日历
   * @param  {Date} date
   * @return {String}
   */
  getDates: function(date) {
    var returnValue = [];
    var day = date.getDate();
    var beginDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); //当月的第一天从几开始
    var nDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); //总天数

    var pushObj = {day: "", day1: "",festival: "",Class: ""};
    for (var i = 1; i < 43-(42-nDays-beginDay); i++) {
      var tempDate = new Date(date.getFullYear(), date.getMonth(), (i - beginDay));
      var tempDateStr = this.getDateString(tempDate);
      var tempClass = this.getClass(tempDate, tempDateStr);
      if (i > beginDay && i <= nDays + beginDay) { //当前月
        pushObj = {
          day1: tempDateStr,
          day: this.getDay(tempDate,tempDateStr,i - beginDay),
          Class: (tempClass['class'] ? "class='" + tempClass['class'] + "'" : "")
        };
      }
      returnValue.push(this.template.item.replaceWith(pushObj));
    }
    return returnValue.join("");
  },
  /**
   * 设定今日的样式
   * @param {Date} date
   */
  setToday: function(date) {
    var classList = [this.classNames.today, this.classNames.tomorrow, this.classNames.aftertomorrow];
    var tempDay = Math.round(((date - this.date) / (86400000)));
    var ret = this.todayInfos[tempDay] || "";
    // if(this.range.length){
    //   return "";
    // }else{
      return ret;
    //}
  },
  /**
   * 获取屏幕高度
   * @return {Number}
   */
  winHeight:function(){
      var _h = window.innerHeight
      return ((_h > 0) ? _h :screen.height);
  },
  winWidth:function(){
     var _w = window.innerWidth
     return ((_w > 0) ? _w :screen.width);
  },
  /**
   * 渲染
   */
  render: function() {
    var t = this.create(this.date);
    var _tempwrapper = document.getElementById(this.id)||document.createElement("div");
     _tempwrapper.style.height = this.winHeight() + 'px';
      _tempwrapper.style.width = this.winWidth() + 'px';
    _tempwrapper.className = this.classNames.all;
    _tempwrapper.innerHTML =  t;
    _tempwrapper.id = this.classNames.all;
    var h = document.createElement("div");
    h.innerHTML = this.template.header;
	
	  var h2 = document.createElement("div");
    h2.innerHTML = this.craeteTips().replaceWith({
      parent:this.template.parent
    });

    _tempwrapper.appendChild(h.firstChild);
    _tempwrapper.appendChild(h2.firstChild);
   
    this.wrapper.appendChild(_tempwrapper);
    
    _tempwrapper.style.top= "0px";

     addClass(_tempwrapper,"animated");

    //_tempwrapper.style.display = "";
    this.target = _tempwrapper;
   
    //败笔，要计算提示的高度
    addClass(_tempwrapper,this.classNames.enter);
    var fixHeight = _tempwrapper.childNodes[2].offsetHeight;

    _tempwrapper.childNodes[0].style.paddingTop = fixHeight +'px';
    _tempwrapper.childNodes[1].style.top = fixHeight+'px';
    this.onCreate(this.target);

   
    Calendar.prototype.run=true;
    setTimeout(function(){
      Calendar.prototype.run=false;
    }.bind(this),400)
  }
}

