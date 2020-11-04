
function initChart(){
	/*图表*/
	var chart01 = echarts.init(document.getElementById('chart01'));
	var chart02 = echarts.init(document.getElementById('chart02'));
	
	var option01 = {
		tooltip: {
	        trigger: 'item',
	        formatter: "{b}: {c}"
	    },
	    series: [
	        {
	            name:'',
	            type:'pie',
				hoverAnimation: false,					//悬浮放大效果
	            radius : '50%',
	            center: ['50%', '40%'],
	            avoidLabelOverlap: false,
	            // label: {
	            //     normal: {
	            //         show: false,
	            //         position: 'center'
	            //     }
	            // },
	            // labelLine: {
	            //     normal: {
	            //         show: false
	            //     }
	            // },
	            data:[
	                {
	                	value:80, 
	                	name:'一等',
	                	itemStyle:{
							normal: {
								color:'#04C75C'
							}   
						}
	                },
	                {
	                	value:20, 
	                	name:'二等',
		                itemStyle:{
							normal: {
								color:'#A587FD'
							}   
						}
					},
	                {
	                	value:60, 
	                	name:'三等',
		                itemStyle:{
							normal: {
								color:'#FCC11B'
							}   
						}
					},
	                {
	                	value:100, 
	                	name:'四等',
		                itemStyle:{
							normal: {
								color:'#FF95EC'
							}   
						}
					},
	                {
	                	value:30, 
	                	name:'五等',
		                itemStyle:{
							normal: {
								color:'#46ADFA'
							}   
						}
					},
	                {
	                	value:90, 
	                	name:'六等',
		                itemStyle:{
							normal: {
								color:'#FDA787'
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
	    series: [
	        {
	            name:'',
	            type:'pie',
				hoverAnimation: false,					//悬浮放大效果
	            radius : '50%',
	            center: ['50%', '55%'],
	            avoidLabelOverlap: false,
	            // label: {
	            //     normal: {
	            //         show: false,
	            //         position: 'center'
	            //     }
	            // },
	            // labelLine: {
	            //     normal: {
	            //         show: false
	            //     }
	            // },
	            data:[
	                {
	                	value:80, 
	                	name:'农业产品',
	                	itemStyle:{
							normal: {
								color:'#55B813'
							}   
						}
	                },
	                {
	                	value:20, 
	                	name:'谷物',
		                itemStyle:{
							normal: {
								color:'#FDBA4F'
							}   
						}
					},
	                {
	                	value:60, 
	                	name:'小麦及混合小麦',
		                itemStyle:{
							normal: {
								color:'#51A7F3'
							}   
						}
					},
	                {
	                	value:100, 
	                	name:'冬小麦',
		                itemStyle:{
							normal: {
								color:'#A587FD'
							}   
						}
					},
	                {
	                	value:30, 
	                	name:'春小麦',
		                itemStyle:{
							normal: {
								color:'#FF95EC'
							}   
						}
					},
	                {
	                	value:90, 
	                	name:'粟(谷子)',
		                itemStyle:{
							normal: {
								color:'#A587FD'
							}   
						}
					},
	                {
	                	value:90, 
	                	name:'稻谷',
		                itemStyle:{
							normal: {
								color:'#A587FD'
							}   
						}
					},
	                {
	                	value:90, 
	                	name:'玉米',
		                itemStyle:{
							normal: {
								color:'#FF95EC'
							}   
						}
					},
	                {
	                	value:90, 
	                	name:'混合小麦',
		                itemStyle:{
							normal: {
								color:'#3CCCCA'
							}   
						}
					},
	                {
	                	value:90, 
	                	name:'优质小麦',
		                itemStyle:{
							normal: {
								color:'#C8AA77'
							}   
						}
					}
	            ]
	        }
	    ]
	}

	chart01.setOption(option01);  
	chart02.setOption(option02);  
}
