
// Configurations

let gulp           = require('gulp')
let del            = require('del')
let sass           = require('gulp-sass')
let browserSync    = require('browser-sync').create()
let mincss 		   = require('gulp-cssmin')
let postcss 	   = require('gulp-postcss')
let pug            = require('gulp-pug')
let rename         = require('gulp-rename')
let imgmin         = require('gulp-imagemin')

const paths = {
	root: './src',
	templates: {
		from: './src/views/pages/**/*.pug',
		to:   './dist/',
		src:  './src/views/**/*.pug'
	},
	styles:    {
		from: './src/assets/app/default/default.sass',
		src:  './src/assets/app/default/*',
		imprt:'./src/assets/styles/',
		to:   './dist/assets/css'
	},
	image:     {
		from: './src/assets/image/*',
		to:   './dist/assets/img'
	},
	fonts:     {
		from: './src/assets/fonts/**',
		to:   './dist/assets/fonts'
	},
};

//  Task for files

gulp.task('sass-build',    function () {
	return gulp.src(paths.styles.from)
		.pipe(sassImport({
			filename: './',
			marker: '/*'
		}))
		.pipe(sass())
		.pipe(postcss([prefixer({
			overrideBrowserslist: 'last 5 version',
			cascade: false
		})]))
		.pipe(mincss())
		.pipe(rename('styles.min.css'))
		.pipe(gulp.dest(paths.styles.to));
});

gulp.task('pug-build',     function () {
	return gulp.src((paths.templates.from))
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(paths.templates.to));
});

gulp.task('image-build',   function () {
	return gulp.src(paths.image.from)
		.pipe(imgmin())
		.pipe(gulp.dest(paths.image.to))
});

gulp.task('fonts-build',   function () {
	return gulp.src(paths.fonts.from)
		.pipe(gulp.dest(paths.fonts.to))
});

// Task for development

gulp.task('default_watch', function () {
	gulp.watch(paths.templates.src, gulp.parallel('pug-build'));
	gulp.watch(paths.styles.src,     gulp.parallel('sass-build'));
	gulp.watch(paths.image.from,     gulp.parallel('image-build'));
	gulp.watch(paths.fonts.from,     gulp.parallel('fonts-build'));
});

gulp.task('default_serve', function () {
	browserSync.init({

		server: paths.root

	});

	browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
});

// Task for build

gulp.task('clean',         function () {
	return del(paths.root)
})

gulp.task('default', gulp.series(
	'clean',
	gulp.parallel(
		'pug-build',   'sass-build',
		'image-build', 'fonts-build'
	),
	gulp.parallel('default_watch', 'default_serve')
));
