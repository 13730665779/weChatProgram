function RoomThemeUtil() {
    var connection;
    this.init = function () {
        var mysql = require('mysql');  //调用MySQL模块
        //1，创建一个connection
        connection = mysql.createConnection({
            host: 'localhost',       //主机 ip
            user: 'root',            //MySQL认证用户名
            password: 'wtt19950820/',                //MySQL认证用户密码
            port: '3306',                 //端口号
            database: 'Hstel_DB'          //数据库里面的数据
        });

        //2,连接
        connection.connect();
    }

    //插入数据
    this.insertTheme = function (themeName,themeInfo,imgKey) {
        //1,编写sql语句
        var themeAddSql = 'INSERT INTO Theme_TB(id,themeName,themeInfo,imgKey) VALUES(null,?,?,?)';
        var themeAddSql_Params = [themeName,themeInfo,imgKey];
        //2,进行插入操作
        /**
         *query，mysql语句执行的方法
         * 1，userAddSql编写的sql语句
         * 2，userAddSql_Params，sql语句中的值
         * 3，function (err, result)，回调函数，err当执行错误时，回传一个err值，当执行成功时，传回result
         */
        connection.query(themeAddSql,themeAddSql_Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        //5,连接结束
        connection.end();
    }
    //查询全部
    this.queryAll = function (call) {

        var sql = "select* from Theme_TB";
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            call(result);
        });
        //5,连接结束
        connection.end();
    }
    //更新主题名
    this.updateStyle = function (value,id) {
        var sql = "update Theme_TB set themeName = ? where id = ?";
        var Params = [value,id];
        connection.query(sql, Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        connection.end();
    }
    //更新简介
    this.updateInfor = function (value,id) {
        var sql = "update Theme_TB set introduction = ? where id = ?";
        var Params = [value,id];
        connection.query(sql, Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        connection.end();
    }
}
var style = new RoomThemeUtil();
style.insertTheme("自然风光","1","2","3");

module.exports = RoomThemeUtil;