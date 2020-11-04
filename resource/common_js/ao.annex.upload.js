/*
 * @Author: your name
 * @Date: 2020-01-02 11:33:33
 * @LastEditTime: 2020-05-29 10:32:00
 * @LastEditors: Please set LastEditors
 * @Description: 附件上传 依赖layui,layui.element,layui.layer,jquery
 * @FilePath:
 */
(function () {
    var conflict = window.AoAnnexUpload; // 命名冲突，保存全局变量
    var uuid = 1;

    // 使用示例
    function example() {
        var instAnnex = new AoAnnexUpload({
            'wrapper': null,// 必填 上传附件的容器
            'url': null, // 单个文件上传的url
            'mode': 'upload',// 模式：upload：上传模式 view:查看模式（只是回显，没有上传也没有删除）
            'imgMaxSize': 4 * 1024 * 1024,
            'videoMaxSize': 4 * 1024 * 1024,
            'fileMaxSize': 200 * 1024 * 1024,
            'accept': 'file',// 所有文件
            'exts': null, // 'jpg|png|gif|bmp|jpeg'
            'multiple': true, // 多文件
            'chooseBtnType': 'type1', // 选择按钮类型 type1 type2

            // 单个文件上传时添加的参数，可以是Object，也可以是Function
            'uploadParams': function () {
                return {
                    'operator': $('#userName').val(), // 操作人
                    'annexAscriptionType': 1,// 1：志愿者项目
                    'annexAscriptionId': searchId// 主键id
                };
            },
            // 单个文件上传成功
            'onOneSuccess': function (fileIndex, file) {

            },
            // 单个文件上传失败
            'onOneError': function (fileIndex, file) {

            },
            // 所有文件上传成功
            'onAllSuccess': function (files) {

            }
        });

        var size = instAnnex.filesSize(); // 获取准备上传的文件数量（已上传成功的或者从后台回显的不会上传），只包含从本地选择的文件，不包括已上传或者回显的文件
        var annexIdList = instAnnex.getAnnexIdList();// 获取要删除的附件数组

        var size = instAnnex.annexsSize(); // 当前显示的所有附件数量，包括回显和已上传的数量

        // 上传文件
        instAnnex.uploadFiles();

        // 设置附件列表视图
        instAnnex.setFileView(obj);
    }

    function AnnexUpload(option) {
        var that = this;

        var defaultOption = {
            'wrapper': null,// 必填 上传附件的容器
            'url': null, // 单个文件上传的url
            'mode': 'upload',// 模式：upload：上传模式 view:查看模式（只是回显，没有上传也没有删除）
            'imgMaxSize': 4 * 1024 * 1024,
            'videoMaxSize': 200 * 1024 * 1024,
            'fileMaxSize': 4 * 1024 * 1024,
            'accept': 'file',// 所有文件
            'exts': null, // 'jpg|png|gif|bmp|jpeg'
            'multiple': true, // 多文件

            'onOneSuccess': null, // 单个文件上传成功
            'onOneError': null, // 单个文件上传失败
            'onAllSuccess': null, // 所有文件上传成功
            'uploadParams': null,// 单个文件上传时添加的参数，可以是Object，也可以是Function

            // layui选择文件之后的preview回调，可用于灵活判断文件是否符合要求
            'onPreview': function (index, file, result, next, stop) {
                next(); // 往下执行，必须执行
                // stop(); // 如果不往下执行，必须执行stop
            }

        };

        this.option = $.extend(true, {}, defaultOption, option);

        this.$wrapper = $(this.option.wrapper);

        this.layuiLayer = layui.layer;
        this.layuiUpload = layui.upload;

        this.files = {};// 选择的所有文件，对象
        this.filesBase64 = {};// 选择的文件的base64
        this.uploadFilesDet = {}; // 用于检测上传成功的文件数量,{fileIndex:{complete:true,total:1000,loaded:120}}

        this.annexIdList = [];// 要删除的附件id数组，修改的时候带上

        this.progressLoading = null;//

        // 初始化视图，添加进度条、按钮等元素
        this.initView();

        // 初始化文件上传
        if (this.option.mode !== 'view') {
            this.initUpload();
        }

        // 放大预览图片
        this.enlargeImg();

        // 绑定事件
        this.bindEvents();

        // 显示隐藏上传按钮
        this.refreshUpBtn();

    }

    AnnexUpload.prototype = {

        'constructor': AnnexUpload,

        /**
         * @description: 重新设置全局变量名，解决命名冲突
         * @param {string} name 变量名
         * @return:
         */
        'noConflict': function (name) {
            window[name] = this;
            window.AoAnnexUpload = conflict;
        },

        /**
         * @description:  初始化视图，添加进度条、按钮等元素
         * @return: {void}
         */
        'initView': function () {
            var html = '';

            html += this.getProgressHtml();
            var btnHtml = this.getUploadBtnHtml();
            var btnHidden = '';

            if (this.option.mode === 'view') {
                btnHidden = ' dpn ';
            }
            html += btnHtml.replace(/\{\{hidden\}\}/g, btnHidden);
            this.$wrapper.empty().append(html);
        },

        /**
         * @description:  重置部分页面数据
         * @param {type}
         * @return: {void}
         */
        'resetData': function () {
            var that = this;
            // 重置数据

            $.each(this.files, function (fileIndex) {
                delete that.files[fileIndex];
            });

            // 不可以重置base64
            // this.filesBase64 = {};// 选择的文件的base64

            this.uploadFilesDet = {}; // 用于检测上传成功的文件数量,{fileIndex:false}

            this.annexIdList = [];// 要删除的附件id数组，修改的时候带上

            // 显示隐藏上传按钮
            this.refreshUpBtn();
        },

        /**
         * @description:  设置附件列表视图
         * @param {{annexList: [type.pictureSize2]}} obj
         * @return: {void}
         */
        'setFileView': function (obj) {
            var that = this;
            // 重置数据

            this.resetData();
            this.$wrapper.find('.j-file-item').remove();
            this.$wrapper.find('.j-allfile-progress').hide();// 隐藏进度条

            // 设置附件列表
            var filesList = obj.annexList || [];
            // var bottomStyle = ' style="display:none;" ';
            // var bottomStyle = ' ';
            var bottomHidden = '';

            if (this.option.mode === 'view') {
                bottomHidden = ' dpn ';
                this.$wrapper.find('.j-choosebtn-wrapper').hide();// 隐藏上传按钮
            } else {
                this.$wrapper.find('.j-choosebtn-wrapper').show();// 显示上传按钮
            }

            var html = [];

            $.each(filesList, function (i, file) {
                var tmpl; // html模板

                if (file.annexType == 2 || file.annexType == 1) {
                    // 如果是图片文件
                    tmpl = that.getImgTmpl(); // 图片模板
                    html.push(tmpl.replace(/\{\{index\}\}/g, file.index)
                        .replace(/\{\{name\}\}/g, file.annexName)
                        .replace(/\{\{annexId\}\}/g, file.annexId)
                        .replace(/\{\{hasAnnexId\}\}/g, 1)
                        .replace(/\{\{bottomHidden\}\}/g, bottomHidden)
                        .replace(/\{\{src\}\}/g, 'fastdfs/download/image.do?filePath=' + file.annexAddress));
                } else if (file.annexType == 3) {
                    // 如果是视频文件
                    tmpl = that.getVideoTmpl(); // 视频模板
                    html.push(tmpl.replace(/\{\{index\}\}/g, file.index)
                        .replace(/\{\{name\}\}/g, file.annexName)
                        .replace(/\{\{annexId\}\}/g, file.annexId)
                        .replace(/\{\{hasAnnexId\}\}/g, 1)
                        .replace(/\{\{bottomHidden\}\}/g, bottomHidden)
                        .replace(/\{\{src\}\}/g, 'fastdfs/download/file.do?filePath=' + file.annexAddress));
                } else {
                    // 其他文件
                    tmpl = that.getFileTmpl(); // 其他文件模板
                    html.push(tmpl.replace(/\{\{index\}\}/g, file.index)
                        .replace(/\{\{annexId\}\}/g, file.annexId)
                        .replace(/\{\{hasAnnexId\}\}/g, 1)
                        .replace(/\{\{bottomHidden\}\}/g, bottomHidden)
                        .replace(/\{\{src\}\}/g, 'fastdfs/download/file.do?filePath=' + file.annexAddress)
                        .replace(/\{\{name\}\}/g, file.annexName));
                }

            });
            this.$wrapper.find('.j-choosebtn-wrapper').before(html.join(''));

            // 显示隐藏上传按钮
            this.refreshUpBtn();
        },

        /**
         * @description:  设置总进度条
         * @param {type}
         * @return: {void}
         */
        'setProgress': function (percent, isComplete) {
            this.$wrapper.find('.j-allfile-progress').show();

            // 手动改变进度条文字
            this.$wrapper.find('.j-allfile-progress .j-progress-inner').attr('lay-percent', percent);
            layui.element.init();
            layui.element.progress('allfileProgress', percent);

            if (isComplete) {
                this.$wrapper.find('.j-allfile-progress .j-progress-inner').removeClass('layui-bg-red layui-bg-blue');
            }

        },

        /**
         * @description:  设置单个进度条
         * @param {type} status 是否已经成功 success表示成功（必须是完全成功的时候才能回调）,error表示失败
         * @return: {void}
         */
        'setPerProgress': function (index, percent, status) {
            // console.log('percent:', percent);
            var $el = this.$wrapper.find('.j-file-progress[data-index="' + index + '"]');

            $el.show();

            $el.find('.layui-progress-bar').attr('lay-percent', percent);
            // console.log('percent:', percent);
            layui.element.init();
            layui.element.progress('fileProgress_' + index, percent);

            if (status === 'success') {
                $el.find('.layui-progress-bar').removeClass('layui-bg-red layui-bg-blue');
            }
            if (status === 'error') {
                $el.find('.layui-progress-bar').removeClass('layui-bg-red layui-bg-blue').addClass('layui-bg-red');
            }
        },

        /**
         * @description:  删除选择的文件(未上传)
         * @param {string} index
         * @return: {void}
         */
        'delFile': function (index) {

            delete this.files[index];
            delete this.filesBase64[index];
            this.$wrapper.find('.j-file-item[data-index="' + index + '"]').remove();
            // 显示隐藏上传按钮
            this.refreshUpBtn();
        },

        /**
         * @description:  删除文件(已上传)
         * @param {string} index
         * @return: {void}
         */
        'delFileAnnexId': function (annexId) {
            this.annexIdList.push(annexId);
            this.$wrapper.find('.j-file-item[data-annexid="' + annexId + '"]').remove();
            // 显示隐藏上传按钮
            this.refreshUpBtn();
        },

        /**
         * @description:  初始化文件上传（layui只负责选择文件，不负责上传到后台）
         * @param {type}
         * @return: {void}
         */
        'initUpload': function () {
            var that = this;
            // var uploadFileData = this.uploadFileData = {};

            this.layuiUpload.render({
                // 'elem': '#btnChooseFile', // 触发选择文件的按钮
                'elem': this.$wrapper.find('.j-btn-choosefile'),// 触发选择文件的按钮
                // 'url': basePath + '/noEncrypt/volunteerAnnexUpload', //附件上传接口
                'auto': false,
                // 'size': 100000,
                'accept': this.option.accept,
                'exts': this.option.exts,
                'multiple': this.option.multiple,
                // 'bindAction': '#btnUploadFile', // 触发上传的按钮
                // 'data': uploadFileData,
                'progress': function (e, percent) {
                    // 不支持单个文件上传显示
                    // console.log('percent:', percent);
                    // // element.progress('progressBar', percent + '%');
                    // that.setProgress(percent + '%');
                    // if (percent === 100) {

                    // }

                },
                'before': function (obj) {
                    // this.data.params = JSON.stringify(uploadFileData);
                },
                'choose': function (obj) {

                    // 获取文件队列 files是对象
                    // that.files = this.files = obj.pushFile(); // 返回所有文件（包括之前选择的）
                    that.files = obj.pushFile(); // 返回所有文件（包括之前选择的）
                    // console.log('that.files :', that.files );

                    // $('.j-files-wrapper .j-file-item').empty(); // 清空

                    // 读取本地文件 遍历files
                    obj.preview(function (index, file, result) {

                        that.option.onPreview(index, file, result, function () {

                            if (file.type.indexOf('image') > -1) {

                                // 如果是图片文件
                                if (file.size > that.option.imgMaxSize) {
                                    delete that.files[index];
                                    aoUtils.failMsg('图片最大不能超过' + that.option.imgMaxSize / (1024 * 1024) + 'M', that.layuiLayer);
                                    return;
                                }

                            } else if (file.type.indexOf('video') > -1) {
                                // 如果是视频文件
                                if (file.type.indexOf('video') > -1 && file.size > that.option.videoMaxSize) {
                                    delete that.files[index];
                                    aoUtils.failMsg('视频最大不能超过' + that.option.videoMaxSize / (1024 * 1024) + 'M', that.layuiLayer);
                                    return;

                                }
                            } else {
                                // 其他文件
                                if (file.size > that.option.fileMaxSize) {
                                    delete that.files[index];
                                    aoUtils.failMsg('文件最大不能超过' + that.option.fileMaxSize / (1024 * 1024) + 'M', that.layuiLayer);
                                    return;
                                }
                            }

                            // console.log('index:', index);
                            // console.log('file:', file);
                            // console.log('type:', file.type);

                            // 如果不是多文件上传，则先清空已选择的文件，再放入当前文件
                            if (!that.option.multiple) {
                                $.each(that.files, function (fileIndex) {
                                    delete that.files[fileIndex];
                                });
                                that.$wrapper.find('.j-file-item').remove();
                                that.files[index] = file;
                            }

                            that.filesBase64[index] = result;

                            var html = '';
                            var tmpl; // html模板

                            if (file.type.indexOf('image') > -1) {
                                // 如果是图片文件
                                tmpl = that.getImgTmpl(); // 图片模板
                                html = tmpl.replace(/\{\{index\}\}/g, index)
                                    .replace(/\{\{name\}\}/g, file.name)
                                    .replace(/\{\{src\}\}/g, result);
                            } else if (file.type.indexOf('video') > -1) {

                                // 如果是视频文件
                                tmpl = that.getVideoTmpl(); // 图片模板
                                html = tmpl.replace(/\{\{index\}\}/g, index)
                                    .replace(/\{\{name\}\}/g, file.name)
                                    .replace(/\{\{src\}\}/g, result);
                            } else {
                                // 其他文件
                                tmpl = that.getFileTmpl(); // 其他文件模板
                                html = tmpl.replace(/\{\{index\}\}/g, index)
                                    .replace(/\{\{name\}\}/g, file.name)
                                    .replace(/\{\{src\}\}/g, result);

                            }

                            that.$wrapper.find('.j-choosebtn-wrapper').before(html);
                            // 显示隐藏上传按钮
                            that.refreshUpBtn();
                        }, function () {

                            // 删除文件
                            delete that.files[index];
                            // base64必须存起来
                            that.filesBase64[index] = result;

                            // 显示隐藏上传按钮
                            that.refreshUpBtn();
                        });

                    });

                },
                'allDone': function (obj) {
                    // 当文件全部被提交后，才触发
                    // console.log(obj.total); // 得到总文件数
                    // console.log(obj.successful); // 请求成功的文件数
                    // console.log(obj.aborted); // 请求失败的文件数
                },
                'done': function (res, index, upload) {
                }
            });
        },

        // 某图片放大预览 class有imgShow的图片可以放大,使用事件委托
        'enlargeImg': function () {
            var that = this;

            this.$wrapper.on('click', '.j-upload-enlargeimg', function () {
                var width = $(this).width();
                var height = $(this).height();
                var scaleWH = width / height;
                var bigH = 600;
                var bigW = scaleWH * bigH;

                if (bigW > 900) {
                    bigW = 900;
                    bigH = bigW / scaleWH;
                }
                // 放大预览图片
                that.layuiLayer.open({
                    'type': 1,
                    'title': false,
                    'closeBtn': 1,
                    'shadeClose': true,
                    'area': [bigW + 'px', bigH + 'px'], // 宽高
                    'content': '<img width=\'' + bigW + '\' height=\'' + bigH + '\' src=\'' + $(this).attr('src') + '\'  />',
                    'cancel': function (index, layero) {
                        that.layuiLayer.closeAll();
                    },
                    'end': function () {
                        that.layuiLayer.closeAll();
                    }
                });
            });
        },

        /**
         * @description:  description
         * @param {type}
         * @return: {void}
         */
        'bindEvents': function () {
            var that = this;

            // 删除文件按钮-事件委托
            this.$wrapper.on('click', '.j-file-del-btn', function () {
                var index = $(this).attr('data-index');
                var hasAnnexId = $(this).attr('data-hasannexid'); // 是否存在id，是则说明已经上传
                var annexId = $(this).attr('data-annexid');

                // console.log('删除:', index);
                if (hasAnnexId == 1) {
                    // 已上传的删除
                    that.delFileAnnexId(annexId);
                } else {
                    // 未上传的删除
                    that.delFile(index);
                }
            });

        },

        /**
         * @description:  上传所有文件
         * @param {string}
         * @return: {void}
         */
        'uploadFiles': function () {
            var that = this;
            var size = this.filesSize();// 要上传的文件数量

            this.uploadFilesDet = {}; // 存储上传成功状态
            this.triggerAllUploadSuccessed = false;// 防止多次触发成功回调

            if (!size) {
                // 如果没有文件要上传
                this.onAllFileUploadSuccess();
                return;
            }
            this.progressLoading = aoUtils.loading(this.$wrapper.find('.j-allfile-progress'), 10);
            console.log('this.files:', this.files);
            $.each(this.files, function (fileIndex, file) {
                console.log('fileIndex:', fileIndex);
                that.$wrapper.find('.j-allfile-progress').show();

                that.uploadFilesDet[fileIndex] = {
                    'total': file.size,
                    'loaded': 0,
                    'complete': false,
                    'isError': false
                };
                // console.log('fileIndex:', fileIndex);
                // console.log('file:', file);
                that.uploadPerFile(fileIndex, file);
            });

        },

        /**
         * @description:  检测上传完成度
         * @param {type}
         * @return: {void}
         */
        'detUploadComplete': function () {
            var obj = {
                'complete': true, // 全部上传成功
                'percent': '100%',
                'finish': false// ajax请求全部结束，包括上传出错的情况
            };
            var count = 0; // 上传文件的数量
            var finishCount = 0;// ajax结束的数量
            // var completeCount = 0;

            var total = 0;
            var loaded = 0;

            $.each(this.uploadFilesDet, function (fileIndex, item) {
                count++;
                total += item.total;
                loaded += item.loaded;
                if (item.complete) {
                    // 当前文件上传完成
                    // completeCount++;
                } else {
                    // 当前文件上传未完成
                    obj.complete = false;
                }

                if (item.complete || item.isError) {
                    finishCount++;
                }
            });
            // var per = Math.floor(100 * completeCount / count); // 已经上传的百分比
            var per = Math.floor(100 * loaded / total); // 已经上传的百分比

            per = per > 99 ? 99 : per; // 不能达到100%，100%要在成功回调里

            obj.percent = per + '%';

            if (count === finishCount) {
                obj.finish = true;
            }
            return obj;
        },

        /**
         * @description:  一个文件上传成功时触发
         * @param {type} params
         * @return: {void}
         */
        'onOneFileUploadSuccess': function (fileIndex, file) {
            // 设置成功状态
            this.uploadFilesDet[fileIndex] = this.uploadFilesDet[fileIndex] || {};
            this.uploadFilesDet[fileIndex].complete = true;

            // 设置进度条
            this.setPerProgress(fileIndex, '100%', 'success');

            // 检测是否已经全部上传
            var detObj = this.detUploadComplete();

            // 设置总进度条
            this.setProgress(detObj.percent);

            // 清除file
            delete this.files[fileIndex];

            // 单个成功回调
            this.option.onOneSuccess && this.option.onOneSuccess(fileIndex, file);

            // 如果已经全部上传
            if (detObj.complete) {

                // 全部成功回调
                this.onAllFileUploadSuccess();
            }
        },

        /**
         * @description:  一个文件上传失败时触发
         * @param {type} params
         * @return: {void}
         */
        'onOneFileUploadError': function (fileIndex, file) {

            this.setPerProgress(fileIndex, '100%', 'error');
            this.uploadFilesDet[fileIndex].isError = true;

            // 检测是否已经全部上传
            var detObj = this.detUploadComplete();
            // ajax全部结束

            if (detObj.finish){
                this.progressLoading && this.progressLoading.remove && this.progressLoading.remove();
            }

            this.option.onOneError && this.option.onOneError(fileIndex, file);
        },

        /**
         * @description:  全部上传时触发
         * @param {type}
         * @return: {void}
         */
        'onAllFileUploadSuccess': function () {
            var that = this;
            // 可能会多次触发

            // console.log('全部文件上传成功');

            if (!this.triggerAllUploadSuccessed) {
                this.triggerAllUploadSuccessed = true;
                this.progressLoading && this.progressLoading.remove && this.progressLoading.remove();
                // 设置总进度条
                if (this.filesSize()) {
                    this.setProgress('100%', true);
                }

                // 重置数据
                this.resetData();

                // 执行成功回调
                this.option.onAllSuccess && this.option.onAllSuccess(this.files);
            }
        },

        /**
         * @description:  上传单个文件
         * @param {type}
         * @return: {void}
         */
        'uploadPerFile': function (fileIndex, file, onSuccess) {
            var that = this;
            var formData = new FormData();

            /* $.each(file, function (key, item) {
                formData.append(key, item);
            });*/
            formData.append('annexBase64', file);
            formData.append('annexName', file.name);

            if (file.type.indexOf('image') > -1) {
                // 图片
                formData.append('annexType', 2);
            } else if (file.type.indexOf('video') > -1) {
                // 视频
                formData.append('annexType', 3);
            } else {
                // 其他文件
                formData.append('annexType', 4);
            }

            // 添加外部传进的参数
            var uploadParam = this.option.uploadParams;

            if (typeof uploadParam === 'function') {
                uploadParam = uploadParam();
            }
            if ($.isPlainObject(uploadParam)) {
                // 如果是纯粹的对象
                uploadParam = uploadParam;

            } else {
                uploadParam = {};
            }

            $.each(uploadParam, function (key, item) {
                key === 'annexType' && formData.delete(key);
                formData.append(key, item);
            });

            $.ajax({
                'url': this.option.url,
                'type': 'post',
                'data': formData,
                'dataType': 'json',
                'processData': false, // jQuery不要去处理发送的数据
                'contentType': false, // jQuery不要去设置Content-Type请求头

                // 获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
                'xhr': function () {
                    var myXhr = $.ajaxSettings.xhr();
                    // 获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数

                    if (myXhr.upload) {
                        // 绑定progress事件的回调函数
                        myXhr.upload.addEventListener('progress', function (e) {
                            var loaded = e.loaded;// 已经上传大小情况
                            var tot = e.total;// 附件总大小
                            var per = Math.floor(100 * loaded / tot); // 已经上传的百分比
                            // console.log('附件总大小 = ' + loaded);
                            // console.log('已经上传大小 = ' + tot);
                            // console.log('上传百分比 = ' + per + '%');

                            that.uploadFilesDet[fileIndex] = that.uploadFilesDet[fileIndex] || {};
                            that.uploadFilesDet[fileIndex].loaded = loaded;

                            that.setPerProgress(fileIndex, per + '%');

                            // 检测是否已经全部上传
                            var detObj = that.detUploadComplete();

                            // 设置总进度条
                            that.setProgress(detObj.percent);

                        }, false); // for handling the progress of the upload

                    }
                    // xhr对象返回给jQuery使用
                    return myXhr;
                },
                'success': function (resp) {
                    // console.log('$.type(resp):', $.type(resp));
                    // console.log('文件上传 resp:', resp);
                    // console.log('typeof:', typeof resp);

                    if (resp.respCode === '0000') {
                        that.onOneFileUploadSuccess(fileIndex, file);
                        onSuccess && onSuccess(resp.data);
                    } else {
                        that.onOneFileUploadError(fileIndex, file);
                        console.error('resp:', resp);

                    }
                },
                'error': function (error) {
                    that.onOneFileUploadError(fileIndex, file);
                    console.error('error:', error);
                }
            });

        },

        /**
         * @description:   获取准备上传的文件数量（已上传成功的或者从后台回显的不会上传），只包含从本地选择的文件，不包括已上传或者回显的文件
         * @return: {number}
         */
        'filesSize': function () {
            var count = 0;

            $.each(this.files, function (index, item) {
                count++;
            });
            return count;
        },

        /**
        * @description:  当前显示的所有附件数量，包括回显和已上传的数量
        * @param {type}
        * @return: {void}
        */
        'annexsSize': function () {
            return this.$wrapper.find('>.j-file-item').length;
        },

        /**
         * @description:  获取要删除的附件id数组
         * @return: {Array}
         */
        'getAnnexIdList': function () {
            return this.annexIdList.concat([]);
        },

        /**
        * @description:  刷新上传按钮（显示、隐藏）
        * @param {type} params
        * @return: {void}
        */
        'refreshUpBtn': function () {
            // 如果是单文件上传
            if (!this.option.multiple) {
                if (this.filesSize()) {
                    this.$wrapper.find('.j-btn-choosefile').hide();
                } else {
                    this.$wrapper.find('.j-btn-choosefile').show();
                }
            }

        },

        /**
         * @description:  获取图片模板
         * @return: {}
         */
        'getImgTmpl': function () {
            if (AnnexUpload.imgTmpl) {
                return AnnexUpload.imgTmpl;
            }
            return AnnexUpload.imgTmpl = '' +
                '<div class="j-file-item why-filecard fl" data-index="{{index}}" data-annexid="{{annexId}}">' +
                '    <div class="j-file-progress layui-progress why-filecard__progress" lay-filter="fileProgress_{{index}}"' +
                '        data-index="{{index}}" style="display:none;">' +
                '        <div class="layui-progress-bar layui-bg-blue" lay-percent="0%"></div>' +
                '    </div>' +
                '    <div class="img-preview-outer why-filecard__outer"><img src="{{src}}" title="{{name}}"' +
                '            class="j-upload-enlargeimg layui-upload-img why-filecard__img">' +
                '        <div class="btns-small {{bottomHidden}}" >' +
                '            <span class="j-file-del-btn  why-filecard__del layui-icon layui-icon-close" data-index="{{index}}"' +
                '                data-hasannexid="{{hasAnnexId}}" data-annexid="{{annexId}}"></span>' +
                '        </div>' +
                '    </div>' +
                '</div>';

        },

        /**
         * @description:  获取视频模板
         * @return: {}
         */
        'getVideoTmpl': function () {
            if (AnnexUpload.videoTmpl) {
                return AnnexUpload.videoTmpl;
            }
            return AnnexUpload.videoTmpl = '' +
                '<div class="j-file-item why-filecard fl" data-index="{{index}}" data-annexid="{{annexId}}">' +
                '    <div class="j-file-progress layui-progress why-filecard__progress" lay-filter="fileProgress_{{index}}"' +
                '        data-index="{{index}}" style="display:none;">' +
                '        <div class="layui-progress-bar layui-bg-blue" lay-percent="0%"></div>' +
                '    </div>' +
                '    <div class="img-preview-outer why-filecard__outer"><video src="{{src}}" title="{{name}}"' +
                '            class=" layui-upload-img why-filecard__img" controls preload></video>' +
                // '        <div class="btns-small {{bottomHidden}}" >' +
                // '            <span class="j-file-del-btn layui-btn layui-btn-normal" data-index="{{index}}"' +
                // '                data-hasannexid="{{hasAnnexId}}" data-annexid="{{annexId}}">删除</span>' +
                // '        </div>' +
                '        <div class="btns-small {{bottomHidden}}" >' +
                '            <span class="j-file-del-btn  why-filecard__del layui-icon layui-icon-close" data-index="{{index}}"' +
                '                data-hasannexid="{{hasAnnexId}}" data-annexid="{{annexId}}"></span>' +
                '        </div>' +
                '    </div>' +
                '</div>';

        },

        /**
         * @description:  获取其他文件模板
         * @return: {}
         */
        'getFileTmpl': function () {
            if (AnnexUpload.fileTmpl) {
                return AnnexUpload.fileTmpl;
            }
            return AnnexUpload.fileTmpl = '' +
                '<div class="j-file-item why-filecard fl" data-index="{{index}}" data-annexid="{{annexId}}">' +
                '    <div class="j-file-progress layui-progress why-filecard__progress" lay-filter="fileProgress_{{index}}"' +
                '        data-index="{{index}}" style="display:none;">' +
                '        <div class="layui-progress-bar layui-bg-blue" lay-percent="0%"></div>' +
                '    </div>' +
                '    <div class="img-preview-outer why-filecard__outer">' +
                '        <div class="why-filecard__box">' +
                '            <div class="why-filecard__box-text" title="{{name}}"><a href="{{src}}" target="_blank" download="{{name}}">{{name}}</a></div>' +
                '        </div>' +
                // '        <span class="btns-small {{bottomHidden}}" >' +
                // '            <span class="j-file-del-btn layui-btn layui-btn-normal" data-index="{{index}}"' +
                // '                data-hasannexid="{{hasAnnexId}}" data-annexid="{{annexId}}">删除</span>' +
                // '        </span>' +
                '        <div class="btns-small {{bottomHidden}}" >' +
                '            <span class="j-file-del-btn  why-filecard__del layui-icon layui-icon-close" data-index="{{index}}"' +
                '                data-hasannexid="{{hasAnnexId}}" data-annexid="{{annexId}}"></span>' +
                '        </div>' +
                '    </div>' +
                '</div>';

        },

        /**
         * @description:  获取总进度条的html
         * @return: {void}
         */
        'getProgressHtml': function () {
            if (!this.option.multiple) {
                return '';
            }
            return '' +
                '<div class="j-allfile-progress layui-progress layui-progress-big mb10" lay-showPercent="yes"' +
                '    lay-filter="allfileProgress" style="display: none;">' +
                '    <div class="j-progress-inner layui-progress-bar layui-bg-blue" lay-percent="0%"></div>' +
                '</div>';
        },

        /**
         * @description:  获取上传按钮的html
         * @return: {void}
         */
        'getUploadBtnHtml': function () {
            if (this.option.chooseBtnType === 'type2') {
                return '<div class="j-choosebtn-wrapper why-filecard fl {{hidden}}">' +
                    ' <div class="why-filecard__choosebtn j-btn-choosefile">' +
                    '          <i class="layui-icon layui-icon-add-1"></i>' +
                    '                </div>' +
                    '  </div>';
            }
            return '' +
                '<div class="j-choosebtn-wrapper why-filecard fl {{hidden}}">' +
                // '    <div class="img-preview-outer">' +
                // '        <div class="why-filecard__box">' +
                // '            <div class="why-filecard__box-text">' +
                '                <div class="layui-upload">' +
                '                    <button type="button" class="j-btn-choosefile layui-btn layui-btn-normal"><i class="layui-icon">&#xe67c;</i>上传</button>' +
                '                </div>' +
                // '            </div>' +
                // '        </div>' +
                // '        <span class="btns-small">&nbsp;</span>' +
                // '    </div>' +
                '</div>';
            // return '' +
            //     '<div class="j-choosebtn-wrapper why-filecard fl {{hidden}}">' +
            //     '    <div class="img-preview-outer">' +
            //     '        <div class="why-filecard__box">' +
            //     '            <div class="why-filecard__box-text">' +
            //     '                <div class="layui-upload">' +
            //     '                    <button type="button" class="j-btn-choosefile layui-btn "><i class="layui-icon">&#xe67c;</i>上传</button>' +
            //     '                </div>' +
            //     '            </div>' +
            //     '        </div>' +
            //     '        <span class="btns-small">&nbsp;</span>' +
            //     '    </div>' +
            //     '</div>';
        }

    };

    window.AoAnnexUpload = AnnexUpload;

})();