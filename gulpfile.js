const browsersync = require('browser-sync').create();

// Gulp
const gulp = require('gulp');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// CSS
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const tailwind = require('tailwindcss');

// JS
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const tap = require('gulp-tap');
const babel = require('gulp-babel');

// HTML
const inject = require('gulp-inject-string');
const del = require('del');


const purgecss = require('gulp-purgecss');

const paths = {
	views: {
		src: 'src/views/*.html',
		dest: './public',
		watch: 'src/views/**/*.html',
	},
	css: {
		src: 'src/scss/*.scss',
		dest: './public/css',
		watch: 'src/scss/**/*.scss',
	},
	scripts: {
		src: 'src/scripts/*.js',
		dest: './public/js',
		watch: 'src/scripts/**/*.js',
	},
	assets: {
		src: 'assets/**',
		dest: 'public',
		watch: 'assets/**',
	},
};

/*
 * CSS task
 *   This task compiles your SCSS files with postcss, with the following
 *   plugins enabled, and ordered:
 *
 *   Tailwind - UI framekwork
 *   Autoprefix - Automatically add vendor prefixes to the rules
 *   PurgeCSS - Remove unused classes
 *   CSSNano - Minifies the final output
 */
function compileSCSS() {
    
    const plugins = [
        tailwind(),
		autoprefixer(),
        cssnano(),
	];

	return gulp
		.src(paths.css.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(sourcemaps.write('.'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(paths.css.dest))
		.pipe(browsersync.stream());
}

// JS task
function compileES6() {
	return gulp
		.src(paths.scripts.src, { read: true })
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(
			tap((file) => {
				file.contents = browserify(file.path, { debug: true }).bundle();
			})
		)
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(terser())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(browsersync.stream());
}

// HTML Engine task
// https://www.npmjs.com/package/gulp-browserify
function compileHTML() {
	let pugOpts = {
		basedir: './src/views',
		pretty: true /* deprecated */,
	};

	return gulp
		.src(paths.views.src)
		// .pipe(pug(pugOpts))
        .pipe(inject.before('</body>', '<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>\n'))
		.pipe(gulp.dest(paths.views.dest))
		.pipe(browsersync.stream());
}

// Assets task
function compileAssets() {
	return gulp
		.src(paths.assets.src, {
			allowEmpty: true,
			base: './',
		})
		.pipe(gulp.dest(paths.assets.dest))
		.pipe(browsersync.stream());
}

// Optimize Images
function optimizeImages() {
//   return gulp
//     .src("assets/imgages/**/*")
//     .pipe(newer("public/assets/imgages"))
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
//     .pipe(gulp.dest("public/assets/imgages"));
}

function clean() {
	return del(['./public/*']);
}

// BrowserSync
function browserSync(done) {
	let browserSyncOpts = {
		server: {
			baseDir: './public',
		},
	};

	browsersync.init(browserSyncOpts);

	gulp.watch(paths.css.watch, gulp.series(compileSCSS, browserSyncReload));
	gulp.watch(paths.scripts.watch, gulp.series(compileES6, browserSyncReload));
	gulp.watch(paths.views.watch, gulp.series(compileHTML, browserSyncReload));
	gulp.watch(
		paths.assets.watch,
		gulp.series(compileAssets, browserSyncReload)
	);

	done();
}

// Browser reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}

// compile everything, copy assets folder, copy humans.txt, optimize images
function productionRelease() {
	// https://www.npmjs.com/package/gulp-inject-string
	// https://www.npmjs.com/package/gulp-cachebust
}

// [Compile] tasks
gulp.task('compile:scss', compileSCSS);
gulp.task('compile:js', compileES6);
gulp.task('compile:pug', compileHTML);
gulp.task('compile:assets', compileAssets);
gulp.task(
	'compile:default',
	gulp.parallel(compileSCSS, compileES6, compileHTML, compileAssets)
);

// [Watch] tasks
gulp.task('watch:scss', () => {
	gulp.watch(paths.css.watch, gulp.series(compileSCSS));
});
gulp.task('watch:js', () => {
	gulp.watch(paths.scripts.watch, gulp.series(compileES6));
});
gulp.task('watch:html', () => {
	gulp.watch(paths.views.watch, gulp.series(compileHTML));
});
gulp.task('watch:assets', () => {
	gulp.watch(paths.assets.watch, gulp.series(compileAssets));
});

// [Development] Tasks
gulp.task(
	'run:dev',
	gulp.series(
		clean,
		compileSCSS,
		compileES6,
		compileHTML,
		compileAssets,
		browserSync
	)
);

// gulp.task('run:optimize', gulp.series(optimizeImages, copyAssets));
gulp.task('run:clean', gulp.series(clean));

// [Production] Tasks
gulp.task('run:production', gulp.series(clean, productionRelease));
