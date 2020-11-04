//地图容器
var mapContainer,pieContainer,rosePieContainer,roundPieContainer,barContainer;
var pieLegends = [['稻谷','玉米','小麦'],['一等','二等','三等','四等','五等'],['自治区储备粮','市级储备粮','县级储备粮','其他储备粮','中央储备粮']],
    pieLegend = pieLegends[0],
    rosePieLegend = pieLegends[1],
    roundPieLegend = pieLegends[2],
    pieColor = ['#55B813','#69A5E1','#FDBA4F','#CEE5B1','#ACD2F8'],
    barXdata = ['南宁市','柳州市','桂林市','梧州市','北海市','防港城市','钦州市','贵港市','玉林市','百色市','贺州市','河池市','来宾市','崇左市'],
    barLegend = ['自治区储备粮'],
    barColor = ['#69A5E1','#FDBA4F','#ACD2F8','#55B813','#CEE5B1'],
    level = 0,
    currentType = '库存',
    num = (Math.random() * 100).toFixed(2),
    mapJsonUrl = 'map/province/guangxi.json',
    mapName = 'guangxi',
    autoInterval = null;

/*散点经纬度数据*/
var geoData = [
    {
        name : "粮库1",
        value: [108.191206,22.926497]
    },
    {
        name : "粮库2",
        value: [108.054133,24.784499]
    },
    {
        name : "粮库3",
        value: [106.757393,23.920344]
    },
    {
        name : "粮库4",
        value: [109.46892,24.355665]
    },
    {
        name : "粮库5",
        value: [109.46892,24.355665]
    },
    {
        name : "粮库6",
        value: [110.577671,22.758514]
    },
    {
        name : "粮库7",
        value: [110.540876,23.349621]
    },
    {
        name : "粮库8",
        value: [109.725098,23.052021]
    }
];
$(function () {
    setHeight();
    initTree();
    initTreeDown();

    mapContainer = echarts.init(document.getElementById('main'));
    pieContainer = echarts.init(document.getElementById('top3'));
    rosePieContainer = echarts.init(document.getElementById('top4'));
    // roundPieContainer = echarts.init(document.getElementById('bottom2'));
    barContainer = echarts.init(document.getElementById('bottom1'));
    getMap();
    renderPie();
    renderPie("rose");
    // renderPie("round");
    renderBar();

    var swiper = new Swiper('#slide', {
        slidesPerView: 'auto',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

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
    $(".full-screen-icon").click(function () {
        $(this).closest(".table_outer").toggleClass("full-screen");
        $(this).closest(".table_outer").attr("id") === "maps" ? mapContainer.resize() : "";
    });
});
function setHeight() {
    var h = $("body").height() *0.66;
    $("#top1,#top2,#main").height(h - 40);
    $("#top3,#top4").height((h - 10 - 40 * 3)/2 - 1);
    $("#bottom1,#bottom2").height($("body").height() *0.33 - 40 - 20);
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
        $("#title").html(treeNode.name + '库存分布情况');
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
                    color: '#333',
                    fontSize:14,
                    lineHeight: 20
                },
            }
        }
    };
    var myItemStyle = {
        normal: {
            areaColor: '#a4ccf4',
            borderColor: '#fff',
            borderWidth: '2'
        },
        emphasis: {
            areaColor: '#cee5b1'
        }
    };
    var myVissualMap = {
        min: 0,
        max: 300,
        splitNumber: 5,
        color: ['#FF0C00','#FEE129','#5EEC42','#97FEFC','#8383DF'],
        textStyle: {
            color: '#333'
        }
    }
    var option = {
        geo: {
            map: map,
            aspectScale: 0.85,
            zoom: 1.12,
            itemStyle: myItemStyle,
            label: myLabelStyle,
        },
        visualMap: myVissualMap,
        series: [
            {
                name: '',
                zoom: 1.12,
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
                data: geoData
            }
        ]
    };
    mapContainer.clear();
    //渲染地图
    mapContainer.setOption(option,true);
}

