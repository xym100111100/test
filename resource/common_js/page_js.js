var classclick = 0;
 
var listNum = parseInt($('#count').val());//资产数

var page = 40;

if($('input').is('#page')){ 
	
    page = $('#page').val(); 
    
}

var listPage = Math.ceil(listNum/page);//页面数 

pagelisthtml()
function pagelisthtml()
{
	//翻页前
	var pagesBefore = "<ul><li><a href='javascript:;' class='list_page list_page_click' data-page='shouye' onclick='pagesFirst(this)'>首页</a></li><li><a href='javascript:;' class='list_page' data-page='on-page' onclick='pagesPrev(this)'>上一页</a></li>";
	
	//翻页后面
	var  pagesAfter = "<li><a href='javascript:;' class='list_page' data-page='under-page' onclick='pagesNext(this)'>下一页</a></li><li><a href='javascript:;' class='list_page' data-page='shouye' onclick='pagesLast(this)'>末页</a></li><li><span class='pageinfo'>共 <strong>" + listPage + "</strong>页<strong>" + listNum + "</strong>条</span></li></ul>";
	
	//页面初始添加翻页
	if(listPage<=5){
		for(var i=1;i<=listPage;i++){
			pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
		}
		pagesBefore += pagesAfter;
	}else{
		for(var i=1;i<=5;i++){
			pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
		}
		pagesBefore += pagesAfter;
	}
	$('.pages').html(pagesBefore);
	$('.pages>ul>li>a').each(function(){
		if($(this).text()==1){
			$(this).parent().addClass('thisclass active');
		}
	});
}


//点击翻页
function pagesClick(obj){
	
	//点击的页面
	var pagesNumNow = parseInt($(obj).text());
	
	//翻页前面
	pagesBefore = "<ul><li><a href='javascript:;' class='list_page list_page_click' data-page='shouye' onclick='pagesFirst(this)'>首页</a></li><li><a href='javascript:;' class='list_page' data-page='on-page' onclick='pagesPrev(this)'>上一页</a></li>";
	
	//翻页后面
	 pagesAfter = "<li><a href='javascript:;' class='list_page' data-page='under-page' onclick='pagesNext(this)'>下一页</a></li><li><a href='javascript:;' class='list_page' data-page='shouye' onclick='pagesLast(this)'>末页</a></li><li><span class='pageinfo'>共 <strong>" + listPage + "</strong>页<strong>" + listNum + "</strong>条</span></li></ul>";
	
	if(listPage<=5){
		var pagesNewHtml="";
		for(var i=1;i<=listPage;i++){
		pagesNewHtml += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
		}
		$('.pages').html(pagesBefore+pagesNewHtml+pagesAfter);
		$('.pages>ul>li>a').each(function(){
			if($(this).text()==pagesNumNow){
				$(this).parent().addClass('thisclass active');
			}
		});
	}else{
		//点击前三页
		if(pagesNumNow<=3){
			var pagesNewHtml="";
			for(var i=1;i<=5;i++){
			pagesNewHtml += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
			}
			$('.pages').html(pagesBefore+pagesNewHtml+pagesAfter);
			$('.pages>ul>li>a').each(function(){
				if($(this).text()==pagesNumNow){
					$(this).parent().addClass('thisclass active');
				}
			});
		}
		
		//点击前后三页之外
		if(pagesNumNow>3 && pagesNumNow<=listPage-3 && listPage>=6){
			var pagesNewHtml="";
			for(var i=pagesNumNow-2;i<=pagesNumNow+2;i++){
			pagesNewHtml += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
			}
			$('.pages').html(pagesBefore+pagesNewHtml+pagesAfter);
			$('.pages>ul>li>a').each(function(){
				if($(this).text()==pagesNumNow){
					$(this).parent().addClass('thisclass active');
				}
			});
		}
		
		//点击后三页
		if(pagesNumNow>3 && pagesNumNow>listPage-3){
			var pagesNewHtml="";
			for(var i=listPage-4;i<=listPage;i++){
			pagesNewHtml += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
			}
			$('.pages').html(pagesBefore+pagesNewHtml+pagesAfter);
			$('.pages>ul>li>a').each(function(){
				if($(this).text()==pagesNumNow){
					$(this).parent().addClass('thisclass active');
				}
			});
		}
	}

	$(window).scrollTop($('.assortment_content').offset().top);
	ajaxPages(pagesNumNow)
}

