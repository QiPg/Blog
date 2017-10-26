/**
 * 处理登陆鉴权的模块
 */

 module.exports=(req,resp,next)=>{
 	//如何是开发模式伪造一个user对象放入session中，跳过登录界面
 	 if(req.app.locals.isDev){
    	req.session.user={
    		_id:'59ec71c135af4b6f911c7253',
    		username:'农启兵'
    	}
      }
    console.log('所有的请求都被我拦截掉',req.url);
    //有些请求是不应该被拦截的  登陆注册不能被拦截
    //  /admin/index
    //如果请求路径 以 /admin开头，就要拦截对其进行权限校验
    if(req.url.startsWith('/admin')){
        if(req.session.user){
            //存在session,放行
            next();
        }else{
            //重定向跳转到登陆页面
            resp.redirect('/login');
        
        }
    }else{
        next();
    }
}
