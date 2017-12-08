var gulp   = require('gulp');
var	concat = require('gulp-concat');   //合并文件
var uglify = require('gulp-uglify');   //js压缩
var rename = require('gulp-rename');   //文件重命名
var notify = require('gulp-notify');   //提示

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
       .pipe(concat('main.js'))   //合并js
       .pipe(gulp.dest('dist/js'))       //输出
       .pipe(rename({suffix:'.min'}))     //重命名
       .pipe(uglify())                    //压缩
       .pipe(gulp.dest('dist/js'))            //输出 
       .pipe(notify({message:"minJs task ok"}));    //提示
});