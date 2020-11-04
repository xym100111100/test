
layui.use(['form', 'laydate', 'layer'], function () {
    var form = layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;

    var inst;

    function Main() {

        // this.areaCode = ''; // 行政区划代码，默认广西
        // this.areaName = 'guangxi'; // 行政区域名称，地市级使用中文，用于echarts 如：南宁市
        this.areaState = [{
            code: '', // 行政区划代码，默认广西
            name: 'guangxi' // 行政区域名称，地市级使用中文，用于echarts 如：南宁市
        }];

        this.curTab = "zcr"; // 默认总仓容

        this.timers = {
            'percentTable': null,
        };

        this.renderTime(); // 渲染时间

        // 初始化地图
        this.mapChart = echarts.init(document.getElementById('mapChart'));

        // 初始化饼图
        this.pieChart = echarts.init(document.getElementById('pieChart'));


        this.searchData(); // 请求数据

        this.bindEvents();

    }

    Main.prototype = {

        /**
         * @description:  渲染时间
         * @param {type}
         * @return: {void}
         */
        'renderTime': function () {
            var format = 'yyyy-MM-dd@@HH:mm:ss@@周w@@HH';

            timeoutFun();
            function timeoutFun() {
                var dateText = aoUtils.formatDate(new Date(), format);
                var timeArr = dateText.split('@@');

                aoUtils.setFormData('#container', {
                    time: timeArr[1],
                    date: timeArr[0],
                    week: timeArr[2],
                    apm: Number(timeArr[3]) < 12 ? 'am' : 'pm',
                });

                setTimeout(function () {
                    timeoutFun();
                }, 1000);
            }
        },

        /**
        * @description:  请求后台 查询数据
        * @param {type} 
        * @return: {void}
        */
        searchData: function () {
            var that = this;
            var obj = {
                tab: this.curTab
            };

            var url = './json/analysisSystem2.json';
            if (this.areaState.length > 1) {
                url = './json/analysisSystem_nanning.json';
            }

            $.ajax({
                url: url,
                type: 'get',
                data: obj,
                dataType: 'json',
                success: function (resp) {
                    // console.log('resp:', resp);
                    var data = resp.data;
                    if (String(resp.code) === '200') {
                        that.renderTable(data.barData);
                        that.renderPie(data.barData);
                        that.renderTotalData(data.totalData);
                        that.loadMapData(function (mapData) {

                            if (that.curTab === 'zcr' || that.curTab === 'zkc') {
                                // 总仓容或者总库存
                                that.renderMap(mapData, data.mapAreaData, data.mapPointData);
                            } else if (that.curTab === 'lw') {
                                // 粮温
                                that.renderMap2(mapData, data.heatDataList);
                            }
                        });
                    } else {
                        aoUtils.failMsg(resp.message, layer);
                    }
                },
                error: function (xhr) {
                    // aoUtils.failMsg(xhr, layer);
                }
            });
        },

        /**
        * @description:  加载地图数据
        * @param {type} 
        * @return: {void}
        */
        loadMapData: function (onSuccess) {
            var that = this;
            var url = '../../plug-in/echarts/map/province/guangxi.json'; // 默认广西地图

            var areaStateLen = this.areaState.length;
            var areaItem = this.areaState[areaStateLen - 1];
            if (areaStateLen === 2) {
                url = '../../plug-in/echarts/map/city/' + areaItem.code + '.json';
            } else if (areaStateLen === 3) {
                url = '../../plug-in/echarts/map/gxDistrict/' + areaItem.code + '.json';
            }
            $.getJSON(url, function (data) {
                echarts.registerMap(areaItem.name, data);
                onSuccess && onSuccess(data);
            });

        },

        /**
        * @description:  渲染地图-总仓容、总库存
        * @param {type} 
        * @return: {void}
        */
        renderMap: function (mapData, mapAreaData, mapPointData) {
            var that = this;
            var chart = this.mapChart;
            var seriesMapData = mapAreaData;
            var scatterData = mapPointData;

            var projectMap = {
                zcr: '总仓容',
                zkc: '总库存',
                lw: '粮温'
            };

            $.each(scatterData, function (index, item) {
                item.value = [item.jd, item.wd]; // 经纬度 
                item.name = item.kqmc; // 添加name字段，才能弹出tooltip
            });

            var maxNum = 1;
            $.each(seriesMapData, function (index, item) {
                // 添加数值
                if (that.curTab === 'zcr') {
                    // 总仓容
                    item.value = item.zcr;
                } else if (that.curTab === 'zkc') {
                    // 总库存
                    item.value = item.zkc;
                }
                item.name = item.xzqymc; // 行政区域名称
                maxNum = Number(item.value) > maxNum ? Number(item.value) : maxNum;
            });
            // console.log('maxNum:', maxNum);
            // ===========================================================================================

            var myTooltip = {
                trigger: 'item',
                formatter: '{b}',
                enterable: true,
                //alwaysShowContent:true,
                hideDelay: 100,
                // backgroundColor: 'rgba(255,255,255,1)',//背景颜色（此时为默认色）
                borderRadius: 2,//边框圆角
                borderWidth: '0',
                padding: 0,    // [5, 10, 15, 20] 内边距
                textStyle: {
                    color: '#000'
                },
                position: function (point, params, dom, rect, size) {
                    // console.log('params:', params);
                    var value = isNaN(Number(params.value)) ? '' : params.value;
                    var projectName = projectMap[that.curTab];

                    var valHtml = '      <p style="font-size:16px;color:' + color + '">' + projectName + '：' + value + '</p>';

                    if (params.seriesName === 'mapScatter') {
                        // 添加数值
                        if (that.curTab === 'zcr') {
                            // 总仓容
                            value = params.data.zcr;
                        } else if (that.curTab === 'zkc') {
                            // 总库存
                            value = params.data.zkc;
                        }
                        // console.log('value:', value);
                        valHtml = '      <p style="font-size:16px;color:' + color + '">' + projectName + '：' + value + '</p>';
                    }

                    var color = '#fff';
                    var html = '<div class="lsvs-chart__tip">'
                        + '      <p style="font-size:16px;color:' + color + '">' + params.name + '</p>'
                        + valHtml
                        + '  </div>';
                    $(dom).html(html)
                }
            };
            var myLabelStyle = {
                normal: {
                    show: true,

                    height: 100,

                    textStyle: {
                        color: '#fff',
                        fontSize: 14,
                        height: 100,

                    }
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        color: '#fff',
                        fontSize: 16
                    }
                }
            };

            var myItemStyle = {

                normal: {
                    areaColor: 'rgba(27, 95, 152, .6)',
                    borderColor: 'rgba(156,188,231,.5)',
                    borderWidth: 2.5
                },
                emphasis: {
                    areaColor: 'rgba(21, 41, 117, .8)'
                }
            };
            var myVissualMap = {
                type: 'continuous',
                orient: 'horizontal',
                itemWidth: 10,
                itemHeight: 80,
                text: ['高', '低'],
                showLabel: true,
                seriesIndex: [0],
                min: 0,
                max: maxNum,
                inRange: {
                    color: ['rgba(34,61,101,.85)', 'rgba(71,205,170,.85)', 'rgba(173,255,139,.85)']
                },
                textStyle: {
                    color: '#7B93A7'
                },
                bottom: 10,
                left: 10,
            }

            var option = {
                tooltip: myTooltip,
                geo: {
                    map: this.areaState[this.areaState.length - 1].name,
                    // aspectScale: 0.85,
                    // zoom: 1.15,
                    label: myLabelStyle,
                    itemStyle: myItemStyle
                },
                visualMap: myVissualMap,
                series: [
                    {
                        name: 'mapSer',
                        type: 'map', // 地图区域
                        // aspectScale: 0.85,
                        // zoom: 1.15,
                        roam: false,
                        geoIndex: 0,
                        label: {
                            show: false,
                        },

                        data: seriesMapData

                    },
                    {
                        name: 'mapScatter',
                        type: 'scatter',                // 气泡点
                        coordinateSystem: 'geo',
                        hoverAnimation: false,

                        data: scatterData,
                        symbol: 'circle',
                        symbolSize: 8,
                        label: {
                            normal: {
                                show: false,
                            },
                            emphasis: {
                                show: false,
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#ff715e',
                                borderWidth: 1,
                                borderColor: '#fff'
                            },
                            emphasis: {
                                color: '#f00',
                                borderWidth: 2,
                                borderColor: '#f00'
                            }
                        },


                    }
                ]
            };
            // console.log('option:', option);

            //渲染地图
            chart.clear();
            chart.setOption(option, true);
        },

        /**
         * @description:  渲染地图- 温度
         * @param {type}
         * @return: {void}
         */
        renderMap2: function (mapData, heatData) {
            var that = this;
            var chart = this.mapChart;

            console.log('mapData:', mapData);
            if (heatData) {
                // var heartValue1 = []; // 库点所属区域名称、数值（库点的数值）
                // var heartValue2 = []; // 库点坐标、数值
                var heartValue3 = []; // 库点的数据：名称、坐标、数值
                var scatterData = []; // 地区名称、行政区划编码、数值（将该地区所有库点取平均值）
                var scatterDataObjAvg = {}; // 各地市平均值
                var scatterDataMapName = {};

                var mapDataObj = {}; // 行政区划 区域码，名称映射 "450100":{"name": "南宁市"}


                var maxNum = 1; // 最大值
                var maxNumPoint = 1; // 库点最大值

                if (this.areaState.length === 1) {
                    // 如果是第一级 广西
                    $.each(mapData.features, function (index, item) {
                        mapDataObj[item.id] = item.properties;

                    });
                } else {
                    // console.log('mapData.features:', mapData.features);
                    $.each(mapData.features, function (index, item) {
                        var name = item.properties.name;
                        // console.log('name:',name);
                        // var name = gxDistrictMap[name];
                        mapDataObj[gxDistrictMap[name]] = { name: name };

                    });
                }
                // console.log('mapDataObj:', mapDataObj);

                $.each(heatData, function (i, val) {
                    var jwd = [];
                    var jwd1 = [];
                    // jwd.push(strToNum(val.jd));
                    // jwd.push(strToNum(val.wd));
                    // jwd1.push(strToNum(val.jd));
                    // jwd1.push(strToNum(val.wd));
                    jwd.push(val.jd);
                    jwd.push(val.wd);
                    jwd1.push(val.jd);
                    jwd1.push(val.wd);
                    var sl = val.pjw; // 平均粮温

                    jwd.push(sl);
                    jwd1.push(sl);
                    // heartValue1.push({ xzqymc: val.xzqymc, "sl": sl });
                    // heartValue2.push(jwd);
                    heartValue3.push({ "name": val.kqmc, value: jwd1, sl: sl });


                    maxNumPoint = Number(sl) > maxNumPoint ? Number(sl) : maxNumPoint; // 库点的最大值

                    if (!scatterDataObjAvg[val.xzqydm]) {

                        var xzqhName;
                        xzqhName = mapDataObj[val.xzqydm].name;

                        // if (that.areaState.length === 1) {
                        //     xzqhName = mapDataObj[val.xzqydm].name;
                        // } else {
                        //     xzqhName = that.areaState[that.areaState.length-1].name;
                        // }

                        scatterDataObjAvg[val.xzqydm] = {
                            name: xzqhName,
                            code: val.xzqydm,
                            value: sl,
                            valueArr: []
                        };

                        scatterData.push({
                            name: xzqhName,
                            code: val.xzqydm,

                        })
                    }
                    scatterDataObjAvg[val.xzqydm].valueArr.push(sl); // 相同地区添加数据
                    scatterDataObjAvg[val.xzqydm].value = getAverage(scatterDataObjAvg[val.xzqydm].valueArr); // 取平均值
                });


                $.each(scatterData, function (index, item) {
                    item.value = scatterDataObjAvg[item.code].value; // 添加数值（已计算为平均值）
                    scatterDataMapName[item.name] = item.value;
                    maxNum = Number(item.value) > maxNum ? Number(item.value) : maxNum; // 地区的最大值

                });

                // console.log('scatterData:', scatterData);

                // maxNum = this.areaState.length === 1 ? maxNum : maxNumPoint;

                // console.log('maxNum:', maxNum);

                // 求平均值
                function getAverage(arr) {
                    arr = arr || [];
                    var result = '';
                    if (arr.length) {
                        var sum = 0;
                        for (var i = 0, j = arr.length; i < j; i++) {
                            var val = parseFloat(arr[i]);
                            if (!isNaN(val)) {
                                sum += val;
                            }
                        }
                        result = (sum / arr.length).toFixed(1); // 保留一位小数
                    }
                    return result;
                }

                // 处理经纬度
                // function strToNum(str) {
                //     str = str.toString();
                //     var index = str.indexOf('.');
                //     return str.slice(0, index + 3);
                // }


                var myLabelStyle = {
                    normal: {
                        show: true,
                        formatter: function (params) {
                            // console.log('params:', params);

                            var tmpl = '{a|[[name]]}\n{b|[[value]]℃}';

                            var value = parseFloat(scatterDataMapName[params.name]);
                            if (isNaN(value) || that.areaState.length > 1) {
                                tmpl = '{a|[[name]]}';
                            }
                            var html = tmpl.replace(/\[\[name\]\]/g, params.name)
                                .replace(/\[\[value\]\]/g, value);
                            return html;
                        },
                        rich: {
                            a: {
                                // color: '#333',
                                color: '#333',
                                fontSize: 14,
                                lineHeight: 18
                            },
                            b: {
                                color: '#0f3a90',
                                // color: '#000',
                                fontSize: 14,
                                lineHeight: 18
                            },
                        },
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        },

                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize: 16
                        },
                        rich: {
                            a: {
                                // color: '#333',
                                color: '#fff',
                                fontSize: 14,
                                lineHeight: 18
                            },
                            b: {
                                // color: '#0f3a90',
                                color: '#fff',
                                fontSize: 14,
                                lineHeight: 18
                            },
                        },
                    }
                };

                var myItemStyle = {

                    normal: {
                        areaColor: 'rgba(27, 95, 152, .6)',
                        borderColor: 'rgba(156,188,231,.5)',
                        borderWidth: 2.5,
                    },
                    emphasis: {
                        areaColor: 'rgba(21, 41, 117, .8)'
                    }
                };


                var myVissualMap;

                maxNum = Math.ceil(maxNum);	// 对数进行上舍入。
                var splitNumber = Math.ceil(maxNum / 6); // 分段数量，每一段6
                maxNum = splitNumber * 6
                var colorArr = ['#74e0ea', '#cafbdb', '#fdfcb7', '#faa644', '#f67108'];
                colorArr.length = splitNumber;
                $.each(colorArr, function (index, item) {
                    if (!item) {
                        colorArr[index] = '#f67108'
                    }
                });


                // 温度
                myVissualMap = {
                    type: 'piecewise',
                    'min': 0,
                    'max': maxNum,
                    'splitNumber': splitNumber,
                    seriesIndex: [0, 1],
                    bottom: 10,
                    left: 10,
                    // seriesIndex: [0],
                    // dimension: this.areaState.length === 1 ? null : 2,

                    // 'color': ['#f67108', '#faa644', '#fdfcb7', '#cafbdb', '#74e0ea'],
                    inRange: {
                        'color': colorArr,
                    },
                    'textStyle': {
                        'color': '#fff'
                    }
                };

                var scatterLabelStyle = {
                    'normal': {
                        'show': false,
                        'position': 'top',
                        'align': 'center',
                        'formatter': function (data) {
                            var unit = '℃';

                            var text = data.name + ' ' + Number(data.data.sl).toFixed(1) + unit;
                            return '{pop|' + text + '}\n{arrow|}';

                        },
                        'rich': {
                            'pop': {
                                // 'backgroundColor': '#0641ba',
                                'backgroundColor': 'rgba(86,129,170,1)',
                                'color': '#fff',
                                'padding': [5, 8]
                            },
                            'arrow': {
                                'backgroundColor': {
                                    // 'image': 'resource/images/label_arrow3.png'
                                    'image': 'resource/images/label_arrow.png',
                                },
                                'lineHeight': 5,
                            },
                            'a': {
                                'color': '#333',
                                'fontSize': 14,
                                'lineHeight': 20
                            }
                        }
                    }
                };

                var myTooltip = {
                    trigger: 'item',
                    formatter: '{b}',
                    enterable: true,
                    //alwaysShowContent:true,
                    hideDelay: 100,
                    // backgroundColor: 'rgba(255,255,255,1)',//背景颜色（此时为默认色）
                    borderRadius: 2,//边框圆角
                    borderWidth: '0',
                    padding: 0,    // [5, 10, 15, 20] 内边距
                    textStyle: {
                        color: '#000'
                    },
                    position: function (point, params, dom, rect, size) {
                        var unit = '℃';

                        var value = params.value;
                        if (params.seriesName === 'scatterSer') {
                            value = Number(params.data.sl).toFixed(1);
                        }

                        var valueHtml = '      <p style="font-size:16px;color:' + color + '">粮温' + '：' + value + unit + '</p>';

                        if (isNaN(Number(value))) {
                            valueHtml = '';
                        }

                        var color = '#fff';
                        var html = '<div class="lsvs-chart__tip">'
                            + '      <p style="font-size:16px;color:' + color + '">' + params.name + '</p>'
                            + valueHtml
                            + '  </div>';
                        $(dom).html(html)
                    }
                };

                // console.log('heartValue1:', heartValue1);
                // console.log('heartValue2:', heartValue2);
                // console.log('heartValue3:', heartValue3);
                // console.log('scatterData:', scatterData);
                // console.log('mapName:', mapName);
                // console.log('myVissualMap:', myVissualMap);

                var option = {
                    tooltip: myTooltip,

                    'geo': {
                        map: this.areaState[this.areaState.length - 1].name,
                        // 'aspectScale': 0.85,
                        // 'zoom': 1.05,
                        'itemStyle': myItemStyle,
                        'label': myLabelStyle
                    },
                    'visualMap': myVissualMap,
                    'series': [

                        {
                            name: 'mapSer',
                            type: 'map', // 地图区域
                            // aspectScale: 0.85,
                            // zoom: 1.15,
                            roam: false,
                            geoIndex: 0,
                            label: {
                                show: false,
                            },

                            data: scatterData
                            // data: this.areaState.length === 1 ? scatterData : []

                        },
                        {
                            'name': 'scatterSer',
                            'type': 'scatter', // 散点图
                            'coordinateSystem': 'geo', // 背景
                            // symbol: this.areaState.length === 1 ? 'image://../../resource/css/visual/images/icon_address.png' : '',
                            // 'symbolSize': this.areaState.length === 1 ? 20 : 15,
                            symbol:   'image://../../resource/css/visual/images/icon_address.png' ,
                            'symbolSize':20,
                            itemStyle: {
                                opacity: 1
                            },
                            'hoverAnimation': false,
                            'label': scatterLabelStyle,
                            'data': heartValue3
                        }
                    ]
                };
                console.log('option:', option);
                //渲染地图
                chart.clear();
                chart.setOption(option, true);
            }
        },

        /**
        * @description:  渲染表格（柱图）
        * @param {type} 
        * @return: {void}
        */
        renderTable: function (data) {
            var $table = $('#percentTable');
            var data = [
                {
                    name: '南宁市', percent: '99%', num: 6250
                },
                {
                    name: '柳州市', percent: '90%', num: 6250
                },
                {
                    name: '桂林市', percent: '80%', num: 6250
                },
                {
                    name: '河池市', percent: '76%', num: 6020
                },
                {
                    name: '贺州市', percent: '60%', num: 5320
                },
                {
                    name: '梧州市', percent: '52%', num: 4520
                },
                {
                    name: '来宾市', percent: '66%', num: 3650
                },
                {
                    name: '百色市', percent: '69%', num: 3010
                },
                {
                    name: '崇左市', percent: '78%', num: 3560
                },
                {
                    name: '钦州市', percent: '85%', num: 3870
                },
                {
                    name: '北海市', percent: '86%', num: 3980
                },
                {
                    name: '贵港市', percent: '88%', num: 4020
                },
                {
                    name: '玉林市', percent: '92%', num: 6870
                },
                {
                    name: '防城港市', percent: '95%', num: 6870
                }
            ];

            for (var i = 0; i < data.length; i++) {
                var tr = '<tr>'
                    + '<th width="10%">' + data[i].name + '</th>'
                    + '<td><div class="lsvs-percenttable__percentouter" style="width: 100%;"><div class="lsvs-percenttable__percent j-percent" data-percent=' + data[i].percent + '></div></div></td>'
                    + '<td width="10%" style="padding: 0 10px;"><span>' + data[i].num + '家</span></td>'
                    + '</tr>';
                $table.append(tr);
            }
            $table.find(".j-percent").each(function (index) {
                var percent = $(this).data("percent");
                $(this).animate({
                    width: percent
                }, index * 100);
            });

            // 如果需要滚动
            if (this.detIsTableMove($table)) {
                this.tableMarque($table, 'percentTable');
            }

        },

        /**
         * @description:  检测表格是否需要滚动
         * @param {type} $table
         * @return: {void}
         */
        'detIsTableMove': function ($table) {
            var tableH = $table.height();
            var parH = $table.parent().height();
            return tableH > parH + 15;
        },

        /**
        * @description:  设置表格定时滚动
        * @param {type} $table
        * @return: {void}
        */
        'tableMarque': function ($table, timerName) {

            var that = this;
            var delay = 1500;

            clearTimeout(that.timers[timerName]);
            that.timers[timerName] = setTimeout(function () {
                timeoutFun();
            }, delay);

            if ($table.attr('data-isbindhove') !== '1') {
                // 如果没有绑定事件
                $table.hover(function () {
                    clearTimeout(that.timers[timerName]);
                }, function () {
                    that.timers[timerName] = setTimeout(function () {
                        timeoutFun();
                    }, delay);
                });
            }

            function timeoutFun() {
                that.tableRowMove($table);
                that.timers[timerName] = setTimeout(function () {
                    timeoutFun();
                }, delay);
            }

            // $table.css('border', '0').parent().css('border', '1px solid rgba(101, 124, 168, .7)');
            $table.attr('data-isbindhove', 1); // 是否已经绑定了hover事件
        },

        /**
        * @description:  执行表格行滚动
        * @param {type} $table
        * @return: {void}
        */
        'tableRowMove': function ($table) {
            var height = $table.find('tr:eq(0)').height();

            $table.animate({ 'margin-top': '-' + height + 'px' }, function () {
                $table.find('tr:eq(0)').appendTo($table);
                $table.css({ 'margin-top': 0 });
            });

        },

        /**
     * @description:  渲染饼图
     * @param {type} 
     * @return: {void}
     */
        renderPie: function (data) {
            var chart01 = this.pieChart;

            var colorList = ['#449FFF', '#A54EF8', '#FDD047'];
            // console.log(JSON.stringify(series1));
            var option01 = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} {b} : {c} ({d}%)",
                },
                legend: {
                    type: 'scroll',
                    // orient: 'vertical',
                    bottom: '5%',
                    left: 'center',
                    // left: '5%',
                    // top: 'center',
                    // itemGap: 20,
                    icon: 'pin',
                    data: ['温度告警', '虫害告警', '湿度告警'],
                    textStyle: {
                        color: '#fff',
                        rich: {
                            a: {
                                color: "#DE382C",
                                fontSize: 16,
                                fontWeight: 600
                            }
                        },
                    },
                    formatter: function (name) {
                        // 获取legend显示内容
                        var data = option01.series[0].data;
                        var total = 0;
                        var tarValue = 0;

                        for (var i = 0, l = data.length; i < l; i++) {
                            total += data[i].value;
                            if (data[i].name == name) {
                                tarValue = data[i].value;
                            }
                        }
                        var p = (tarValue / total * 100).toFixed(1);
                        return name + ' {a|' + tarValue + '}';
                        // return name + ' {a|' + tarValue + '(' + p + '%)}';
                    },

                },
                color: colorList,
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: ["40%", "60%"],
                        center: ['50%', '40%'],
                        label: {
                            normal: {
                                show: false,
                            },
                        },
                        labelLine: {
                            normal: {
                                show: false,
                            },
                        },
                        itemStyle: {
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        },
                        data: [
                            { name: '温度告警', value: 5 },
                            { name: '虫害告警', value: 3 },
                            { name: '湿度告警', value: 2 },
                        ],
                    }
                ]
            };

            chart01.setOption(option01);
            // console.log('chart01:', chart01.getOption());

        },

        /**
        * @description:   样品总数数据
        * @param {type} 
        * @return: {void}
        */
        renderTotalData: function (data) {
            aoUtils.setFormData('#container', data);
        },

        /**
        * @description:   绑定事件
        * @param {type} 
        * @return: {void}
        */
        bindEvents: function () {
            var that = this;

            //地图点击事件
            this.mapChart.on('click', function (params) {

                var areaCode = cityMap[params.name] || gxDistrictMap[params.name]; // 行政区划代码
                if (!areaCode || that.areaState.length >= 2) {
                    // 只能下钻两层
                    return;
                }
                that.areaState.push({
                    name: params.name,
                    code: areaCode
                })
                that.searchData();
                $('#btnBack').show();

            });


            // 返回按钮
            $('#btnBack').click(function () {
                that.areaState.pop()
                that.searchData();
                if (that.areaState.length < 2) {
                    $('#btnBack').hide();
                }
            });

            // 全屏按钮
            $('#btnFullscreem').click(function () {
                $('#mapWrapper').toggleClass('lsvs-fullscreem');
                that.mapChart.resize && that.mapChart.resize();
            });


            // 防抖函数
            var debounce = aoUtils.debounce();

            $(window).resize(function () {
                debounce(function () {
                    that.mapChart.resize && that.mapChart.resize();
                    that.pieChart.resize && that.pieChart.resize();
                    // 如果没有绑定过滚动，并且需要滚动，则绑定事件
                    if (that.detIsTableMove($('#percentTable'))) {
                        that.tableMarque($('#percentTable'), 'percentTable');
                    } else {
                        clearTimeout(that.timers['percentTable']);
                    }
                }, 200);
            });

            $('#tab').on('click', '.j-tab-item', function () {
                var id = $(this).attr('data-id');
                $('#tab .j-tab-item').removeClass('is-active');
                $(this).addClass('is-active');
                that.curTab = id;
                that.searchData();
            })


            // 标题提示
            var subtips1;
            $("#btnTips1").hover(function () {
                var html = '<div><span class="grvs-tipscolor-1"></span>温度告警标准：仓房仓内温度>=30℃；</div>'
                    + '<div><span class="grvs-tipscolor-2"></span>虫害告警标准：仓房虫害密度 > 0；</div > '
                    + '<div><span class="grvs-tipscolor-3"></span>湿度告警标准：仓内湿度 < 50 % 或仓内湿度 > 70 %。</div > '
                subtips1 = layer.tips(html, '#btnTips1', { tips: [1, '#BDECF6'], time: 0, area: ['200', 'auto']})
            }, function () {
                layer.close(subtips1);
            })



        },

    };

    inst = new Main();



});




