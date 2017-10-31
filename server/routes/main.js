const express = require('express');
let Article = require('../dbModels/Article');
let User = require('../dbModels/User');
const router = express.Router();
//router.get('/', (req, res, next) => {
//	res.render('index');
//});

router.use((req, res, next) => {
	res.locals.isAjax = req.xhr;
	next();
})
/*
 * 文章首页
 */
router.get('/index', (req, res, next) => {
	getWzlb(req, res, next);
});

/*
 * 文章详情
 */
router.get('/article/detail/:id', (req, res, next) => {
	let id=req.params.id;
	Article.findById(id).then(article=>{
		if(article){
			res.render('article-detail',{
				  article
			});
		}
	}).catch(error=>{
		res.render('404');
	})
});

/**
 * 跳转到登陆界面
 */
router.get('/login', (req, res, next) => {
	res.render('login');
});
/**
 * 文章首页列表
 */
router.get('/', (req, res, next)=>{
	getWzlb(req, res, next);
});

function getWzlb (req, res, next){
	let page = req.query.page || 1;
	let offset = ((page - 1) * 9); //起始页
	//查询数据总共有多少条
	Article.count().then(count => {
		responseMesg.data.total = count;
	});
	//skip  limit  跳过前面skip条数据，然后往后取limit条数据
	Article.find().sort({
		'_id': -1
	}).skip(offset).limit(9).then(articles => {
		articles = articles.map((item,index)=>{
            //获取body中的第一张图片地址作为封面
            let result = item.body.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/);
            //console.log(result);
            if(result){
                item.cover = result[1];
            }else{
                //如果匹配不到，给一个默认的封面
                item.cover = 'http://o0xihan9v.qnssl.com/wp-content/themes/Always/images/thumb.jpg';
            }
            
            //过滤html并且截取前76个字符
            item.body = item.body.replace(/<[^>]+>/g,'').substring(0,77)+'...';

            return  item;
        });
        res.render('index',{
        	articles,
        });
	})
};
module.exports = router;