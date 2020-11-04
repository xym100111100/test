
layui.use(['form', 'laydate', 'table', 'layer', 'element', 'upload'], function () {
    var form = layui.form;
    var layer = layui.layer;
    var table = layui.table;
    var element = layui.element;
    var upload = layui.upload;

    var inst;

    function Main() {

        this.curStep = 1;// 当前步骤

        this.setCurStep();

        // 获取浏览器地址栏中的参数
        this.locationSearch = aoUtils.getLocationSearch();

        form.render();

        // 初始化上传控件
        this.initAnnex1();
        this.initAnnex2();
        this.initAnnex3();

        // 绑定事件
        this.bindEvents();

    }

    Main.prototype = {
        'constructor': Main,

        /**
        * @description:  下一个步骤
        * @param {type} params
        * @return: {void}
        */
        'nextStep': function () {
            if (this.curStep < 4) {
                this.curStep++;
                this.setCurStep();
            }
        },

        /**
        * @description:  上一个步骤
        * @param {type} params
        * @return: {void}
        */
        'prevStep': function () {
            if (this.curStep > 1) {
                this.curStep--;
                this.setCurStep();
            }
        },

        /**
        * @description:  设置步骤高亮
        * @param {type} params
        * @return: {void}
        */
        'setCurStep': function () {
            var that=this;

            $('.j-steps-content .j-step-content-item').hide();
            $('.j-steps-content .j-step-content-item[data-step="' + this.curStep + '"]').show();

            $('.j-steps .j-steps-item').removeClass('is-active');
            $('.j-steps-content .j-step-content-item').each(function () {
                var stepNum = Number($(this).attr('data-step'));

                if (stepNum <= that.curStep) {
                    $('.j-steps .j-steps-item[data-step="' + stepNum + '"]').addClass('is-active');
                }
            });

            if (this.curStep === 1) {
                $('.j-btn-prevstep').hide();
            } else {
                $('.j-btn-prevstep').show();
            }

            if (this.curStep === 4) {
                $('.j-btn-nextstep').hide();
                $('.j-btn-submit').show();
            } else {
                $('.j-btn-nextstep').show();
                $('.j-btn-submit').hide();

            }
        },

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
                'multiple': false, // 多文件
                // 'chooseBtnType':'type2',

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
                'multiple': false, // 多文件

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
        * @description:  全部校验成功，执行上传
        * @param {type} params
        * @return: {void}
        */
        'handleSubmit': function () {
            var form1Data = aoUtils.getFormData('#form1');

            console.log('form1Data:', form1Data);

            var form2Data = aoUtils.getFormData('#form2');

            console.log('form2Data:', form2Data);

            var form3Data = aoUtils.getFormData('#form3');

            console.log('form3Data:', form3Data);

            var form4Data = aoUtils.getFormData('#form4');

            console.log('form4Data:', form4Data);

            // 上传3个文件
            this.instAnnex1.uploadFiles();
            this.instAnnex2.uploadFiles();
            this.instAnnex3.uploadFiles();

        },

        /**
         * @description: 绑定事件
         * @return:
         */
        'bindEvents': function () {
            var that = this;

            // 上一步
            $('.j-btn-prevstep').click(function () {
                that.prevStep();
            });

            // 下一步
            $('.j-btn-nextstep').click(function () {
                console.log('that.curStep:', that.curStep);
                if (that.curStep === 1) {
                    that.nextStep();
                    // $('.j-btn-trigger-form1').click();
                } else if (that.curStep === 2) {
                    that.nextStep();
                    // $('.j-btn-trigger-form2').click();
                } else if (that.curStep === 3) {
                    that.nextStep();
                    // $('.j-btn-trigger-form3').click();
                } else {
                    that.nextStep();

                }
            });

            // 上传按钮
            $('.j-btn-submit').click(function () {

                $('.j-btn-trigger-form4').click();

            });

            // 监听表单1提交
            form.on('submit(form1)', function (data) {
                console.log('表单1校验通过:');

                if (that.instAnnex1.filesSize() && that.instAnnex2.filesSize() && that.instAnnex3.filesSize() ){

                    that.nextStep();
                } else {
                    aoUtils.failMsg('请上传所有需要的文件',layer);
                }

            });

            // 监听表单2提交
            form.on('submit(form2)', function (data) {
                console.log('表单2校验通过:');
                that.nextStep();
            });

            // 监听表单3提交
            form.on('submit(form3)', function (data) {
                console.log('表单3校验通过:');

                // var form3Data = aoUtils.getFormData('#form3');

                // console.log('form3Data:', form3Data);

                that.nextStep();
            });

            // 监听表单4提交
            form.on('submit(form4)', function (data) {
                console.log('表单4校验通过:');

                // var form4Data = aoUtils.getFormData('#form4');

                // console.log('form4Data:', form4Data);

                that.handleSubmit();
            });

            // 获取数据按钮1
            $('.j-btn-getdata1').click(function () {
                aoUtils.setFormData('#form1', Main.formData1);
            });

            // 获取数据按钮2
            $('.j-btn-getdata2').click(function () {
                aoUtils.setFormData('#form2', Main.formData2);
            });

            // 获取数据按钮3
            $('.j-btn-getdata3').click(function () {
                aoUtils.setFormData('#form3', Main.formData3);
            });

            // 获取数据按钮4
            $('.j-btn-getdata4').click(function () {
                aoUtils.setFormData('#form4', Main.formData4);
            });

        }

    };
    Main.formData1 = {
        'title1': '10',
        'title2': '10',
        'title3': '10',
        'title4': '10',
        'title5': '10',
        'title6': '10',
        'title7': '10',
        'title8': '10',
        'title9': '10'
    };
    Main.formData2 = {
        'title1': '10',
        'title2': '10',
        'title3': '10',
        'title4': '10',
        'title5': '10',
        'title6': '10',
        'title7': '10',
        'title8': '10',
        'title9': '10'
    };
    Main.formData3 = {
        'title1': '10',
        'title2': '10',
        'title3': '10',
        'title4': '10',
        'title5': '10',
        'title6': '10',
        'title7': '10',
        'title8': '10',
        'title9': '10'
    };
    Main.formData4 = {
        'title1': '10',
        'title2': '10',
        'title3': '10',
        'title4': '10',
        'title5': '10',
        'title6': '10',
        'title7': '10',
        'title8': '10',
        'title9': '10'
    };

    inst = new Main();

});
