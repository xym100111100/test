//地图容器
var chart = echarts.init(document.getElementById('main'));

 $.getJSON('map/province/guangxi.json', function(data){
     echarts.registerMap( 'guangxi', data);
     renderMap();
});

/*散点经纬度数据*/
var geoData = [                 
    {
        name : "粮库1",
        value: [108.191206,24.926497]
    },
    {
        name : "粮库2",
        value: [108.054133,24.24499]
    },
    {
        name : "粮库3",
        value: [106.757393,23.520344]
    },
    {
        name : "粮库4",
        value: [109.46892,25.355665]
    },
    {
        name : "粮库5",
        value: [109.46892,22.355665]
    },
    {
        name : "粮库6",
        value: [108.577671,22.758514]
    },
    {
        name : "粮库7",
        value: [110.751467,23.144928]
    },
    {
        name : "粮库8",
        value: [109.925098,23.052021]
    }
];

var myTooltip = {
    trigger: 'item',
    formatter: '{b}',
    enterable:true,
    //alwaysShowContent:true,
    hideDelay:100,
    // backgroundColor: 'rgba(255,255,255,1)',//背景颜色（此时为默认色）
    borderRadius: 2,//边框圆角
    borderWidth: '0',
    padding: 0,    // [5, 10, 15, 20] 内边距
    textStyle:{
        color:'#000'
    },
    position: function (point, params, dom, rect, size) {
        var html = '<div class="map-tip">'
                +'      <p style="font-size:16px;">'+ params.name +'</p>'
                +'      <p>承储企业20家</p>'
                +'      <p>粮库40个</p>'
                +'      <p>粮仓100个</p>'
                +'      <p>油罐5个</p>'
                +'  </div>';
        $(dom).html(html)
    }
};
var myLabelStyle = {
    normal:{
        show:true,
        textStyle:{
            color:'#fff',
            fontSize:14
        }  
    },
    emphasis: {
        show: true,
        textStyle:{
            color:'#fff',
            fontSize:14
        }
    }
};
var myItemStyle = {
    normal: {
        areaColor: 'rgba(12, 85, 139, .4)',
        borderColor: '#43a9d8',
        // {
        //         type: 'linear',
        //         x: 0,
        //         y: 1,
        //         x2: 1,
        //         y2: 0,
        //         colorStops: [{
        //             offset: 0, color: '#041447' // 0% 处的颜色
        //         }, {
        //             offset: 1, color: '#0ea9f7' // 100% 处的颜色
        //         }]
        // },
        borderWidth: '2',
        shadowColor: '#4f80cc',
        shadowBlur: 2
    },
    emphasis: {
        areaColor: '#0f3a80'
    }
};
function renderMap(map,data){
    var option = {
        // tooltip: myTooltip,
        geo: {
            aspectScale: 0.85,
            bottom: '-180px',
            map: 'guangxi',
            label: myLabelStyle,
            itemStyle: myItemStyle
        },
        series: [
            {
                name: '',
                type: 'scatter',               //散点图
                coordinateSystem: 'geo',        //背景
                symbol:'image://../../resource/images/grain_flag.png',
                symbolSize: [30,36],
                hoverAnimation:false,
                data: geoData
            }
        ]
    };
    //渲染地图
    chart.setOption(option);
}