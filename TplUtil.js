/**
 * Created by lchysh on 14-12-1.
 */
var Stream = require("stream");
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var htmlparser = require("htmlparser2");
var mkdirp = require('mkdirp');
var htmlminifier = require('html-minifier');
var TplUtil = {};
TplUtil.concatTpls = function (opts) {
    var srcFolder = opts.srcFolder;
    var dest = opts.dest || './tpl.min.html';
    var destFolder = path.dirname(dest);
    fs.writeFileSync(dest, '');
    gulp.src(srcFolder + '/**/*.html')
        .pipe(gulpCallback(function (file) {
            var tplId = file.history[0].replace(srcFolder, '');
            var ret = [
                ' <script id="templates', tplId,
                '" type="text/ng-template">',
                TplUtil.minify( file._contents.toString()),
                '</script>'
            ].join('');
            fs.appendFile(dest,(ret), function (err) {
                if (err) {
                    console.log(file + ':'+err);
                }
            });
        }));

    function gulpCallback(obj) {
        "use strict";
        var stream = new Stream.Transform({objectMode: true});
        stream._transform = function (file, unused, callback) {
            obj(file)
            callback(null, file);
        };

        return stream;
    }
};
TplUtil.minTpl = function(){

};
TplUtil.splitTpl = function (opts) {
    var srcFile= opts.srcFile;
    var destFolder = opts.dest || './';
    var othersContentFile = path.join(destFolder, 'other.html');
    var data = fs.readFileSync(srcFile);
    var destFile = othersContentFile;
    fs.writeFileSync(destFile, '');
    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
            if(name === "script" && attribs.type === "text/ng-template"){
                destFile =path.join(destFolder, attribs.id.replace(/^templates\//,''));
                mkdirp.sync(path.dirname(destFile));

                fs.writeFileSync(destFile, '');
            }
        },
        ontext: function(text){
            fs.appendFileSync(destFile, text);
        },
        onclosetag: function(tagname){
            destFile = othersContentFile;
        }
    });
    parser.write(data);
    parser.end();
};
TplUtil.minify= function(data){
    var minifiedHTML = htmlminifier.minify(data, {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: false,
        removeAttributeQuotes: false,
        removeEmptyAttributes: false
    });
    return minifiedHTML;
};
module.exports = TplUtil;