const router = require('koa-router')();
const koaBody = require('koa-body')({
    "formLimit":"5mb",
    "jsonLimit":"5mb",
    "textLimit":"5mb"
});
var marked = require('marked');
const fs = require('fs');
const userModel = require('../lib/mysql.js');
const utils = require('../utils/utils.js');
const checkObj = require('../utils/check.js');
//获取所有的label
router.get('/label', async(ctx, next) => {
       await userModel.findAllLabel().then((res)=>{
            if(res.length) {
                ctx.body = {
                    success: true,
                    data: res
                }
            }else {
                ctx.body = {
                    success: false,
                    data: {
                        msg: '获取标签失败'
                    }
                }
            }
        });
            
});
//获取文章
router.get('/getArticle', async(ctx, next) => {
       let articleArr = [],
           newArticleArr = [];
       await userModel.findAllArticle().then(res=>{
            if(res.length) {
                articleArr = res;
            }
       }); 
       for(let item of articleArr) {
            let articleItem = {
                id: item.id,
                title: item.title,
                postImg: item.postimg,
                resume: item.resume,
                moment: item.moment,
                view: item.view,
                likes: item.likes,
                discuss: item.discuss
            };
            await userModel.findLabelById(item.label).then(res=>{
                if(res.length) {
                    articleItem.labelTitle = res[0].title;
                }
            }); 
            await userModel.findUserByTicket(item.ticket).then(res=>{
                if(res.length) {
                    articleItem.userName = res[0].name;
                    articleItem.avator = res[0].avator;
                }
            }); 
            newArticleArr.push(articleItem);
       }
       ctx.body = {
            success: true,
            data: newArticleArr
       }
});
//通过文章ID获取文章
router.get('/getArticleById', async(ctx, next) => {
        console.log(ctx.query);
        let quary = ctx.query;
        let articleObj = {};
        let ticket = '';
        if(quary.id) {
            await userModel.findArticleById(Number(quary.id)).then((res)=>{
                if(res.length) {
                    articleObj.id = res[0].id;
                    articleObj.detail = res[0].detail;
                    articleObj.moment = res[0].moment;
                    articleObj.title = res[0].title;
                    articleObj.view = res[0].view;
                    articleObj.discuss = res[0].discuss;
                    articleObj.likes = res[0].likes;
                    ticket = res[0].ticket;
                }else {
                    ctx.body = {
                        success: false,
                        data: {
                            msg: '获取文章失败'
                        }
                    }
                }
            });
            await userModel.updatePostPv([articleObj.view + 1, Number(quary.id)]).then((res)=>{
                console.log('articlePvUpdate:',res);
            });
            if(ticket) {
                await userModel.findUserByTicket(ticket).then((res)=>{
                    if(res.length) {
                        articleObj.userName = res[0].name;
                        articleObj.avator = res[0].avator;
                    }
                });
            }
        }
        ctx.body = {
            success: true,
            data: articleObj
        }    
});
//通过label获取文章
router.get('/getArticleByLabel', async(ctx, next) => {
        console.log(ctx.query);
        let quary = ctx.query,
            articleArr = [],
            newArticleArr = [];
        if(quary.id) {
            await userModel.findArticleByLabel(Number(quary.id)).then((res)=>{
                if(res.length) {
                    articleArr = res;
                }else {
                    ctx.body = {
                        success: false,
                        data: {
                            msg: '获取文章失败'
                        }
                    }
                }
            });
            for(let item of articleArr) {
                let articleItem = {
                    id: item.id,
                    title: item.title,
                    postImg: item.postimg,
                    resume: item.resume,
                    moment: item.moment,
                    view: item.view,
                    likes: item.likes,
                    discuss: item.discuss
                };
                newArticleArr.push(articleItem);
                ticket = item.ticket;
                await userModel.findLabelById(item.label).then(res=>{
                    if(res.length) {
                        articleItem.labelTitle = res[0].title;
                    }
                }); 
                 if(ticket) {
                    await userModel.findUserByTicket(ticket).then((res)=>{
                        if(res.length) {
                            articleItem.userName = res[0].name;
                            articleItem.avator = res[0].avator;
                        }
                    });
                }
            }
        }
        if(newArticleArr) {

        }
        ctx.body = {
            success: true,
            data: newArticleArr
        }    
});
//创建文章
router.post('/publicArticle',koaBody, async(ctx, next) => {
        console.log(ctx.request.body);
        let userTicket = ctx.cookies.get('USER_ID');
        if(userTicket) {
            //检查用户是否合法
            let isLegal = await checkObj.checkUser(userTicket);
            if(isLegal) {
                let responseTest = ctx.request.body;
                let articel = {
                    title: ctx.request.body.title,
                    postimg: ctx.request.body.postImg,
                    detail: marked(ctx.request.body.detail),
                    label: Number(ctx.request.body.label),
                    ticket: userTicket,
                    resume: ctx.request.body.resume,
                    moment: utils.exchangeDate(new Date(Date.now()))
                }
                await userModel.insertArticle([articel.title,articel.postimg,articel.resume,articel.detail,articel.label,articel.moment,articel.ticket]).then(res=>{
                    console.log('insertArticle:',res);
                    if(res.insertId) {
                        ctx.body = {
                        success: true,
                        data: {
                            msg: '文章提交成功'
                            }
                        } 
                    }
                });
                
            }else {
                ctx.body = {
                success: false,
                data: {
                    msg: '用户信息不合法'
                    }
                } 
            }
        }else {
           ctx.body = {
                success: false,
                data: {
                    msg: '没有登录'
                }
            } 
        }
});
 module.exports = router;