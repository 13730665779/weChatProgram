function RoomDetailUtil() {
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
    this.inserDetail = function (theme,number_of_people,number_of_room,price) {
        //1,编写sql语句
        var DetailAddSql = 'INSERT INTO room_details_table(theme,number_of_people,number_of_room,price) VALUES(?,?,?,?)';
        var DetailAddSql_Params = [theme,number_of_people,number_of_room,price];
        //2,进行插入操作
        /**
         *query，mysql语句执行的方法
         * 1，userAddSql编写的sql语句
         * 2，userAddSql_Params，sql语句中的值
         * 3，function (err, result)，回调函数，err当执行错误时，回传一个err值，当执行成功时，传回result
         */
        connection.query(DetailAddSql, DetailAddSql_Params, function (err, result) {
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

        var sql = "select* from room_details_table";
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
    //更新主题名称
    this.updateTheme = function (value,id) {
        var sql = "update room_details_table set number_of_people = ? where id = ?";
        var Params = [value,id];
        connection.query(sql, Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        connection.end();
    }
    //更新可住人数
    this.updateNumberOfPeople = function (value,id) {
        var sql = "update room_details_table set theme = ? where id = ?";
        var Params = [value,id];
        connection.query(sql, Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        connection.end();
    }
    //更新房间总数
    this.updateNumberOfRoom = function (value,id) {
        var sql = "update room_details_table set number_of_room = ? where id = ?";
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
}

module.exports = RoomDetailUtil;