var express = require('express');
var app=express();
var fs = require("fs");

// var multer = require('multer');
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(express.static('public'));
app.set("view engine",'ejs');
app.set('views',__dirname+ '/views');
app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// *显示*
app.get('/index', function (req, res) {
    //风格信息
    var ThemeUtil_WTT=require('./dao/ThemeUtil_WTT');
    var theme=new ThemeUtil_WTT();
    theme.init();
    var QQutil2=require('./util/QQutil2');
    var qqutil=new QQutil2();
    qqutil.init();
    //房间信息
    var RoomUtil = require("./dao/RoomUtil");
    var room = new RoomUtil();
    room.init();
    room.queryAll(function (roomData) {
        var length=roomData.length;
        for (var i=0;i<length;i++){
            // console.log(roomData[i]);
            // roomBuffer.push(roomData[i]);
        }
        theme.queryAll(function (themeData) {
            var length = themeData.length;
            for (var i = 0; i < length; i++) {
                var themeKey = themeData[i].imgKey;
                qqutil.query(themeKey, function (url) {
                    themeData[i].imgKey = url;
                })
            }
            res.render('index', {
                themeData:themeData,
                roomData:roomData
            });
        })

    })



})
//*风格的添加*
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
        var QQutil2=require('./util/QQutil2');
        var qqutil=new QQutil2();
        qqutil.init();
        qqutil.insert(fileKey,path,fs,function() {
            var themeName = fields.themeName;
            var themeInfor = fields.themeInfor;
            var ThemeUtil_WTT=require('./dao/ThemeUtil_WTT');
            var theme=new ThemeUtil_WTT();
            theme.init();
            theme.inserTheme(themeName,themeInfor,fileKey);
        });

        res.json({
            "newPath":'http://localhost:8883/upload/'+path
        });
    });
});
//*删除风格*
app.post('/deleteTheme',urlencodedParser,function (req,res) {
    var themeId=req.body.themeId;
    var ThemeUtil_WTT = require("./dao/ThemeUtil_WTT");
    var Theme = new ThemeUtil_WTT();
    Theme.init();
    Theme.deleteTheme(themeId);
})
// *房间添加*
app.post("/addRoom",urlencodedParser,function(req,res){
    var roomNo = req.body.roomNo;
    var themeName=req.body.themeName;
    var accomodate = req.body.accomodate
    var roomPrice = req.body.roomPrice;
    var ThemeUtil_WTT=require('./dao/ThemeUtil_WTT');
    var theme=new ThemeUtil_WTT();
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
// *删除房间*
app.post('/deleteRoom',urlencodedParser,function (req,res) {
   var roomNo=req.body.roomNo;
    var RoomUtil = require("./dao/RoomUtil");
    var room = new RoomUtil();
    room.init();
    room.deleteRoom(roomNo);
})
// *修改房间*
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

console.log("http://localhost:8883/index");
var server = app.listen(8883);
