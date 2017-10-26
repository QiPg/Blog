//引入express后端框架
const express = require('express');
//引入模板
const swig = require('swig');
//处理前端的POST请求
const bodyParser = require('body-parser');
//引入连接数据库的插件（驱动）
const mongoose = require('mongoose');
//引入session模块
const session = require('express-session');
const app = express();
//session的中间件,加了它以后就可以在路由里面用req.session 获取到session
app.use(session({
	secret: 'alibaba', //用来对session进行加密的密钥，有了这个密钥，才能解密
	resave: false, //是否重新保存会话
	saveUninitialized: true //自动初始化会话
}));
//处理前端的POST请求的配置
//处理前端传给后端的表单格式数据（表单提交、ajax提交）  fromdata
app.use(bodyParser.urlencoded({ extended: false }));
//处理前端以json格式传给后端的数据 application/json 
app.use(bodyParser.json());

//编辑器
const ueditor = require("ueditor");
const path = require('path');
//将public/ueditor 目录静态化
app.use('/ueditor', express.static(__dirname + '/public/ueditor'));
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    //客户端上传文件设置
    var imgDir = '/ueditor/upload/img'
     var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/ueditor/upload/file'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/ueditor/upload/video'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

//模板配置--------------------------------
app.engine('html', swig.renderFile);
app.set('views', './server/views');
app.set('view engine', 'html');
//取出设置的环境变量
const isDev = process.env.NODE_ENV === 'dev';
app.locals.isDev=isDev;
if(isDev) {
	//清除缓存
	swig.setDefaults({
		cache: false
	});
	//--------------node中调用webpack实现热刷新的中间件（自动编译）--------
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
	//--------------node中调用webpack实现热刷新的中间件end-----
	//------------------路由--------------------
	
	//引入路由
	 require('./server/routes/routes')(app);
	//-----------------路由end------------------

	//---------实现服务器重启后浏览器能自动刷新--------------
	const reload = require('reload');
	const http = require('http');
	reload(app); //通知浏览器刷新
	//-----------浏览器自动刷新--------------------
	const browserSync = require('browser-sync').create();
	const server = http.createServer(app);
	server.listen(8080, () => {
		//初始化要监听的目录
		browserSync.init({
			ui: false,
			open: false,
			online: false,
			notify: false,
			proxy: 'http://localhost:8080/', //要代理的服务器地址
			files: './server/views/**', //自动刷新页面
			port: 3000
		}, () => {
			console.log('代理服务器启动成功');
		});
		console.log('web应用启动成功1');
	});

} else {
	app.use('/public', express.static(__dirname + '/public')); //配置中间件后（将编译后的文件放在内存里）可以注释这个了 这个发布的会后才调用

	//引入路由
	 require('./server/routes/routes')(app);
	//开启node服务
	app.listen(8080, () => {
		console.log('web应用启动成功 生产模式');
	});
}
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Blog2',{useMongoClient: true}).on('open',(db)=>{
    console.log('数据库连接成功');
})
.on('error',(error)=>{
    console.log('数据库连接失败');
});
//配置静态资源目录(可配置多个 所有的请求都会发送到服务器 给每个请求都设置路由就很不现实，所以需要设置静态资源)
//app.use('/public', express.static(__dirname + '/public')); //配置热加载中间件后（将编译后的文件放在内存里）可以注释这个了 这个发布的会后才调用