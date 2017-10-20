console.log('入口文件公共的js4');
require('../index/index');
//修改js实现热刷新
if(module.hot){
	module.hot.accept();
}
