$(function(){
	/*图表*/
	var chart01 = echarts.init(document.getElementById('chart01'));
	var chart02 = echarts.init(document.getElementById('chart02'));
	var chart03 = echarts.init(document.getElementById('chart03'));
	var chart05 = echarts.init(document.getElementById('chart05'));

	option01 = {
		tooltip: {
	        trigger: 'item',
	        formatter: "{b}: {c}"
	    },
	    title : {
	        text: '80%',
	        subtext: '大学以上学历',
	        left: 'center',
	        top: '35%',
	        textStyle:{
	            color: '#262B2E',
	            fontSize:28,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        },
	        subtextStyle:{
	        	color: '#262B2E',
	            fontSize:13,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        }
	    },
	    series: [
	        {
	            name:'',
	            type:'pie',
				hoverAnimation: false,					//悬浮放大效果
	            radius: ['70%', '80%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {
	                	value:80, 
	                	name:'大学以上学历',
	                	itemStyle:{
							normal: {
								color:'#55B813'
							}   
						}
	                },
	                {
	                	value:20, 
	                	name:'大学以下学历',
		                itemStyle:{
							normal: {
								color:'#f5f8f9'
							}   
						}
					}
	            ]
	        }
	    ]
	}
	option02 = {
		tooltip: {
	        trigger: 'item',
	        formatter: "{b}: {c}"
	    },
	    title : {
	        text: '60%',
	        subtext: '有资格证书比例',
	        left: 'center',
	        top: '35%',
	        textStyle:{
	            color: '#262B2E',
	            fontSize:28,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        },
	        subtextStyle:{
	        	color: '#262B2E',
	            fontSize:13,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        }
	    },
	    series: [
	        {
	            name:'',
	            type:'pie',
				hoverAnimation: false,					//悬浮放大效果
	            radius: ['70%', '80%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {
	                	value:60, 
	                	name:'有资格证书比例',
	                	itemStyle:{
							normal: {
								color:'#69A5E1'
							}   
						}
	                },
	                {
	                	value:40,
	                	name:'无资格证书比例',
		                itemStyle:{
							normal: {
								color:'#f5f8f9'
							}   
						}
					}
	            ]
	        }
	    ]
	}
	option03 = {
		tooltip: {
	        trigger: 'item',
	        formatter: "{b}: {c}"
	    },
	    title : {
	        text: '40%',
	        subtext: '中级以上职称',
	        left: 'center',
	        top: '35%',
	        textStyle:{
	            color: '#262B2E',
	            fontSize:28,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        },
	        subtextStyle:{
	        	color: '#262B2E',
	            fontSize:13,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        }
	    },
	    series: [
	        {
	            name:'',
	            type:'pie',
				hoverAnimation: false,					//悬浮放大效果
	            radius: ['70%', '80%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {
	                	value:40, 
	                	name:'中级以上职称',
	                	itemStyle:{
							normal: {
								color:'#FDBA4F'
							}   
						}
	                },
	                {
	                	value:60, 
	                	name:'中级以下职称',
		                itemStyle:{
							normal: {
								color:'#f5f8f9'
							}   
						}
	            	}
	            ]
	        }
	    ]
	}
	option05 = {
		backgroundColor:'#fff',
		legend: {
			data:[
				{
					name:'年初金额',
					icon:'rect'
				},
				{
					name:'年末金额',
					icon:'rect'
				}
			],
			right:'30px',
			top:'10px',
			itemGap:15
		},
		tooltip : {
			trigger: 'axis',
			axisPointer:{
				lineStyle:{
					width:0
				}
			},
			//showContent:false
		},
		grid: {
			top: '60px',
			left: '0',
			right: '20px',
			left: '30px',
			bottom: '0',
			containLabel: true
		},
		xAxis : [
			{
				type : 'category',
				boundaryGap : false,
				axisLine: {
					show: true,
					lineStyle: {
						color:'#eee'
					}
					
				},
				axisLabel: {
					textStyle: {
						color: '#444',//坐标值得具体的颜色
					}
				},
			   data : ['第一行','第二行','第三行','第四行','第五行','第六行']
			}
		],
		yAxis : [
			{
				type : 'value',
				splitNumber:4,
				boundaryGap : false,
				axisLine: {
					lineStyle: {
						color:'#fff'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#444',//坐标值得具体的颜色

					}
				},
				splitLine:{
					show: true,
					lineStyle:{
						color:'#eee'			//网格分割线
					}
				}
			}
		],
		series : [
			{
				name:'年末金额',
				type:'line',
				symbolSize:10,
				hoverAnimation:false,
				showSymbol:false,
				label: {
					normal: {
						show: true,
						position: 'top',
						backgroundColor:'#69A5E1',
						color:'#fff',
						padding:[6,9],
						borderRadius:100
					}
				},
				lineStyle:{
					normal:{
						color:'#69A5E1'
					}
				},
				itemStyle: {
					normal: {
						color: "#69A5E1"
					}
				},
				areaStyle: {
					normal: {
						color: '#d2e4f6',
						opacity:1
					}
				},
				data:[45, 30, 28, 40, 65, 50]
			},

			{
				name:'年初金额',
				type:'line',
				symbolSize:10,
				hoverAnimation:false,
				showSymbol:false,
				label: {
					normal: {
						show: true,
						position: 'top',
						backgroundColor:'#5DD054',
						color:'#fff',
						padding:[6,9],
						borderRadius:100
					}
				},
				lineStyle:{
					normal:{
						color:'#5DD054'
					}
				},
				itemStyle: {
					normal: {
						color: "#5DD054"
					}
				},
				areaStyle: {
					normal: {
						color: '#cef1cb',
						opacity:1
					}
				},
				data:[32, 20, 25, 40, 45, 36]
			}
		]
	};
	
	chart01.setOption(option01);  
	chart02.setOption(option02);  
	chart03.setOption(option03);  
	 
	chart05.setOption(option05);               
});


