function reset() {
	let _margin = 6 * 2;
	let $content = $('#content.post-index'); //父级
	let $articles = $content.find('article'); //卡片集合
	let content_width = $content.width(); //父级宽度
	let articles_width_old = 249 + _margin; //卡片初始化

	//一行能显示的卡片数量
	let max_column = parseInt(content_width / articles_width_old);
	console.log(max_column);
	//设置每个卡片的宽度
	$articles.css('width', content_width / max_column - _margin);
	//获取父级元素的高度
	let content_herght = $content.height();
	//新的卡片新宽度
	let article_width_new = content_width / max_column;
	$content.css('height', content_herght); //设置父级初始高度
	$articles.css({
		'position': 'absolute',
		'left': 0,
		'top': 0
	});
	let all_height = []; //所有卡片的高度
	$articles.each(function(index, item) {
		let column = index % max_column; //第几列
		let left = article_width_new * column;
		let row = parseInt(index / max_column); //第几行
		all_height.push($(item).height() + _margin);
		let top = 0;
		while(row > 0) {
			row--;
			top += all_height[row * max_column + column]
		}
		$(item).css({
			'transform': 'translate(' + left + 'px,' + top + 'px)'
		});

	})
}
reset();
//浏览窗口发生变化时调用
window.onresize = function() {
	reset();
}
qingqqiu();
//分页
function qingqqiu() {
	let total = $('#total').val();
	let yesu = (total / 9)+1;
	console.log("会执行吗" + yesu)
	if(yesu > 1) {}
	$('#shangye').on('click', function(e) {
		let ddd=getUrlParam('page')
		if(!ddd){
			qq(1);
			return;
		}
		let dd=--ddd;
		if(dd==0){
			return;
		}
		qq(dd);
		
	})
	$('#xiaye').on('click', function(e) {
		let ddd=getUrlParam('page');
		if(ddd==null){
			qq(2);
			return;
		}
		let dd=++ddd;
		if(dd>yesu){
			$.Prompt("欢迎光临本站!4S",4000);("已经是最后一页了");
			return;
		}
		qq(dd);
	})

}

function qq(rint) {
	window.location.href = '/index?page=' + rint;
}

//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if(r != null) return unescape(r[2]);
	return null; //返回参数值
}