var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});

let query = ( sql, values ) => {

  return new Promise(( resolve, reject ) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}


// let query = function( sql, values ) {
// pool.getConnection(function(err, connection) {
//   // 使用连接
//   connection.query( sql,values, function(err, rows) {
//     // 使用连接执行查询
//     console.log(rows)
//     connection.release();
//     //连接不再使用，返回到连接池
//   });
// });
// }

let users =
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     pass VARCHAR(100) NOT NULL,
     phone VARCHAR(100) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     ticket VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let posts =
    `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     title TEXT(0) NOT NULL,
     content TEXT(0) NOT NULL,
     md TEXT(0) NOT NULL,
     uid VARCHAR(40) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     comments VARCHAR(200) NOT NULL DEFAULT '0',
     pv VARCHAR(40) NOT NULL DEFAULT '0',
     avator VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let article =
    `create table if not exists article(
     id INT NOT NULL AUTO_INCREMENT,
     title TEXT(0) NOT NULL,
     postimg VARCHAR(40) NOT NULL,
     resume VARCHAR(400) NOT NULL,
     detail TEXT(0) NOT NULL,
     label INT NOT NULL,
     view INT NOT NULL DEFAULT 0,
     discuss INT NOT NULL DEFAULT 0,
     likes INT NOT NULL DEFAULT 0,
     ticket VARCHAR(100) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let label = 
  `create table if not exists label(
       id INT NOT NULL AUTO_INCREMENT,
       title TEXT(0) NOT NULL,
       postimg VARCHAR(40) NOT NULL,
       PRIMARY KEY ( id )
    );`

let comment =
    `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     content TEXT(0) NOT NULL,
     moment VARCHAR(40) NOT NULL,
     postid VARCHAR(40) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let createTable = ( sql ) => {
  return query( sql, [] )
}

// 建表
createTable(users)
createTable(posts)
createTable(comment)
createTable(article)
createTable(label)

// 注册用户
let insertData =  ( value ) => {
  let _sql = "insert into users set name=?,pass=?,phone=?,avator=?,moment=?,ticket=?;"
  return query( _sql, value )
}
// 删除用户
let deleteUserData = ( name ) => {
  let _sql = `delete from users where name="${name}";`
  return query( _sql )
}
// 查找用户
let findUserData = ( name ) => {
  let _sql = `select * from users where name="${name}";`
  return query( _sql )
}
// 通过ticket查找用户
let findUserByTicket = ( ticket ) => {
  let _sql = `select * from users where ticket="${ticket}";`
  return query( _sql )
}
// 发表文章
let insertPost = ( value ) => {
  let _sql = "insert into posts set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?;"
  return query( _sql, value )
}
// 更新文章评论数
let updatePostComment = ( value ) => {
  let _sql = "update posts set comments=? where id=?"
  return query( _sql, value )
}

// 更新浏览数
let updatePostPv = ( value ) => {
  let _sql = "update posts set pv=? where id=?"
  return query( _sql, value )
}

// 发表评论
let insertComment = ( value ) => {
  let _sql = "insert into comment set name=?,content=?,moment=?,postid=?,avator=?;"
  return query( _sql, value )
}
// 通过名字查找用户
let findDataByName =  ( name ) => {
  let _sql = `select * from users where name="${name}";`
  return query( _sql)
}
//通过手机号查找用户
let findDataByPhone =  ( phone ) => {
  let _sql = `select * from users where phone="${phone}";`
  return query( _sql)
}
// 通过文章的名字查找用户
let findDataByUser =  ( name ) => {
  let _sql = `select * from posts where name="${name}";`
  return query( _sql)
}
// 通过文章id查找
let findDataById =  ( id ) => {
  let _sql = `select * from posts where id="${id}";`
  return query( _sql)
}
// 通过文章id查找
let findCommentById =  ( id ) => {
  let _sql = `select * FROM comment where postid="${id}";`
  return query( _sql)
}
// 通过评论id查找
let findComment =  ( id ) => {
  let _sql = `select * FROM comment where id="${id}";`
  return query( _sql)
}

// 查询所有文章
let findAllPost =  () => {
  let _sql = ` select * FROM posts;`
  return query( _sql)
}
// 查询分页文章
let findPostByPage =  ( page ) => {
  let _sql = ` select * FROM posts limit ${(page-1)*10},10;`
  return query( _sql)
}
// 查询个人分页文章
let findPostByUserPage =  (name,page) => {
  let _sql = ` select * FROM posts where name="${name}" order by id desc limit ${(page-1)*10},10 ;`
  return query( _sql)
}
// 更新修改文章
let updatePost = (values) => {
  let _sql = `update posts set title=?,content=?,md=? where id=?`
  return query(_sql,values)
}
// 删除文章
let deletePost = (id) => {
  let _sql = `delete from posts where id = ${id}`
  return query(_sql)
}
// 删除评论
let deleteComment = (id) => {
  let _sql = `delete from comment where id=${id}`
  return query(_sql)
}
// 删除所有评论
let deleteAllPostComment = (id) => {
  let _sql = `delete from comment where postid=${id}`
  return query(_sql)
}
// 查找评论数
let findCommentLength = (id) => {
  let _sql = `select content from comment where postid in (select id from posts where id=${id})`
  return query(_sql)
}

// 滚动无限加载数据
let findPageById = (page) => {
  let _sql = `select * from posts limit ${(page-1)*5},5;`
  return query(_sql)
}
// 评论分页
let findCommentByPage = (page,postId) => {
  let _sql = `select * from comment where postid=${postId} order by id desc limit ${(page-1)*10},10;`
  return query(_sql)
}


//label

// 查询所有label
let findAllLabel =  () => {
  let _sql = ` select * FROM label;`
  return query( _sql)
}
//通过label的id查找label
let findLabelById = ( id ) => {
  let _sql = `select * from label where id="${id}";`
  return query( _sql )
}
// 发表文章
let insertArticle =  ( value ) => {
  let _sql = "insert into article set title=?,postimg=?,resume=?,detail=?,label=?,moment=?,ticket=?;"
  return query( _sql, value )
}
//查找所有文章并倒序输出
let findAllArticle =  () => {
  let _sql = ` select * FROM article order by id desc;`
  return query( _sql)
}
//通过文章ID获取文章
let findArticleById =  ( id ) => {
  let _sql = ` select * FROM article where id="${id}";`
  return query( _sql)
}

module.exports = {
	query,
	createTable,
	insertData,
  deleteUserData,
  findUserData,
  findUserByTicket,
	findDataByName,
  findDataByPhone,
  insertPost,
  findAllPost,
  findPostByPage,
  findPostByUserPage,
  findDataByUser,
  findDataById,
  insertComment,
  findCommentById,
  findComment,
  updatePost,
  deletePost,
  deleteComment,
  findCommentLength,
  updatePostComment,
  deleteAllPostComment,
  updatePostPv,
  findPageById,
  findCommentByPage,
  findAllLabel,
  findLabelById,
  insertArticle,
  findAllArticle,
  findArticleById
}

