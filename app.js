//引入express后端框架
const express = require('express');
//引入模板
const swig = require('swig');
const app = express();
//调用webpack配置
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true, //编译时控制台不显示信息
	stats: {
		colors: true
	},
	publicPath: webpackConfig.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));
//模板配置--------------------------------
app.engine('html', swig.renderFile);
app.set('views', './server/views');
app.set('view engine', 'html');
//配置静态资源目录(可配置多个 所有的请求都会发送到服务器 给每个请求都设置路由就很不现实，所以需要设置静态资源)
//app.use('/public', express.static(__dirname + '/public')); //配置中间件后（将编译后的文件放在内存里）可以注释这个了 这个发布的会后才调用

//清除缓存
swig.setDefaults({
	cache: false
});
//设置路由
app.get('/', (req, res, next) => {
	res.render('index');
})
//开启node服务
app.listen(8080, () => {
	console.log('web应用启动成功');
});