function renderPie(type) {
    var data = [],
        legend = [],
        chart = null,
        series = {
            name:'',
            type:'pie',
            center: ['40%','50%'],
            avoidLabelOverlap: false
        };
    if(type === 'rose'){
        legend = rosePieLegend;
        chart = rosePieContainer;
        series.roseType = 'radius';
        series.radius = ['10%','70%'];
    }else if(type == 'round'){
        legend = roundPieLegend;
        chart = roundPieContainer;
        series.radius = ['0','70%'];
    }else{
        legend = pieLegend;
        chart = pieContainer;
        series.radius = ['50%','70%'];
    }
    legend.forEach(function (item) {
        data.push({
            name: item,
            value: (Math.random() * 100).toFixed(2)
        });
    });
    series.data = data;
    var option = {
        backgroundColor: '#fff',
        legend: {
            data: legend,
            textStyle: {
                color: '#262B2E'
            },
            orient: 'vertical',
            // itemWidth: 15,
            left: '70%',
            bottom: '10%'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b}: {c}"
        },
        series: [
            series
        ],
        color: pieColor
    };
    chart.setOption(option);
}
function renderBar() {
    var series = [];
    barLegend.forEach(function (item,index){
        var tmpData = [];
        for(var i = 0; i < barXdata.length; i++){
            var num = (1000 * Math.random()).toFixed(0);
            tmpData.push(num);
        }
        var tmp = {
            name: item,
            type: 'bar',
            stack: 'stack',
            barWidth: '55%',
            label: {
                normal: {
                    show: false
                }
            },
            data: tmpData
        };
        series.push(tmp);
    });
    var option = {
        backgroundColor: '#fff',
        tooltip : {
            trigger: 'axis',
            axisPointer:{
                lineStyle:{
                    width:0
                }
            },
            // showContent:false
        },
        // legend: {
        //     data: barLegend,
        //     textStyle: {
        //         color: '#262B2E'
        //     },
        //     right: '20px',
        //     top: '10px'
        // },
        grid: {
            top: '40px',
            left: '20px',
            right: '20px',
            bottom: '15px',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                axisLine: {
                    lineStyle: {
                        color:'#eee'
                    }

                },
                axisLabel: {
                    textStyle: {
                        color: '#444'
                    }
                },
                data : barXdata
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitNumber: 3,
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
        dataZoom: [{
            type: 'slider', //图表下方的伸缩条
            height: 14,
            bottom: 0,
            right: '40px',
            show: true, //是否显示
            realtime: true, //拖动时，是否实时更新系列的视图
            start: 0, //伸缩条开始位置（1-100），可以随时更改
            end: 100, //伸缩条结束位置（1-100），可以随时更改
        }],
        series : series,
        color: barColor
    };
    barContainer.setOption(option);
    autoPlay();
}
function updateBarPie() {
    renderPie();
    renderPie("rose");
    // renderPie("round");
    renderBar();
}
function autoPlay() {
    var index = 0; //播放所在下标
    if(autoInterval){
        clearInterval(autoInterval);
    }
    autoInterval = setInterval(function() {
        var prev = index == 0 ? barXdata.length - 1 : index - 1;
        barContainer.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: index
        });
        barContainer.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: index
        });
        barContainer.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: prev
        });
        index++;
        if(index > barXdata.length - 1) {
            index = 0;
        }
    }, 2000);
}
function initTreeDown() {
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
            onClick : setVal
        }
    };
    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
    var zNodes = [
        { name:"储备粮", open:true,children:[
                { name:"中央储备粮"},
                {
                    name:"地方储备粮",
                    open:true,
                    children:[
                        { name: '自治区地方储备粮'},
                        { name: '市级地方储备粮'},
                        { name: '县级地方储备粮'},
                        { name: '其他储备粮'}
                    ]
                }
            ]},
        { name:"商品粮", open:true,children:[
                { name:"中储粮系统商品粮"},
                { name:"进口商品粮"},
                { name:"其他商品粮"}
            ]},
        { name:"政策性粮食", open:true,children:[
                { name:"最低收购价粮"},
                { name:"国家临时存储粮"},
                { name:"地方临时存储粮"}
            ]},
    ];
    var $dom = $("#treeDemo");
    var zTreeObj2 = $.fn.zTree.init($dom, setting, zNodes);
}
function setVal(event, treeId, treeNode) {
    $("#grain").val(treeNode.name);
    hideSelect();
}
function toggleSelect(obj) {
    var cityOffset = $(obj).offset();
    $("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + $(obj).outerHeight() + "px"}).slideToggle("fast");

    $("body").bind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
        hideSelect();
    }
}
function hideSelect() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
