var express = require('express');
var app=express();
var fs = require("fs");

var multer = require('multer');
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(express.static('public'));
app.set("views engine",'ejs');
app.set('views',__dirname+ '/views');
app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get('/index', function (req, res) {
    res.render('index',{});
})


// app.post('/upload', urlencodedParser, multer({dest: __dirname + '/public/upload/'}).array('file'), function (req, res) {
//     var themeName = req.body.themeName;
//     var themeInfor = req.body.themeInfor;
//     var themeImgKey = req.file.imgKey.path;
//     console.log(themeName+" "+themeInfor+ " "+ themeImgKey);
// })
var formidable = require('formidable');
app.post("/index",function (req, res) {
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

        console.log(fields.themeName+","+fields.themeInfor+" ," +files.uploadImage.path);
        //显示地址
        var path = files.uploadImage.path;
        // var index=  path.lastIndexOf('\\')+1;
        // path=path.substring(index,path.length);
        // console.log(path);
        //图片主键
        var fileKey = "nodejs"+new Date().getTime()+"img";
        console.log(fileKey);
        var QQutil2=require('./util/QQutil2');
        var qqutil=new QQutil2();
        qqutil.init();
        qqutil.insert(fileKey,path,fs,function() {
            var themeName = fields.themeName;
            var themeInfor = fields.themeInfor;

        });
        
        res.json({
            "newPath":'http://localhost:8882/index/'+path
        });
    });
});

console.log("http://localhost:8882/index");
var server = app.listen(8882);