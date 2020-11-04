//地图容器
var mapContainer,barContainer;
var barXdata = ['南宁市','柳州市','桂林市','梧州市','北海市','防港城市','钦州市','贵港市','玉林市','百色市','贺州市','河池市','来宾市','崇左市'],
    barColor = {type: 'linear',x: 0,y: 0,x2: 0,y2: 1,colorStops: [{offset: 0, color: '#C4E0FC' }, {offset: 1, color: '#35B9FD' }]},
    level = 0,
    currentType = '数量',
    num = (Math.random() * 100).toFixed(2),
    titles = ["全区范围最新安全会议主题TOP20","全市范围最新安全会议主题TOP20","全县范围最新安全会议主题TOP20"],
    mapJsonUrl = 'map/province/guangxi.json',
    mapName = 'guangxi',
    autoInterval = null,
    myswiper = null;

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
    laydate.render({
        elem: '#date'
        ,type: 'month'
        ,range: true
    });

    mapContainer = echarts.init(document.getElementById('main'));
    // barContainer = echarts.init(document.getElementById('bottom'));
    getMap();
    // renderBar();

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
        $("#rightTitle").text(titles[level]);
        getMap();
        // updateBarPie();
        // loadSwiper();
    });
    $(".full-screen-icon").click(function () {
        $(this).closest(".table_outer").toggleClass("full-screen");
        $(this).closest(".table_outer").attr("id") === "maps" ? mapContainer.resize() : "";
    });

    // loadSwiper();

    /*鼠标移入停止轮播，鼠标离开 继续轮播*/
    // $('.swiper-container').mouseenter(function () {
    //     swiper.autoplay.stop();
    // });
    // $('.swiper-container').mouseleave(function () {
    //     swiper.autoplay.start();
    // });
});
function setHeight() {
    // var h = $("body").height() *0.66;
    // $("#top1,#top2,#main").height(h - 40);
    // $("#top3").height($("body").height() - 40 * 2 - 10);
    // $("#bottom").height($("body").height() *0.33 - 14 - 40);
    var h = $("body").height();
    $("#top1,#top2,#main").height(h - 50);
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
        // $("#maps").hide() && $("#grains").show();
        // $("#title").html(treeNode.name + '库存分布情况');
    }else{
        // $("#maps").show() && $("#grains").hide();
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
        $("#rightTitle").text(titles[level]);
        getMap();
    }

    // updateBarPie();
    // loadSwiper();
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

function renderBar() {
    var data = [];
    barXdata.forEach(function (item) {
        data.push((Math.random() * 100).toFixed(0));
    });
    var option = {
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
            top: '20px',
            left: '10px',
            right: '10px',
            bottom: '10px',
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
                data : barXdata
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
                barWidth: '50%',
                itemStyle:{
                    normal:{
                        color: barColor
                    }
                },
                label: {
                    normal: {
                        show: true,
                        color: '#C3CAD9',
                        position: 'top'
                    }
                },
                data: data
            }
        ]
    };
    barContainer.setOption(option);
    autoPlay();
}
function updateBarPie() {
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
function loadSwiper() {
    var loop = true;
    $("#swiper").html('');
    myswiper && myswiper.destroy();
    var data = [];
    var l = (Math.random()*10).toFixed(0);
    for(var i = 0; i < l; i++){
        data.push({
            name1: '企业名称企业名称',
            name2: '安全会议主题安全会议主题安全会议主题安全会议主题安全会议主题',
            name3: '会议召开单位会议召开单位',
            name4: '2019-08-25 12:00:00'
        });
    }
    var _html = '';
    data.forEach(function (item,index) {
        _html += '<div class="swiper-slide">\n' +
            '<div class="each-meeting">\n' +
            '<div style="position: relative;">\n' +
            '    <i class="list-seq">' + (index+1) + '</i>\n' +
            '    <p>企业名称：<span>' + item.name1 + '</span></p>\n' +
            '    <p>安全会议主题：<span>' + item.name2 + '</span></p>\n' +
            '    <p>会议召开单位：<span>' + item.name3 + '</span></p>\n' +
            '    <p>会议时间：<span>' + item.name4 + '</span></p>\n' +
            '</div>\n' +
            '</div>\n' +
            '                </div>';
    });
    if(data.length < 4){
        _html += '<div class="swiper-slide">\n' +
            '<div class="each-meeting">\n' +
            '    <p class="tc">-没有更多了-</p>\n' +
            '</div>\n' +
            '                </div>';
        loop = false;
    }
    $("#swiper").append(_html);
    swiperPlay(loop);
}
function swiperPlay(loop) {
    myswiper = new Swiper('.swiper-container', {
        slidesPerView: 4,
        initialSlide : 0,
        // slidesPerGroup: 4,
        loop: loop,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        direction: 'vertical',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // observer:true,//修改swiper自己或子元素时，自动初始化swiper
        // observeParents: true,//修改swiper的父元素时，自动初始化swiper
        // onSlideChangeEnd: function(swiper){
        //     myswiper.update();
        //     myswiper.startAutoplay();
        //     myswiper.reLoop();
        // }
    });
}
