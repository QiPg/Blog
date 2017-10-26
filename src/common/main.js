console.log('入口文件公共的js4');
//修改js实现热刷新
//if(module.hot){
//	module.hot.accept();
//}
//实现访问那个html就自动引入js(按需加载)
let modelPath=$('[data-main]').data('main');
if(modelPath){
	//异步引入模块
	import('../'+modelPath).then(model=>{
		console.log('加载模块成功'+model);
	}).catch(err=>{
		console.log('加载模块失败'+err);
	})
}
