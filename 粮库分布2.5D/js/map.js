
var oImg = document.getElementById("oImg");

var params = decodeURI(window.location.href).split("?")[1]; //得到参数
var name = params === undefined || !params.includes("name") ? 'default' : params.split("=")[1];

//所有的仓库数据
var lists = [],
    vLists = [],
    gIds = [],
    positionsTmp = [],
    imgUrl = 'images/maps/map_' + name +'.jpg',
    imgWidth = 4096,
    imgHeight = 2160,
    width = $(window).width(),
    height = $(window).height(),
    divHeight = parseInt($('.silo-state .number').height()),
    tops = 0,
    wRatio = Math.round(width/imgWidth*10000)/10000,
    hRatio = Math.round(height/imgHeight*10000)/10000,
    ratio = wRatio > hRatio ? wRatio : hRatio,
    filterParams = ["stock","storage","quality","monitor","grainSituation","inOut"],
    filterNames = ["库存","仓容","质量","监控","粮情","出入库"],
    granaryDatas = {
        total: 0,
        videos: [],
        rows: []
    },
    img = {};
    currentId = -1;

$(function() {
    layer.config({
        extend: 'myskin/style.css', //加载您的扩展样式
        skin: 'layer-ext-myskin'
    });
    // $("#loading").show();
    oImg.src = imgUrl;
    img = new Image();
    img.src = imgUrl;
    var time  = 0;
    if(!img.complete) {
        time = 1000;
        $("#loading").show();
    }
    setTimeout(function () {
        $("#loading").hide();
        original();
        setImgThumb();
        bindEvents();
    },time);
});


// 初始化背景缩略图
function setImgThumb() {
    var url = imgUrl,
        areaSrc ="images/img-area.jpg";
    var oImg_over = '<div id="oImg_over" style="z-index: 5; border: 4px solid white; background-color: white; height: 145px; width: 238px; visibility: hidden; display: block;position: fixed; bottom: 0px; right: 0px;">\n' +
        '    <img id="oImg_tumb" src="' + url + '" style="height: 137px; width: 230px; display: block; position: absolute; bottom: 0px; right: 0px; border: 1px solid rgb(126, 174, 193);">\n' +
        '    <span><img id="oImg_view" style="position: absolute; width: 231px; height: 135px; left: 1px; top: 1px;" src="' + areaSrc + '"></span>\n' +
        '</div>';

    $("#body1").append(oImg_over);

    $("#oImg_tumb").bind('mousedown',function(){
        shiftzoom._catchDrag();
    });

    $("#oImg_view").bind('mousedown',function(){
        shiftzoom._startMove();
    });
}

//根据频幕分辨率初始化图例位置
function initGranary(){
    // 获取仓房坐标
    // $.ajax({
    //     type:'get',
    //     dataType:'json',
    //     url:'json/position_' + name + '.json?flag=false',
    //     success:function(data) {
    //         positionsTmp = data;
    //         getPoints();
    //     }
    // });

    $.getJSON('json/position_' + name + '.json',{}, function (data) {
        positionsTmp = data;
        getPoints();
    });

}
// 利用shiftzoom加载进图片
function getPoints(){
    // $.ajax({
    //     type:'post',
    //     dataType:'json',
    //     url:'json/granaryList.json?flag=false',
    //     success:function(data) {
            // 造数据
            createData();
            lists = granaryDatas.rows;
            if(name === 'nanning1'){
                vLists = [{
                    "id": 111,
                    "name": "111号摄像头",
                    "canClick": "1",
                    "xAxis": "4600",
                    "yAxis": "2660"
                }];
            }
            videoList = granaryDatas.videos;
            if (videoList.length>0) {
                videoList.forEach(function (item) {
                    item.xAxis = Math.round((item.xAxis)*ratio);
                    item.yAxis = Math.round((item.yAxis)*ratio);
                });
            }
            lists.forEach(function (item) {
                gIds.push(item.id);
            });
            shiftzoom.add($('#oImg')[0],{showcoords:true,zoom:0});
            initHover();
            tops = document.body.scrollHeight > height ? (document.body.scrollHeight - height)/2 : 0;
            // var top = tops+15;
            top = tops;
            $('.abnormal-prompt').css({top:top});
            // $('.map-wrapper').css({top:-(tops - 15)});
            $('.map-wrapper').css({top:-(tops)});
            $('#body1').css('overflow','hidden');
            $('#oImg_listDiv').show();
        // }
    // });
}

