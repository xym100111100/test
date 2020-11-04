/**
 * Created by thx 2018.
 */
$.extend({
 
    /**
     * 确认弹框
     * @param  {[type]} conQue [问题文本]
     * @param  {[type]} conMsg [内容主体文本]
     * @param  {[type]} opt    [参数]
     * @return {[type]}        [弹窗对象]
     */
    layerConfirm: function (conQue, conMsg, opt) {
        var defaults = {
            title: '',
            area:["500px","290px"],
            btnAlign: 'c',
            btn: ['确定', '取消'],
            yes: function(index, layero){}, 
            no: function(index){},
            shade: 0.6,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var content = '<div class="confirm-content"><div class="confirm-que"><i class="myskin-ico ico01"></i>' + conQue + '</div><div>' + conMsg + '</div></div>';
        var param = $.extend({}, defaults, opt);
        param.content = content;

        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // var confirmLayer = top.layer.open(param); 
        var confirmLayer = layer.open(param);  

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
            btnAlign: 'c',
            btn: ['确定', '取消'],
            yes: function(index, layero){}, 
            no: function(index){},
            shade: 0.6,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var param = $.extend({}, defaults, opt);

        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // var confirmLayer = top.layer.open(param); 
        var confirmLayer = layer.open(param);  

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
            // area:["550px","400px"],
            // btn: none,
            // btnAlign: 'c',
            shade: 0.6,
            // icon: 1,
            fixed: true,
            resize: false,
            // closeBtn: '0',       //叉叉关闭
            scrollbar: false //不允许页面滚动
        };
        var param = $.extend({}, defaults, opt);

        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        // var confirmLayer = top.layer.open(param); 
        var confirmLayer = layer.open(param);  

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
            closeBtn: 1,
            // btn: none,
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
        // IE和Firefox下本地可以跨域，页面路径和皮肤路径加载会有误，执行的路径相对于父级页面
        // 如果不使用iframe，不需要父级弹框，注释关于父级的操作
        // 如果需要使用，则页面的路径参数需要相应修改
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
            closeBtn: 1,
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
        // IE和Firefox下本地可以跨域，页面路径和皮肤路径加载会有误，执行的路径相对于父级页面
        // 如果不使用iframe，不需要父级弹框，注释关于父级的操作
        // 如果需要使用，则页面的路径参数需要相应修改
        // try{
        //     var confirmLayer = top.layer.open(param); 
        // }catch(err){
            var confirmLayer = layer.open(param);  
        // }
        
        return confirmLayer;
    }
 
});