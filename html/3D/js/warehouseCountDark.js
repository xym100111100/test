//地图容器
var mapContainer,pieContainer,barContainer;
var pieLegends = [['简易仓容','完好仓容','需维修仓容','需重建仓容'],['地下仓','楼房仓','立筒仓','浅圆仓','平房仓']],
    pieLegend = pieLegends[0],
    pieColor = ['#55C6FF','#EEE369','#06DB8E','#B467FB','#f2a385'],
    barLegend = ['应用环\n流熏蒸\n技术','应用粮\n情监控\n系统','应用机\n械通风\n仓容','应用谷\n物冷却\n技术','应用气\n调储量\n技术'],
    barColor = {type: 'linear',x: 0,y: 0,x2: 0,y2: 1,colorStops: [{offset: 0, color: '#C4E0FC' }, {offset: 1, color: '#35B9FD' }]},
    level = 0,
    currentType = '总仓容',
    num = (Math.random() * 100).toFixed(2),
    mapJsonUrl = 'map/province/guangxi.json',
    mapName = 'guangxi';

/*散点经纬度数据*/
var geoData = [
    {
        name : "广西XXX企业1",
        value: [108.191206,22.926497]
    },
    {
        name : "广西XXX企业2",
        value: [108.054133,24.784499]
    },
    {
        name : "广西XXX企业3",
        value: [106.757393,23.920344]
    },
    {
        name : "广西XXX企业4",
        value: [109.46892,24.355665]
    },
    {
        name : "广西XXX企业5",
        value: [109.46892,24.355665]
    },
    {
        name : "广西XXX企业6",
        value: [110.577671,22.758514]
    },
    {
        name : "广西XXX企业7",
        value: [110.540876,23.349621]
    },
    {
        name : "广西XXX企业8",
        value: [109.725098,23.052021]
    }
];
$(function () {
    setHeight();
    initTree();
    $("#top1").niceScroll({
        cursorcolor:"#1a57c3",
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
        cursorwidth: "6px", //像素光标的宽度
        cursorborder: "0", // 游标边框css定义
        cursorborderradius: "10px",//以像素为光标边界半径
        background:"rgba(0,0,0,.1)", //滚动条的背景色，默认是透明的
        autohidemode: true //是否隐藏滚动条
    });

    mapContainer = echarts.init(document.getElementById('main'));
    pieContainer = echarts.init(document.getElementById('top3'));
    barContainer = echarts.init(document.getElementById('top4'));
    getMap();
    renderPie();
    renderBar();

    mapContainer.on('click', function (params) {
        console.log("map");
        if(params.seriesType === 'scatter'){
            alert("散点点击");
            return false;
        }
        if(level === 0){
            mapJsonUrl = 'map/city/' + cityMap[params.name] + '.json';
            mapName = params.name;
            level = 1;
        }
        else {
            mapJsonUrl = 'map/gxDistrict/' + gxDistrictMap[params.name] + '.json';
            mapName = params.name;
            level = 2;
        }
        getMap();
        updateBarPie();
    });

    $("[name='r1']").change(function () {
        currentType = $(this).next().html();
        num = (Math.random() * 100).toFixed(2);
        getMap();
    });
    $("#tab span").click(function () {
        if($(this).hasClass("active")){
            return;
        }
        $(this).addClass("active").siblings().removeClass("active");
        var idx = $(this).index();
        pieLegend = pieLegends[idx];
        renderPie();
    });
    $(".full-screen-icon").click(function () {
        $(this).closest(".table_outer").toggleClass("full-screen");
        $(this).closest(".table_outer").attr("id") === "maps" ? mapContainer.resize() : "";
    });
});
function setHeight() {
    var h = $("body").height() - $("#bottom").height() - 60;
    $("#top1,#top2,#top21,#main").height(h);
    $("#top3,#top4").height((h - 10 - 40 * 2)/2 - 1);
}
function initTree() {
    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        data: {            //这里不动
            simpleData: {
                enable: true,
                idKey: "id",
                pidKey: "pId",
                rootPid: '-1'
            }
        },
        callback : {
            // 单击事件
            onClick : zTreeOnClick
        }
    };
    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
    var zNodes = [
        {name:"广西壮族自治区", open:true,children:[
                {
                    name:"南宁市",
                    open:true,
                    children:[
                        {name: '武鸣县', open:true,children:[
                                {name:"南宁粮食储备库"}]
                        },
                        {name: '青秀区', open:true,children:[
                                {name:"青秀区粮食储备库"}]
                        }
                    ]
                },
                {
                    name:"柳州市",
                    open:true,
                    children:[
                        {name: '柳城县', open:true,children:[
                                {name:"柳城县粮食储备库"}]
                        },
                        {name: '柳江县', open:true,children:[
                                {name:"柳江县粮食储备库"}]
                        }
                    ]
                },
                {
                    name:"柳州市",
                    open:true,
                    children:[
                        {name: '柳城县', open:true,children:[
                                {name:"柳城县粮食储备库"}]
                        },
                        {name: '柳江县', open:true,children:[
                                {name:"柳江县粮食储备库"}]
                        }
                    ]
                },
                {
                    name:"柳州市",
                    open:true,
                    children:[
                        {name: '柳城县', open:true,children:[
                                {name:"柳城县粮食储备库"}]
                        },
                        {name: '柳江县', open:true,children:[
                                {name:"柳江县粮食储备库"}]
                        }
                    ]
                },
                {
                    name:"柳州市",
                    open:true,
                    children:[
                        {name: '柳城县', open:true,children:[
                                {name:"柳城县粮食储备库"}]
                        },
                        {name: '柳江县', open:true,children:[
                                {name:"柳江县粮食储备库"}]
                        }
                    ]
                },
                {
                    name:"柳州市",
                    open:true,
                    children:[
                        {name: '柳城县', open:true,children:[
                                {name:"柳城县粮食储备库"}]
                        },
                        {name: '柳江县', open:true,children:[
                                {name:"柳江县粮食储备库"}]
                        }
                    ]
                },
                {
                    name:"柳州市",
                    open:true,
                    children:[
                        {name: '柳城县', open:true,children:[
                                {name:"柳城县粮食储备库"}]
                        },
                        {name: '柳江县', open:true,children:[
                                {name:"柳江县粮食储备库"}]
                        }
                    ]
                }
            ]}
    ];
    var $dom = $("#areaTree");
    var zTreeObj = $.fn.zTree.init($dom, setting, zNodes);
}
//用于存储被隐藏的结点
var hiddenNodes = [];
//过滤ztree显示数据
function zTreeKeyfilter() {
    var zTreeObj = $.fn.zTree.getZTreeObj("areaTree");
    //显示上次搜索后背隐藏的结点
    zTreeObj.showNodes(hiddenNodes);

    //查找不符合条件的叶子节点
    function filterFunc(node) {
        //需要过滤的关键词
        var _keywords = $("#nodeKeyword").val();
        var rootName = zTreeObj.getNodes()[0].name;
        // if(rootName.indexOf(_keywords) != -1){
        //  _keywords = '';
        // }

        if (node.name.indexOf(_keywords) != -1){
            return false;
        }

        if(!CheckParentNodesIsContainKeyword(node)){
            return false;
        }
        if (node.isParent){
            //是父节点时需要判断子节点是否符合条件，是的话则父节点需要保留
            var bl = CheckChildNodesIsContainKeyword(node);
            //console.log(bl);
            return bl;
        }else {
            //是子节点时，需要判断父节点是否符合条件，是的话则子节点需要保留
            var bl2 = CheckParentNodesIsContainKeyword(node);
            return bl2;
        }

        return true;
    };

    //获取不符合条件的叶子结点
    hiddenNodes = zTreeObj.getNodesByFilter(filterFunc);

    //隐藏不符合条件的叶子结点
    zTreeObj.hideNodes(hiddenNodes);
};
//tree搜索时：是父节点时需要判断子节点是否符合条件，是的话则父节点需要保留
function CheckChildNodesIsContainKeyword(pNode)
{
    var childs = pNode.children;

    var isexit = true;
    var _keywords = $("#nodeKeyword").val();

    for(var i=0;i<childs.length;i++)
    {
        if (childs[i].isParent)
        {
            if (childs[i].name.indexOf(_keywords) != -1){
                return false;
            }
            isexit = CheckChildNodesIsContainKeyword(childs[i]);
            if (!isexit)
                return isexit;
        }
        else {
            if (childs[i].name.indexOf(_keywords) != -1)
                return false;
        }
    }

    return true;
}

