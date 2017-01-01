var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    rigger = require('gulp-rigger'),
    cssnano = require('gulp-cssnano'),
    less = require('gulp-less'),
    rimraf = require('rimraf'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    spritesmith = require('gulp.spritesmith'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();


gulp.task('sprite', function() {
    var sprite = gulp.src('src/img/icons/*.png').pipe(spritesmith({
        imgName: '../img/sprite.png',
        cssName: 'sprite.less',
        cssFormat: 'less',
        algorithm: 'binary-tree',
        padding: 10
    }));
    sprite.img.pipe(rename('sprite.png')).pipe(gulp.dest('build/img/')).pipe(browserSync.stream());
    sprite.css.pipe(gulp.dest('src/less/imports/')).pipe(browserSync.stream());
});



gulp.task('css', function() {
    gulp.src('src/less/style.less') // Выберем наш style.less
        .pipe(sourcemaps.init())
        .pipe(less()) // Скомпилируем
        .pipe(prefixer()) // Добавим вендорные префиксы
        .pipe(cssnano({
            zindex: false
        }))
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.stream());
});
gulp.task('normalize', function() {
    gulp.src('bower_components/normalize-css/normalize.css') // Выберем наш style.less
        .pipe(sourcemaps.init())
        .pipe(less()) // Скомпилируем
        .pipe(prefixer()) // Добавим вендорные префиксы
        .pipe(cssnano({
            zindex: false
        }))
        .pipe(rename('normalize.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.stream())
});
gulp.task('html', function() {
    gulp.src('src/*.html') // Выберем файлы по нужному пути
        .pipe(sourcemaps.init())
        .pipe(rigger()) // Прогоним через rigger
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.stream());
    // Переместим их в папку build
});
gulp.task('js', function() {
    gulp.src('src/js/main.js') // Выберем файлы по нужному пути
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream());
});
gulp.task('image', function() {
    gulp.src('src/img/**/*.*') // Выберем наши картинки
        .pipe(imagemin({ // Сожмем их
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            interlaced: true
        }))
        .pipe(gulp.dest('build/img/'));
    // Переместим в build
});

gulp.task('fonts', function() {
    gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts/'));
    // Переместим шрифты в build
});
gulp.task('clean', function(cb) {
    rimraf('build/', cb);
});
gulp.task('build', [
    'html',
    'css',
    'js',
    'fonts',
    'sprite',
    'image',
    'normalize'
]);
gulp.task('browser-sync', ['html', 'css', 'fonts', 'image', 'sprite'], function() {
    browserSync.init({
        server: {
            baseDir: "build"
        },
        notify: false
    });
});
gulp.task('watch', function() {
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/less/**/*.less', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/fonts/**/*.*', ['fonts']);
    gulp.watch('src/img/**/*.*', ['image']);
    gulp.watch('src/img/icons/*.*', ['sprite']);
});

// gulp.task('default', ['browser-sync', 'watch']);


//     // Serve files from the root of this project
gulp.task('default', ['build', 'browser-sync', 'watch']);
//     // add browserSync.reload to the tasks array to make
//     // all browsers reload after tasks are complete.
