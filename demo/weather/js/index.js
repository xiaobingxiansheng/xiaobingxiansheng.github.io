(function($){
	
	/**
   * 获取天气信息
   * @param {*} cityCode 
   * @param {*} callback 
   */
  var _GetDataToWeather = (function(){
  	// 发起请求次数
  	var XHR_COUNT = 0;
  	return function sendAjax(cityCode, callback){
  		var fetchDataPromise = fetch('https://www.tianqiapi.com/api/?version=v1&cityid='+cityCode,{
	      mode:'cors',
	      method:'get'
	    })
	    .then(response=>response.json())
	    
	    // 超时调用 当超时或者请求当中发生什么错误都会提示网络原因。
	    Promise.race([
	    	fetchDataPromise,
	    	new Promise(function(resolve, reject){
	    	   setTimeout(reject, 5000);
	    	})
	    ]).then(function(data){
	      console.log("当前的天气信息：",data);
	      // 重置请求次数
	      XHR_COUNT = 0;
	      callback(data);
	    },function(){
	    	console.log("请求久久不能响应...");
	    	if(XHR_COUNT++<3){
		    	sendAjax(cityCode, callback);
		    	return ;
	    	}
	    	$.alert("数据获取失败\n 请稍后重试","请检查网络");
	    })
  	}
  })();
  
  /**
   * 刷新更新时间
   */
	var _refreshUpdateTimer = (function(){
		var _time = new Date().getTime();
		var timer = null;
		var updateActions = function(){
			var diff_time = new Date() - _time; 
			var over_minutes = parseInt(diff_time/(1000*60));
			var over_hours = parseInt(diff_time/(1000*60*60));
			var result = "";
			if(over_minutes < 1){
				result = "刚刚更新";
			}else if (over_minutes >= 1 && over_minutes < 60){
				result = (over_minutes) + "分钟前更新"
			}else if (over_hours >= 1 && over_hours < 24){
				result = (over_hours) + "小时前更新"
			}else{
				result = "距离上次更新已经很久了哦"
			}
			console.log(over_minutes, result);
			$(".updateTime")[0].innerHTML = result;
		}
		var main = function(){
			if(timer){ // 清除定时器并更新时间。
				clearTimeout(timer);
				updateActions();
			}
			timer = setInterval(updateActions, 1000*60);
		}
		main();
		return function refresh(){
			_time = new Date().getTime();
			console.log("你在刚刚就更新过了哦");
			main();
		}
	})();
  /**
   * 主程序
   */
  (function(){
    // 侧滑菜单bug解决
    $('.mui-scroll-wrapper').scroll({
		scrollY: true, //是否竖向滚动
		scrollX: false, //是否横向滚动
		startX: 0, //初始化时滚动至x
		startY: 0, //初始化时滚动至y
		indicators: false, //是否显示滚动条
		deceleration:0.0004, //阻尼系数,系数越小滑动越灵敏
		bounce: true //是否启用回弹
	});
    // 选择器.
    initPopPicker();

    // 渲染天气信息
    renderWeatherToView(localStorage.getItem("cityCode") || 101010100);

		// 初始化轮播事件
    initSlideEvent();
    
    $.init({
		  pullRefresh : {
		    container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		    down : {
		      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			color:'#fff',
			range:'80px',
		      contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
      			contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
		      contentrefresh:"正在努力加载中..",
		      callback :function(){
		      	renderWeatherToView(localStorage.getItem("cityCode") || 101010100, function(){
    					// 表示结束上拉刷新
    					$('#refreshContainer').pullRefresh().endPulldownToRefresh();
    				});
		      }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		    }
		  }
		});
  })();
  
  
  /**
   * 初始化选择器
   */
  function initPopPicker(){
    var cityPicker = new $.PopPicker({
      layer: 3,
      buttons:null
    });
    
    cityPicker.setData(cityData3);

    // 添加选择器事件
    var updateCurCity = $('#updateCurCity')[0];
    updateCurCity.addEventListener('tap', function(event) {
      
      cityPicker.show(function(items) {
        var len = items.length;
        var cityCode = items[len-1].code;
        renderWeatherToView(cityCode);
      });
    }, false);
  }

  /**
   * 初始化滑动动作
   */
  function initSlideEvent(){
    var changeMapToListBtn = $("#changeMapToListBtn")[0];
    var SliderDOM = $('#mui-slider');
    SliderDOM[0].addEventListener('slide', function(event) {
      if (event.detail.slideNumber === 0) {
        changeMapToListBtn.classList.remove("active")
      } else if (event.detail.slideNumber === 1) {
        changeMapToListBtn.classList.add("active")
      }
    });

    $(".circular").on('tap', 'div', function(event){
      var nowClicked = event.target;
      console.log("您正在点击", nowClicked.className)
      if(nowClicked.classList.contains("trend")){
        SliderDOM.slider().gotoItem(0);
      }else if(nowClicked.classList.contains("list")){
        SliderDOM.slider().gotoItem(1);
      }
    })
  }

  /**
   * 渲染天气信息到页面上
   * @param {*} cityCode 
   */
  function renderWeatherToView(cityCode, callback){
    _GetDataToWeather(cityCode, function(data){
    	// 更新页面状态
      initAndRefreshWeatherState(data);
      // 更新天气代码
      localStorage.cityCode = data.cityid;
      callback&&callback();
    })
  }

  /**
   * 更新和初始化页面天气状态
   * @param {*} weatherData 
   */  
  function initAndRefreshWeatherState(weatherData){
    // 城市信息
    var cityNow = $("#cityNow")[0];
    cityNow.innerHTML = weatherData.city;
    
    // 当日气温
    var curTemp = $("#curTemp")[0];
    curTemp.innerHTML = parseTempToNumber(weatherData.data[0].tem);

    // 七日预报图
    var allWeekData = weatherData.data;
    loadAllWeekInfo(allWeekData);
    loadAllWeekTable(allWeekData)

    // 24小时预报图
    loadAllDayTable(allWeekData[0].hours)
 
    // 当天天气小贴士
    var weatherTips = $("#weatherTips")[0];
    weatherTips.innerHTML = allWeekData[0].air_tips;

    // 今天天气渲染
    var todayWeather = $("#todayWeather")[0];
    todayWeather.innerHTML = firstAndSecWeatherDataToView(1, {
      air_level: allWeekData[0].air_level,
      temp_range: allWeekData[0].tem2 + '~' + allWeekData[0].tem1,
      wea: allWeekData[0].wea
    })
    
    // 明天气渲染
    var tomorrowWeather = $("#tomorrowWeather")[0];
    tomorrowWeather.innerHTML = firstAndSecWeatherDataToView(0,  {
      air_level: allWeekData[0].air_level, // 接口里没有第二天空气质量
      temp_range: allWeekData[1].tem2 + '~' + allWeekData[1].tem1,
      wea: allWeekData[1].wea
    })

    // 指数渲染
    $("#UVIndex")[0].innerHTML = allWeekData[0].index[0].level;
    $("#motionIndex")[0].innerHTML = "运动";
    $("#bloodSugarIndex")[0].innerHTML = allWeekData[0].index[2].level;
    $("#wearIndex")[0].innerHTML = allWeekData[0].index[3].level;
    $("#washCarIndex")[0].innerHTML = allWeekData[0].index[4].level;
    $("#AirPollutionIndex")[0].innerHTML = allWeekData[0].index[5].level;
    
    // 重置更新时间
    _refreshUpdateTimer()
  }


  /**
   * 渲染七日预报天气信息
   * 
   */
  function loadAllWeekInfo(weatherDatas){
    var Maphtml = '',
        Listhtml = '',
        MapTable = mui('#allWeek-w-table-wrap')[0],
        ListTable = mui('#allWeek-w-table-list')[0];

    var _getFirstWeaAndLastWea = function(hoursData){
      var last_wea = '';
      var wea = '';
      hoursData.forEach(function(item, index){
        var curwea = item.wea;
        if(wea == ''){
          wea = curwea;
        }
        // 因为接口没有专门的第二个天气状态，所以要自己来找出不同的天气状态
        if(wea !== curwea || index===hoursData.length-1){
          last_wea = curwea;
          return true;
        }
      })
      return [wea, last_wea];
    }
    for(var i in weatherDatas){
      var week = (i==0 ? '今天' : weatherDatas[i].week);
      var air_level = getBadgeClassStl(weatherDatas[0].air_level).value;
      var weaObj = _getFirstWeaAndLastWea(weatherDatas[i].hours);
      Maphtml += getFulledDataAllWeekMapView({
        week: week,
        wea: weaObj[0],
        last_wea: weaObj[1],
        air_level: air_level,
        win: sortOutByWindDir(weatherDatas[i].win[0]),
        win_speed: weatherDatas[i].win_speed,
        date: parseDateToDay(weatherDatas[i].date)
      })
      Listhtml += getFulledDataAllWeekListView({
        week: week,
        wea: weaObj[0],
        air_level: air_level,
        temp_range: parseTempToNumber(weatherDatas[i].tem2) + '~' + weatherDatas[i].tem1
      })
    }
    
    MapTable.innerHTML = Maphtml;
    ListTable.innerHTML = Listhtml;
  }

  /**
   * 获取填充完七日趋势图的信息
   */
  function getFulledDataAllWeekMapView(data){
    return `
    <div class="allWeek-w-row-wrap">
      <div class="allWeek-w-row-top">
          <p class="allWeek-w-date">${data.week}</p>
          <p class="allWeek-w-dateTime">${data.date}</p>
          <span class="mui-badge mui-badge-success allWeek-w-quality">${data.air_level}</span>
          <p class="allWeek-w-type">${data.wea}</p>
          <span class="iconSymbol">${getIconSymbolFromCNstate(data.wea)}</span>
      </div>
      <div class="allWeek-w-row-bottom">
          <span class="iconSymbol">${getIconSymbolFromCNstate(data.last_wea)}</span>
          <p class="allWeek-w-type">${data.last_wea}</p>
          <p class="allWeek-w-windDir">${data.win}</p>
          <p class="allWeek-w-windLev">${data.win_speed}</p>
      </div>
    </div>
    `
  }
  /**
   * 获取填充完七日列表的信息
   */
  function getFulledDataAllWeekListView(data){
    return `
    <li>
        <div class="allWeek-slide-item dayNumber">${data.week}</div>
        <div class="allWeek-slide-item airLevel"><span class="mui-badge mui-badge-success quality">${data.air_level}</span></div>
        <div class="allWeek-slide-item"><span class="iconSymbol">${getIconSymbolFromCNstate(data.wea)}</span></div>
        <div class="allWeek-slide-item weather-condition">${data.wea}</div>
        <div class="allWeek-slide-item list-degrees">${data.temp_range}</div>
    </li>
    `
  }




  /**
   * 用于渲染今天和明天的天气板块
   * @param {*} yeAndTo 
   * @param {*} weatherData {包含空气质量，温度范围，天气状况}
   */
  function firstAndSecWeatherDataToView(yeAndTo, weatherData, wea){
    
    var air_level_obj = getBadgeClassStl(weatherData.air_level);
    return `
      <div class="twoday-info" id="todayWeather">
          <div class="twoday-info-inline">
              ${yeAndTo?'今天':'明天'}<span class="mui-badge ${air_level_obj.classTxt} twoday-quailty">${air_level_obj.value}</span>
          </div>
          <span>${weatherData.temp_range}</span>
      </div><div class="twoday-type"><span class="iconSymbol">${getIconSymbolFromCNstate(weatherData.wea)}</span><span class="tips">${weatherData.wea}</span></div>
    `
  }

    /**
   * 整理数据并加载7日图表
   * @param {*} allDayData 
   */
  function loadAllWeekTable(allWeekData){
    var highLowObj = {
      high:[],
      low:[]
    }
    for(var i=0;i<allWeekData.length;i++){
      highLowObj.high.push(parseTempToNumber(allWeekData[i].tem1))
      highLowObj.low.push(parseTempToNumber(allWeekData[i].tem2))
    }
    
    loadAllWeekTableFormData(".allWeek-w-table", highLowObj);
  }

  /**
   * 整理数据并加载24小时图表
   * @param {*} allDayData 
   */
  function loadAllDayTable(allDayData){
   // 24小时气温预报图
    var allDataTemp = {
      timeline:[],
      data:[]
    }
    for(var i=0;i<allDayData.length;i++){
      allDataTemp.data.push(parseTempToNumber(allDayData[i].tem));
      allDataTemp.timeline.push(parseDateToNumber(allDayData[i].day));
    }
    loadAllDayTableFormData(".allDay-w-table", allDataTemp);
  }

  /**
   * 字符串转数字
   * @param {*} tempStr 
   */
  function parseTempToNumber(tempStr){
    return parseFloat(tempStr);
  }

  /**
   * 转换为数字时钟格式
   * @param {*} dateStr  08日13时 =》 13:00
   */
  function parseDateToNumber(dateStr){
    return dateStr.match(/\w+(?=时)/g)[0] + ":00";
  }

  /**
   * 转换为斜杠分割的时间格式
   * @param {*} dateStr  2019-03-13 =》 03/13
   */
  function parseDateToDay(dateStr){
    return dateStr.match(/\-(.+)/)[1].replace("-", "/")
  }

  /**
   * 过滤接口数据——风向
   * @param {*} datastr 
   */
  function sortOutByWindDir(datastr){
    switch(datastr){
      case "无持续风向":
        return "无风向"
      default:
        return datastr
    }
  }


  /**
   *  根据接口得到的天气质量进行再包装
   */
  function getBadgeClassStl(air_level){
    var BadgeS = {
      "优": { classTxt: 'mui-badge-success', value: "优质"},
      "好": { classTxt: 'mui-badge-success', value: "优质"},
      "良": { classTxt: 'mui-badge-primary', value: "良好"},
      "中": { classTxt: 'mui-badge-warning', value: "中等"},
      "差": { classTxt: 'mui-badge-danger', value: "差"},
      "严重": { classTxt: 'mui-badge-danger', value: "严重"},
    }
    for(var Badge in BadgeS){
      if(Badge.indexOf(air_level) > -1){
        console.log('当前空气质量等级', BadgeS[Badge]);
        return BadgeS[Badge];
      }
    }
  }

  /**
   * 返回一个用于判断天气类型的类名的方法
   */
  var getIconSymbolFromCNstate = (function(){
      var icon = '#icon-';
      var weatherIconArray = [
          {
              name: "霾",
              class: icon+'wu' // 借用 雾
          },{
              name: "雾",
              class: icon+'wu'
          },{
              name: "扬沙",
              class: icon+'yangsha'
          },{
              name: "浮尘",
              class: icon+'fuchen'
          },{
              name: "小雪",
              class: icon+'xiaoxue'
          },{
              name: "中雪",
              class: icon+'zhongxue'
          },{
              name: "大雪",
              class: icon+'daxue'
          },{
              name: "阵雪",
              class: icon+'zhenxue'
          },{
              name: "冻雪",
              class: icon+'baoxue' // 用暴雪代替
          },{
              name: "暴雪",
              class: icon+'baoxue'
          },{
              name: "阵雨",
              class: icon+'zhenyu'
          },{
              name: "小雨",
              class: icon+'xiaoyu'
          },{
              name: "中雨",
              class: icon+'zhongyu'
          },{
              name: "大雨",
              class: icon+'dayu'
          },{
              name: "暴雨",
              class: icon+'baoyu'
          },{
              name: "沙尘暴",
              class: icon+'shachenbao'
          },{
              name: "强沙尘暴",
              class: icon+'qiangshachenbao'
          },{
              name: "多云",
              class: icon+'duoyun'
          },{
              name: "晴",
              class: icon+'qing'
          },{
              name: "阴",
              class: icon+'yin'
          },{
              name: "大暴雨",
              class: icon+'dabaoyu'
          },{
              name: "特大暴雨",
              class: icon+'tedabaoyu'
          },{
              name: "雷阵雨",
              class: icon+'leizhenyu'
          },{
              name: "雨夹雪",
              class: icon+'yujiaxue'
          },{
              name: "雷阵雨伴冰雹",
              class: icon+'leizhenyubanbingbao'
          }
        ]
      return function (CNstate){
          for(var index in weatherIconArray){
              var item = weatherIconArray[index]
              var isMatch = CNstate.indexOf(item.name) > -1;
              if(isMatch)
                  return `
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="${item.class}"></use>
                  </svg>`
          }
      }
  })();

})(mui, document)




