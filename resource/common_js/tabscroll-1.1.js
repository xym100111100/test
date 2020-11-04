/**
 * @autor   thx
 * @date    2017
 * tab滚动
 * @param  {[type]} $         [description]
 * @param  {[type]} window    [description]
 * @param  {[type]} document  [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
+(function($, window, document,undefined) {
    //定义TabScroll的构造函数
    var TabScroll = function(ele, opt,callback) {
        this.$outer = ele,                                  //dom元素 容器
        this.defaults = {   //默认值
            'ul' : null,                                    //tab列表
            'leftArrow' : null,                             //左箭头
            'rightArrow' : null,                            //右箭头
            'scroll' : true                                 //是否滚动
            ,'scrollNum': 1
        },
        this.options = $.extend({}, this.defaults, opt),    //合并自定义参数
        this.callback = callback,                           //下一个回调函数
        this.currentIdx = 0,                                 //当前显示的第一个菜单下标
        this.clickFlag = true                               //是否可点击
    }
    
    //定义TabScroll的属性和方法
    TabScroll.prototype = {
        ifScroll: function(){
            var _this = this;
            var ulWidth = 0;
            // debugger
            this.options.ul.find("li").each(function(){
                var $li = $(this);
                ulWidth += calcWidth($li);
            });
            var outerDivWidth = this.$outer.width();
            var padding = parseInt(this.$outer.css("paddingLeft")) + parseInt(this.$outer.css("paddingRight"));
            
            if((outerDivWidth - padding) < ulWidth && this.options.scroll){
                this.$outer.addClass("scroll");
                this.options.rightArrow.on("click",function(e){
                    e.stopPropagation();
                    padding = parseInt(_this.$outer.css("paddingLeft")) + parseInt(_this.$outer.css("paddingRight"));
                    var flag = _this.judgeWidth(ulWidth,outerDivWidth,padding);
                    if( flag  && _this.clickFlag){
                        var liW = 0;
                        for(var i = 0; i < _this.options.scrollNum; i++){
                            var idx = _this.currentIdx + i;
                            var $nextLi = _this.options.ul.find("li").eq(idx);
                            var marginBefore = parseInt(_this.options.ul.find("li:first-child").css("marginLeft"));
                            if(flag){
                                liW += calcWidth($nextLi) +4;
                                _this.currentIdx++;
                            }
                        }
                        _this.animate(-liW);
                        
                    }
                });
                this.options.leftArrow.on("click",function(e){
                    e.stopPropagation();
                    if( _this.currentIdx > 0 && _this.clickFlag){
                        var liW = 0;
                        for(var i = 0; i < _this.options.scrollNum; i++){
                            var idx = _this.currentIdx - i;
                            var $prevLi = _this.options.ul.find("li").eq(idx);
                            var marginBefore = parseInt(_this.options.ul.find("li:first-child").css("marginLeft"));
                            if(_this.currentIdx > 0){
                                liW += calcWidth($prevLi) +4;
                                _this.currentIdx--;
                            }
                        }
                        _this.animate(liW);
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
        },
        /**
         * 判断是否还有隐藏
         * @param  {[type]} ulWidth       [description]
         * @param  {[type]} outerDivWidth [description]
         * @param  {[type]} padding       [description]
         * @return {[type]}               [description]
         */
        judgeWidth : function(ulWidth,outerDivWidth,padding){
            var marginBefore = parseInt(this.options.ul.find("li:first-child").css("marginLeft"));
            return (marginBefore + ulWidth + this.currentIdx * 4)> (outerDivWidth - padding);
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
/**
 * 计算元素的实际宽度 包括padding
 * @param  {[type]} $dom [description]
 * @return {[type]}      [description]
 */
function calcWidth($dom){
    var result = $dom.width() + parseInt($dom.css("paddingLeft")) + parseInt($dom.css("paddingRight"))
    return result;
}

/**
	用法：
	var options = {
		ul : $("#menuPanelDiv>ul"),
		leftArrow : $(".left-arrow"),
		rightArrow : $(".right-arrow"),
	};
	this.tabScroll = $("#menuPanelDiv").tabScroll(options);
	this.tabScroll.ifScroll();
	
	HTML结构
		<div id="menuPanelDiv" class="outer">
			<div class="left-arrow"></div>			//绝对定位
			<div class="right-arrow"></div>
			<ul>
				<li><a href=""></a> </li>
				<li><a href=""></a></li>
			</ul>
		</div>
		
	
*/