var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var formidable = require('formidable');
app.use(bodyParser.json({limit: '50mb'}));
var urlencode = bodyParser.urlencoded({limit: '50mb', extended: true});
app.use(urlencode);
//设置静态文件
app.use(express.static('public'));
//3,指定模板引擎
app.set("view engine", 'ejs');
//4,指定模板位置
app.set('views', __dirname + '/views');
app.get('/index01', function (req, res) {
    //1, 引入模块
    var FoodUtil = require('./dao/FoodUtil');
    //2,创建对象
    var foodUtil = new FoodUtil();
    foodUtil.init();
    //1, 引入腾讯模块
    var QQUtil = require('./util/QQutil');
    //2,创建对象
    var qqUtil = new QQUtil();
    qqUtil.init();
    //1, 引入模块
    var EntertainmentUtil = require('./dao/EntertainmentUtil');
    //2,创建对象
    var entertainmentUtil = new EntertainmentUtil();
    entertainmentUtil.init();
    //3,查询语句
    foodUtil.queryAll(function (foodData) {
        //根据数据，获得key值
        var length = foodData.length;
        for (let i = 0; i < length; i++) {
            let imgKey = foodData[i].imgKey;
            //到腾讯云平台获得图片地址
            qqUtil.query(imgKey,function (url) {
                foodData[i].imgKey=url;
            });
        }
        //3,查询语句
        entertainmentUtil.queryAll(function (enterData) {
            //根据数据，获得key值
            var length = enterData.length;
            for (let i = 0; i < length; i++) {
                let imgKey = enterData[i].imgKey;
                //到腾讯云平台获得图片地址
                qqUtil.query(imgKey,function (url) {
                    enterData[i].imgKey=url;
                });
            }
            res.render('index01', {foodData: foodData,enterData:enterData});
        });

    });

});
//删除食物信息
app.post("/foodDelete",urlencode,function (req,res) {
    var id = req.body.id;
    var FoodUtil = require('./dao/FoodUtil.js');
    var foodUtil = new FoodUtil();
    foodUtil.init();
    foodUtil.delete(id,function () {
        console.log("删除成功！");
    })
    res.location('index01');
})
//删除娱乐信息
app.post("/enterDelete",urlencode,function (req,res) {
    var id = req.body.id;
    var EntertainmentUtil = require('./dao/EntertainmentUtil.js');
    var entertainmentUtil = new EntertainmentUtil();
    entertainmentUtil.init();
    entertainmentUtil.delete(id,function () {
        console.log("删除成功！");
    })
})
//添加食物
app.post("/inserFood", function (req, res) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/upload';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function(err, fields, files) {
        console.log('fields',fields);
        if (err) {
            res.locals.error = err;
            res.render('index01', { title: "图片上传失败" });
            return;
        }
        var extName = '';  //后缀名
        switch (files.uploadImage.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if(extName.length == 0){
            res.locals.error = '只支持png和jpg格式图片';
            res.render('index01', { title: TITLE });
            return;
        }
        //显示地址；
        var path = files.uploadImage.path;

        // var index=  path.lastIndexOf('\\')+1;
        // path=path.substring(index,path.length);
        var fileKey = "nodejs"+new Date().getTime()+'img';
        //1, 引入腾讯模块
        var QQUtil = require('./util/QQutil');
        //2,创建对象
        var qqUtil = new QQUtil();
        qqUtil.init();
        // 3,上传图片到云服务器
        res.json({
            "newPath":'http://localhost:8088/upload/'+path
        });
        qqUtil.insert(fileKey, path,fs, function () {
            var foodName = fields.foodName;
            var foodType = fields.foodType;
            var foodPrice = fields.foodPrice;
            var foodInfor = fields.foodInfor;
            var FoodUtil = require('./dao/FoodUtil');
            var foodUtil = new FoodUtil();
            foodUtil.init();
            foodUtil.inserFood(foodName,foodType,foodPrice,foodInfor,fileKey);
        });
    });
})
//添加娱乐
app.post("/inserEntertainment", function (req, res) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/upload';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function(err, fields, files) {
        console.log('fields',fields);
        if (err) {
            res.locals.error = err;
            res.render('index01', { title: "图片上传失败" });
            return;
        }
        var extName = '';  //后缀名
        switch (files.uploadEnterImage.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if(extName.length == 0){
            res.locals.error = '只支持png和jpg格式图片';
            res.render('index01', { title: TITLE });
            return;
        }
        //显示地址；
        var path = files.uploadEnterImage.path;

        // var index=  path.lastIndexOf('\\')+1;
        // path=path.substring(index,path.length);
        var fileKey = "nodejs"+new Date().getTime()+'img';
        //1, 引入腾讯模块
        var QQUtil = require('./util/QQutil');
        //2,创建对象
        var qqUtil = new QQUtil();
        qqUtil.init();
        // 3,上传图片到云服务器
        res.json({
            "newPath":'http://localhost:8088/upload/'+path
        });
        qqUtil.insert(fileKey, path,fs, function () {
            var enterName = fields.enterName;
            var enterPlace = fields.enterPlace;
            var enterInfor = fields.enterInfor;
            var EntertainmentUtil = require('./dao/EntertainmentUtil');
            var entertainmentUtil = new EntertainmentUtil();
            entertainmentUtil.init();
            entertainmentUtil.inserEntertainment(enterName,enterPlace,enterInfor,fileKey);
        });
    });
})
//修改食物
app.post("/updateFood",function (req,res) {
    var name = req.body.name;
    var value = req.body.value;
    var id = req.body.id;
    var FoodUtil = require("./dao/FoodUtil.js");
    var foodUtil = new FoodUtil();
    foodUtil.init();
    switch (name){
        case "foodName":
            foodUtil.updateFoodName(value,id);
            break;
        case "foodType":
            foodUtil.updateFoodType(value,id);
            break;
        case "foodPrice":
            foodUtil.updateFoodPrice(value,id);
            break;
        case "foodInfor":
            foodUtil.updateFoodInfor(value,id);
            break;
    }
})
//修改娱乐
app.post("/updateEnter",function (req,res) {
    var name = req.body.name;
    var value = req.body.value;
    var id = req.body.id;
    var EntertainmentUtil = require("./dao/EntertainmentUtil.js");
    var entertainmentUtil = new EntertainmentUtil();
    entertainmentUtil.init();
    switch (name){
        case "enterName":
            entertainmentUtil.updateEnterName(value,id);
            break;
        case "enterPlace":
            entertainmentUtil.updateEnterPlace(value,id);
            break;
        case "enterInfor":
            entertainmentUtil.updateEnterInfor(value,id);
            break;

    }
})
console.log("http://localhost:8888/index01")
var server = app.listen(8888);