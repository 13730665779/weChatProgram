var express = require('express');
var app=express();
var fs = require("fs");

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(express.static('public'));
app.set("view engine",'ejs');
app.set('views',__dirname+ '/views');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

//显示主页
app.get('/index', function (req, res) {
    //风格信息
    var ThemeUtil=require('./dao/ThemeUtil');
    var theme=new ThemeUtil();
    theme.init();
    var QQutil=require('./util/QQutil');
    var qqUtil=new QQutil();
    qqUtil.init();
    //房间信息
    var RoomUtil = require("./dao/RoomUtil");
    var room = new RoomUtil();
    room.init();
    //1, 引入模块
    var FoodUtil = require('./dao/FoodUtil');
    //2,创建对象
    var foodUtil = new FoodUtil();
    foodUtil.init();
    //1, 引入模块
    var EntertainmentUtil = require('./dao/EntertainmentUtil');
    //2,创建对象
    var entertainmentUtil = new EntertainmentUtil();
    entertainmentUtil.init();
    room.queryAll(function (roomData) {
        theme.queryAll(function (themeData) {
            var length = themeData.length;
            for (var i = 0; i < length; i++) {
                var themeKey = themeData[i].imgKey;
                qqUtil.query(themeKey, function (url) {
                    themeData[i].imgKey = url;
                })
            }
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
                    res.render('index', {
                        themeData:themeData,
                        roomData:roomData,
                        foodData: foodData,
                        enterData: enterData
                    });
                });

            });

        })

    })



})

//风格添加
var formidable = require('formidable');
app.post("/upload",function (req, res) {
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public/upload';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {
        if (err) {
            res.locals.error = err;
            res.render('index', { title: "图片上传失败" });
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
            res.render('index', { title: TITLE });
            return;
        }

        // console.log(fields.themeName+","+fields.themeInfor+" ," +files.uploadImage.path);
        //显示地址
        var path = files.uploadImage.path;
        // var index=  path.lastIndexOf('\\')+1;
        // path=path.substring(index,path.length);
        // console.log(path);
        //图片主键
        var fileKey = "nodejs"+new Date().getTime()+"img";
        // console.log(fileKey);
        var QQutil=require('./util/QQutil');
        var qqutil=new QQutil();
        qqutil.init();
        qqutil.insert(fileKey,path,fs,function() {
            var themeName = fields.themeName;
            var themeInfor = fields.themeInfor;
            var ThemeUtil=require('./dao/ThemeUtil');
            var theme=new ThemeUtil();
            theme.init();
            theme.inserTheme(themeName,themeInfor,fileKey);
        });

        res.json({
            "newPath":'http://localhost:8883/upload/'+path
        });
    });
});
//风格删除
app.post('/deleteTheme',urlencodedParser,function (req,res) {
    var themeId=req.body.themeId;
    var ThemeUtil= require("./dao/ThemeUtil");
    var Theme = new ThemeUtil();
    Theme.init();
    Theme.deleteTheme(themeId);
})

//房间添加
app.post("/addRoom",urlencodedParser,function(req,res){
    var roomNo = req.body.roomNo;
    var themeName=req.body.themeName;
    var accomodate = req.body.accomodate
    var roomPrice = req.body.roomPrice;
    var ThemeUtil=require('./dao/ThemeUtil');
    var theme=new ThemeUtil();
    theme.init();
    var id;
    theme.queryThemeID(themeName,function (themeId) {
        id=themeId[0].id;
        var RoomUtil = require("./dao/RoomUtil");
        var room = new RoomUtil();
        room.init();
        room.inserRoom(roomNo,id,accomodate,roomPrice);
    })

})
//房间删除
app.post('/deleteRoom',urlencodedParser,function (req,res) {
   var roomNo=req.body.roomNo;
    var RoomUtil = require("./dao/RoomUtil");
    var room = new RoomUtil();
    room.init();
    room.deleteRoom(roomNo);
})
//房间修改
app.post("/updateRoom",urlencodedParser,function (req,res) {
    var id = req.body.id;
    var name = req.body.name;
    var value = req.body.value;
    var RoomUtil = require("./dao/RoomUtil");
    var room = new RoomUtil();
    room.init();
    if (name=="themeId") {
        room.updateTheme(value,id);
    }
    else if(name=="accommodate"){
        room.updateAccommodate(value,id);
    }
    else if(name=="roomPrice"){
        room.updateRoomPrice(value,id);
    }


})

//餐饮添加
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
            res.render('index', { title: "图片上传失败" });
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
//餐饮删除
app.post("/foodDelete",urlencodedParser,function (req,res) {
    var id = req.body.id;
    var FoodUtil = require('./dao/FoodUtil.js');
    var foodUtil = new FoodUtil();
    foodUtil.init();
    foodUtil.delete(id,function () {
        console.log("删除成功！");
        res.redirect('index');
    })
})
//餐饮修改
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
    res.redirect('index');
})

//娱乐添加
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
            res.render('index', { title: "图片上传失败" });
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
//娱乐删除
app.post("/enterDelete",urlencodedParser,function (req,res) {
    var id = req.body.id;
    var EntertainmentUtil = require('./dao/EntertainmentUtil.js');
    var entertainmentUtil = new EntertainmentUtil();
    entertainmentUtil.init();
    entertainmentUtil.delete(id,function () {
    })
})
//娱乐修改
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


console.log("http://localhost:8883/index");
var server = app.listen(8883);
