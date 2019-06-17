// Load plugins
const browsersync  = require('browser-sync').create();

const gulp          = require('gulp');
const sass          = require('gulp-sass');
const terser        = require('gulp-terser');

const rename        = require('gulp-rename');
const plumber       = require('gulp-plumber');
const sourcemaps    = require('gulp-sourcemaps');

const cleanCSS      = require('gulp-clean-css');

const autoprefixer  = require('gulp-autoprefixer');
const browserify    = require('browserify');
const buffer        = require('vinyl-buffer');
const tap           = require('gulp-tap');
const watchify      = require('watchify');
const babel         = require('gulp-babel');
const pug           = require('gulp-pug');
const del           = require('del');



const paths = {
  views: {
    src: 'src/views/*.pug',
    dest: './public',
    watch: 'src/views/**/*.pug'
  },
  css: {
    src: 'src/scss/*.scss',
    dest: './public/css',
    watch: 'src/scss/**/*.scss'
  },
  scripts: {
    src: 'src/scripts/*.js',
    dest: './public/js',
    watch: 'src/scripts/**/*.js'
  },
  assets:  {
    src: 'assets/**',
    dest: 'public',
    watch: 'assets/**'
  }
};



// CSS task
function compileSCSS() 
{
  return gulp
    .on('error', sass.logError)
    .src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest(paths.css.dest)) 
    .pipe(browsersync.stream());
}

// JS task
function compileES6()
{
    return gulp
      .src(paths.scripts.src, { read: true })
      .pipe(babel({ presets: ['@babel/env'] }))
      .pipe(tap( file => {
        file.contents = browserify(file.path, { debug: true }).bundle();
      }))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
     
      .pipe(terser())
      .pipe(rename({ suffix: '.min'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(browsersync.stream());

}

// HTML Engine task
function compilePug()
{

  let pugOpts = {
    basedir: './src/views',
    pretty: true /* deprecated */
  };

  return gulp
    .src(paths.views.src)
    .pipe(pug(pugOpts))
    .on('error', console.error)
    .pipe(gulp.dest(paths.views.dest))
    .pipe(browsersync.stream());
}

// Assets task
function compileAssets()
{
  return gulp
    .src(paths.assets.src, {
      allowEmpty: true,
      base: './'
    })
    .pipe(gulp.dest(paths.assets.dest))
    .pipe(browsersync.stream());
}


// Optimize Images
// function optimizeImages() {
//   return gulp
//     .src("./assets/img/**/*")
//     .pipe(newer("./_site/assets/img"))
//     .pipe(
//       imagemin([
//         imagemin.gifsicle({ interlaced: true }),
//         imagemin.jpegtran({ progressive: true }),
//         imagemin.optipng({ optimizationLevel: 5 }),
//         imagemin.svgo({
//           plugins: [
//             {
//               removeViewBox: false,
//               collapseGroups: true
//             }
//           ]
//         })
//       ])
//     )
//     .pipe(gulp.dest("./_site/assets/img"));
// }


function clean()
{
  return del([
    './public/assets/', 
    './public/css/*.css', 
    './public/js/*.js',
    './public/*.html'
  ]);
}

// BrowserSync
function browserSync(done) 
{
  let browserSyncOpts = {
    server: {
      baseDir: './public'
    }
  }

  browsersync.init(browserSyncOpts);

  gulp.watch(paths.css.watch, gulp.series(compileSCSS, browserSyncReload));
  gulp.watch(paths.scripts.watch, gulp.series(compileES6, browserSyncReload));
  gulp.watch(paths.views.watch, gulp.series(compilePug, browserSyncReload))
  gulp.watch(paths.assets.watch, gulp.series(compileAssets, browserSyncReload))

  done();
}


// Browser reload
function browserSyncReload(done)
{
  browsersync.reload();
  done();
}

// compile everything, copy assets folder, copy humans.txt, optimize images
function productionRelease()
{
  // https://www.npmjs.com/package/gulp-inject-string
  // https://www.npmjs.com/package/gulp-cachebust
}


// [Compile] tasks
gulp.task('compile:scss', compileSCSS);
gulp.task('compile:js', compileES6);
gulp.task('compile:pug', compilePug);
gulp.task('compile:assets', compileAssets);
gulp.task('compile:default', gulp.parallel(compileSCSS, compileES6, compilePug, compileAssets));

// [Watch] tasks
gulp.task('watch:scss', () => { gulp.watch(paths.css.watch, gulp.series(compileSCSS)) });
gulp.task('watch:js', () => { gulp.watch(paths.scripts.watch, gulp.series(compileES6)) });
gulp.task('watch:pug', () => { gulp.watch(paths.views.watch, gulp.series(compilePug)) });
gulp.task('watch:assets', () => { gulp.watch(paths.assets.watch, gulp.series(compileAssets)) });

// [Development] Tasks
gulp.task('run:dev', gulp.series(clean, compileSCSS, compileES6, compilePug, compileAssets, browserSync));
// gulp.task('run:optimize', gulp.series(optimizeImages, copyAssets));
gulp.task('run:clean', gulp.series(clean));

// [Production] Tasks
gulp.task('run:production', gulp.series(clean, productionRelease))