//控件隐藏
function display(id,type){
    $(id).css('display',type);
}

/**
 * 事件绑定
 */
function bindEvents() {
    $(".menu-map li>a").click(function () {
        $(this).addClass("cur").parent().siblings().find(">a").removeClass("cur");
    });
    $("#camera").click(function () {
        showVideo(currentId);
    });
}

/**
 * 监控弹出
 * @param id
 */
function showVideo(id) {
    var _html = '<div style="padding: 0 20px 10px;height: 100%;">' +
        '<div class="fl">\n' +
        '        <ul class="video-list">\n' +
        '            <li>\n' +
        '                <span>2号球机地磅</span>\n' +
        '                <div class="fr">\n' +
        '                    <a href="javascript:void();">播放</a>\n' +
        '                </div>\n' +
        '            </li>\n' +
        '            <li>\n' +
        '                <span>1号枪机出口道闸抓拍</span>\n' +
        '                <div class="fr">\n' +
        '                    <a href="javascript:void();">播放</a>\n' +
        '                </div>\n' +
        '            </li>\n' +
        '        </ul>\n' +
        '    </div>' +
        '<div style="margin-left: 270px;height: 100%;border: 1px solid #ddd;"><video></video>' +
        '</div>' +
        '</div>';
    var param = {
        type:1,
        title: 'xxx号仓',
        area:["80%","80%"],
        shade: 0.4,
        fixed: true,
        resize: false,
        scrollbar: false, //不允许页面滚动,
        content: _html
    };
    var cLayer = layer.open(param);
}
// 造数据
// 以下只给目前出现过的字段
function createData() {
    var qualitys = ['宜存粮','不宜存粮', undefined];
    var inOuts = ['入库','满仓', '出库'];
    positionsTmp.forEach(function (item) {
        granaryDatas.rows.push({
            //左侧筛选对应的属性
            "stock": (Math.random() * 100).toFixed(0),  //库存
            "storage": (Math.random() * 100).toFixed(0),  //仓容
            "quality": qualitys[((Math.random() * 100).toFixed(0)) % qualitys.length],  //质量
            "monitor": '',  //监控
            "grainSituation": (Math.random() * 100).toFixed(0),  //粮情
            "inOut": inOuts[((Math.random() * 100).toFixed(0)) % inOuts.length],  //出入库

            // 悬浮详情属性
            "water": (Math.random() * 100).toFixed(2),
            "grainTypeName": "粮油品种" + item.id,
            "qty": "空仓",
            "personName": "明明" + item.id,
            "typeName": "平房仓" + item.id,
            "id": item.id,
            "categoryName": "测试" + item.id,
            "videoFlag": "true",
            "name": item.name,
            "inMois": (Math.random() * 100).toFixed(2),
            "volume": (Math.random() * 1000).toFixed(2) + "吨",
            "levelName": (Math.random() * 10).toFixed(0),
            "inTemp": (Math.random() * 100).toFixed(2),
            "years": "2019",
            "sName": "XXXX" + item.id,
            "avgTemp": (Math.random() * 100).toFixed(2),
            "baudRate": (Math.random() * 100).toFixed(2),
            "outTemp": (Math.random() * 100).toFixed(2),
            "outMois": (Math.random() * 100).toFixed(2),

            // 界面属性
            "xAxis": item.xAxis,
            "yAxis": item.yAxis,
            "x": Math.round((item.xAxis)*ratio)-(divHeight/2),
            "y": Math.round((item.yAxis)*ratio)-divHeight,
            "canClick": item.canClick,
            "isShow": true
        });
    });
}

