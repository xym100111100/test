+(function($, window, document,undefined) {
    //定义TabScroll的构造函数
    var TabScroll = function(ele, opt,callback) {
        this.$outer = ele,                                  //dom元素 容器
        this.defaults = {   //默认值
            'ul' : null,                                    //tab列表
            'leftArrow' : null,                             //左箭头
            'rightArrow' : null,                            //右箭头
            'scroll' : true                                 //是否滚动
        },
        this.options = $.extend({}, this.defaults, opt),    //合并自定义参数
        this.callback = callback,                           //下一个回调函数
        this.leftEditN = 0,                                 //左边隐藏个数
        this.rightEditN = 0,                                //右边隐藏个数
        this.clickFlag = true                               //是否可点击
    }
    
    //定义TabScroll的属性和方法
    TabScroll.prototype = {
        ifScroll: function(){
            var _this = this;
            var ulWidth = 0;
            // debugger
            this.options.ul.find("li").each(function(){
                var liWidth = $(this).width();
                ulWidth += liWidth;
            });
            var outerDivWidth = this.$outer.width();
            var padding = parseInt(this.$outer.css("paddingLeft")) + parseInt(this.$outer.css("paddingRight"));
            
            if((outerDivWidth - padding) < ulWidth && this.options.scroll){
                this.$outer.addClass("scroll");
                var restWidth = ulWidth - outerDivWidth;
                var showN = 0;
                var showWidth = 0;
                this.options.ul.find("li").each(function(){
                    var width2 = $(this).width() + parseInt($(this).css("paddingLeft")) + parseInt($(this).css("paddingRight"));
                    showWidth += width2;
                    if(showWidth > outerDivWidth){
                        return;
                    }else{
                        showN++;
                    }
                });
                var restN = this.options.ul.find("li").length - showN;
                // console.log(showN);
                // console.log(this.options.ul.find("li").length);
                this.options.ul.find("li:first-child").css("marginLeft",0 + "px");
                
                this.leftEditN = restN;
                this.rightEditN = 0;
                this.options.rightArrow.on("click",function(e){
                    e.stopPropagation();
                    if( _this.leftEditN  > 0 && _this.clickFlag){
                        var liW = _this.options.ul.find("li").eq(_this.rightEditN).width();
                        _this.animate(-liW);
                        _this.leftEditN--;
                        _this.rightEditN++;
                    }
                });
                this.options.leftArrow.on("click",function(e){
                    e.stopPropagation();
                    if( _this.rightEditN  > 0 && _this.clickFlag){
                        var liW = _this.options.ul.find("li").eq(_this.rightEditN-1).width();
                        _this.animate(liW);
                        _this.rightEditN--;
                        _this.leftEditN++;
                    }
                });
            }else{
                this.$outer.removeClass("scroll");
            }
            if(this.callback != null){
                this.callback();
            }
        },
        /**
         * [箭头点击滚动事件]
         * @param  {[type]} liWidth [description]
         * @return {[type]}         [description]
         */
        animate : function(liWidth){
            var _this = this;
            this.clickFlag=false;
            var marginBefore = parseInt(this.options.ul.find("li:first-child").css("marginLeft"));
            var marginAfter = marginBefore + liWidth;
            this.options.ul.find("li:first-child").animate(
            {
                marginLeft : marginAfter + "px"
            },"fast",function(){
                _this.clickFlag=true;
            });
        }
    }
    
    //在插件中使用树对象
    $.fn.tabScroll = function(options,callback) {
        //创建canvas的实体
        var tabScroll = new TabScroll(this, options,callback);
        // //调用其判断滚动的方法
        // return tabScroll.ifScroll();
        return tabScroll;
    }
})(jQuery, window, document);