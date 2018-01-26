const compose = require('koa-compose');

const logger = (ctx, next) => {
    console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}-${ctx.request.path}`);
    next();
}
module.exports = compose([logger]);