//点击首页
function pagesFirst(obj,nums){
	  
	 if(nums == '' || nums == 0 || nums == null){
	 	nums = 0;
	 }else{
	 	nums = 1;
	 }
	  
	var pagesNumNow = parseInt($(obj).text());
	
	//翻页前面
	pagesBefore = "<ul><li><a href='javascript:;' class='list_page list_page_click' data-page='shouye' onclick='pagesFirst(this)'>首页</a></li><li><a href='javascript:;' class='list_page' data-page='on-page' onclick='pagesPrev(this)'>上一页</a></li>";
	
	//翻页后面
	 pagesAfter = "<li><a href='javascript:;' class='list_page' data-page='under-page' onclick='pagesNext(this)'>下一页</a></li><li><a href='javascript:;' class='list_page' data-page='shouye' onclick='pagesLast(this)'>末页</a></li><li><span class='pageinfo'>共 <strong>" + listPage + "</strong>页<strong>" + listNum + "</strong>条</span></li></ul>";
	
	if(listPage<=5){
		for(var i=1;i<=listPage;i++){
			pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
		}
		pagesBefore += pagesAfter;
	}else{
		for(var i=1;i<=5;i++){
			pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
		}
		pagesBefore += pagesAfter;
	}
	$('.pages').html(pagesBefore);
	$('.pages>ul>li>a').each(function(){
		if($(this).text()==1){
			$(this).parent().addClass('thisclass active');
		}
	});
	
	$(window).scrollTop($('.assortment_content').offset().top);
	if(nums == "0"){
		ajaxPages(1);
	}

}

//点击末页
function pagesLast(obj){

	//翻页前面
	pagesBefore = "<ul><li><a href='javascript:;' class='list_page list_page_click' data-page='shouye' onclick='pagesFirst(this)'>首页</a></li><li><a href='javascript:;' class='list_page' data-page='on-page' onclick='pagesPrev(this)'>上一页</a></li>";
	
	//翻页后面
	 pagesAfter = "<li><a href='javascript:;' class='list_page' data-page='under-page' onclick='pagesNext(this)'>下一页</a></li><li><a href='javascript:;' class='list_page' data-page='shouye' onclick='pagesLast(this)'>末页</a></li><li><span class='pageinfo'>共 <strong>" + listPage + "</strong>页<strong>" + listNum + "</strong>条</span></li></ul>";
	
	if(listPage<=5){
		for(var i=1;i<=listPage;i++){
			pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
		}
		pagesBefore += pagesAfter;
	}else{
		for(var i=listPage-4;i<=listPage;i++){
			pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
		}
		pagesBefore += pagesAfter;
	}
	$('.pages').html(pagesBefore);
	$('.pages>ul>li>a').each(function(){
		if($(this).text()==listPage){
			$(this).parent().addClass('thisclass active');
		}
	});
	
	$(window).scrollTop($('.assortment_content').offset().top);
	ajaxPages(listPage)
}

//点击上一页
function pagesPrev(obj){
	var pagesNumNow = parseInt($('.pages>ul>li.active a').text());
	if(pagesNumNow-1<=0){
		return false;
	}else{
		//翻页前面
		pagesBefore = "<ul><li><a href='javascript:;' class='list_page list_page_click' data-page='shouye' onclick='pagesFirst(this)'>首页</a></li><li><a href='javascript:;' class='list_page' data-page='on-page' onclick='pagesPrev(this)'>上一页</a></li>";
		
		//翻页后面
		 pagesAfter = "<li><a href='javascript:;' class='list_page' data-page='under-page' onclick='pagesNext(this)'>下一页</a></li><li><a href='javascript:;' class='list_page' data-page='shouye' onclick='pagesLast(this)'>末页</a></li><li><span class='pageinfo'>共 <strong>" + listPage + "</strong>页<strong>" + listNum + "</strong>条</span></li></ul>";
		
		var pagesNewHtml="";
		if(listPage<=5){
			for(var i=1;i<=listPage;i++){
				pagesNewHtml += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
			}
		}else{
			if(pagesNumNow<=3){
				for(var i=1;i<=5;i++){
				pagesNewHtml += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
				}
			}else{
				if(pagesNumNow-1==listPage-1){
					for(var i=pagesNumNow-4;i<=pagesNumNow;i++){
						pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
					}
				}else{
					for(var i=pagesNumNow-3;i<=pagesNumNow+1;i++){
						pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
					}
				}	
			}
		}
		
		$('.pages').html(pagesBefore +pagesNewHtml+ pagesAfter);
		$('.pages>ul>li>a').each(function(){
			if($(this).text()==pagesNumNow-1){
				$(this).parent().addClass('thisclass active');
			}
		});
		$(window).scrollTop($('.assortment_content').offset().top);
		ajaxPages(pagesNumNow-1)
	}	
}

//点击下一页

