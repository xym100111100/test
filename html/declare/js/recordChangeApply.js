
layui.use(['form', 'laydate', 'table', 'layer', 'element', 'upload'], function () {
    var form = layui.form;
    var layer = layui.layer;
    var table = layui.table;
    var element = layui.element;
    var upload = layui.upload;
    var laydate = layui.laydate;

    var inst;

    function Main() {

        // 获取浏览器地址栏中的参数
        this.locationSearch = aoUtils.getLocationSearch();

        form.render();

        // 初始化上传控件
        this.initAnnex1();
        this.initAnnex2();
        this.initAnnex3();

        this.initAnnex4();
        this.initAnnex5();
        this.initAnnex6();

        // 回显测试
        this.initAnnex7();
        this.instAnnex7.setFileView(Main.annexData);

        // 绑定事件
        this.bindEvents();

    }

    Main.prototype = {
        'constructor': Main,

        /**
         * @description:  初始化上传控件
         * @return: {void}
         */
        'initAnnex1': function () {
            var that = this;

            this.instAnnex1 = new AoAnnexUpload({
                'wrapper': '.j-files-wrapper1',
                'url': 'volunteerAnnexUploadController/volunteerAnnexUpload.do',
                // 'multiple': false, // 多文件
                'chooseBtnType': 'type2',

                // 'mode': this.annexMode, // 默认upload
                // 单个文件上传时添加的参数，可以是Object，也可以是Function
                'uploadParams': function () {
                    return {
                        'operator': $('#userName').val(), // 操作人
                        'annexAscriptionType': 2,// 1：志愿者项目
                        'annexAscriptionId': 1// 主键id
                    };
                },

                // 所有文件上传成功
                'onAllSuccess': function (files) {
                    // console.log('调用页面 onAllSuccess:', files);
                    // layer.msg(that.msgSuccess, {'time': 3000, 'icon': 6});

                    // that.queryDetail(); // 刷新页面
                    // that.isAnnexSuccess = true;
                    // that.onAllFilesUploadSuccess();
                }
            });

            // 触发上传
            // this.instAnnex1.uploadFiles();

        },

        /**
      * @description:  初始化上传控件
      * @return: {void}
      */
        'initAnnex2': function () {
            var that = this;

            this.instAnnex2 = new AoAnnexUpload({
                'wrapper': '.j-files-wrapper2',
                'url': 'volunteerAnnexUploadController/volunteerAnnexUpload.do',
                // 'multiple': false, // 多文件
                'chooseBtnType': 'type2',

                // 'mode': this.annexMode, // 默认upload
                // 单个文件上传时添加的参数，可以是Object，也可以是Function
                'uploadParams': function () {
                    return {
                        'operator': $('#userName').val(), // 操作人
                        'annexAscriptionType': 2,// 1：志愿者项目
                        'annexAscriptionId': 1// 主键id
                    };
                },

                // 所有文件上传成功
                'onAllSuccess': function (files) {
                    // console.log('调用页面 onAllSuccess:', files);
                    // layer.msg(that.msgSuccess, {'time': 3000, 'icon': 6});

                    // that.queryDetail(); // 刷新页面
                    // that.isAnnexSuccess = true;
                    // that.onAllFilesUploadSuccess();
                }
            });

            // 触发上传
            // this.instAnnex2.uploadFiles();

        },

        /**
      * @description:  初始化上传控件
      * @return: {void}
      */
        'initAnnex3': function () {
            var that = this;

            this.instAnnex3 = new AoAnnexUpload({
                'wrapper': '.j-files-wrapper3',
                'url': 'volunteerAnnexUploadController/volunteerAnnexUpload.do',
                // 'multiple': false, // 多文件
                'chooseBtnType': 'type2',

                // 'mode': this.annexMode, // 默认upload
                // 单个文件上传时添加的参数，可以是Object，也可以是Function
                'uploadParams': function () {
                    return {
                        'operator': $('#userName').val(), // 操作人
                        'annexAscriptionType': 2,// 1：志愿者项目
                        'annexAscriptionId': 1// 主键id
                    };
                },

                // 所有文件上传成功
                'onAllSuccess': function (files) {
                    // console.log('调用页面 onAllSuccess:', files);
                    // layer.msg(that.msgSuccess, {'time': 3000, 'icon': 6});

                    // that.queryDetail(); // 刷新页面
                    // that.isAnnexSuccess = true;
                    // that.onAllFilesUploadSuccess();
                }
            });

            // 触发上传
            // this.instAnnex3.uploadFiles();

        },

        /**
    * @description:  初始化上传控件
    * @return: {void}
    */
        'initAnnex4': function () {
            var that = this;

            this.instAnnex4 = new AoAnnexUpload({
                'wrapper': '.j-files-wrapper4',
                'url': 'volunteerAnnexUploadController/volunteerAnnexUpload.do',
                // 'multiple': false, // 多文件
                'chooseBtnType': 'type2',

                // 'mode': this.annexMode, // 默认upload
                // 单个文件上传时添加的参数，可以是Object，也可以是Function
                'uploadParams': function () {
                    return {
                        'operator': $('#userName').val(), // 操作人
                        'annexAscriptionType': 2,// 1：志愿者项目
                        'annexAscriptionId': 1// 主键id
                    };
                },

                // 所有文件上传成功
                'onAllSuccess': function (files) {
                    // console.log('调用页面 onAllSuccess:', files);
                    // layer.msg(that.msgSuccess, {'time': 3000, 'icon': 6});

                    // that.queryDetail(); // 刷新页面
                    // that.isAnnexSuccess = true;
                    // that.onAllFilesUploadSuccess();
                }
            });

            // 触发上传
            // this.instAnnex3.uploadFiles();

        },

        /**
    * @description:  初始化上传控件
    * @return: {void}
    */
        'initAnnex5': function () {
            var that = this;

            this.instAnnex5 = new AoAnnexUpload({
                'wrapper': '.j-files-wrapper5',
                'url': 'volunteerAnnexUploadController/volunteerAnnexUpload.do',
                // 'multiple': false, // 多文件
                'chooseBtnType': 'type2',

                // 'mode': this.annexMode, // 默认upload
                // 单个文件上传时添加的参数，可以是Object，也可以是Function
                'uploadParams': function () {
                    return {
                        'operator': $('#userName').val(), // 操作人
                        'annexAscriptionType': 2,// 1：志愿者项目
                        'annexAscriptionId': 1// 主键id
                    };
                },

                // 所有文件上传成功
                'onAllSuccess': function (files) {
                    // console.log('调用页面 onAllSuccess:', files);
                    // layer.msg(that.msgSuccess, {'time': 3000, 'icon': 6});

                    // that.queryDetail(); // 刷新页面
                    // that.isAnnexSuccess = true;
                    // that.onAllFilesUploadSuccess();
                }
            });

            // 触发上传
            // this.instAnnex3.uploadFiles();

        },

        /**
    * @description:  初始化上传控件
    * @return: {void}
    */
        'initAnnex6': function () {
            var that = this;

            this.instAnnex6 = new AoAnnexUpload({
                'wrapper': '.j-files-wrapper6',
                'url': 'volunteerAnnexUploadController/volunteerAnnexUpload.do',
                // 'multiple': false, // 多文件
                'chooseBtnType': 'type2',

                // 'mode': this.annexMode, // 默认upload
                // 单个文件上传时添加的参数，可以是Object，也可以是Function
                'uploadParams': function () {
                    return {
                        'operator': $('#userName').val(), // 操作人
                        'annexAscriptionType': 2,// 1：志愿者项目
                        'annexAscriptionId': 1// 主键id
                    };
                },

                // 所有文件上传成功
                'onAllSuccess': function (files) {
                    // console.log('调用页面 onAllSuccess:', files);
                    // layer.msg(that.msgSuccess, {'time': 3000, 'icon': 6});

                    // that.queryDetail(); // 刷新页面
                    // that.isAnnexSuccess = true;
                    // that.onAllFilesUploadSuccess();
                }
            });

            // 触发上传
            // this.instAnnex3.uploadFiles();

        },

        /**
     * @description:  初始化上传控件
     * @return: {void}
     */
        'initAnnex7': function () {
            var that = this;

            this.instAnnex7 = new AoAnnexUpload({
                'wrapper': '.j-files-wrapper7',
                'mode': 'view'// 模式：upload：上传模式 view:查看模式（只是回显，没有上传也没有删除）

                // 'chooseBtnType': 'type2',

            });

        },

        /**
        * @description:  全部校验成功，执行上传
        * @param {type} params
        * @return: {void}
        */
        'handleSubmit': function () {
            var form1Data = aoUtils.getFormData('#form1');

            console.log('form1Data:', form1Data);

            // 上传3个文件
            this.instAnnex1.uploadFiles();
            this.instAnnex2.uploadFiles();
            this.instAnnex3.uploadFiles();

            this.instAnnex4.uploadFiles();
            this.instAnnex5.uploadFiles();
            this.instAnnex6.uploadFiles();

        },

        /**
         * @description: 绑定事件
         * @return:
         */
        'bindEvents': function () {
            var that = this;

            // 备案有效期
            laydate.render({
                'elem': '.j-input[name="bayxq"]', // 指定元素
                // 'range': true,
                'type': 'date',// 默认，可不填
                'done': function (value, date, endDate) {
                }
            });

            // 上传按钮
            $('.j-btn-submit').click(function () {

                var form1Data = aoUtils.getFormData('#form1');

                console.log('form1Data:', form1Data);

                $('.j-btn-trigger-form1').click();

            });

            // 监听表单提交
            form.on('submit(form1)', function (data) {
                console.log('表单1校验通过:');

                if (that.instAnnex1.filesSize() && that.instAnnex2.filesSize() && that.instAnnex3.filesSize() && that.instAnnex4.filesSize() && that.instAnnex5.filesSize() && that.instAnnex6.filesSize()) {

                    that.handleSubmit();
                } else {
                    aoUtils.failMsg('请上传所有需要的文件', layer);
                }

            });

        }

    };

    Main.annexData = {
        'annexList': [{
            'annexId': 1,
            'annexType': 2,
            'annexAddress': 'fastfile/group1/M00/00/78/CgrgIl2wKzCABW5xAAKdP_HG13Y585.jpg?token=805327ac7f7310c42ed3f85fb008f7c4&ts=1589902579',
            'annexName': '测试图片'
        }, {
            'annexId': 2,
            'annexType': 2,
            'annexAddress': 'fastfile/group1/M00/00/78/CgrgIl2wKzCABW5xAAKdP_HG13Y585.jpg?token=805327ac7f7310c42ed3f85fb008f7c4&ts=1589902579',
            'annexName': '测试图片2'
        }]
    };

    inst = new Main();

});