//tree 搜索时：子节点时，需要判断父节点是否符合条件，是的话则子节点需要保留
function CheckParentNodesIsContainKeyword(cNode) {

    var pnode = cNode.getParentNode();

    if (pnode != null)
    {
        var _keywords = $("#nodeKeyword").val();
        if (pnode.name.indexOf(_keywords) != -1)
            return false;
        else {
            return CheckParentNodesIsContainKeyword(pnode)
        }
    }
    return true;
}
/*enter搜索*/
function inpPress(){
    var e = window.event || arguments.callee.caller.arguments[0];
    if(e.keyCode == "13"){
        zTreeKeyfilter();
    }
}

function zTreeOnClick(event, treeId, treeNode) {
    level = treeNode.level;
    if(level >= 3){
        $("#maps").hide() && $("#grains").show();
        var src = '../../粮库分布2.5D/map.html?name=nanning1';
        // setTimeout(function () {
           $("#frame11").attr("src",src);
        // },0);
        $("#title").html(treeNode.name + '仓储设施情况');
    }else{
        $("#maps").show() && $("#grains").hide();
        if(level === 0){
            mapJsonUrl = 'map/province/guangxi.json';
            mapName = 'guangxi';
        }
        else if(level === 1){
            mapJsonUrl = 'map/city/' + cityMap[treeNode.name] + '.json';
            mapName = treeNode.name;
        }
        else{
            mapJsonUrl = 'map/gxDistrict/' + gxDistrictMap[treeNode.name] + '.json';
            mapName = treeNode.name;
        }
        getMap();
    }

    updateBarPie();
}

