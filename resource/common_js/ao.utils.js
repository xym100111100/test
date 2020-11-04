/*
 * @Author: your name
 * @Date: 2020-01-02 11:33:33
 * @LastEditTime: 2020-03-19 16:14:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \粮食局财务管理\resource\common_js\ao.utils.js
 */
(function () {
    var conflict = window.aoUtils; // 命名冲突，保存全局变量

    // loading DOM,依赖JQuery和layui
    var Loading = function (parent, type, opt) {

        // layui写法
        // var loading = layer.load(2);
        // layer.close(loading);

        var str;

        if (type == '10') {
            str = '<div  style="text-align:center;">' +
                '<i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>' +
                '</div>';
        } else {
            str = '<div class=" layui-layer-loading  ">' +
                '    <div class="layui-layer-content layui-layer-loading' + (type || 0) + '" style="margin:0 auto;"></div><span class="layui - layer - setwin"></span>' +
                '</div>';
        }
        this.$el = $(str);

        var defaultOpt = {
            // 默认垂直居中，使用absolute
            'middle': true,
            // 距离顶部距离，如果top不为null，则不适应绝对定位
            'top': null,
            'zIndex': 1
        };

        this.opt = $.extend(true, defaultOpt, opt || {});
        var parentPosition = $(parent).css('position');

        if (this.opt.top !== null) {
            this.$el.css({
                'position': 'relative',
                'top': this.opt.top
            });
        } else if (this.opt.middle) {
            // 垂直居中
            if (parentPosition === 'static') {
                $(parent).css('position', 'relative');
            }
            this.$el.css({
                'position': 'absolute',
                'top': '50%',
                'left': '50%',
                'marginTop': '-16px',
                'marginLeft': '-16px'
            });
        }
        $(parent).append(this.$el);
    };

    Loading.prototype = {

        'remove': function () {
            this.$el.remove();
        }
    };

    /**
     * @description: ajax错误提示，包括error回调和success中的错误
     * @param {type}
     * @return:
     */
    function HttpError() {
    }

    HttpError.prototype = {

        'constructor': HttpError,

        'msgs': {
            '0': '您当前网络状况不好,请稍后再试!',
            '400': '程序请求出现语法错误。',
            '401': '程序试图未经授权访问受密码保护的页面。应答中会包含一个WWW-Authenticate头，浏览器据此显示用户名字/密码对话框，然后在填 写合适的Authorization头后再次发出请求。',
            '403': '资源不可用。服务器理解程序的请求，但拒绝处理它。通常由于服务器上文件或目录的权限设置导致。',
            '404': '网络开小差了~~~请您稍后刷新~~~',
            '405': '请求方法（GET、POST、HEAD、DELETE、PUT、TRACE等）对指定的资源不适用。（HTTP 1.1新）',
            '406': '指定的资源已经找到，但它的MIME类型和程序在Accpet头中所指定的不兼容。（HTTP 1.1新）',
            '407': '类似于401，表示程序必须先经过代理服务器的授权。（HTTP 1.1新）',
            '408': '在服务器许可的等待时间内，程序一直没有发出任何请求。程序可以在以后重复同一请求。（HTTP 1.1新）',
            '409': '请求和资源的当前状态相冲突，请求不能成功。（HTTP 1.1新）',
            '410': '所请求的文档已经不再可用，而且服务器不知道应该重定向到哪一个地址。它和404的不同在于，返回407表示文档永久地离开了指定的位置，而 404表示由于未知的原因文档不可用。（HTTP 1.1新）',
            '411': '服务器不能处理请求，除非程序发送一个Content-Length头。（HTTP 1.1新）',
            '412': '请求头中指定的一些前提条件失败（HTTP 1.1新）。',
            '413': '目标文档的大小超过服务器当前愿意处理的大小。如果服务器认为自己能够稍后再处理该请求，则应该提供一个Retry-After头（HTTP 1.1新）。',
            '414': '请求过长（HTTP 1.1新）。',
            '416': '服务器不能满足程序在请求中指定的Range头。（HTTP 1.1新）',
            '500': '出错了，请您稍后再试~~~',
            '501': '出错了，请您稍后再试~~~',
            '502': '出错了，请您稍后再试~~~',
            '503': '出错了，请您稍后再试~~~',
            '504': '出错了，请您稍后再试~~~',
            '505': '出错了，请您稍后再试~~~'
        },

        'getMsg': function (code) {
            return this.msgs[code] ? this.msgs[code] : '出错了，请您稍后再试~~~';
        },

        /**
         * @description: ajax的error回调
         * @param {Object|string} xhr对象或者msg字符串
         * @param {Object} layui的layer弹出层对象
         * @return:
         */
        'failMsg': function (xhr, layer) {
            var msg = '';

            if (typeof xhr === 'string') {
                msg = xhr || '出错了，请您稍后再试~~~';
            } else if (typeof xhr === 'object') {
                if (xhr.statusText === 'timeout') {
                    msg = '请求超时，请您稍后再试~~~';
                } else {
                    var code = xhr ? xhr.status : null;

                    msg = this.getMsg(code);
                }
            } else {
                msg = '出错了，请您稍后再试~~~';
            }
            layer.msg(msg, { 'time': 3000, 'icon': 2 });
        }
    };
    var instHttpError = new HttpError();

    function Utils() {
    }

    Utils.prototype = {

        'constructor': Utils,

        /**
         * @description: 重新设置全局变量名，解决命名冲突
         * @param {string} name 变量名
         * @return:
         */
        'noConflict': function (name) {
            window[name] = this;
            window.aoUtils = conflict;
        },

        /**
         * @description: 校验字符串，只要是数字（包含正负整数，0以及正负浮点数）就返回true
         * @param {string}
         * @return: {boolean}
         */
        'isNumber': function (val) {
            var regPos = /^\d+(\.\d+)?$/; // 非负浮点数
            var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数

            if (regPos.test(val) || regNeg.test(val)) {
                return true;
            }
            return false;
        },

        /**
         * @description: 获取location中的参数，一般用于获取页面类型
         * @param {string}  获取页面类型 getQueryString("viewType") 页面类型，2:查看 3：查看原始表单，不能提交 其他：填报，可提交
         * @return:
         */
        'getQueryString': function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var r = window.location.search.substr(1).match(reg);

            if (r != null) {
                return decodeURI(r[2]);
            }
            return null;
        },

        /**
         * @description: 格式化日期
         * @param {Date} 日期对象
         * @param {string=} sep 日期分隔符
         * @param {boolen=} hasTime 是否显示时分秒
         * @return:
         */
        'formatDateTime': function (date, sep, hasTime) {
            sep = sep || '-';
            hasTime = hasTime || false;
            var y = date.getFullYear();
            var m = date.getMonth() + 1;

            m = m < 10 ? '0' + m : m;
            var d = date.getDate();

            d = d < 10 ? '0' + d : d;
            var h = date.getHours();

            h = h < 10 ? '0' + h : h;
            var minute = date.getMinutes();

            minute = minute < 10 ? '0' + minute : minute;
            var second = date.getSeconds();

            second = second < 10 ? '0' + second : second;
            var time = hasTime ? ' ' + h + ':' + minute + ':' + second : '';

            return y + sep + m + sep + d + time;
        },

        /**
         * @description: 格式化日期
         * @param {Date} 日期对象
         * @param {string=} formater 格式化模板
         * @return:
         */
        'formatDate': function (date, formater) {
            formater = formater || 'yyyy-MM-dd';
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var fullMonth = m < 10 ? '0' + m : m;
            var d = date.getDate();
            var fullDate = d < 10 ? '0' + d : d;
            var h = date.getHours();
            var fullHours = h < 10 ? '0' + h : h;
            var minute = date.getMinutes();
            var fullMinute = minute < 10 ? '0' + minute : minute;
            var second = date.getSeconds();
            var fullSecond = second < 10 ? '0' + second : second;
            var weekdayIndex = date.getDay();// 获取星期
            var weekday = ['日', '一', '二', '三', '四', '五', '六'];
            var curWeek = weekday[weekdayIndex];
            var result = formater;

            if (/yyyy/g.test(result)) {
                result = result.replace(/yyyy/g, y);
            }
            if (/MM/g.test(result)) {
                result = result.replace(/MM/g, fullMonth);
            } else {
                result = result.replace(/M/g, m);
            }
            if (/dd/g.test(result)) {
                result = result.replace(/dd/g, fullDate);
            } else {
                result = result.replace(/d/g, d);
            }
            if (/HH/g.test(result)) {
                result = result.replace(/HH/g, fullHours);
            } else {
                result = result.replace(/H/g, h);
            }
            if (/mm/g.test(result)) {
                result = result.replace(/mm/g, fullMinute);
            } else {
                result = result.replace(/m/g, minute);
            }
            if (/ss/g.test(result)) {
                result = result.replace(/ss/g, fullSecond);
            } else {
                result = result.replace(/s/g, second);
            }
            if (/w/g.test(result)) {
                result = result.replace(/w/g, curWeek);
            }
            return result;
        },

        /**
         * 年月日时间格式化
         * @param date
         * @return {string}
         */
        'formatDateByChinese': function (date) {
            var dt = date ? new Date(date) : new Date();
            var y = dt.getFullYear().toString();
            var m = (dt.getMonth() + 1).toString().padStart(2, '0');
            var d = dt.getDate().toString().padStart(2, '0');

            return `${y}年${m}月${d}日`;
        },

        /**
         * @description: 去掉字符串前后空格
         * @param {string} s
         * @return:
         */
        'trim': function (s) {
            return s.replace(/(^\s*)|(\s*$)/g, '');
        },

        /**
         * @description: 防抖
         * @return:{Function}
         * @param {Function} return.method
         * @param {number} return.delay 清除定时器的时间间隔
         * @example: var fn=debounce(); window.onresize=function(){fn(method,delay);};
         */
        'debounce': function () {
            var timer = null;

            return function (method, delay) {
                var context = this;
                var args = arguments;

                clearTimeout(timer);
                timer = setTimeout(function () {
                    method.apply(context, args);
                }, delay);
            };
        },

        /**
         * @description: 固定时间必须执行
         * @return:{Function}
         * @param {Function} return.method
         * @param {number} return.delay 清除定时器的时间间隔
         * @param {number} return.duration 固定执行的时间间隔
         * @example: var fn=throttle(); window.onresize=function(){fn(method,delay,duration);};
         */
        'throttle': function () {
            var timer = null;
            var begin = new Date();

            return function (method, delay, duration) {
                var context = this;
                var args = arguments;
                var current = new Date();

                clearTimeout(timer);
                if (current - begin >= duration) {
                    method.apply(context, args);
                    begin = current;
                } else {
                    timer = setTimeout(function () {
                        method.apply(context, args);
                    }, delay);
                }
            };
        },

        /**
         * @description: 创建一个loading DOM，依赖JQuery，layui
         * @param {type}
         * @return:
         */
        'loading': function (parent, type, opt) {
            return new Loading(parent, type, opt);
        },

        /**
         * @description: ajax的error回调
         * @param {Object|string} xhr对象或者msg字符串
         * @param {Object} layui的layer弹出层对象
         * @return:
         */
        'failMsg': function (xhr, layer) {
            instHttpError.failMsg(xhr, layer);
        },

        /**
         * @description: 判断浏览器类型
         * @param {type}
         * @return:
         */
        'browser': function () {
            // 取得浏览器的userAgent字符串
            var userAgent = navigator.userAgent;
            var isOpera = userAgent.indexOf('Opera') > -1;

            // 判断是否Opera浏览器
            if (isOpera) {
                return 'Opera';
            }

            // 判断是否Firefox浏览器
            if (userAgent.indexOf('Firefox') > -1) {
                return 'FF';
            }

            if (userAgent.indexOf('Chrome') > -1) {
                return 'Chrome';
            }

            // 判断是否Safari浏览器
            if (userAgent.indexOf('Safari') > -1) {
                return 'Safari';
            }

            // 判断是否IE6-9浏览器
            if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
                if (userAgent.indexOf('MSIE 6.0') > -1) {
                    return 'IE6';
                }
                if (userAgent.indexOf('MSIE 7.0') > -1) {
                    return 'IE7';
                }
                if (userAgent.indexOf('MSIE 8.0') > -1) {
                    return 'IE8';
                }
                if (userAgent.indexOf('MSIE 9.0') > -1) {
                    return 'IE9';
                }
                if (userAgent.indexOf('MSIE 10.0') > -1) {
                    return 'IE10';
                }
                return 'IE';
            }

            // 判断是否IE10-11浏览器
            if (userAgent.toLowerCase().indexOf('trident') > -1 && userAgent.indexOf('rv') > -1 && !isOpera) {
                if (userAgent.indexOf('rv:10.0') > -1) {
                    return 'IE10';
                }
                if (userAgent.indexOf('rv:11.0') > -1) {
                    return 'IE11';
                }
                return 'IE11';
            }

            return userAgent;
        },

        /**
         * @description: 获取地址栏的参数
         * @param {type}
         * @return:
         */
        'getLocationSearch': function () {
            var search = decodeURIComponent(location.search);
            var pairs = search.slice(1).split('&');
            var result = {};

            for (var index = 0; index < pairs.length; index++) {
                var pair = pairs[index];

                if (pair && pair.indexOf('=') !== -1) {
                    pair = pair.split('=');
                    // 兼容写法
                    result[pair[0]] = pair[1] || '';
                }
            }
            return JSON.parse(JSON.stringify(result));
        },

        /**
         * @description: 转换时间格式
         * @param {type}
         * @return:
         */
        'timestampToTime': function (timestamp) {
            var date = new Date(timestamp);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

            return Y + M + D;
        },

        /**
         * @description: 获取图片的信息，主要是获取原始尺寸
         * @param {string}  url
         * @return:{Object} img实例 img.width img.height
         */
        'getImageInfo': function (url, onSuccess, onError) {
            var img = new Image();

            img.src = url;
            if (img.complete) {
                // 如果图片被缓存，则直接返回缓存数据
                onSuccess && onSuccess(img);
            } else {
                img.onload = function () {
                    onSuccess && onSuccess(img);
                };

                img.error = function () {
                    onError && onError();
                };
            }
        },

        /**
         * @description:  图片放大预 class有imgShow的图片可以放大,使用事件委托

         * @param {type}
         * @return:
         */
        'enlargeImg': function (src, layer) {
            // 占位图片的class cmnpub-placeholder-img 不能写在public.css,因为不同项目的静态文件目录不同

            var loading = layer.load(2);

            this.getImageInfo(src, function (img) {
                // 成功回调
                layer.close(loading);

                var width = img.width;
                var height = img.height;

                // 最大放大屏幕的80%，不使用滚动条
                var maxWidth = $(window).width() * 0.9;
                var maxHeight = $(window).height() * 0.9;

                var scale = width / height;
                var windowScale = maxWidth / maxHeight;// 屏幕比例

                var finalWidth; // 最终使用的宽高
                var finalHeight;

                if (scale > windowScale) {
                    // 图片比较宽，最大宽度使用屏幕宽度
                    finalWidth = width > maxWidth ? maxWidth : width;
                    finalHeight = finalWidth / scale;

                } else {
                    // 图片比较高，最大高度使用屏幕高度
                    finalHeight = height > maxHeight ? maxHeight : height;
                    finalWidth = finalHeight * scale;
                }

                // var temp = '<div class="cmnpub-placeholder-img" ><img src="{{src}}" style="width:{{width}}px;height:{{height}}px" /></div>';
                var temp = '<div class="j-img-wrap cmnpub-placeholder-img" ></div>';
                var contentStr = temp.replace(/\{\{src\}\}/g, src)
                    .replace(/\{\{width\}\}/g, finalWidth)
                    .replace(/\{\{height\}\}/g, finalHeight);

                var $img = $(img);

                $img.css({
                    'width': finalWidth,
                    'height': finalHeight
                });

                // 放大预览图片
                layer.open({
                    'type': 1,
                    'title': false,
                    'closeBtn': 1,
                    'shadeClose': true,
                    'area': [finalWidth + 'px', finalHeight + 'px'], // 宽高
                    'content': contentStr,
                    'success': function (layero) {
                        // console.log('layero:', layero);
                        $(layero).find('.j-img-wrap').append($img);

                    },
                    'cancel': function (index, layero) {
                        layer.closeAll();
                    },
                    'end': function () {
                        layer.closeAll();
                    }
                });

            }, function () {
                // 失败回调
                layer.close(loading);
            });
        },

        /**
         * @description:  // textarea高度自适应
         * @param {type} elem textarea原生对象
         * @return: {void}
         */
        'textareaAutoHeight': function (elem) {
            $(elem).on('input', function () {
                $(this).height('auto');
                $(this).css({
                    'overflow-y': 'hidden'
                }).innerHeight(elem.scrollHeight);
            });
            $(elem).trigger('input');// 默认触发
        },

        /**
        * @description:  获取表单填写的数据
        * @param {type}
        * @return: {void}
        */
        'getFormData': function (formElem) {
            // 表单元素的name对应后台字段
            // input[text] textarea select 一律加上 j-input 的class
            // radio 一律加上 j-radio 的class
            // checkbox 一律加上 j-check 的class
            // 只有checkbox的其他 的name才可以使用下划线

            var $form = $(formElem);

            var obj = {};

            // 获取input[text] textarea 的值
            $form.find('.j-input').each(function () {
                var value = $(this).val();
                var prop = $(this).attr('name'); // input的name属性就是字段名
                var isExplain = $(this).attr('data-explain') === '1';// 该input是否是某个checkbox的说明

                if (!isExplain) {
                    obj[prop] = value;
                }
            });

            // 获取select的值
            $form.find('.j-select').each(function () {
                var value = $(this).val();
                var prop = $(this).attr('name'); // input的name属性就是字段名

                obj[prop] = value;
            });

            // 获取radio的值
            $form.find('.j-radio').each(function () {
                var isChecked = $(this).prop('checked');
                var value = $(this).val();
                var prop = $(this).attr('name'); // input的name属性就是字段名

                obj[prop] = obj[prop] || ''; // 默认空字符串
                if (isChecked) {
                    obj[prop] = value;
                }
            });

            // 获取checkbox的值
            $form.find('.j-checkbox').each(function () {
                var isChecked = $(this).prop('checked');
                var value = $(this).val();
                var prop = $(this).attr('name'); // input的name属性就是字段名
                var isExplain = $(this).attr('data-explain') === '1';// 该checkbox是否有input说明

                obj[prop] = obj[prop] || []; // 默认空数组
                if (isChecked) {
                    if (!isExplain) {
                        obj[prop].push(value);
                    } else {
                        // 如果有对应的说明
                        var explainVal = $form.find('.j-input[name="' + prop + '_' + value + '"]').val();

                        obj[prop].push(value + '_' + explainVal);
                    }

                }
            });

            // 获取date range 的值
            $form.find('.j-layui-date').each(function () {
                var value = $(this).val();
                var range = $(this).attr('data-range');

                if (range) {
                    // 如果是时间范围
                    var prop1 = $(this).attr('data-prop1'); // 开始时间
                    var prop2 = $(this).attr('data-prop2'); // 结束时间
                    var arr = (value || '').split(range);

                    arr = arr.length > 1 ? arr : ['', ''];

                    obj[prop1] = $.trim(arr[0]);
                    obj[prop2] = $.trim(arr[1]);
                } else {
                    var prop = $(this).attr('name'); // input的name属性就是字段名

                    obj[prop] = value;
                }

            });

            return obj;
        },

        /**
         * @description:  设置表单数据
         * @param {type} obj
         * @return: {void}
         */
        'setFormData': function (formElem, obj) {
            var $form = $(formElem);

            // 设置span/div等
            $form.find('.j-text').each(function () {
                var prop = $(this).attr('name'); // span/div的name属性就是字段名
                var text = obj[prop];

                $(this).text(text);
            });

            // 设置input[text] textarea 的
            $form.find('.j-input').each(function () {
                var prop = $(this).attr('name'); // input的name属性就是字段名

                $(this).val(obj[prop]);
            });

            // 设置 select的值
            $form.find('.j-select').each(function () {
                var prop = $(this).attr('name'); // input的name属性就是字段名

                $(this).val(obj[prop]);
            });

            // 设置radio的值
            $form.find('.j-radio').each(function () {
                var value = $(this).val();
                var prop = $(this).attr('name'); // input的name属性就是字段名

                if (value === obj[prop]) {
                    $(this).prop('checked', true);
                }
            });

            // 设置checkbox的值
            $form.find('.j-checkbox').each(function () {
                var that = this;
                var value = $(this).val();
                var prop = $(this).attr('name'); // input的name属性就是字段名
                var arr = obj[prop] || [];
                var isExplain = $(this).attr('data-explain') === '1';// 该checkbox是否有input说明

                if (isExplain) {
                    // 如果有input说明
                    $.each(arr, function (idx2, item2) {
                        // item2的值实例： 8_其他说明~~~
                        var valArr = item2.split('_');
                        var checkboxVal = valArr.shift();// 对应的checkbox值
                        var inputVal = valArr.join('_');

                        if (checkboxVal === value) {
                            $(that).prop('checked', true);
                        }

                        // 设置对应的input值
                        $form.find('.j-input[name="' + prop + '_' + checkboxVal + '"]').val(inputVal);

                    });
                } else {
                    // 如果没有input说明
                    if (arr.indexOf(value) > -1) {
                        $(this).prop('checked', true);
                    }
                }

            });

            // 设置时间range的值
            $form.find('.j-layui-date').each(function () {
                var range = $(this).attr('data-range');
                var prop = $(this).attr('name'); // input的name属性就是字段名

                if (range) {
                    // 如果是时间范围
                    var prop1 = $(this).attr('data-prop1'); // 开始时间的字段名
                    var prop2 = $(this).attr('data-prop2'); // 结束时间的字段名
                    var val1 = $.trim(obj[prop1] || '');
                    var val2 = $.trim(obj[prop2] || '');
                    var value = '';

                    if (val1 && val2) {
                        value = val1 + ' ' + range + ' ' + val2;
                    }

                    $(this).val(value);

                } else {
                    $(this).val(obj[prop]);

                }

            });

            // 设置a标签 文字说明和下载链接
            $form.find('.j-file').each(function () {

                var prop = $(this).attr('name');
                var prop2 = $(this).attr('data-file');

                var name = obj[prop] || '';

                $(this).text(name).attr('download', name).attr('href', obj[prop2] || '#');
            });

            // 执行render才可以让select、radio、checkbox选中
            layui.form.render();
        },

        /**
         * @description:  设置只读
         * @param {type}
         * @return: {void}
         */
        'setReadonly': function (formElem, flag) {
            var $form = $(formElem);

            // 设置input[text] textarea
            $form.find('.j-input').each(function () {
                $(this).prop('readonly', flag);
            });

            // 设置select
            $form.find('.j-select').each(function () {
                $(this).prop('disabled', flag);
            });

            // 设置radio
            $form.find('.j-radio').each(function () {
                $(this).prop('disabled', flag);
            });

            // 设置checkbox
            $form.find('.j-checkbox').each(function () {
                $(this).prop('disabled', flag);
            });

            // 设置时间控件
            $form.find('.j-layui-date').each(function () {
                $(this).prop('disabled', flag);
            });

            layui.form.render();
        },

        /**
        * 设置为货币格式，无法转换为数值格式的原样返回
        * param {number|string} val
        * param {number|string} exactDigit 精确小数位数，如果不传，保留原值
        * return {string}
        */
        'currencyFormat': function (val, exactDigit) {
            var num = val;
            var returnOrg = false; // 是否原样返回
            var decimal; // 小数部分
            var result;

            if (isNaN(num) || val === undefined || val === null || typeof val === 'string' && $.trim(val) == '') {
                returnOrg = true;
            }
            if (returnOrg) {
                result = val; // 无法转换为数值，原样返回
            } else {

                // var negative = num < 0 ? "-" : ""; //保存正负符号
                var negative = ''; // 正负符号

                result = negative + String(num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');

                if (exactDigit !== undefined) {
                    decimal = String(val).split(/e/i)[0].split('.')[1];
                    if (decimal !== undefined) {
                        var bLen = exactDigit - decimal.length; // 补零的长度

                        for (var i = 0; i < bLen; i++) {
                            result += '0';
                        }
                    } else {
                        result += '.00';
                    }

                }

            }
            return result;
        },

        /**
       * @description: 合并layui表格的单元格
       * @param res, curr, count 都是done回调的参数
       * @param {string|Element} tableWrapper 表格的父元素
       * @param {Array} colVal 值相同的时候合并 ['id','roleId'] 需要id和roleId相同才合并列
       * @param {Array} colName 需要合并的列名称 ['roleName', 'percent']
       * 用法示例
       *  'done': function (res, curr, count) {
                  aoUtils.mergeTableCol2(res, '#tableWrapper', ['id','roleId'], ['roleName', 'percent']);
              }
       * @return:
       */
        'mergeTableCol': function (res, tableWrapper, colVal, colName) {
            var data = res.data;

            var obj = {};

            if (colVal.length && colName.length) {

                $.each(data, function (idx1, item1) {
                    var prop = '';

                    $.each(colVal, function (idx2, item2) {
                        prop += '_' + item1[item2];
                    });

                    obj[prop] = obj[prop] || {
                        'num': 0, // 数量
                        'indexs': [] // 下标集合
                    };

                    obj[prop].num++;
                    obj[prop].indexs.push(idx1);
                });

                var $trArr = $(tableWrapper).find('.layui-table-body>.layui-table').find('tr');// 所有行

                $.each(obj, function (key, cell) {
                    $.each(cell.indexs, function (index, trIndex) {
                        if (index === 0) {
                            $.each(colName, function (i, field) {
                                $trArr.eq(trIndex).find('td[data-field="' + field + '"]').attr('rowspan', cell.num);
                            });
                        } else {
                            $.each(colName, function (i, field) {
                                $trArr.eq(trIndex).find('td[data-field="' + field + '"]').hide();
                            });
                        }
                    });
                });
            }

            return obj;

        }
    };

    window.aoUtils = new Utils();
})();