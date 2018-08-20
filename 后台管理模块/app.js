var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');
app.use(bodyParser.json({limit:'50mb'}));
//1,接受表单的请求
var urlencode=bodyParser.urlencoded({limit:'50mb',extended:true});
app.use(urlencode);
app.use(express.static('public'));
//2,设置下载的地址
app.use(multer({ dest: '/public/'}).array('image'));
//3,指定模板引擎
app.set("views engine", 'ejs');
//4,指定模板位置
app.set('views', __dirname + '/views');
app.get('/index', function (req, res) {
    res.render('index',{});
})
// 引入模块
var COS = require('cos-nodejs-sdk-v5');
var cos = new COS({
    // 必选参数
    SecretId: "AKIDTnBwlXSvfKqBKISkBSr7BFB7rY6TbhaI",
    SecretKey: "49A0hCUm5RgmjgR2Ur4ILDvUr264xeAl",
});

app.post("/upload", function (req, res) {
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
            res.render('index', { title: TITLE });
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
            "newPath":'http://localhost:8888/upload/'+path
        });
        qqUtil.insert(fileKey, path,fs, function () {
            var song = fields.song;
            var songer = fields.songer;
            var album = fields.album;
            var SongUtil = require('./dao/SongUtil');
            var songUtil = new SongUtil();
            songUtil.init();
            songUtil.inserSong(song,songer,album,fileKey);
        });
    });
});

var server = app.listen(8888);