function getMap() {
    $.getJSON(mapJsonUrl, function(data){
        echarts.registerMap( mapName, data);
        var heatData = [  [108.191206,22.926497,5],[108.054133,24.784499,800],[106.757393,23.920344,500],
            [109.46892,24.355665,1],[108.667973,24.154409,90],[110.181857,25.171585,6],[109.385468,24.010832,7],[109.431461,22.958706,30],
            [109.468255,23.951665,45],[109.127905,24.095308,20],[108.024068,22.813806,600],[108.603583,22.754096,1000],[108.465603,23.214029,300],[108.428808,22.822334,300]
        ];
        renderMap(mapName,heatData,data);
    });
}
function renderMap(map,heatData,mapData){
    var myLabelStyle = {
        normal:{
            show:true,
            formatter: function(data) {
                return '{pop|' + currentType + '：' + num + '吨}\n{arrow|}\n{a|' + data.name + '}';

            } , rich: {
                pop: {
                    backgroundColor: 'rgba(53, 97, 138,.7)',
                    color: '#fff',
                    padding: [5,8]
                },
                arrow: {
                    backgroundColor: {
                        image: '../../resource/images/label_arrow.png'
                    },
                    lineHeight: 5
                },
                a: {
                    color: '#fff',
                    fontSize:14,
                    lineHeight: 20
                },
            }
        }
    };
    var myItemStyle = {
        normal: {
            areaColor: '#4bb7fe',
            borderColor: 'rgba(255,255,255,.7)',
            borderWidth: '2'
        },
        emphasis: {
            areaColor: 'rgba(253, 186, 79, .9)'
        }
    };
    var myVissualMap = {
        min: 0,
        max: 300,
        splitNumber: 5,
        color: ['#FF0C00','#FEE129','#5EEC42','#97FEFC','#8383DF'],
        textStyle: {
            color: '#fff'
        }
    };
    var scatterLabelStyle = {
        normal:{
            show: true,
            position: 'top',
            align: 'center',
            formatter: function(data) {
                return '{pop|' + data.name + '}\n{arrow|}';

            } ,
            rich: {
                pop: {
                    backgroundColor: '#0641ba',
                    color: '#fff',
                    padding: [5,8]
                },
                arrow: {
                    backgroundColor: {
                        image: '../../resource/images/label_arrow3.png'
                    },
                    lineHeight: 5
                },
                a: {
                    color: '#333',
                    fontSize:14,
                    lineHeight: 20
                },
            }
        }
    };
    var option = {
        geo: {
            map: map,
            aspectScale: 0.85,
            zoom: 1.05,
            itemStyle: myItemStyle,
            label: myLabelStyle,
        },
        visualMap: myVissualMap,
        series: [
            {
                name: '',
                zoom: 1.05,
                type: 'heatmap',                //热力图
                coordinateSystem: 'geo',        //背景
                data: heatData
            },
            {
                name: '',
                type: 'scatter',               //散点图
                coordinateSystem: 'geo',        //背景
                // symbol:'image://../resource/images/grain_flag.png',
                symbolSize: 15,
                hoverAnimation:false,
                label: scatterLabelStyle,
                data: geoData
            }
        ]
    };
    mapContainer.clear();
    //渲染地图
    mapContainer.setOption(option,true);
}

