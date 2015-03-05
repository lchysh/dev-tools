/**
 * Created by lchysh on 14-10-28.
 */
var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var fs = require('fs');
var root = path.join(path.dirname(__dirname),'www','res');
(function(){
    var scripts = fs.readdirSync(path.join(root,'js')).map(function(item){
        return path.join(root,'js', item);
    });
    scripts.unshift(path.join(root,'js/_pageData.js'));
    scripts.unshift(path.join(root,'vendor/ionic/js/i18n/angular-locale_zh-cn.js'));
    gulp.task('scripts', function() {
        console.log('scripts');
        gulp.src(scripts)
            .pipe(uglify())
            .pipe(concat('clientApp.js'))
            .pipe(gulp.dest(root + '/dist/js/'))
    });
    gulp.watch(scripts, ['scripts']);
    console.log(scripts);
    var styles = [root + '/style/style.scss'];
    gulp.task('css', function() {
        gulp.src(styles)
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(concat('style.css'))
            .pipe(gulp.dest(root + '/dist/style/'))
    });
    gulp.watch(styles, ['css']);
    gulp.task('updatecache', function() {
        var cacheFile =path.join(path.dirname(root), 'app.appcache');
        var data = fs.readFileSync(cacheFile).toString();

        data = data.replace(/\{[^\}]+\}/,function(w){
            var num = w.replace(/\D/g,'');
            num = Number(num) + 1;
            console.log('cache_ver:'+num);
            return ['{',num,'}'].join('');
        });
        fs.writeFile(cacheFile,data)
    });
    var distFiles = [path.join(root,'dist', '**','*'), path.join(path.dirname(root), 'index.html')];
    console.log(distFiles);
    gulp.watch(distFiles, ['updatecache']);
})();

