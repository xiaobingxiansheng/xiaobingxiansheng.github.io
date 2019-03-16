function initTablesToView(selector, option){
    var dom = document.querySelector(selector);
    var chart = echarts.init(dom);
    
    if (option && typeof option === "object") {
        chart.setOption(option, true);
    }

    // 当函数被多次复用就合并函数。
    if(window.onresize!= null){
        let oldResizeHandle = window.onresize;
        window.onresize = function(){
            oldResizeHandle();
            chart.resize();
        }
    }else {
        window.onresize = function(){
            chart.resize();
        };
    }
}

/**
 * 
 * @param {*} dom example:".cityContent"
 * @param {object} allDataTemp example:{timeline:['08:00',....], data: [15,14,13,14,...]}
 */
var loadAllDayTableFormData = function(dom, allDataTemp){
    var option =  {
        "color": [
            "#e2d2d2",
            "#759aa0",
        ],
        xAxis: {
            
            // 坐标轴两端的空隙
            boundaryGap : false,
            type: 'category',
            data: allDataTemp.timeline,
            axisLine: {
                show: false  
            },
            axisTick:{
                show: false
            },
            axisLabel:{
                textStyle: {
                    color: "#fff"
                }
            }

        },
        yAxis: {
            type: 'value',
            // 坐标轴分割线
            splitLine: {
                show: false
            },
            
            axisLine: {
                show: false  
            },
            axisTick:{
                show: false
            },
            axisLabel:{
                textStyle: {
                    color: "#fff"
                }
            },
            // 轴线分割
            splitNumber : 1,
            min: function(value) {
                return value.min;
            },
            max: function(value) {
                return value.max;
            }
        },
        series: [{
            data: allDataTemp.data,
            type: 'line',
            lineStyle: {
                normal:{
                    "width": "1",
                    "color": "#fff"
                }
            },
            // 标志大小
            symbolSize: 4,
            // 圆头的线
            smooth: true,
            areaStyle: {
                // 折线图填充颜色
                color: 'rgb(44,47,69)',
                opacity: 0.3
            }
        }],
        grid:{
            //　图标的位置。
            top:"20px",
            left:"5px",
            right:"15px",
            bottom:"10px",
            containLabel : true,
        }
    }

    initTablesToView(dom, option);
}

var loadAllWeekTableFormData = function(dom, highLowTemps){
    var option ={
        xAxis: {
            type: 'category',
            boundaryGap: false,
            show: false,
            data: ['周一','周二','周三','周四','周五','周六', '周日']
        },
        yAxis: {
            type: 'value',
            min: function(value) {
                return value.min - 2;
            },
            max: function(value) {
                return value.max + 2;
            },
            show: false
        },
        series: [
            {
                type:'line',
                data:highLowTemps.high,
                smooth:true,
                label: {
                    show: true,
                    position: 'top',
                    formatter:'{c}°',
                    color:"#fff"
                },
                symbolSize:8,
                symbol : "circle",
                lineStyle:{
                    color:"rgb(236,226,63)" 
                },
                itemStyle:{
                    color: "#fff"
                },
                grid:{
                    top:0,
                    left:0
                }
            },
            {
                type:'line',
                data:highLowTemps.low,
                smooth:true,
                label: {
                    show: true,
                    position: 'bottom',
                    formatter:'{c}°',
                    color:"#fff"
                },
                symbolSize:8,
                symbol : "circle",
                lineStyle:{
                    color:"rgb(123,254,255)" 
                },
                itemStyle:{
                    color: "#fff"
                }

            },
        ],
        grid:{
            //　图标的位置。
            top:"25px",
            left:"4px",
            right:"25px",
            bottom:"5px",
            containLabel : true,
        }
    };

    initTablesToView(dom, option);
}