/**
 * 左侧筛选
 * @param index
 */
function filterParam(index) {
    var filterParam = filterParams[index];
    $(".silo-state .temp").each(function () {
        var id = $(this).attr("id").replace("showTemp","");
        $(this).empty();
        if(filterParam === 'monitor'){
            $(this).append("<img src='images/i_map_s1.png' style='margin-top: 3px;' onclick='showVideo(" + id + ");'>");
        }else if(filterParam === 'grainSituation'){
            // 对应相应数据
            $(this).html(granaryDatas.rows[id - 1][filterParam] === undefined ? '0℃' : (granaryDatas.rows[id - 1][filterParam] + '℃'));
        }else{
            // 对应相应数据
            $(this).html(granaryDatas.rows[id - 1][filterParam] === undefined ? '无库存' : granaryDatas.rows[id - 1][filterParam]);
        }
        $(this).attr("title",filterNames[index]);
    });
}


//初始化图片大小
function original(){

    imgReady(imgUrl, function () {
        imgWidth = img.width;
        imgHeight = img.height;
        wRatio = Math.round(width/imgWidth*10000)/10000;
        hRatio = Math.round(height/imgHeight*10000)/10000;
        ratio = wRatio > hRatio ? wRatio : hRatio;
        $('.map-wrapper').css('width',imgWidth*ratio);
        $("#oImg").css('width',imgWidth*ratio);
        initGranary();
    });
}
// 图片加载完才执行操作
var imgReady = (function () {
    var list = [], intervalId = null,
        // 用来执行队列
        tick = function () {
            var i = 0;
            for (; i < list.length; i++) {
                list[i].end ? list.splice(i--, 1) : list[i]();
            };
            !list.length && stop();
        },
        // 停止所有定时器队列
        stop = function () {
            clearInterval(intervalId);
            intervalId = null;
        };
    return function (url, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();
        img.src = url;
        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        };
        width = img.width;
        height = img.height;
        // 加载错误后的事件
        img.onerror = function () {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };
        // 图片尺寸就绪
        onready = function () {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||newWidth * newHeight > 1024) {
                // 如果图片已经在其他地方加载可使用面积检测
                ready.call(img);
                onready.end = true;
            };
        };
        onready();
        // 完全加载完毕的事件
        img.onload = function () {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();
            load && load.call(img);
            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };
        // 加入队列中定期执行
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        };
    };
})();
var my_granarytimeout = null;
var my_overtimeout = null;
//鼠标悬停事件
function initHover(){
    $('.silo-state').hover(function(){
        var id = $(this).attr('id');
        clearTimeout(my_granarytimeout);
        display('.warehouse-details','none');
        my_overtimeout = setTimeout(function(){
            if (id) {
                id = id.replace(/warehouse/gi,'');
                if (id.indexOf("empty") !=-1) {
                    display('.warehouse-details','none');
                } else {
                    // 粮库不为空则显示详情
                    overGranarys(id);
                }
            }
        },200);
    },function(){
        clearTimeout(my_overtimeout);
        my_granarytimeout = setTimeout(function() {
            display('.warehouse-details','none');
        }, 200);
    });

    $('.warehouse-details').hover(function(){
        clearTimeout(my_granarytimeout);
    },function(){
        my_granarytimeout = setTimeout(function() {
            display('.warehouse-details','none');
        }, 200);
    });
}