function renderPie() {
    var data = [];
    pieLegend.forEach(function (item) {
        data.push({
            name: item,
            value: (Math.random() * 100).toFixed(2)
        });
    });
    var option = {
        // backgroundColor: '#fff',
        legend: {
            data: pieLegend,
            textStyle: {
                color: '#fff'
            },
            orient: 'vertical',
            itemWidth: 15,
            right: '2%',
            bottom: '8%'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c}"
        },
        series: [
            {
                name:'',
                type:'pie',
                // hoverAnimation: false,                   //悬浮放大效果
                radius : ['50%','70%'],
                center: ['40%','50%'],
                avoidLabelOverlap: false,
                data: data
            }
        ],
        color: pieColor
    };
    pieContainer.setOption(option);
}
function renderBar() {
    var data = [];
    barLegend.forEach(function (item) {
        data.push((Math.random() * 100).toFixed(2));
    });
    var option = {
        // backgroundColor: '#fff',
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
            top: '12%',
            left: '5%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                axisLine: {
                    lineStyle: {
                        color:'rgba(102, 125, 169, 0.5)'
                    }

                },
                axisLabel: {
                    textStyle: {
                        color: '#C3CAD9'
                    }
                },
                axisTick: {
                    show: false
                },
                data : barLegend
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitNumber: 3,
                axisLine: {
                    lineStyle: {
                        color:'rgba(102, 125, 169, 0.5)'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#C3CAD9',//坐标值得具体的颜色

                    }
                },
                axisTick: {
                    show: false
                },
                splitLine:{
                    show: true,
                    lineStyle:{
                        color:'rgba(32,33,36,.15)'
                    }
                }
            }
        ],
        series : [
            {
                name:'',
                type:'bar',
                barWidth: '30%',
                itemStyle:{
                    normal:{
                        color: barColor
                    }
                },
                data: data
            }
        ]
    };
    barContainer.setOption(option);
}
function updateBarPie() {
    var data = [];
    pieLegend.forEach(function (item) {
        data.push({
            name: item,
            value: (Math.random() * 100).toFixed(2)
        });
    });
    var pieOp = pieContainer.getOption();
    pieOp.series[0].data = data;
    pieContainer.setOption(pieOp);

    data = [];
    barLegend.forEach(function (item) {
        data.push((Math.random() * 100).toFixed(2));
    });
    var barOp = barContainer.getOption();
    barOp.series[0].data = data;
    barContainer.setOption(barOp);
}
