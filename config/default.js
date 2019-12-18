const config = {
  // 启动端口
  port: 7002,
  // 数据库配置
  // database: {
  //   DATABASE: 'blogone',
  //   USERNAME: 'root',
  //   PASSWORD: '123456',
  //   PORT: '3306',
  //   HOST: 'localhost'
  // }
  database: {
    DATABASE: 'stblog',
    USERNAME: 'cow',
    PASSWORD: 'BaiTai890',
    PORT: '3306',
    HOST: 'rm-bp1c5c89758v1r68fo.mysql.rds.aliyuncs.com'
  },
  ossConfig: {
    region: 'oss-cn-beijing',
    accessKeyId: 'xxx',
    accessKeySecret: 'xxxxxxx'
  },
  ENVIRONMENT: 'PROD',
  DOMAIN: 'stblog.ltyun.cc'
}

module.exports = config;