function overGranarys(id) {
    var granary = $('#warehouse'+id);
    $.each(lists,function(val){
        var row = lists[val];
        // 修改详情里的数据
        if (row.id == id) {
            $('#categoryName').html(row.categoryName);
            $('#levelName').html(row.levelName);

            if (!parseInt(row.canClick)) {
                return;
            }
            $('#granaryName').html(row.name+'('+row.sName+')');
            $('#personName').html(row.personName);
            $('#grainTypeName').html(row.grainTypeName);
            $('#years').html(row.years);
            $('#grainVisual').removeAttr('href').attr('href','javascript:grainVisual("'+row.id+'")');
            if (parseInt(row.canClick)) {
                $('#granaryEnter').removeAttr('href').attr('href','javascript:granary("'+row.id+'","'+row.name+'")');
            } else {
                $('#granaryEnter').removeAttr('href');
            }
            $('#baudRate').html(typeof(row.baudRate) == "undefined" ? '&nbsp' : row.baudRate);
            // $('#baudRate1').html(typeof(row.baudRate) == "undefined" ? '&nbsp' : row.baudRate);
            $('#water').html(typeof(row.water) == "undefined" ? '&nbsp' : row.water);
            $('#inTemp').html(typeof(row.inTemp) == "undefined" ? '&nbsp' : row.inTemp);
            $('#inMois').html(typeof(row.inMois) == "undefined" ? '&nbsp' : row.inMois);
            $('#outTemp').html(typeof(row.outTemp) == "undefined" ? '&nbsp' : row.outTemp);
            $('#outMois').html(typeof(row.outMois) == "undefined" ? '&nbsp' : row.outMois);


            if (row.showGasPh3Wran) {
                $('.warehouse-details').addClass('toxic-layer');
            } else {
                $('.warehouse-details').removeClass('toxic-layer');
            }
            if (row.isShow) {
                display('.warehouse-details', 'block');
            } else {
                display('.warehouse-details', 'none');
            }

            // 摄像头
            if (row.videoFlag == 'true') {
                display('.link-camera', 'block');
            } else {
                display('.link-camera', 'none');
            }
            currentId = row.id;
            return false;
        }
    });
    setDetailPos(granary);
}

/**
 * 详情定位
 * @param granary 目标元素
 */
function setDetailPos(granary) {
    var dh = parseInt($('#mCSB_3').height()) + parseInt($('#granary_hd').height())+15,
        detailWidth = parseInt($('.warehouse-details').width());
    //加宽弹出框的内容
    $('.warehouse-details').css({
        'height': dh,
        'width': detailWidth
    });
    var detailHeight = parseInt($('.warehouse-details').height());
    //每个仓库的内容
    var item = granary;
    //距离顶部的距离
    var offSet = granary.offset() ? parseInt(granary.offset().left) : 0,
        left = offSet + parseInt(item.width())+10,
        granaryTop = parseInt(granary.offset().top),
        positionHeight = 68;
    //granaryTop:鼠标距离顶部距离  tops:判断是否鼠标位于页面上半部分/下半部分 94.5
    var top = !shiftzoom._isIE() ? granaryTop - positionHeight : granaryTop;
    if (width < left+ detailWidth) {
        left = granary.offset().left - detailWidth-10;
        $('#sj-l').removeClass().addClass('sj-r');
    } else {
        $('#sj-l').removeClass().addClass('sj-l');
    }

    var max = granary.height()>39 ? (granary.height()-39)/2 : 0;
    var scrollTop = $(document).scrollTop();//浏览器顶部的高度
    if(!shiftzoom._isIE()){
        if (height < top + detailHeight+10) {
            $('#sj-l').css('top',Math.min(detailHeight-20,detailHeight-scrollTop- ((height-granaryTop) - granary.height() + (granary.height()/2))-5));
            top = height - detailHeight - 10;
        } else if (top < 0) {
            $('#sj-l').css('top',top+positionHeight+max - 5);
            top = 10;
        } else {
            $('#sj-l').css('top',5 + positionHeight + max);
        }
    }else{
        if (height < top + detailHeight) {
            $('#sj-l').css('top',Math.min(detailHeight-20,detailHeight-scrollTop- ((height-granaryTop) - granary.height() + (granary.height()/2))-5));
            top = height - detailHeight - 10;
        } else if (top < positionHeight) {
            $('#sj-l').css('top',top);
            top = 10;
        } else {
            $('#sj-l').css('top',5 + positionHeight + max);
            top= top - positionHeight;
        }
    }
    $('.warehouse-details').css({
        'left': left,
        'top': top
    });
}