function pagesNext(obj){
	var pagesNumNow = parseInt($('.pages>ul>li.active a').text());
	 
	if(pagesNumNow+1>listPage){
		return false;
	}else{
		//翻页前面
		pagesBefore = "<ul><li><a href='javascript:;' class='list_page list_page_click' data-page='shouye' onclick='pagesFirst(this)'>首页</a></li><li><a href='javascript:;' class='list_page' data-page='on-page' onclick='pagesPrev(this)'>上一页</a></li>";
		
		//翻页后面
		 pagesAfter = "<li><a href='javascript:;' class='list_page' data-page='under-page' onclick='pagesNext(this)'>下一页</a></li><li><a href='javascript:;' class='list_page' data-page='shouye' onclick='pagesLast(this)'>末页</a></li><li><span class='pageinfo'>共 <strong>" + listPage + "</strong>页<strong>" + listNum + "</strong>条</span></li></ul>";
		
		var pagesNewHtml="";
		if(listPage<=5){
			for(var i=1;i<=listPage;i++){
				pagesNewHtml += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
			}
		}else{
			if(listPage-pagesNumNow<=2){
				for(var i=listPage-4;i<=listPage;i++){
				pagesNewHtml += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
				}
			}else{
				if(pagesNumNow-1<=0){
					for(var i=pagesNumNow;i<=pagesNumNow+4;i++){
						pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
					}
				}else{
					for(var i=pagesNumNow-1;i<=pagesNumNow+3;i++){
						pagesBefore += "<li><a href='javascript:;' onclick='pagesClick(this)'>" + i + "</a></li>";
					}
				}
			}
		}
		
		$('.pages').html(pagesBefore +pagesNewHtml+ pagesAfter);
		$('.pages>ul>li>a').each(function(){
			if($(this).text()==pagesNumNow+1){
				$(this).parent().addClass('thisclass active');
			}
		});
		
		$(window).scrollTop($('.assortment_content').offset().top);
		ajaxPages(pagesNumNow+1)
	}
} 
	

 
function ajaxPages(num,page_count)
{
	
	$('.news_list').html('加载中请稍等... ...');  

	var label = $('#label').val();
 
  
	i = num;
	if(i<=1){
		i = 1;
	}
	

	$.ajax({
	   type: "POST",
	   url: '/news/getPageData', 
	   data: "page="+i+"&label="+label,
	   success: function(msg){
				
	    	msg = eval('['+msg+']');

	    	var html = '';
	    	if(msg){
	    		
				if(page_count == 'count'){
					listNum = msg[0].count; 
					 
					listPage = Math.ceil(listNum/30);//页面数 
					
					pagelisthtml()
				}
				 
				$.each(msg[0].res,function (i,val){

					html += '<div class="gn_box"><div class="gn_item"><a href="'+val.articleurl+'"><img class="delay" src="" data-src="'+val.thumbnail+'" alt="加载失败"/></a><div class="words"><a href="'+val.articleurl+'"><h2>'+val.title+'</h2><h3><span></span>'+val.body+'</h3><h4>小编:<span>管理员</span> <span><i></i>'+val.articletime+'</span></h4></a></div></div></div>';

				});
			  
	  		}

	    			
	    	$('.news_list').html(html);  
	    		
	    }
	    	
	}); 
}





function s(){

	$('img.delay').each(function(){
		if($(this).offset().top<$(window).height()+$(window).scrollTop()){
			
			$(this).attr('src',$(this).data('src')).removeClass('relay');
		}else{
			return false;
		}
	});
};

// 分类
function classification(name)
{
	classclick = 1;
	$('#listname').val(name);

	ajaxPages(1,'count');
	pagesFirst($('.list_page_click'),1);
	pagelisthtml() 

}

// 类型
function typelist(name)
{
	classclick = 1;
	
	$('#nametype').val(name);
	ajaxPages(1,'count');
	pagesFirst($('.list_page_click'),1); 
	pagelisthtml() 
}

// 版本
function version(name)
{
	classclick = 1;
	
	$('#edition').val(name);
	ajaxPages(1,'count');
	pagesFirst($('.list_page_click'),1); 
	pagelisthtml() 
}

// 语言
function language(name)
{
	classclick = 1;
	
	$('#translatename').val(name);
	ajaxPages(1,'count');
	pagesFirst($('.list_page_click'),1);
	pagelisthtml()
	
}
 
$('.picture_page').click(function(){
	
	var act = $(this).attr('data-type');
	
	if(act.length >= 1){
		
		$('#act').val(act);
		
	}
	
	ajaxPages(0,'count');// games_is
	
	$.each($('.games_list'), function() {
		
		$(this).removeClass('games_is');
		
		$(this).find('li').children('a').children('span').removeClass('games_is_color');
		
	});
	
	$(this).children().addClass('games_is_color');
	
	$(this).parents('.games_list').addClass('games_is');
	
	return false;
});

function soting(soting)
{
	
	ajaxPages(0,0,soting);
}

$(document).on('click','.title_wrap',function(){

	var id = $(this).attr('data-id');

	$('#label').val(id);

	ajaxPages(0,'count');

});