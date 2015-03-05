var Canvas = require('canvas')
    , Image = Canvas.Image;
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var root = path.dirname(path.resolve('./'));
var util = require('util');
ImgUtil = {};
ImgUtil.listImgs = function(opt,callback){
    var folder = opt.folder;
    fs.readdir(folder, function(err, ret){
        if(err){
            console.log(err);
            return;
        }
        var imgTypes = ['.png','.jpg','.gif'];
        ret.forEach(function (tmp) {
            var file = path.join(folder, tmp);
            var extname = path.extname(tmp).toLowerCase().trim();
            if(imgTypes.indexOf(extname) < 0){
                if(opt.traversal && extname == ''){
                    fs.stat(file, function(err,stat){
                        if(err){
                            console.log(err);
                            return;
                        }
                        if(!stat.isFile()){
                            var opt2 = util._extend({},opt);
                            opt2.folder = file;
                            ImgUtil.listImgs(opt2, callback)
                        }
                    });
                } else {
                    console.log([tmp, '不是图片'].join(' '));
                }
                return;
            }
            callback(file);

        });
    });
};
ImgUtil.scaleDown = function(opt){
    fs.readFile(opt.img, function(err, squid){
        var img = new Image;
        img.src = squid;
        var sizes = opt.size || [{width:img.width,height:img.height}];
        var count = sizes.length;
        sizes.forEach(function(size, index){
            var imgWitdh = size.width;
            var imgHeight = size.height;
            var target = opt.target;
            var subfolder = opt.subfolder || '';
            if(!target){
                if(count>1){
                    subfolder += (index+1);
                }
                target = path.join(path.dirname(opt.img),subfolder,
                    path.basename(opt.img));
            }
            target = target.replace(/\.[^\.]+$/,'.jpg');
            mkdirp.sync(path.dirname(target));
            var canvas = new Canvas(imgWitdh,imgHeight)
                , ctx = canvas.getContext('2d');
            if (err) throw err;

            ctx.drawImage(img, 0, 0, imgWitdh, imgHeight);
            var  out = fs.createWriteStream(target);
            var stream = canvas.jpegStream({
                bufsize: 4096 // output buffer size in bytes, default: 4096
                , quality: 85 // JPEG quality (0-100) default: 75
                , progressive: true // true for progressive compression, default: false
            });
            stream.on('data', function(chunk){
                out.write(chunk);
            });

            stream.on('end', function(){
                console.log('saved '+ target);
            });
        });

    });

};
module.exports = ImgUtil;

