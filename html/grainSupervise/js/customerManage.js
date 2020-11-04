$(function(){
	/*图表*/
	var chart01 = echarts.init(document.getElementById('chart01'));
	var chart02 = echarts.init(document.getElementById('chart02'));

	option01 = {
		backgroundColor:'#fff',
		tooltip : {
			trigger: 'axis',
			axisPointer:{
				lineStyle:{
					width:0
				}
			},
			// showContent:false
		},
	    title : {
	        text: '客户地市分布图',
	        left: '0',
	        top: '10px',
	        textStyle:{
	            color: '#333',
	            fontSize:14,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        }
	    },
		grid: {
			top: '80px',
			left: '30px',
			right: '50px',
			bottom: '10px',
			containLabel: true
		},
		xAxis : [
			{
				type : 'category',
				name : '城市',
				nameTextStyle : {
					color: '#333',
					align: 'left'
				},
				axisLine: {
					lineStyle: {
						color:'#eee'
					}
					
				},
				axisLabel: {
					textStyle: {
						color: '#444',//坐标值得具体的颜色
					}
				},
			   data : ['南宁','桂林','百色','柳州','梧州', '崇左']
			}
		],
		yAxis : [
			{
				type : 'value',
				name : '数量/个',
				nameTextStyle : {
					color: '#333',
					align: 'left'
				},
				splitNumber:4,
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
						color:'#eee'
					}
				}
			}
		],
		series : [
			{
				name:'',
				type:'bar',
				barWidth: '20%',
				itemStyle:{
					normal:{
						color:'#55B813'
					}
				},
				data:[20, 40, 15, 18, 15]
			}
		]
	};
	
	option02 = {
		tooltip: {
	        trigger: 'item',
	        formatter: "{b}: {c}"
	    },
	    title : {
	        text: '客户类型分布',
	        left: '0',
	        top: '10px',
	        textStyle:{
	            color: '#262B2E',
	            fontSize:14,
	            fontWeight:'normal',
	            fontFamily:"Microsoft YaHei"
	        }
	    },
	    series: [
	        {
	            name:'',
	            type:'pie',
				hoverAnimation: false,					//悬浮放大效果
	            radius : '55%',
	            center: ['50%', '55%'],
	            // avoidLabelOverlap: false,
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
	                	name:'个人客户',
	                	itemStyle:{
							normal: {
								color:'#FDBA4F'
							}   
						}
	                },
	                {
	                	value:20, 
	                	name:'企业客户',
		                itemStyle:{
							normal: {
								color:'#69A5E1'
							}   
						}
					}
	            ]
	        }
	    ]
	}

	chart01.setOption(option01);  
	chart02.setOption(option02);                
});


