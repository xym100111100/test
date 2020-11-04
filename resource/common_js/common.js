$(function(){
    $(document).on('click', ".radio01 input[type='radio']", function(e) {
        var data_name = $(this).attr("name");
        $("input[name=" + data_name + "]").removeAttr("checked");
        $("input[name=" + data_name + "]").parent(".radio01").removeClass("checked");
        $(this).attr("checked","checked");
        $(this).parent(".radio01").addClass("checked");
    });
    $(document).on('click', ".checkbox01 input[type='checkbox']", function(e) {
        if(!$(this).parent(".checkbox01").hasClass("checked")){
            $(this).attr("checked","checked");
            $(this).parent(".checkbox01").addClass("checked");
        }else{
            $(this).removeAttr("checked");
            $(this).parent(".checkbox01").removeClass("checked");
        }
    });
    $(document).on('click','.inp_down>input',function(){
        var flag = $(this).parent().hasClass("open");
        $(".inp_down").removeClass("open");
        // $(this).parent().toggleClass("open");
        flag ? $(this).parent().removeClass("open") : $(this).parent().addClass("open");
    });
    $(document).on('click','.inp_down li',function(){
        var value = $(this).text();
        $(this).parent("ul").siblings("input").val(value);
        $(this).closest(".inp_down").toggleClass("open");
    });
    $(".house-list a").click(function(){
        $(this).addClass("active").siblings("a").removeClass("active");
    });
    
});
/*
*展示内容收缩
*/
function toggle(targetId,obj){
    $(targetId).toggleClass("part");
}
/** 
 * 季度 半年度初始化 
 * @param ohd  input dom对象非jquery对象
 * @param type 类型 季度1 or 半年2  不填默认季度
 * @param sgl 无值单个，有值默认范围
 *
 * 使用：
 * 单个季度： renderSeasonDate(document.getElementById('date1'));
 * 季度区间： renderSeasonDate(document.getElementById('date2'),1,1);
 * 单个半年度：  renderSeasonDate(document.getElementById('date3'),2);
 * 半年度区间：  renderSeasonDate(document.getElementById('date4'),2,1);
 */  
function renderSeasonDate(ohd,type,sgl){  
    /*需要laydate*/
    if(laydate == undefined || laydate == null){
        alert("需要laydate插件");
        return;
    }
    var $Date = laydate;
    var ele = $(ohd);  
    $Date.render({  
        elem: ohd,
        type: 'month',  
        format: type == 2 ? 'yyyy年-M年度' : 'yyyy年-M季度',  
        range: sgl ? '~' : null, 
        min:"1900-1-1",
        max:"2099-12-31",
        btns: ['clear', 'confirm'],
        ready: function(value, date, endDate){
            var hd = $("#layui-laydate"+ele.attr("lay-key"));  
            if(hd.length>0){  
                hd.click(function(){  
                    ren($(this),type);  
                });  
            }  
            ren(hd,type);  
        },  
        done: function(value, date, endDate){ 
            if(type == 2){
                // 半年度
                if(!isNull(date) && date.month < 3){  
                    ele.attr("startDate",date.year + "-" + date.month); 
                }else{
                    ele.attr("startDate","");
                }
                if(!isNull(endDate) && endDate.month < 3){  
                    ele.attr("endDate",endDate.year + "-" + date.month)  
                }else{
                    ele.attr("endDate","");
                }  
            }else{
                // 季度
                if(!isNull(date) && date.month > 0 && date.month < 5){  
                    ele.attr("startDate",date.year + "-" + date.month);  
                }else{
                    ele.attr("startDate","");
                }
                if(!isNull(endDate) && endDate.month > 0 && endDate.month < 5){  
                    ele.attr("endDate",endDate.year + "-" + endDate.month)  
                }else{
                    ele.attr("endDate","");
                }  
            }
            
        }  
    });  
    var ren=function(thiz,type){  
        var mls=thiz.find(".laydate-month-list");  
        mls.each(function(i,e){  
            $(this).find("li").each(function(inx,ele){ 
                var cx = ele.innerHTML;  
                if(type == 2){
                    // 半年
                    if(inx == 0){  
                        ele.innerHTML = "上半年";  
                    }else if(inx == 1){
                        ele.innerHTML = "下半年";  
                    }else{  
                        ele.style.display="none";  
                    }  
                }else{
                    // 季度
                   if(inx<4){  
                       ele.innerHTML=cx.replace(/月/g,"季度");  
                   }else{  
                       ele.style.display="none";  
                   }   
                }
                
            });  
        });  
    }  
}
/**
 * 非空判断
 * @param  {[type]}  s [description]
 * @return {Boolean}   [description]
 */
function isNull(s){
    if(s==null||typeof(s)=="undefined"||s=="")return true;
    return false;
}