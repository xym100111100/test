
layui.use(['form', 'laydate', 'layer'], function () {
    var form = layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;

    var inst;

    function Main() {

        this.resData = null; // 后台返回的所有数据

        // 初始化折线图
        this.lineChart = echarts.init(document.getElementById('lineChart'));
        // 初始化柱图
        this.barChart = echarts.init(document.getElementById('barChart'));
        // 初始化饼图
        this.pieChart1 = echarts.init(document.getElementById('pieChart1'));
        this.pieChart2 = echarts.init(document.getElementById('pieChart2'));

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
            var url = './json/inventoryAnalyst.json';
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
                        that.renderLine(data.lineData);
                        that.renderBar(data.barData);
                        that.renderPie1(data.pieData1);
                        that.renderPie2(data.pieData2);
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
        renderLine: function (data) {
            var chart01 = this.lineChart;
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
                            "type": "line",
                            "data": [],
                        };
                        seriesData.push(seriesDataObj[item2]);
                    }
                    seriesDataObj[item2].data.push(item[item2])

                });
            });

            // ==================================================================================================

            // 设置颜色
            var itemStyleArr = [{
                normal: {
                    color: '#4FC2FF',
                    lineStyle: {
                        color: "#4FC2FF",
                        width: 1
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: 'rgba(255, 255, 255, 0)'
                        }, {
                            offset: 1,
                            color: '#4FC2FF'
                        }]),
                    }
                }
            }, {
                normal: {
                    color: 'rgba(102, 194, 62, 1)',
                    lineStyle: {
                        color: "rgba(102, 194, 62, 1)",
                        width: 1
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: 'rgba(255, 255, 255, 0)'
                        }, {
                            offset: 1,
                            color: 'rgba(102, 194, 62, 1)'
                        }]),
                    }
                }
            }]
            $.each(seriesData, function (index, item) {
                item.itemStyle = itemStyleArr[index];
            });


            // console.log(JSON.stringify(series1));
            var option01 = {
                legend: {
                    data: arr2,
                    textStyle: {
                        color: '#fff'
                    },
                    // itemGap: 20,
                    // icon: "rect",
                    // itemWidth: 12,  // 设置宽度
                    // itemHeight: 12, // 设置高度
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
                // color: colors
            };

            chart01.setOption(option01);


        },

        /**
        * @description:  渲染柱图
        * @param {type} 
        * @return: {void}
        */
        renderBar: function (data) {
            var chart01 = this.barChart;

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
                            // "barWidth": 20,
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
                        offset: 0, color: '#39DFEE' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#06C5C2' // 100% 处的颜色
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
                        offset: 0, color: '#51C5FF' //   
                    }, {
                        offset: 1, color: '#218FFD' //  
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
                        offset: 0, color: '#32E0B0' //   
                    }, {
                        offset: 1, color: '#28C289' //  
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
                            rotate: 30, //  
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
                        var colors = ['#06C5C2', '#218FFD', '#28C289'];
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
   * @description:  渲染饼图
   * @param {type} 
   * @return: {void}
   */
        renderPie1: function (data) {
            var chart01 = this.pieChart1;

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

                tooltip: {
                    trigger: 'item',
                    // formatter: "{a} {b} : {c} ({d}%)",
                    formatter: function (params) {
                        return params.marker + params.name + ': ' + params.value + '吨 (' + params.percent + '%)';
                    }
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    // bottom: '10%',
                    // left: 'center',
                    left: 20,
                    top: 'center',
                    itemGap: 20,
                    icon: 'pin',
                    data: legendData,
                    textStyle: {
                        color: '#fff',
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
                        return name + ' {' + richName + '|' + tarValue + '吨}';
                    },

                },
                color: colorList,
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: [60, 90],
                        center: ['70%', '50%'],
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
         * @description:  渲染饼图
         * @param {type} 
         * @return: {void}
         */
        renderPie2: function (data) {
            var chart01 = this.pieChart2;

            var seriesData = data;
            var legendData = [];
            var colorList = ['#B968ED', '#FDCF47', '#5BD792', '#F16980', '#449FFF'];

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
                        return params.marker + params.name + ': ' + params.value + '吨 (' + params.percent + '%)';
                    }
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    // bottom: '10%',
                    // left: 'center',
                    left: 20,
                    top: 'center',
                    itemGap: 20,
                    icon: 'pin',
                    data: legendData,
                    textStyle: {
                        color: '#fff',
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
                        return name + ' {' + richName + '|' + tarValue + '吨}';
                    },

                },
                color: colorList,
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: [60, 90],
                        center: ['70%', '50%'],
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
                    that.lineChart.resize();
                    that.barChart.resize();
                    that.pieChart1.resize();
                    that.pieChart2.resize();
                }, 200);
            });



        },

    };

    inst = new Main();



});




