// Load plugins
const gulp   = require("gulp");
const sass   = require("gulp-sass");
const uglify = require("gulp-uglify");

const rename     = require("gulp-rename");
const plumber    = require("gulp-plumber");
const sourcemaps = require('gulp-sourcemaps');

const cleanCSS     = require("gulp-clean-css");
const browsersync  = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");

// CSS task
function css() {
  return gulp
    .src("./scss/*.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'safari 11', 'IE 11'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browsersync.stream());
}

// Tasks
gulp.task("css", css);
gulp.task("js", js);

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch(["./js/**/*.js", "!./js/*.min.js"], js);
  gulp.watch("./**/*.html", browserSyncReload);
}

gulp.task("default", gulp.parallel(css, js));

// dev task
gulp.task("dev", gulp.parallel(css, js, watchFiles, browserSync));
