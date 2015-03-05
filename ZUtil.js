/**
 * Created by lchysh on 14-12-3.
 */
var fs = require('fs');
var util = require('util');
var path = require('path');
var mkdirp = require('mkdirp');
var ZUtil = {};
ZUtil.listFiles = function(opt,callback, complete){
    var folder = opt.folder;
    fs.readdir(folder, function(err, ret){
        if(err){
            console.log(err);
            return;
        }
        var count = ret.length;
        ret.forEach(function (tmp) {
            var file = path.join(folder, tmp);
            fs.stat(file, function(err,stat){
                count--;
                if(err){
                    console.log(err);
                    return;
                }
                if(!stat.isFile()){

                    if(opt.traversal){
                        var opt2 = util._extend({},opt);
                        opt2.folder = file;
                        ZUtil.listFiles(opt2, callback)
                    }
                } else {
                    callback(file,count);
                }
            });
        });
    });
};
ZUtil.jsonFile = function(data, outputFilename){
    mkdirp.sync(path.dirname(outputFilename));
    var dataStr;
    if(typeof data != 'object'){
        dataStr = ''+data;
    } else {
        dataStr =  JSON.stringify(data, null, 4);
    }
    fs.writeFile(outputFilename,dataStr , function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to " + outputFilename);
        }
    });
};
ZUtil.newFile = function(file, cb){
    mkdirp(path.dirname(file), function(err){
        if(err){
            cb(err);
            return;
        }
        fs.writeFile(file, '', cb);
    });
};
module.exports = ZUtil;