var css = [
  './assets/css/bootstrap.min.css',
  './assets/css/font-awesome.min.css',
  './assets/css/main.css',
  './assets/css/catalog.css',
  './assets/css/product.css',
  './assets/css/spinner.css',
  './js/libs/slick/slick.css',
  './js/libs/slick/slick-theme.css'
];

var js  = [
  './js/libs/angular-ui-router.js',
  './js/libs/angular-cookies.min.js',
  './js/libs/angresource.js',
  './js/libs/capitalize.min.js',
  './js/libs/underscore-min.js',
  './js/libs/ng-infinitescroll.js',
  './js/libs/slick/slick.js',
  './js/assets/js/bootstrap.min.js',
  './js/app.js',
  './js/config.js',
  './js/router/router.js',
  './js/services/services.js',
  './js/services/states.js',
  './js/directives/oqv.js',
  './js/directives/partials.js',
  'js/filters/filters.js',
  './js/controllers/main/mainCtrl.js',
  './js/controllers/catalog/catalogCtrl.js',
  './js/controllers/product/productCtrl.js'
];

// Núcleo do Gulp
var gulp = require('gulp');

// Versionamento dos arquivos
var rev = require('gulp-rev');

var revReplace = require('gulp-rev-replace');

// Transforma o javascript em formato ilegível para humanos
var uglify = require('gulp-uglify');

// Agrupa todos os arquivos em um
var concat = require('gulp-concat');

// Minifica o CSS
var minifyCss = require('gulp-minify-css');

// Remove comentários CSS
var stripCssComments = require('gulp-strip-css-comments');

// Minifica os HTMLs
var minifyHTML = require('gulp-minify-html');

// Replace do HTML
var htmlreplace = require('gulp-html-replace');

// Amazon
var awspublish = require('gulp-awspublish');

// Amazon CloudFront Client
var cloudfront = require("gulp-cloudfront");

// Amazon S3 Client
var s3 = require("gulp-s3");

// Gzip - Compress files
var gzip = require("gulp-gzip");

// AWS ENV Vars
var aws = {
    "key": process.env.AWS_ACCESS_KEY_ID,
    "secret": process.env.AWS_SECRET_ACCESS_KEY,
    "bucket": process.env.AWS_BUCKET,
    "region": process.env.AWS_REGION
};

// Assets Cache Control
var options_js = { headers: {'Cache-Control': 'max-age=315360000, no-transform, public', 'Content-Encoding': 'gzip'}, uploadPath: '/javascripts/' };
var options_css = { headers: {'Cache-Control': 'max-age=315360000, no-transform, public', 'Content-Encoding': 'gzip'}, uploadPath: '/css/' };

// Processo que agrupará todos os arquivos CSS, removerá comentários CSS e minificará.
gulp.task('minify-css', function(){
    gulp.src(css)
    .pipe(concat('style.min.css'))
    .pipe(stripCssComments({all: true}))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rev())                   // Versiona o arquivo
    .pipe(awspublish.gzip())
    .pipe(s3(aws, options_css))
    //.pipe(gulp.dest('./build/css/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./build/css/'));
});

// Tarefa de minificação do Javascript
gulp.task('minify-js', function () {
  gulp.src(js)                        // Arquivos que serão carregados, veja variável 'js' no início
  .pipe(concat('scripts.min.js'))      // Arquivo único de saída
  .pipe(uglify({mangle: false}))  // Transforma para formato ilegível
  .pipe(rev())                   // Versiona o arquivo
  .pipe(awspublish.gzip())
  .pipe(s3(aws, options_js))
  //.pipe(gulp.dest('./build/js/'))          // pasta de destino do arquivo(s)
  .pipe(rev.manifest())
  .pipe(gulp.dest('./build/js/'));          // pasta de destino do arquivo(s)
});

// Tarefa de minificação do Javascript
gulp.task('minify-html', function () {
  var opts = {
    conditionals: true,
    spare:true,
    empty: true
  };

  return gulp.src('./views/*/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./views/'));
});


gulp.task("revreplace", function(){
  var manifestJS = gulp.src("./build/js/rev-manifest.json");
  var manifestCSS = gulp.src("./build/css/rev-manifest.json");

  return gulp.src("index.html")
    .pipe(htmlreplace({
      'js': 'http://s3-sa-east-1.amazonaws.com/assets.produtos.mobile/javascripts/scripts.min.js',
      'css': 'http://s3-sa-east-1.amazonaws.com/assets.produtos.mobile/css/style.min.css'
    }))
    .pipe(revReplace({manifest: manifestJS}))
    .pipe(revReplace({manifest: manifestCSS}))
    .pipe(gulp.dest("./"));
});

// Tarefa padrão quando executado o comando GULP
gulp.task('default',['minify-js','minify-css', 'minify-html']);

// Tarefa de monitoração caso algum arquivo seja modificado, deve ser executado e deixado aberto, comando 'gulp watch'.
gulp.task('watch', function() {
  gulp.watch(js, ['minify-js']);
  gulp.watch(css, ['minify-css']);
  gulp.watch(css, ['minify-html']);
});
