$(function(){
	/*图表*/
	var chart01 = echarts.init(document.getElementById('chart01'));
	var chart02 = echarts.init(document.getElementById('chart02'));
	var chart03 = echarts.init(document.getElementById('chart03'));

	var itemStyle1 = ['#55B813','#FDBA4F','#69a5e1','#13B884','#51c4f8'];
	var option01 = {
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c}"
        },
        title : {
	        text: '直补订单收购执行情况',
	        left: '20px',
	        top: '0',
	        textStyle:{
	            color: '#333',
	            fontSize:20,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        }
	    },
        series: [
            {
                name:'',
                type:'pie',
                hoverAnimation: false,                  //悬浮放大效果
                radius : ['45%','60%'],
                // center: ['50%', '50%'],
                avoidLabelOverlap: false,
                data:[
                    {
                        value: 4544, 
                        name:'普通早稻',
                        itemStyle:{
                            normal: {
                                color: itemStyle1[0]
                            }   
                        }
                    },
                    {
                        value:4544, 
                        name:'普通中晚稻',
                        itemStyle:{
                            normal: {
                                color: itemStyle1[1]
                            }   
                        }
                    },
                    {
                        value:4544, 
                        name:'优质早稻',
                        itemStyle:{
                            normal: {
                                color: itemStyle1[2]
                            }   
                        }
                    },
                    {
                        value:4544, 
                        name:'优质中晚稻',
                        itemStyle:{
                            normal: {
                                color: itemStyle1[3]
                            }   
                        }
                    }
                ]
            }
        ]
    }

    var option02 = {
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c}"
        },
        title : {
	        text: '直补订单收购执行情况',
	        left: '20px',
	        top: '0',
	        textStyle:{
	            color: '#333',
	            fontSize:20,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        }
	    },
        series: [
            {
                name:'',
                type:'pie',
                hoverAnimation: false,                  //悬浮放大效果
                radius : ['45%','60%'],
                // center: ['50%', '50%'],
                avoidLabelOverlap: false,
                data:[
                    {
                        value: 4544, 
                        name:'早稻',
                        itemStyle:{
                            normal: {
                                color: itemStyle1[0]
                            }   
                        }
                    },
                    {
                        value:4544, 
                        name:'中晚稻',
                        itemStyle:{
                            normal: {
                                color: itemStyle1[1]
                            }   
                        }
                    }
                ]
            }
        ]
    };


    var itemStyle3 = ['#5e8594','#55b813','#ff9933','#755da9','#69a5e1'];
    var yData = ['直补订单优质中晚稻','直补订单优质早稻','直补订单普通中晚稻','直补订单普通早稻','非直补订单早稻','非直补订单优质早晚稻'];
    var legend = ['7月1日', '7月6日','7月11日','7月16日','7月21日'];
    var data3 = [
    		[320, 302, 301, 334, 390, 330],
    		[120, 132, 101, 134, 90, 230],
    		[220, 182, 191, 234, 290, 330],
    		[150, 212, 201, 154, 190, 330],
    		[820, 832, 901, 934, 1290, 1330]
    ];
	var option03 = {
		tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    legend: {
	        data: legend
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis:  {
	        type: 'value',
	        axisLabel : {
	            textStyle: {
	                color: '#444',//坐标值得具体的颜色
	            },
	            interval:0//横轴信息全部显示 
	        },
	        axisLine: {
	            lineStyle: {
	                color:'#ddd'
	            }
	            
	        },
	        splitLine:{
	            // show: false
	            lineStyle: {
	                color: '#e9e9e9'
	            }
	        },
	    },
	    yAxis: {
	        type: 'category',
	        axisLabel : {
	            textStyle: {
	                color: '#444',//坐标值得具体的颜色
	            },
	            interval:0//横轴信息全部显示 
	        },
	        axisLine: {
	            lineStyle: {
	                color:'#ddd'
	            }
	            
	        },
	        splitLine:{
	            // show: false
	            lineStyle: {
	                color: '#e9e9e9'
	            }
	        },
	        data: yData
	    },
	    series: [
	        {
	            name: '7月1日',
	            type: 'bar',
	            stack: '总量',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'insideRight'
	                }
	            },
	            itemStyle: {
	            	normal: {
	            		color: itemStyle3[0]
	            	}
	            },
	            data: data3[0]
	        },
	        {
	            name: '7月6日',
	            type: 'bar',
	            stack: '总量',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'insideRight'
	                }
	            },
	            itemStyle: {
	            	normal: {
	            		color: itemStyle3[1]
	            	}
	            },
	            data: data3[1]
	        },
	        {
	            name: '7月11日',
	            type: 'bar',
	            stack: '总量',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'insideRight'
	                }
	            },
	            itemStyle: {
	            	normal: {
	            		color: itemStyle3[2]
	            	}
	            },
	            data: data3[2]
	        },
	        {
	            name: '7月16日',
	            type: 'bar',
	            stack: '总量',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'insideRight'
	                }
	            },
	            itemStyle: {
	            	normal: {
	            		color: itemStyle3[3]
	            	}
	            },
	            data: data3[3]
	        },
	        {
	            name: '7月21日',
	            type: 'bar',
	            stack: '总量',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'insideRight'
	                }
	            },
	            itemStyle: {
	            	normal: {
	            		color: itemStyle3[4]
	            	}
	            },
	            data: data3[4]
	        }
	    ]
	}

	chart01.setOption(option01);  
	chart02.setOption(option02);  
	chart03.setOption(option03);                
});


