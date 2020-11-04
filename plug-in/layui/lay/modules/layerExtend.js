/**
 * Created by thx 2018.
 * 封装layer 统一基本配置
 */
layui.use(['layer'], function(){
    var layer = layui.layer;
    //全局使用。即所有弹出层都默认采用，但是单个配置skin的优先级更高
    layer.config({
        extend: 'myskin/style1.css', //加载您的扩展样式
        skin: 'layer-ext-myskin'
    });

$.extend({
 
    /**
     * 询问框
     * @param  {[type]} param [参数]
     * @return {[type]}       [description]
     */
    layerConfirm: function (param) {
        var defaultsOpt = {
            title: '提示',
            area:["400px","240px"],
            icon: 10,
            closeBtn: 0,
            btnAlign: 'c',
            btn: ['确定', '取消'],
            shade: 0.4,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var defaults = {
            ques: '请确认！',
            opt: defaultsOpt,
            yes: function(index){
                layer.close(index);
            },
            cancel: function(index){
                layer.close(index);
            }
        }
        var lastParam = $.extend({}, defaults, param);
        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // try{
        //     var confirmLayer = top.layer.confirm(lastParam.ques,lastParam.opt,lastParam.yes,lastParam.cancel);
        // }catch(err){
            var confirmLayer = layer.confirm(lastParam.ques,lastParam.opt,lastParam.yes,lastParam.cancel); 
        // }

        return confirmLayer;
    },
    /**
     * 警告框
     * @param  {[type]} param [参数]
     * @return {[type]}       [description]
     */
    layerWarn: function (param) {
        var defaultsOpt = {
            title: '提示',
            area:["400px","240px"],
            icon: 11,
            closeBtn: 0,
            btnAlign: 'c',
            btn: ['确定', '取消'],
            shade: 0.4,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var defaults = {
            ques: '警告',
            opt: defaultsOpt,
            yes: function(index){
                layer.close(index);
            },
            cancel: function(index){
                layer.close(index);
            }
        }
        var lastParam = $.extend({}, defaults, param);
        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // try{
        //     var confirmLayer = top.layer.confirm(lastParam.ques,lastParam.opt,lastParam.yes,lastParam.cancel);
        // }catch(err){
            var confirmLayer = layer.confirm(lastParam.ques,lastParam.opt,lastParam.yes,lastParam.cancel); 
        // }

        return confirmLayer;
    },
    /**
     * 失败提示框
     * @param  {[type]} param [参数]
     * @return {[type]}       [description]
     */
    layerFail: function (param) {
        var defaultsOpt = {
            title: '提示',
            area:["400px","240px"],
            icon: 12,
            closeBtn: 0,
            btnAlign: 'c',
            btn: ['确定', '取消'],
            shade: 0.4,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var defaults = {
            ques: '失败！',
            opt: defaultsOpt,
            yes: function(index){
                layer.close(index);
            },
            cancel: function(index){
                layer.close(index);
            }
        }
        var lastParam = $.extend({}, defaults, param);
        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // try{
        //     var confirmLayer = top.layer.confirm(lastParam.ques,lastParam.opt,lastParam.yes,lastParam.cancel);
        // }catch(err){
            var confirmLayer = layer.confirm(lastParam.ques,lastParam.opt,lastParam.yes,lastParam.cancel); 
        // }

        return confirmLayer;
    },
    /**
     * 成功提示框
     * @param  {[type]} param [参数]
     * @return {[type]}       [description]
     */
    layerSuccess: function (param) {
        var defaultsOpt = {
            title: '提示',
            area:["400px","240px"],
            icon: 13,
            closeBtn: 0,
            btnAlign: 'c',
            btn: ['确定', '取消'],
            shade: 0.4,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var defaults = {
            ques: '成功！',
            opt: defaultsOpt,
            yes: function(index){
                layer.close(index);
            },
            cancel: function(index){
                layer.close(index);
            }
        }
        var lastParam = $.extend({}, defaults, param);
        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // try{
        //     var confirmLayer = top.layer.confirm(lastParam.ques,lastParam.opt,lastParam.yes,lastParam.cancel);
        // }catch(err){
            var confirmLayer = layer.confirm(lastParam.ques,lastParam.opt,lastParam.yes,lastParam.cancel); 
        // }

        return confirmLayer;
    },
    /**
     * 内容弹框
     * @param  {[type]} opt [参数]
     * @return {[type]}     [返回对象]
     */
    layerContent: function (opt) {
        var defaults = {
            title: '',
            area:["550px","400px"],
            closeBtn: 0,
            btnAlign: 'c',
            btn: ['确定', '取消'],
            yes: function(index, layero){}, 
            no: function(index){},
            shade: 0.4,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var param = $.extend({}, defaults, opt);
        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        try{
            var confirmLayer = top.layer.open(param); 
        }catch(err){
            var confirmLayer = layer.open(param);  
        }

        return confirmLayer;
    },
    /**
     * 内容弹框 没有按钮
     * @param  {[type]} opt [参数]
     * @return {[type]}     [返回对象]
     */
    layerContent02: function (opt) {
        var defaults = {
            type:1,
            title: false,
            closeBtn: 0,
            // area:["800px","600px"],
            // btn: none,
            // btnAlign: 'c',
            shade: 0.4,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var param = $.extend({}, defaults, opt);

        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // try{
        //     var confirmLayer = top.layer.open(param);
        // }catch(err){
            var confirmLayer = layer.open(param);  
        // }

        return confirmLayer;
    },
    /**
     * iframe弹窗
     * @param  {[type]} opt [参数]
     * @return {[type]}     [返回对象]
     */
    layerFrame01: function (opt) {
        var defaults = {
            type:2,
            title: false,
            area:["900px","700px"],
            closeBtn: 0,
            // btn: none,
            // btnAlign: 'c',
            shade: 0.4,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var param = $.extend({}, defaults, opt);

        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // try{
        //     var confirmLayer = top.layer.open(param);
        // }catch(err){
            var confirmLayer = layer.open(param);  
        // }
        
        return confirmLayer;
    },
    /**
     * iframe弹窗 有按钮
     * @param  {[type]} opt [参数]
     * @return {[type]}     [返回对象]
     */
    layerFrame02: function (opt) {
        var defaults = {
            type:2,
            title: false,
            area:["900px","700px"],
            closeBtn: 0,
            btn: ['确定', '取消'],
            btnAlign: 'c',
            shade: 0.4,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var param = $.extend({}, defaults, opt);

        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // try{
        //     var confirmLayer = top.layer.open(param);
        // }catch(err){
            var confirmLayer = layer.open(param);  
        // }
        
        return confirmLayer;
    }
 
});
});