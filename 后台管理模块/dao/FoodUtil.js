function FoodUtil() {
    var connection;
    this.init = function () {
        var mysql = require('mysql');  //调用MySQL模块
        //1，创建一个connection
        connection = mysql.createConnection({
            host: 'localhost',       //主机 ip
            user: 'root',            //MySQL认证用户名
            // password: 'wtt19950820/',  //MySQL认证用户密码（王婷婷使用）
            password: 'root',                //MySQL认证用户密码（彭大寒使用）
            port: '3306',                 //端口号
            database: 'hostel_db'          //数据库里面的数据
        });

        //2,连接
        connection.connect();
    }

    //插入数据
    this.inserFood = function (foodName,foodType,foodPrice,foodInfor,imgKey) {
        //1,编写sql语句
        var MenuAddSql = 'INSERT INTO food_tb(foodName,foodType,foodPrice,foodInfor,imgKey) VALUES(?,?,?,?,?)';
        var MenuAddSql_Params = [foodName,foodType,foodPrice,foodInfor,imgKey];
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

        var sql = "select* from food_tb";
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
    //按id查询
    this.queryAtId = function (id,call) {
        var sql = "select * from food_tb where id = ?";
        var Params = [id];
        connection.query(sql,Params,function (err,result) {
            if(err) {
                console.log('QUERY ERROR - ', err.message);
                return;
            }
        })
        connection.end();
    }
    //更新菜名
    this.updateFoodName = function (value,id) {
        var sql = "update food_tb set foodName = ? where id = ?";
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
    this.updateFoodPrice = function (value,id) {
        var sql = "update food_tb set foodPrice = ? where id = ?";
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
    this.updateFoodInfor = function (value,id) {
        var sql = "update food_tb set foodInfor = ? where id = ?";
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
    this.updateFoodType = function (value,id) {
        var sql = "update food_tb set foodType = ? where id = ?";
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
    this.updateFoodPrice = function (value,id) {
        var sql = "update food_tb set foodPrice = ? where id = ?";
        var Params = [value,id];
        connection.query(sql, Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        connection.end();
    }
    //更新图片
    this.updateImgKey = function (value,id) {
        var sql = "update food_tb set imgKey = ? where id = ?";
        var Params = [value,id];
        connection.query(sql, Params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
        });
        connection.end();
    }
    //删除食物
    this.delete = function (id,call) {
        var sql = "delete from food_tb where id = ?";
        var Param = [id];
        connection.query(sql,Param,function (err,result) {
            if(err) {
                console.log('[DELETE ERROR] - ', err.message);
                return;
            }
        })
        connection.end();
    }
}

module.exports = FoodUtil;