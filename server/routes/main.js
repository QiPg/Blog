const express = require('express');
let Article = require('../dbModels/Article');
const router = express.Router();
router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/index', (req, res, next) => {
	res.render('index');
});

/**
 * 跳转到登陆界面
 */
router.get('/login', (req, res, next) => {
	res.render('login');
});
router.get('/article/list', (req, res, next) => {
    console.log(Article+"对象");
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
        res.json(articles);
	})
})
module.exports = router;