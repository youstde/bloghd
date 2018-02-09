const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const cors = require('koa2-cors');
const config = require('./config/default.js');
const middlewares = require('./middlewares/middlewares.js');
const staticCache = require('koa-static-cache');
const app = new Koa();
var _environment = process.argv[2];
console.log('_environment:',_environment);
if(_environment && _environment === 'pre') {
    config.ENVIRONMENT = 'PRE';
    config.DOMAIN = 'youstde.blog.com';
}
console.log(config.ENVIRONMENT);
// 具体参数我们在后面进行解释
app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        if(config.ENVIRONMENT == 'PRE') {
            return 'http://youstde.blog.com'; // 这样就能只允许localhost:8080 这个域名的请求了
        }else {
            return 'http://stblog.ltyun.cc';
        }
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

const main = async ctx => {
	console.log()
	// ctx.cookies.set(
 //        'cid',
 //        'helloworld',
 //        {
 //            domain: '127.0.0.1',
 //            path: '/',
 //            maxAge: 10 * 60 * 1000,
 //            expires: new Date('2017-02-15'),  // cookie失效时间
 //            httpOnly: false,  // 是否只用于http请求中获取
 //            overwrite: false  // 是否允许重写
 //        }
 //    );
 //单页面应用的话，这个方法只会执行一次
}
app.use(staticCache(path.join(__dirname, 'public'), {
  maxAge: 365 * 24 * 60 * 60
}));
app.use(require('./routers/article.js').routes());
app.use(require('./routers/sign.js').routes());
app.use(middlewares);
app.listen(config.port,()=>{
	console.log(`app is listenning on ${config.port}`);
});