/**
 * Created by thx 2018.
 * 封装layUI的table 渲染基本配置
 */
var layTable = layui.table;
layui.use(['table'], function(){
    layTable = layui.table;

});
$.extend({
 
    /**
     * 基本表格视图
     * @opts  {[type]} opts [参数]  参数同layui的table的参数
     * @return {[type]}       [description]
     */
    tableRender: function (opts) {
        var defaults = {
            skin: 'nob' //无边框风格
            ,even: true //开启隔行背景
            // ,size: 'lg' //大尺寸的表格
            ,page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
                layout: ['limit','count', 'prev', 'page', 'next','skip'] //自定义分页布局
                // ,prev: '上一页'
                // ,next: '下一页'
                // ,groups: 1 //只显示 1 个连续页码
                // ,first: false //不显示首页
                // ,last: false //不显示尾页
                // ,limit: false //不显示每页条数选择
                // ,skip: false //不显示跳转页面
              
            }
        };
        var param = $.extend({}, defaults, opts);
        // 遮罩层锁定最顶层 全屏。静态文件下获取不到父窗口
        var layTable = layui.table;
        layui.use(['table'], function(){
            layTable = layui.table;
        });

        return layTable.render(param);
    }

});