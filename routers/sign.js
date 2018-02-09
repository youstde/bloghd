const router = require('koa-router')();
const koaBody = require('koa-body')({
    "formLimit":"5mb",
    "jsonLimit":"5mb",
    "textLimit":"5mb"
});
const fs = require('fs');
const md5 = require('md5');
const moment = require('moment');
const Oss = require('../lib/oss.js');
const userModel = require('../lib/mysql.js');
const checkObj = require('../utils/check.js');
const config = require('../config/default.js');
//测试用
router.get('/imageExit/:action', async(ctx, next) => {
        console.log(ctx.params.action);
        let isExit = false;
        if(ctx.params.action) {
           isExit =  await new Promise((reslove, reject)=>{
                        fs.stat(process.cwd()+'/public/images/' + ctx.params.action, function(err,stats){
                        if(err) {
                            reslove(false);
                        }else {
                            if(stats.isFile()) {
                                reslove(true);
                                console.log('isExit:',true);
                            }
                        }
                    });
                });
            if(isExit) {
                ctx.body = 'isExit';
            }else {
                ctx.body = 'not Exit';
            }
        }
        // ctx.body = await fs.createReadStream(process.cwd() + '/package.json');
            
});
//检查用户登录状态
router.get('/getUserInfo', async(ctx, next) => {
    let userTicket = ctx.cookies.get('USER_ID');
    if(userTicket) {
        let isLegal = await checkObj.checkUser(userTicket);
        let userObj = {};
        if(isLegal) {
            userObj.avator = isLegal.avator;
            userObj.name = isLegal.name;
            userObj.id = isLegal.id;
            ctx.body = {
                success: true,
                data: userObj
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
//用户注册
router.post('/signUp',koaBody, async(ctx, next) => {
		console.log(ctx.request.body);
        let isCheck = true;
        if(ctx.request.body.userName) {
                const user = {
                    name: ctx.request.body.userName,
                    pwd: ctx.request.body.userPwd,
                    phone: ctx.request.body.userPhone,
                    avator: ctx.request.body.avator
                }
             await userModel.findDataByName(user.name).then((res)=> {
                if(res.length > 0) {
                    ctx.body = {
                        success: false,
                        data: {
                            msg:'用户名已存在'
                        }
                    }
                    isCheck = false;
                }
             });
             if(isCheck) {
                await userModel.findDataByPhone(user.phone).then((res)=> {
                    if(res.length > 0) {
                        ctx.body = {
                            success: false,
                            data: {
                                msg:'该用户已经存在，请直接登录'
                            }
                        }
                        isCheck = false;
                    }
                });
             }
             if(isCheck) {
                    await userModel.insertData([user.name, user.pwd ,user.phone, user.avator, moment().format('YYYY-MM-DD HH:mm:ss'),md5(user.pwd + user.phone)]).then(res=>{
                    if(res.insertId) {
                         ctx.body = {
                        success: true,
                        data: {
                            msg: '注册成功'
                        }
                     }
                    }
                 });
             }
        }
			
});
//预请求处理
router.options('/signUp', async(ctx, next) => {
		ctx.type = 'json';
    	ctx.body = {
    	success: true,
    	data: ''
    	}
			
});
//登录
router.post('/signIn',koaBody, async(ctx, next) => {
        console.log(ctx.request.body);
        let isCheck = true;
        const user = {
            phone : ctx.request.body.userPhone,
            pwd : ctx.request.body.userPwd
        }
        if(user.phone) {
             await userModel.findDataByPhone(user.phone).then((res)=> {
                if(res.length > 0) {
                    if(res[0].pass === user.pwd){
                         ctx.cookies.set(
                                'USER_ID',
                                res[0].ticket,
                                {
                                    domain: config.DOMAIN,  //线上
                                    // domain: 'youstde.blog.com',
                                    path: '/',
                                    maxAge: 24 * 60 * 60 * 1000,
                                    expires: new Date('2018-1-21'),  // cookie失效时间
                                    httpOnly: false,  // 是否只用于http请求中获取
                                    overwrite: false  // 是否允许重写
                                }
                            );
                        ctx.body = {
                            success: true,
                            data: {
                                msg:'登录成功'
                            }
                        }
                    }else {
                        ctx.body = {
                            success: false,
                            data: {
                                msg:'用户名或密码错误'
                            }
                        }
                    }
                }else {
                    ctx.body = {
                        success: false,
                        data: {
                            msg:'用户名或密码错误'
                        }
                    }
                }
             });
        }
});
//图片上传
router.post('/imageUpload',koaBody, async(ctx, next) => {
    console.log(ctx.request.body);
    const avator = ctx.request.body.avator;
                let base64Data = avator.replace(/^data:image\/\w+;base64,/, "");
                let dataBuffer = new Buffer(base64Data, 'base64');
                let getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now()
                //写在public/images目录下
                let upload = await new Promise((reslove,reject)=>{
                    fs.writeFile('./public/images/' + getName + '.png', dataBuffer, err => { 
                        if (err) {
                            throw err;
                            reject(false)
                        };
                        reslove(true)
                        console.log('图片上传成功') 
                    });            
                })
                //上传到public/images下的返回值
                // if(upload) {
                //     ctx.body = {
                //         success: true,
                //         data: {
                //             msg: '头像上传成功',
                //             picUrl: '//api.youstde.blog.com/images/' + getName + '.png'
                //             }
                //         }
                // }
                //上传到OSS
                    let picUrl = process.cwd() + '/public/images/' + getName + '.png';
                    let result = await Oss.put('/stblog',process.cwd()+ '/public/images/'+getName+'.png', getName + '.png');
                    if(result.success) {
                        ctx.body = {
                        success: true,
                        data: {
                            msg: '图片上传成功',
                            picUrl: result.requestUrls[0].split(':')[1]
                            }
                        }
                    }else {
                        ctx.body = {
                        success: false,
                        data: {
                            msg: '图片上传失败'
                        }
                        }
                    }
            
});
 module.exports = router;