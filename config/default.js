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
    DATABASE: 'xxx',
    USERNAME: 'cow',
    PASSWORD: 'xxx',
    PORT: '3306',
    HOST: 'rxxxm'
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
