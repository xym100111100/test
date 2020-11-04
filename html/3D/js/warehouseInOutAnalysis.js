
layui.use(['form', 'laydate', 'layer'], function () {
    var form = layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;

    var inst;

    function Main() {

        this.curTab = '1'; // 第二个折线图 默认 全区各地市入库情况统计
        this.resData = null; // 后台返回的所有数据

        // 初始化折线图
        this.lineChart1 = echarts.init(document.getElementById('lineChart1'));
        this.lineChart2 = echarts.init(document.getElementById('lineChart2'));
        // 初始化柱图
        this.barChart1 = echarts.init(document.getElementById('barChart1'));
        this.barChart2 = echarts.init(document.getElementById('barChart2'));
        this.barChart3 = echarts.init(document.getElementById('barChart3'));

        this.bindEvents();
        this.searchData(); // 请求数据

    }

    Main.prototype = {

        /**
        * @description:  请求后台 查询数据
        * @param {type} 
        * @return: {void}
        */
        searchData: function () {
            var that = this;
            var url = './json/warehouseInOutAnalysis.json';
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
                        that.renderLine1(data.lineData1);
                        that.renderLine2();
                        that.renderBar1(data.barData1);
                        that.renderBar2(data.barData2);
                        that.renderBar3(data.barData3);
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
        },


        /**
        * @description:  渲染折线图
        * @param {type} 
        * @return: {void}
        */
        renderLine1: function (data) {
            var chart01 = this.lineChart1;
            data = data || [];
            var axisData = []; // 坐标数据
            var seriesData = [];
            $.each(data, function (index, item) {
                axisData.push(item.name);
                seriesData.push({
                    name: item.name,
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
                legend: {
                    data: ['全区吞吐量'],
                    textStyle: {
                        color: '#fff',
                    }
                },
                grid: {
                    top: '25',
                    left: '5%',
                    right: '5%',
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
                        // boundaryGap: false,
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
                            // interval: 0,
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
                    trigger: 'axis',
                    formatter: function (params) {
                        var unit = '吨';
                        var html = params[0].name + '<br>';
                        $.each(params, function (index, item) {
                            html += item.marker + item.seriesName + ': ' + item.value + ' ' + unit + '<br>';
                        });
                        return html;
                    }
                },

                series: [{
                    "name": '全区吞吐量',
                    "type": "line",
                    "data": seriesData,

                    itemStyle: {
                        normal: {
                            color: 'rgba(102, 194, 62, 1)',
                            lineStyle: {
                                color: "rgba(102, 194, 62, 1)",
                                width: 1
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                    offset: 0,
                                    // color: 'rgba(102, 194, 62, 0)'
                                    color: 'rgba(255, 255, 255, 0)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(102, 194, 62, 1)'
                                }]),
                            }
                        }
                    },

                }],
                color: colors
            };

            chart01.setOption(option01);


        },

        /**
        * @description:  渲染折线图
        * @param {type} 
        * @return: {void}
        */
        renderLine2: function () {
            var chart01 = this.lineChart2;
            var seriesName;
            if (this.curTab === '1') {
                data = this.resData.lineData2_1;
                seriesName = '全区各地市入库情况统计';
            } else {
                data = this.resData.lineData2_2;
                seriesName = '全区各地市出库情况统计';

            }
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
                    left: '5%',
                    right: '5%',
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
                            rotate: 30, //  
                            textStyle: {
                                color: '#BDECF6',//坐标值得具体的颜色
                                fontSize: '100%',
                                fontSize: 14
                            },
                            formatter: function (params) {
                                var maxNum = 5;
                                return params.length > maxNum ? params.slice(0, maxNum - 1) + '...' : params;
                            }
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var unit = '吨';
                        var html = params[0].name + '<br>';
                        $.each(params, function (index, item) {
                            html += item.marker + item.seriesName + ': ' + item.value + ' ' + unit + '<br>';
                        });
                        return html;
                    }
                },

                series: [{
                    "name": seriesName,
                    "type": "line",
                    "data": seriesData,

                    itemStyle: {
                        normal: {
                            color: '#4FC2FF',
                            lineStyle: {
                                color: "#4FC2FF",
                                width: 1
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                    offset: 0,
                                    // color: 'rgba(102, 194, 62, 0)'
                                    color: 'rgba(255, 255, 255, 0)'
                                }, {
                                    offset: 1,
                                    color: '#4FC2FF'
                                }]),
                            }
                        }
                    },

                }],
                color: colors
            };

            chart01.setOption(option01);


        },

        /**
        * @description:  渲染柱图
        * @param {type} 
        * @return: {void}
        */
        renderBar1: function (data) {
            var chart01 = this.barChart1;
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
                    left: '5%',
                    right: '5%',
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
                    trigger: 'axis',
                    formatter: function (params) {
                        var colors = ['#228FFE'];
                        var unit = '吨';
                        var html = params[0].name + '<br>';
                        $.each(params, function (index, item) {
                            html += item.marker.replace('[object Object]', colors[index]) + item.seriesName + ': ' + item.value + ' ' + unit + '<br>';
                        });
                        return html;
                    }
                },
                series: [{
                    "name": '全区出入库业务量',
                    "type": "bar",
                    "barWidth": 20,
                    // 'stack': '1',
                    "data": seriesData,

                }],
                color: colors
            };

            chart01.setOption(option01);


        },

        /**
        * @description:  渲染柱图
        * @param {type} 
        * @return: {void}
        */
        renderBar2: function (data) {
            var chart01 = this.barChart2;

            data = data || [];

            var arr1 = [];
            var obj1 = {};
            var arr2 = [];
            var obj2 = {};

            $.each(data, function (index, item) {
                if (!obj1[item.xzqhmc]) {
                    obj1[item.xzqhmc] = {
                        xzqhmc: item.xzqhmc
                    };
                    arr1.push(obj1[item.xzqhmc]);
                }
                obj1[item.xzqhmc][item.typeName] = item.value;

                if (!obj2[item.typeName]) {
                    obj2[item.typeName] = true;
                    arr2.push(item.typeName);
                }

            });


            var axisData = []; // 坐标数据
            var seriesData = [];
            var seriesDataObj = {};

            $.each(arr1, function (index, item) {
                axisData.push(item.xzqhmc);

                $.each(arr2, function (index2, item2) {

                    if (!seriesDataObj[item2]) {
                        seriesDataObj[item2] = {
                            "name": item2,
                            "type": "bar",
                            "barWidth": 20,
                            // 'stack': '1',
                            "data": []
                        };
                        seriesData.push(seriesDataObj[item2]);
                    }
                    seriesDataObj[item2].data.push(item[item2])

                });
            });

            // ==================================================================================================

            var colors = [
                {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#67DBF5' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#8722EB' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                },
                {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: '#5ACBFF' //   
                    }, {
                        offset: 1, color: '#2772E2' //  
                    }],
                    globalCoord: false // 缺省为 false
                }
            ];


            // console.log(JSON.stringify(series1));
            var option01 = {
                legend: {
                    data: arr2,
                    textStyle: {
                        color: '#fff'
                    },
                    // itemGap: 20,
                    icon: "rect",
                    itemWidth: 12,  // 设置宽度
                    itemHeight: 12, // 设置高度
                    // right: '25',
                    top: 10
                },
                grid: {
                    top: '50',
                    left: '5%',
                    right: '5%',
                    bottom: '20',
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
                            textStyle: {
                                color: '#BDECF6',//坐标值得具体的颜色
                                fontSize: '100%'
                            }
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var colors = ['#8722EB', '#2772E2'];
                        var unit = '吨';
                        var html = params[0].name + '<br>';
                        $.each(params, function (index, item) {
                            html += item.marker.replace('[object Object]', colors[index]) + item.seriesName + ': ' + item.value + ' ' + unit + '<br>';
                        });
                        return html;
                    }
                },
                series: seriesData,
                color: colors
            };

            chart01.setOption(option01);


        },

        /**
        * @description:  渲染柱图
        * @param {type} 
        * @return: {void}
        */
        renderBar3: function (data) {
            var chart01 = this.barChart3;

            data = data || [];

            var arr1 = [];
            var obj1 = {};
            var arr2 = [];
            var obj2 = {};

            $.each(data, function (index, item) {
                if (!obj1[item.xzqhmc]) {
                    obj1[item.xzqhmc] = {
                        xzqhmc: item.xzqhmc
                    };
                    arr1.push(obj1[item.xzqhmc]);
                }
                obj1[item.xzqhmc][item.typeName] = item.value;

                if (!obj2[item.typeName]) {
                    obj2[item.typeName] = true;
                    arr2.push(item.typeName);
                }

            });


            var axisData = []; // 坐标数据
            var seriesData = [];
            var seriesDataObj = {};

            $.each(arr1, function (index, item) {
                axisData.push(item.xzqhmc);

                $.each(arr2, function (index2, item2) {

                    if (!seriesDataObj[item2]) {
                        seriesDataObj[item2] = {
                            "name": item2,
                            "type": "bar",
                            "barWidth": 20,
                            // 'stack': '1',
                            "data": []
                        };
                        seriesData.push(seriesDataObj[item2]);
                    }
                    seriesDataObj[item2].data.push(item[item2])

                });
            });

            // ==================================================================================================

            var colors = [
                '#E2BC79',
                '#38DAC1'
            ];



            // console.log(JSON.stringify(series1));
            var option01 = {
                legend: {
                    data: arr2,
                    textStyle: {
                        color: '#fff'
                    },
                    // itemGap: 20,
                    icon: "rect",
                    itemWidth: 12,  // 设置宽度
                    itemHeight: 12, // 设置高度
                    // right: '25',
                    top: 10
                },
                grid: {
                    top: '50',
                    left: '5%',
                    right: '5%',
                    bottom: '20',
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
                            textStyle: {
                                color: '#BDECF6',//坐标值得具体的颜色
                                fontSize: '100%'
                            }
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var unit = '吨';
                        var html = params[0].name + '<br>';
                        $.each(params, function (index, item) {
                            html += item.marker + item.seriesName + ': ' + item.value + ' ' + unit + '<br>';
                        });
                        return html;
                    }
                },
                series: seriesData,
                color: colors
            };

            chart01.setOption(option01);


        },


        /**
         * @description:  渲染select， 
         * @return: {void}
         */
        renderSelect: function (obj) {

            var defaultObj = {
                // el: '#demo1',

                // 字段映射
                prop: {
                    name: 'name',
                    value: 'value',
                },

                options: [],

            };
            var _obj = $.extend(true, defaultObj, obj);

            var html = '';

            $.each(_obj.options, function (index, item) {
                html += '<option value="' + item[_obj.prop.value] + '">' + item[_obj.prop.name] + '</option>'
            });
            $(_obj.el).html(html);
            layui.form.render();
        },

        /**
        * @description:   绑定事件
        * @param {type} 
        * @return: {void}
        */
        bindEvents: function () {
            var that = this;

            laydate.render({
                'elem': '.j-layui-date[name="dateTime"]', // 指定元素
                'theme': '#228FFE',
                value: new Date(),
                btns: ['now', 'confirm'],
                'done': function (value, date, endDate) {
                    that.searchData(); // 请求数据
                }
            });

            this.renderSelect({
                el: '.j-select[name="xzqhdm"]',
                options: [{
                    name: '广西壮族自治区',
                    value: '450000'
                }, {
                    name: '南宁市',
                    value: '450100'
                }, {
                    name: '柳州市',
                    value: '450200'
                }, {
                    name: '桂林市',
                    value: '450300'
                }, {
                    name: '梧州市',
                    value: '450400'
                }, {
                    name: '北海市',
                    value: '450500'
                }, {
                    name: '防城港市',
                    value: '450600'
                }, {
                    name: '钦州市',
                    value: '450700'
                }, {
                    name: '贵港市',
                    value: '450800'
                }, {
                    name: '玉林市',
                    value: '450900'
                }, {
                    name: '百色市',
                    value: '451000'
                }, {
                    name: '贺州市',
                    value: '451100'
                }, {
                    name: '河池市',
                    value: '451200'
                }, {
                    name: '来宾市',
                    value: '451300'
                }, {
                    name: '崇左市',
                    value: '451400'
                }]
            })



            // 监听select
            form.on('select(xzqhdm)', function () {
                that.searchData(); // 请求数据
            })


            // 防抖函数
            var debounce = aoUtils.debounce();

            $(window).resize(function () {
                debounce(function () {
                    that.lineChart1.resize && that.lineChart1.resize();
                    that.lineChart2.resize && that.lineChart2.resize();
                    that.barChart1.resize && that.barChart1.resize();
                    that.barChart2.resize && that.barChart2.resize();
                    that.barChart3.resize && that.barChart3.resize();

                }, 200);
            });

            $('#tab').on('click', '.j-tab-item', function () {
                var id = $(this).attr('data-id');
                $('#tab .j-tab-item').removeClass('is-active');
                $(this).addClass('is-active');
                that.curTab = id;
                that.renderLine2()
            })


        },

    };

    inst = new Main();



});




