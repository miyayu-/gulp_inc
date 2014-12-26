
var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'), /* sassを入れる */
  plumber = require('gulp-plumber'), /* エラーが出てもwatchを止めない */
  spritesmith = require('gulp.spritesmith'), /* CSSスプライトを作成する */
  hologram = require('gulp-hologram'), /* スタイルガイド */
  fileinclude = require('gulp-file-include'), /* ファイルを分割する */
  pleeease = require('gulp-pleeease'); /* 圧縮やベンダープレフィックスをつける */

gulp.task('sass', function() {
  return gulp.src('./app/sass/*.scss')
    .pipe(plumber())
    .pipe(sass({
      style: 'expanded',
      noCache: true
    }))
    .pipe(gulp.dest('./dist/css'));
});
gulp.task('ple', function() {
    return gulp.src('./dist/css/*.css')
    .pipe(pleeease({
        autoprefixer: {"browsers": ["last 1 versions"]},  // ベンダープレフィックス対応バージョンの指定
        minifier: true //圧縮の有無 true/false
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('_sprite/*.png') //スプライトにする画像
  .pipe(spritesmith({
    imgName: 'sprite.png', //スプライトの画像
    cssName: '_sprite.scss', //生成されるscss
    imgPath: '../img/sprite.png', //生成されるscssに記載されるパス
    cssFormat: 'scss', //フォーマット
    cssVarMap: function (sprite) {
      sprite.name = 'sprite-' + sprite.name; //VarMap(生成されるScssにいろいろな変数の一覧を生成)
    }
  }));
  spriteData.img.pipe(gulp.dest('img/')); //imgNameで指定したスプライト画像の保存先
  spriteData.css.pipe(gulp.dest('sass/')); //cssNameで指定したcssの保存先
});

gulp.task('fileinclude', function() {
  gulp.src(['./app/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['fileinclude']);
  gulp.watch(['./app/sass/*.scss'], ['sass']);
  return gulp.watch(['./dist/css/*.css'], ['ple']);
});

// spriteのタスク
gulp.task("css-sprite", function() {
    gulp.run('sprite');
});

// hologramのタスク
gulp.task('hologram', function() {
  return gulp.src('hologram_config.yml')
    .pipe(hologram());
});

gulp.task('default', ['watch']);