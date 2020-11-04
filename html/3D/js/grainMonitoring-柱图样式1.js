
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
        this.curTab = "pjw"; // 默认评价粮温

        this.timers = {
            'table': null,

        };



        // 初始化地图
        this.mapChart = echarts.init(document.getElementById('mapChart'));

        // 初始化柱图
        this.barChart = echarts.init(document.getElementById('barChart'));
        // 初始化饼图
        this.pieChart = echarts.init(document.getElementById('pieChart'));


        this.searchData(); // 请求数据

        this.bindEvents();

    }

    Main.prototype = {


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
                        that.renderBar(data.barData);
                        that.renderPie(data.barData);
                        that.renderTable();
                        that.loadMapData(function (mapData) {
                            that.renderMap(mapData, data.heatDataList);
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
       * @description:  渲染地图- 温度
       * @param {type}
       * @return: {void}
       */
        renderMap: function (mapData, heatData) {
            var that = this;
            var chart = this.mapChart;

            var projectMap = {
                pjw: '平均粮温',
                zdw: '最低粮温',
                zgw: '最高粮温',
                cwqw: '仓外气温',
                cnqw: '仓内气温',
                cwsd: '仓外湿度',
                cnsd: '仓内湿度',
            };

            // console.log('mapData:', mapData);
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
                        // console.log('name:', name);
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
                    var sl = val[that.curTab]; // 根据当前tab值 设置数值

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
                            if (isNaN(value)) {
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
                if (that.curTab === 'cnsd' || that.curTab === 'cwsd') {
                    // 湿度
                    myVissualMap = {
                        type: 'continuous',
                        orient: 'horizontal',
                        itemWidth: 10,
                        itemHeight: 80,
                        text: ['高', '低'],
                        // dimension: mapName === 'guangxi' ? null : 2,
                        showLabel: true,
                        seriesIndex: [0, 1],
                        min: 0,
                        max: 100,
                        inRange: {
                            color: ['#ff680d', '#ff9e0f', '#58d232']
                        },
                        textStyle: {
                            color: '#fff'
                        },
                        right: 10,
                        bottom: 10,
                    };
                } else {
                    // 温度
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
                    myVissualMap = {
                        type: 'piecewise',
                        'min': 0,
                        'max': maxNum,
                        'splitNumber': splitNumber,
                        seriesIndex: [0, 1],
                        right: 10,
                        bottom: 10,
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
                }

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

                        // 湿度
                        if (that.curTab === 'cnsd' || that.curTab === 'cwsd') {
                            unit = '%';
                        }

                        var currentType = projectMap[that.curTab];

                        var value = params.value;
                        if (params.seriesName === 'scatterSer') {
                            value = Number(params.data.sl).toFixed(1);
                        }

                        var valueHtml = '      <p style="font-size:16px;color:' + color + '">' + currentType + '：' + value + unit + '</p>';

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

                        },
                        {
                            'name': 'scatterSer',
                            'type': 'scatter', // 散点图
                            'coordinateSystem': 'geo', // 背景
                            // symbol: 'image://../resource/images/grain_flag.png',
                            symbol: 'image://../../resource/css/visual/images/icon_address.png',
                            'symbolSize': 20,
                            itemStyle: {
                                opacity: 1
                            },
                            'hoverAnimation': false,
                            'label': scatterLabelStyle,
                            'data': heartValue3
                        }
                    ]
                };
                // console.log('option:', option);
                //渲染地图
                chart.clear();
                chart.setOption(option, true);
            }
        },

        /**
        * @description:  渲染柱图
        * @param {type} 
        * @return: {void}
        */
        renderBar: function (data) {
            var chart01 = this.barChart;
            data = data || [];
            var axisData = []; // 坐标数据
            var seriesData = [];
            $.each(data, function (index, item) {
                axisData.push(item.xzqhmc);
                seriesData.push({
                    name: item.xzqhmc,
                    value: item.value
                });
            });
            // console.log('axisData:', axisData);
            // console.log('seriesData:', seriesData);
            // ==================================================================================================

            var colors = [
                {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#52C5FF' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#228FFE' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                }
            ];
            var option01 = {
                grid: {
                    top: '25',
                    left: '8%',
                    right: '8%',
                    bottom: '10',
                    containLabel: true
                },
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#227081'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#65C6E7',//坐标值得具体的颜色
                                fontSize: 14
                            }
                        },
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        data: axisData,
                        splitNumber: 8,
                        axisLine: {
                            lineStyle: {
                                color: '#227081'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 0,
                            // rotate: 30, //  
                            textStyle: {
                                color: '#BDECF6',//坐标值得具体的颜色
                                fontSize: '100%',
                                fontSize: 14
                            }
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} 家"
                },

                series: [{
                    "name": '',
                    "type": "bar",
                    "barWidth": "45%",
                    // 'stack': '1',
                    "data": seriesData,

                }],
                color: colors
            };

            chart01.setOption(option01);


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

                // tooltip: {
                //     trigger: 'item',
                // },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} {b} : {c} ({d}%)",
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    // bottom: '10%',
                    // left: 'center',
                    left: '15%',
                    top: 'center',
                    itemGap: 20,
                    icon: 'pin',
                    data: ['温度告警', '虫害告警', '湿度告警'],
                    textStyle: {
                        color: '#fff',

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
                        return name + ' ' + tarValue + '(' + p + '%)';
                    },

                },
                color: colorList,
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: [60, 90],
                        center: ['60%', '50%'],
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


        },


        /**
         * @description:  设置表格 在建项目累计完成进度排名
         * @param {Array} data
         * @return: {void}
         */
        'renderTable': function (data) {
            var that = this;
            var data = [
                {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }, {
                    'city': '南宁市',
                    'lkxz': '直属库',
                    'kdmc': '广西壮族自治区南宁粮食储备库有限公司',
                    'cf': '15仓',
                    'gjlx': '温度',
                    'bz': '仓内温度过高',
                }
            ];

            var $table = $('#table');

            var tmpl = '<tr>' +
                '<td title="{{index}}" width= "50px" class="lsvs_tc">{{index}}</td>' +
                '<td title="{{city}}" width="70px">{{city}}</td>' +
                '<td title="{{lkxz}}" width="80px">{{lkxz}}</td>' +
                '<td title="{{kdmc}}" width="">{{kdmc}}</td>' +
                '<td title="{{cf}}" width="60px">{{cf}}</td>' +
                '<td title="{{gjlx}}" width="80px" class="lsvs_tc">{{gjlx}}</td>' +
                '<td title="{{bz}}" width="120px" class="lsvs_tc">{{bz}}</td>' +
                '</tr>';

            var html = '';

            $.each(data, function (index, item) {
                html += tmpl.replace(/\{\{index\}\}/g, index + 1)
                    .replace(/\{\{city\}\}/g, item.city)
                    .replace(/\{\{lkxz\}\}/g, item.lkxz)
                    .replace(/\{\{kdmc\}\}/g, item.kdmc)
                    .replace(/\{\{cf\}\}/g, item.cf)
                    .replace(/\{\{gjlx\}\}/g, item.gjlx)
                    .replace(/\{\{bz\}\}/g, item.bz)
            });
            $table.html(html);

            // 如果需要滚动
            if (this.detIsTableMove($table)) {
                this.tableMarque($table, 'table');
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

            return tableH > parH + 5;
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
        * @description:   绑定事件
        * @param {type} 
        * @return: {void}
        */
        bindEvents: function () {
            var that = this;

            //地图点击事件
            this.mapChart.on('click', function (params) {
                // console.log('params:', params);
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
                    that.barChart.resize && that.barChart.resize();
                    that.pieChart.resize && that.pieChart.resize();

                    // 如果没有绑定过滚动，并且需要滚动，则绑定事件
                    if (that.detIsTableMove($('#table'))) {
                        that.tableMarque($('#table'), 'table');
                    } else {
                        clearTimeout(that.timers['table']);
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


        },

    };

    inst = new Main();



});




