var charts = [];
$(function(){
    laydate.render({
        elem: '#date1'
    });
    laydate.render({
        elem: '#date2'
        ,type: 'month'
    });

    loadGraph();
    
    var data1 = {value: 200, name: '及时率'}
    var total = 250;
    var whitePart  = total/0.75*0.25;
    var grayPart = total - data1.value;
    var data=[data1 ,{value: grayPart, name:'未完成'},{value: whitePart,name: ''}];
    var colors = ['#ed4f4c','#f6f7f9','#fff'];

    var percent = data1.value/total;
    var percentStr = Number(percent*100).toFixed(0) + '%';
    var currentColor = '#ed4f4c';
    if(percent < 0.8){
        currentColor = '#ed4f4c';
    }else if(percent >= 0.8 && percent < 0.9){
        currentColor = '#fcc64b';
    }else if(percent >= 0.9){
        currentColor = '#1bcd20';
    }
    colors[0] = currentColor;
    var percentC1 = loadPercent(data,percentStr,colors,'percent1');

    data1 = {value: 160, name: '工单完成率'}
    whitePart  = total/0.75*0.25;
    var grayPart = total - data1.value;
    data=[data1 ,{value: grayPart, name:'未完成'},{value: whitePart,name: ''}];
    colors = ['#7f5efe','#f6f7f9','#fff'];
    percent = data1.value/total;
    percentStr = Number(percent*100).toFixed(0) + '%';
    var percentC2 = loadPercent(data,percentStr,colors,'percent2');



    loadCircle({
        domId: 'circle1',
        fontColor: '#1EA3FE',
        itemColor: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 1,
            y2: 0,
            colorStops: [{
                offset: 0, color: '#1EA3FE' // 0% 处的颜色
            }, {
                offset: 1, color: '#17F7F4' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        },
        value: 508,
        name: '全部流程'

    });
    loadCircle({
        domId: 'circle2',
        fontColor: '#1BD4BC',
        itemColor: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 1,
            y2: 0,
            colorStops: [{
                offset: 0, color: '#1CD4BC' // 0% 处的颜色
            }, {
                offset: 1, color: '#60F5FA' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        },
        value: 203,
        name: '运行中流程'

    });
    loadCircle({
        domId: 'circle3',
        fontColor: '#6344FA',
        itemColor: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 1,
            y2: 0,
            colorStops: [{
                offset: 0, color: '#6344FA' // 0% 处的颜色
            }, {
                offset: 1, color: '#8F57F5' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        },
        value: 80,
        name: '挂起流程'

    });
    var op3 = {
        lineColor: '#FAA82B',
        barColor: '#1AD3F9',
        lineData: [15, 29, 43, 64, 51, 35, 37, 34, 35, 55],
        barData: [10, 24, 38, 59, 46, 30, 32, 29, 30, 50],
        xData: ['通知工单','用车工单','请假工单','采购工单','通知工单','用车工单','请假工单','采购工单','通知工单','用车工单'],
        labelColor: 'rgba(27,27,27,.7)'
    };
    loadChart3(op3);
    var op4 = {
        lineColor: '#15C1AB',
        lineData: [15, 29, 43, 64, 51, 35, 37, 34, 35, 55, 38,61,72, 25, 35, 45, 51, 37, 45, 29, 44, 47, 55,61,33,44,55,24,27,34,41],
        xData: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
        labelColor: 'rgba(27,27,27,.7)'
    };
    loadChart4(op4);

    window.onresize = function(){
        charts.forEach(function(item,index){
            item.resize();
        });
    };
});
/**
 * [loadGraph description]
 * @return {[type]} [description]
 */
function loadGraph(){
    var colors = ['#FFC852','#8C97CB','#448ACA'];
    option = {
        series : [
            {
                type: 'graph',
                left: 55,
                right: 55,
                hoverAnimation:false,
                symbolSize: function(value,param){
                    if(param.dataIndex == 0){
                        return 120;
                    }
                    return 90;
                },
                label: {
                    normal: {
                        show: true
                    }
                },
                data: [{
                    name: '工作流\n\n平台',
                    x: 300,
                    y: 300,
                    itemStyle: {
                        color: colors[0]
                    },
                    label: {
                        fontSize: 24
                    }
                }, {
                    name: 'XX流程定义',
                    x: 0,
                    y: 150,
                    itemStyle: {
                        color: colors[1]
                    },
                    label: {
                        fontSize: 14
                    }
                }, {
                    name: 'XX表单',
                    x: 550,
                    y: 180,
                    itemStyle: {
                        color: colors[2]
                    },
                    label: {
                        fontSize: 14
                    }
                }],
                links: [ {
                    source: '工作流\n\n平台',
                    target: 'XX流程定义'
                }, {
                    source: '工作流\n\n平台',
                    target: 'XX表单'
                }],
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                    }
                }
            }
        ]
    };
    var chart = echarts.init(document.getElementById("graph"));
    chart.setOption(option);
    chart.on('click', function (params) {
        /*以颜色区分。。*/
        //TODO
        if(params.color == colors[0]){
            alert("工作流平台");
        }
        if(params.color == colors[1]){
            alert("XX流程定义");
        }
        if(params.color == colors[2]){
            alert("XX表单");
        }
        
    });
    charts.push(chart);
    return chart;
}
/**
 * 加载百分比
 * @param  {[type]} data       [description]
 * @param  {[type]} percentStr [description]
 * @param  {[type]} colors     [description]
 * @param  {[type]} domId      [description]
 * @return {[type]}            [description]
 */
function loadPercent(data,percentStr,colors,domId){
    option = {
        backgroundColor:' #fff',
        title:{
            text: percentStr,
            textStyle: {
                color: colors[0],
                fontSize: 30
            },
            left: 'center',
            bottom: '16%',
            subtext: data[0].name,
            subtextStyle: {
                fontSize: 14,
                color: '#333'
            },
            itemGap: 30
        },
        color: colors,
        series : [
        {
            name: data[0].name,
            type: 'pie',
            startAngle:225,
            hoverAnimation: false,
            radius :  ['63%', '80%'],
            data:data,
            label: {
                show: false
            }
        }
        ]
    };
    var chart = echarts.init(document.getElementById(domId));
    chart.setOption(option);
    charts.push(chart);
    return chart;
}
/**
 * [loadChart3 description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function loadChart3(options){
    var option = {
        title: {
            text: '工单数',
            left:'10px',
            top:'10px',
            textStyle:{
                fontSize: 16,
                fontWeight: 'normal',
                color:'#666'
            }
        },
        tooltip : {
            trigger: 'axis',
            axisPointer:{
                lineStyle:{
                    width:0
                }
            },
            // showContent:false
        },
        grid: {
            top: '60px',
            left: '40px',
            right: '20px',
            bottom: '20px',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color:'#E5E5E5'
                    }
                    
                },
                axisLabel: {
                    textStyle: {
                        color: '#666',//坐标值得具体的颜色
                    },
                    rotate: -45,
                },
               data : options.xData
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitNumber: 4,
                axisLine: {
                    lineStyle: {
                        color:'#E5E5E5'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#666',//坐标值得具体的颜色

                    }
                },
                axisTick: {
                    show: false
                },
                splitLine:{
                    show: true,
                    lineStyle:{
                        color:'#E5E5E5'         //网格分割线
                    }
                }
            }
        ],
        series : [
            {
                name:'指标1',
                type:'line',
                symbolSize:10,
                hoverAnimation:false,
                // showSymbol:false,
                smooth: true,
                label: {
                        show: false,
                    position: 'top',
                    backgroundColor: options.labelColor,
                    color:'#fff',
                    padding:[6,15],
                    borderRadius:2,
                    formatter: '{c} 条'
                },
                lineStyle:{
                    normal:{
                        color: options.lineColor
                    }
                },
                itemStyle: {
                    normal: {
                        color: options.lineColor
                    }
                },
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: options.lineData
            },
            {
                name:'指标2',
                type:'bar',
                barWidth: '35%',
                itemStyle:{
                    normal:{
                        color: options.barColor,
                        label : {
                            show : false
                        },
                        barBorderRadius: 4
                    },
                }, 
                data: options.barData
            }
        ]
    };

    var chart03 = echarts.init(document.getElementById('chart3'));
    chart03.setOption(option);
    charts.push(chart03);
    return chart03;
}
/**
 * [loadChart4 description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function loadChart4(options){
    var option = {
        title: {
            text: '流程实例',
            left:'10px',
            top:'10px',
            textStyle:{
                fontSize: 16,
                fontWeight: 'normal',
                color:'#666'
            }
        },
        tooltip : {
            trigger: 'axis',
            axisPointer:{
                lineStyle:{
                    width:0
                }
            },
            // showContent:false
        },
        grid: {
            top: '60px',
            left: '40px',
            right: '20px',
            bottom: '15px',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color:'#E5E5E5'
                    }
                    
                },
                axisLabel: {
                    textStyle: {
                        color: '#666',//坐标值得具体的颜色
                    }
                },
               data : options.xData
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitNumber: 4,
                axisLine: {
                    lineStyle: {
                        color:'#E5E5E5'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#666',//坐标值得具体的颜色

                    }
                },
                axisTick: {
                    show: false
                },
                splitLine:{
                    show: true,
                    lineStyle:{
                        color:'#E5E5E5'         //网格分割线
                    }
                }
            }
        ],
        series : [
            {
                name:'指标1',
                type:'line',
                symbolSize:10,
                hoverAnimation:false,
                smooth: true,
                label: {
                    // normal: {
                        show: false,
                        position: 'top',
                        backgroundColor: options.labelColor,
                        color:'#fff',
                        padding:[6,15],
                        borderRadius:2,
                        formatter: '{c} 个'
                    // },
                    
                },
                lineStyle:{
                    normal:{
                        color: options.lineColor
                    }
                },
                itemStyle: {
                    normal: {
                        color: options.lineColor
                    }
                },
                areaStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#a7fbf0' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }]
                        },
                        opacity:1
                    }
                },
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: options.lineData
            }
        ]
    };

    var chart04 = echarts.init(document.getElementById('chart4'));
    chart04.setOption(option);
    charts.push(chart04);
    return chart04;
}
function loadCircle(options){
    var option = {
        series: [
            {
                name:'数据',
                type:'pie',
                radius: ['85%', '100%'],
                startAngle: -90,
                hoverAnimation: false,
                label: {
                    normal: {
                        formatter:'{a|{c}}\n{b|{b}}',
                        show: true,
                        fontSize: 16,
                        position: 'center',
                        rich: {
                            a: {
                                color: options.fontColor,
                                fontSize: 32,
                                fontWeight: 'bold',
                            },
                            b: {
                                color: options.fontColor,
                                fontSize: 14,
                                lineHeight: 20
                            }
                        }
                    }
                },
                color: options.itemColor,
                data:[
                    {value: options.value, name: options.name}
                ]
            }
        ]
    };
    var chart = echarts.init(document.getElementById(options.domId));
    chart.setOption(option); 
    charts.push(chart);
    return chart;
}