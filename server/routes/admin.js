const express = require('express');
const router = express.Router();

let Article = require('../dbModels/Article');
let User = require('../dbModels/User');
//后端响应给前端的数据格式
let responseMesg;
router.use((req, resp, next) => {
	//初始化一下数据格式
	responseMesg = {
		success: false,
		message: '',
		data: {
			total: 0,
			rows: []
		}
	};
	next();
});

/**
 * 跳转到登陆后的首页
 */
router.get('/index', (req, res, next) => {
	res.render('admin/article-list', {
		user: req.session.user
	});
});
/*
 * 跳转到个人资料修改页面
 */
router.get('/myinfo', (req, res, next) => {
	res.render('admin/article-myinfo', {
		user: req.session.user
	});
});
/*
 * 保存用户资料（此功能为个人隐私，os部分代码省略）
 */
router.post('/article/updatemyinfo', (req, res, next) => {
	
	User.findByIdAndUpdate(parms.id, {
		username: daa[0]
	}).then(user => {
		if(user) {
			responseMesg.success = true;
			responseMesg.message = '资料修改成功！说明主人还是爱你的';
			res.json(responseMesg);
		}else{
			responseMesg.success = false;
			responseMesg.message = '资料修改失败！这都会修改失败，主人也会有大意的时候啊';
			res.json(responseMesg);
		}
	});

});
/**
 * 查询列表（一次性查出所有数据）
 */
router.get('/article/list', (req, res, next) => {
	Article.find().then(articles => {
		res.json(articles);
	});
});

/**
 * 查询文章列表（服务端分页）
 */
router.get('/article/pagination', (req, res, next) => {
	//获取下前端传给后端的分页数据
	let offset = Number(req.query.offset);
	let limit = Number(req.query.limit); //每页固定显示的数据条数（10）
	let order = (req.query.order === 'asc' ? 1 : -1);
	let sort = req.query.sort || '_id';
	//查询数据总共有多少条
	Article.count().then(count => {
		responseMesg.data.total = count;
	});
	//skip  limit  跳过前面skip条数据，然后往后取limit条数据
	Article.find().sort({
		[sort]: [order]
	}).skip(offset).limit(limit).then(articles => {
		responseMesg.success = true;
		responseMesg.data.rows = articles;
		res.json(responseMesg);
	})
});

let i = 0;
/**
 * 保存文章
 */
router.post('/article/save', (req, res, next) => {
	let parms = req.body;
	if(!parms.title || !parms.body) {
		responseMesg.message = '标题或者内容不能为空！';
		res.json(responseMesg);
		return;
	}
	new Article({
		title: parms.title,
		body: parms.body
	}).save().then(article => {
		responseMesg.message = '文章添加成功';
		responseMesg.success = true;
		res.json(responseMesg);
	});
});
/*
 * 跳转文章添加页面
 */
router.get('/article/add', (req, res, next) => {
	res.render('admin/article-add', {
		user: req.session.user
	});
});
/**
 * 根据id查询文章，并跳转到编辑页面
 */
router.get('/article/:id', (req, res, next) => {
	Article.findById(req.params.id).then(article => {
		res.render('admin/article-edit', {
			article,
			user: req.session.user
		});
	})

});
//修改文章
router.post('/article/update', (req, res, next) => {
	let parms = req.body;
	Article.findByIdAndUpdate(parms.id, {
		title: parms.title,
		body: parms.body
	}).then(article => {
		if(article) {
			responseMesg.message = '文章修改成功';
			responseMesg.success = true;
			res.json(responseMesg);
		} else {
			responseMesg.message = '文章修改失败';
			responseMesg.success = false;
			res.json(responseMesg);
		}
	});
});
//删除文章
router.delete('/article/:id', (req, res, next) => {
	Article.findByIdAndRemove(req.params.id).then(article => {
		if(article) {
			responseMesg.message = '文章删除成功';
			responseMesg.success = true;
			res.json(responseMesg);
		} else {
			responseMesg.message = '文章删除失败';
			responseMesg.success = false;
			res.json(responseMesg);
		}
	})

});
/*
 * 退出
 */
router.get('/logout', (req, res, next) => {
	req.session.user = null;
	res.redirect('/login');
});
module.exports = router;