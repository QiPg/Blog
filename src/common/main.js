
//实现访问那个html就自动引入js(按需加载)
let modelPath=$('[data-main]').data('main');
if(modelPath){
	//异步引入模块
	import('../'+modelPath).then(model=>{
		console.log('加载模块成功'+model);
	}).catch(err=>{
		console.log('加载模块失败'+err);
	})
};
if(!location.pathname.startsWith('/admin')&&!location.pathname.startsWith('/login')){
	require('jquery-pjax');
	$(document).pjax('a.pjax','#main');
}
