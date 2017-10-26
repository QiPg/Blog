module.exports = app => {
	//判断是否是开发模式如果是开发模式就不验证
//  if(!app.locals.isDev){
//  	
//  }
    //校验登陆的中间件,校验是否登陆的中间件
    app.use(require('./auth'));
	app.use('/api', require('./api'));
	app.use('/admin', require('./admin'));
	app.use('/', require('./main'));
}