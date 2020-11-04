
layui.use(['form', 'laydate', 'layer', 'table', 'laypage'], function () {
    var form = layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var table = layui.table;
    var laypage = layui.laypage;

    var inst;

    function Main() {

        this.resData = null; // 后台返回的所有数据

        this.areaState = [{
            code: '', // 行政区划代码，默认广西
            name: 'guangxi' // 行政区域名称，地市级使用中文，用于echarts 如：南宁市
        }];

        this.timers = {
            'percentTable': null,
            'table1': null,
            'table2': null,

        };


        // // 初始化折线图
        // this.lineChart = echarts.init(document.getElementById('lineChart'));
        // // 初始化柱图
        // this.barChart = echarts.init(document.getElementById('barChart'));
        // 初始化饼图
        this.pieChart = echarts.init(document.getElementById('pieChart'));
        // this.pieChart2 = echarts.init(document.getElementById('pieChart2'));

        // 初始化地图
        this.mapChart = echarts.init(document.getElementById('mapChart'));

        this.bindEvents();
        this.searchData(); // 请求数据
        this.loadTable1(1);
        this.loadTable2(1);
    }

    Main.prototype = {

        /**
        * @description:  请求后台 查询数据
        * @param {type} 
        * @return: {void}
        */
        searchData: function () {
            var that = this;
            var url = './json/grainEnterprisesAnalysis.json';
            var obj = aoUtils.getFormData('#searchForm');
            // console.log('obj:', obj);
            $.ajax({
                url: url,
                type: 'get',
                data: obj,
                dataType: 'json',
                success: function (resp) {
                    // console.log('resp:', resp);
                    var data = resp.data;
                    that.resData = resp.data;
                    if (String(resp.code) === '200') {
                        that.renderTotalData(data.totalData);
                        that.renderPie(data.pieData1);
                        that.renderPercentTable(data.barData);

                        that.loadMapData(function (mapData) {
                            that.renderMap(mapData, data.mapAreaData, data.mapPointData);
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
      * @description:   总数据
      * @param {type} 
      * @return: {void}
      */
        renderTotalData: function (data) {
            aoUtils.setFormData('#total', data);

            var numArr = String(data.qqslqyzs).split('')
            var zeroNum = 3 - numArr.length; // 不满3的补0
            var html = '';
            if (zeroNum > 0) {
                for (var index = 1; index <= zeroNum; index++) {
                    numArr.unshift('0');
                }
            }
            $.each(numArr, function (index, item) {
                html += '<span class="grvs-block__value">' + item + '</span>'
            });
            $('#totalNumber').html(html);
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
            var scatterDataMapName = {};

            $.each(scatterData, function (index, item) {
                item.value = [item.jd, item.wd]; // 经纬度 
                item.name = item.kqmc; // 添加name字段，才能弹出tooltip
            });

            var maxNum = 1;
            $.each(seriesMapData, function (index, item) {
                item.value = item.zcr;

                item.name = item.xzqymc; // 行政区域名称
                maxNum = Number(item.value) > maxNum ? Number(item.value) : maxNum;
                scatterDataMapName[item.name] = item.value;

            });

            var scatterData2 = [];
            $.each(mapData.features, function (index, item) {
                scatterData2.push({
                    name: item.properties.name,
                    value: item.properties.cp,
                })
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
                    var projectName = '数量';

                    var valHtml = '      <p style="font-size:16px;color:' + color + '">' + projectName + '：' + value + '个</p>';

                    if (params.seriesName === 'mapScatter') {
                        value = params.data.zcr;

                        // console.log('value:', value);
                        valHtml = '      <p style="font-size:16px;color:' + color + '">' + projectName + '：' + value + '个</p>';
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
                    formatter: function (params) {
                        // console.log('params:', params);

                        var tmpl = '{a|[[name]]}\n{b|[[value]]个}';

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
                            color: '#fff',
                            fontSize: 14,
                            lineHeight: 20
                        },
                        b: {
                            color: '#0f3a90',
                            color: '#fff',
                            fontSize: 14,
                            lineHeight: 20
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
                            lineHeight: 20
                        },
                        b: {
                            // color: '#0f3a90',
                            color: '#fff',
                            fontSize: 14,
                            lineHeight: 20
                        },
                    },
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
                        type: 'scatter',  // 气泡点
                        coordinateSystem: 'geo',
                        hoverAnimation: false,
                        data: scatterData2,
                        symbol: 'circle',
                        symbolSize: 8,
                        tooltip: {
                            show: false
                        },
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
                    // {
                    //     name: 'mapScatter',
                    //     type: 'scatter',                // 气泡点
                    //     coordinateSystem: 'geo',
                    //     hoverAnimation: false,

                    //     data: scatterData,
                    //     symbol: 'circle',
                    //     symbolSize: 8,
                    //     label: {
                    //         normal: {
                    //             show: false,
                    //         },
                    //         emphasis: {
                    //             show: false,
                    //         }
                    //     },
                    //     itemStyle: {
                    //         normal: {
                    //             color: '#ff715e',
                    //             borderWidth: 1,
                    //             borderColor: '#fff'
                    //         },
                    //         emphasis: {
                    //             color: '#f00',
                    //             borderWidth: 2,
                    //             borderColor: '#f00'
                    //         }
                    //     },


                    // }
                ]
            };
            // console.log('option:', option);

            //渲染地图
            chart.clear();
            chart.setOption(option, true);
        },



        /**
   * @description:  渲染饼图
   * @param {type} 
   * @return: {void}
   */
        renderPie: function (data) {
            var chart01 = this.pieChart;

            var seriesData = data;
            var legendData = [];
            var colorList = ['#F16980', '#5BD792', '#449FFF', '#B968ED', '#FDCF47'];

            $.each(seriesData, function (index, item) {
                legendData.push(item.name);
            });

            var rich = {
                // 默认，颜色数组不够用的时候
                'b': {
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600
                }
            };
            $.each(colorList, function (index, color) {
                rich['a' + index] = {
                    color: color,
                    fontSize: 14,
                    fontWeight: 600
                }
            });

            var option01 = {

                // tooltip: {
                //     trigger: 'item',
                // },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return params.marker + params.name + ': ' + params.value + '个 (' + params.percent + '%)';
                    }
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    // bottom: '10%',
                    // left: 'center',
                    right: 10,
                    top: 'center',
                    itemGap: 20,
                    icon: 'pin',
                    data: legendData,

                    textStyle: {
                        color: '#fff',
                        fontSize: 14,
                        rich: rich
                    },
                    formatter: function (name) {
                        // 获取legend显示内容
                        var data = option01.series[0].data;
                        var total = 0;
                        var tarValue = 0;
                        var richName = 'b';

                        for (var i = 0, l = data.length; i < l; i++) {
                            total += data[i].value;
                            if (data[i].name == name) {
                                tarValue = data[i].value;
                                richName = 'a' + i;
                            }
                        }
                        // var p = (tarValue / total * 100).toFixed(1);
                        return name + ' {' + richName + '|' + tarValue + '个}';
                    },

                },
                color: colorList,
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: [60, 90],
                        center: ['25%', '50%'],
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
                        data: seriesData,
                    }
                ]
            };

            chart01.setOption(option01);


        },



        /**
         * @description:  渲染表格（柱图）
         * @param {type} 
         * @return: {void}
         */
        renderPercentTable: function (data) {
            var $table = $('#percentTable');

            clearTimeout(this.timers['percentTable']);


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
                    + '<td><div class="lsvs-percenttable__percentouter" style="width: 100%;"><div class="lsvs-percenttable__percent lsvs-percenttable__percent--theme2 j-percent" data-percent=' + data[i].percent + '></div></div></td>'
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
         * @description:  设置表格  
         * @param {Array} data
         * @return: {void}
         */
        'renderTable1': function (data) {
            var that = this;
            data = data || []

            clearTimeout(this.timers['table1']);

            var $table = $('#table1');

            var tmpl = '<tr>' +
                '<td title="{{index}}" width= "50px" class="lsvs_tc">{{index}}</td>' +
                '<td title="{{city}}" width="70px">{{city}}</td>' +
                '<td title="{{qydm}}" width="">{{qydm}}</td>' +
                '<td title="{{qymc}}" width="">{{qymc}}</td>' +
                '<td title="{{ywl}}" width="70px">{{ywl}}</td>' +
                '</tr>';

            var html = '';

            $.each(data, function (index, item) {
                html += tmpl.replace(/\{\{index\}\}/g, index + 1)
                    .replace(/\{\{city\}\}/g, item.city)
                    .replace(/\{\{qymc\}\}/g, item.qymc)
                    .replace(/\{\{qydm\}\}/g, item.qydm)
                    .replace(/\{\{ywl\}\}/g, item.ywl)
            });
            $table.html(html);

            // 如果需要滚动
            if (this.detIsTableMove($table)) {
                this.tableMarque($table, 'table1');
            }

        },

        /**
        * @description:  设置表格  
        * @param {Array} data
        * @return: {void}
        */
        'renderTable2': function (data) {
            var that = this;
            data = data || []

            clearTimeout(this.timers['table2']);

            var $table = $('#table2');

            var tmpl = '<tr class="{{trClass}}">' +
                '<td title="{{qymc}}" width="">{{qymc}}</td>' +
                '<td title="{{city}}" width="70px">{{city}}</td>' +
                '<td title="{{qxmc}}" width="70px">{{qxmc}}</td>' +
                '<td title="{{qyttl}}" width="90px">{{qyttl}}</td>' +
                '</tr>';

            var html = '';

            $.each(data, function (index, item) {
                var trCls = ['grvs-tr-rank--1', 'grvs-tr-rank--2', 'grvs-tr-rank--3'];
                html += tmpl.replace(/\{\{city\}\}/g, item.city)
                    .replace(/\{\{qymc\}\}/g, item.qymc)
                    .replace(/\{\{qxmc\}\}/g, item.qxmc)
                    .replace(/\{\{qyttl\}\}/g, item.qyttl)
                    .replace(/\{\{trClass\}\}/g, item.ranking ? trCls[Number(item.ranking) - 1] : '')
            });
            $table.html(html);

            // 如果需要滚动
            if (this.detIsTableMove($table)) {
                this.tableMarque($table, 'table2');
            }
        },

        /**
        * @description: 加载表格1
        * @return:
        */
        'loadTable1': function (page) {
            // 查询参数
            var that = this;

            $.ajax({
                'url': './json/grainEnterprisesAnalysis_table1.json',
                type: 'get',
                data: {
                    page: page,
                    rows: 10
                },
                dataType: 'json',
                success: function (resp) {
                    if (String(resp.status) === '1') {
                        that.renderTable1(resp.data.results);
                        that.renderLaypage1(resp.data.total)
                    } else {
                        aoUtils.failMsg(resp.msg, layer);
                    }
                },
                error: function (xhr) {
                    aoUtils.failMsg(xhr, layer);
                }
            });
        },

        /**
        * @description:  初始化分页1
        * @param {type} params
        * @return: {void}
        */
        renderLaypage1: function (count) {
            var that = this;
            laypage.render({
                elem: 'pager1'
                , first: '首页'
                , last: '尾页'
                , prev: '<i class="layui-icon layui-icon-left"></i>'
                , next: '<i class="layui-icon layui-icon-right"></i>'
                , count: count //数据总数，从服务端得到
                , jump: function (obj, first) {

                    //首次不执行
                    if (!first) {
                        //do something
                        that.loadTable1(obj.curr)
                    }
                }
            });

        },
        /**
               * @description: 加载表格2
               * @return:
               */
        'loadTable2': function (page) {
            // 查询参数
            var that = this;

            $.ajax({
                'url': './json/grainEnterprisesAnalysis_table2.json',
                type: 'get',
                data: {
                    page: page,
                    rows: 10
                },
                dataType: 'json',
                success: function (resp) {
                    if (String(resp.status) === '1') {
                        that.renderTable2(resp.data.results);
                        that.renderLaypage2(resp.data.total)
                    } else {
                        aoUtils.failMsg(resp.msg, layer);
                    }
                },
                error: function (xhr) {
                    aoUtils.failMsg(xhr, layer);
                }
            });
        },

        /**
        * @description:  初始化分页1
        * @param {type} params
        * @return: {void}
        */
        renderLaypage2: function (count) {
            var that = this;
            laypage.render({
                elem: 'pager2'
                , first: '首页'
                , last: '尾页'
                , prev: '<i class="layui-icon layui-icon-left"></i>'
                , next: '<i class="layui-icon layui-icon-right"></i>'
                , count: count //数据总数，从服务端得到
                , jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：

                    //首次不执行
                    if (!first) {
                        //do something
                        that.loadTable2(obj.curr)
                    }
                }
            });

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
                    // that.lineChart.resize();
                    // that.barChart.resize();
                    that.pieChart.resize();
                    // that.pieChart2.resize();

                    that.mapChart.resize();

                    // 如果没有绑定过滚动，并且需要滚动，则绑定事件
                    if (that.detIsTableMove($('#percentTable'))) {
                        that.tableMarque($('#percentTable'), 'percentTable');
                    } else {
                        clearTimeout(that.timers['percentTable']);
                    }

                    // 如果没有绑定过滚动，并且需要滚动，则绑定事件
                    if (that.detIsTableMove($('#table1'))) {
                        that.tableMarque($('#table1'), 'table1');
                    } else {
                        clearTimeout(that.timers['table1']);
                    }

                    // 如果没有绑定过滚动，并且需要滚动，则绑定事件
                    if (that.detIsTableMove($('#table2'))) {
                        that.tableMarque($('#table2'), 'table2');
                    } else {
                        clearTimeout(that.timers['table2']);
                    }

                }, 200);
            });


            // 标题提示
            var subtips1;
            var subtips2;
            $("#btnTips1").hover(function () {
                subtips1 = layer.tips('一个月内业务量大于10笔的企业为活跃企业', '#btnTips1', { tips: [1, '#BDECF6'], time: 0 })
            }, function () {
                layer.close(subtips1);
            })
            $("#btnTips2").hover(function () {
                subtips2 = layer.tips('粮食吞吐量=粮食进库量+粮食出库量+粮食移库量', '#btnTips2', { tips: [1, '#BDECF6'], time: 0 })
            }, function () {
                layer.close(subtips2);
            })

        },

    };

    inst = new Main();



});




