var gulp     = require('gulp');
var	concat   = require('gulp-concat');    //合并文件
var uglify   = require('gulp-uglify');    //js压缩
var rename   = require('gulp-rename');    //文件重命名
var notify   = require('gulp-notify');    //提示
var server   = require('gulp-webserver'); //本地服务
var imagemin = require('gulp-imagemin')  //图片压缩

// 合并压缩js
gulp.task('minJs', function () {
	return gulp.src([
			'js/hilo-standalone.js',
			'js/game.js',
			'js/Asset.js',
			'js/readyScene.js',
			'js/overScene.js',
			'js/hoodle.js',
			'js/obstacles.js',
			'js/fences.js',
			'js/bonus.js',
			'js/progress.js'
		])
       .pipe(concat('main.js'))           //合并js
       .pipe(gulp.dest('dist/js'))        //输出
       .pipe(rename({suffix: '.min'}))     //重命名
       .pipe(uglify())                    //压缩
       .pipe(gulp.dest('dist/js'))        //输出 
       .pipe(notify({message: "minJs task ok"}))    //提示
});
// 开启本地服务器
gulp.task('server', function () {
	gulp.src('./')
		.pipe(server({
			port: 80,//端口
			host: '127.0.0.1',//域名
			liveload: true,//实时刷新代码。不用f5刷新
			directoryListing: {
				path: './',
				enable: true
			}
		}))
		.pipe(notify({message: "server is listening 127.0.0.1:80"}))
});
// 压缩图片
gulp.task('minImage', function () {
	gulp.src('images/*.png')
		.pipe(imagemin({
			progress: true
		}))
		.pipe(gulp.dest('images'))
		.pipe(notify({message: "minImage task ok"}))
});