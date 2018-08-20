function MenuUtil() {
    var connection;
    this.init = function () {
        var mysql = require('mysql');  //调用MySQL模块
        //1，创建一个connection
        connection = mysql.createConnection({
            host: 'localhost',       //主机 ip
            user: 'root',            //MySQL认证用户名
            password: 'root',                //MySQL认证用户密码
            port: '3306',                 //端口号
            database: 'hotel'          //数据库里面的数据
        });

        //2,连接
        connection.connect();
    }

    //插入数据
    this.inserMenu = function (dish_name,price,introduction,type) {
        //1,编写sql语句
        var MenuAddSql = 'INSERT INTO menu_table(dish_name,price,introduction,type) VALUES(?,?,?,?)';
        var MenuAddSql_Params = [dish_name,price,introduction,type];
        //2,进行插入操作
        /**
         *query，mysql语句执行的方法
         * 1，userAddSql编写的sql语句
         * 2，userAddSql_Params，sql语句中的值
         * 3，function (err, result)，回调函数，err当执行错误时，回传一个err值，当执行成功时，传回result
         */
        connection.query(MenuAddSql, MenuAddSql_Params, function (err, result) {
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

        var sql = "select* from menu_table";
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
    //更新菜名
    this.updateDishName = function (value,id) {
        var sql = "update room_details_table set dish_name = ? where id = ?";
        var Params = [value,id];
        connection.query(sql, Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        connection.end();
    }
    //更新价格
    this.updatePrice = function (value,id) {
        var sql = "update room_details_table set price = ? where id = ?";
        var Params = [value,id];
        connection.query(sql, Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        connection.end();
    }
    //更新介绍
    this.updateIntroduction = function (value,id) {
        var sql = "update room_details_table set introduction = ? where id = ?";
        var Params = [value,id];
        connection.query(sql, Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        connection.end();
    }
    //更新分类
    this.updateType = function (value,id) {
        var sql = "update room_details_table set type = ? where id = ?";
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

module.exports = MenuUtil;