/*jslint node:true */
'use strict';

var glob = require('glob');
var path = require('path');
var fs = require('fs-extra');
var through = require('through2');
var project = require('./package.json');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var cache = require('gulp-cache');
var useref = require('gulp-useref');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var imagemin = require('gulp-imagemin');
var cleancss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var closureCompiler = require('google-closure-compiler').gulp({requireStreamInput: true});
var pngquant = require('imagemin-pngquant');
var acorn = require('acorn');

gulp.task('material-icons-svg', function () {
    var iconNames = [];
    glob.sync('app/**/*.html', {}).forEach(function (filename) {
        (fs.readFileSync(filename, 'utf8').match(/md\-svg\-icon="gui:(.*?)(?=")/g) || []).forEach(function (match) {
            match = match.split('md-svg-icon="gui:')[1];
            if (iconNames.indexOf(match) < 0) {
                iconNames.push(match);
            }
        });
    }); //console.log(iconNames);
    var source = fs.readFileSync('node_modules/angular-material-icons/angular-material-icons.js', 'utf8');
    var ast = acorn.parse(source, {sourceType: 'script'});
    var includedShapes = require('acorn/dist/walk').findNodeAt(ast, null, null, function(nodeType, node) {
        return nodeType === 'FunctionDeclaration' && node.id.name === 'includedShapes';
    });
    var iconCodes = {};
    includedShapes.node.body.body[0].argument.properties.forEach(function(property) {
        iconCodes[property.key.value] = property.value.value;
    });
    var svg = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '\n';
    svg += '<svg>' + '\n';
    iconNames.forEach(function (iconName) {
        if (iconCodes[iconName]) {
            svg += '  <defs>' + '\n';
            svg += '    <svg viewBox="0 0 24 24" id="' + iconName + '">' + '\n';
            svg += '      ' + iconCodes[iconName] + '\n';
            svg += '    </svg>' + '\n';
            svg += '  </defs>' + '\n';
        } else {
            console.warn('Could not find \"' + iconName + '\" icon in angular-material-icons');
        }
    });
    svg += '</svg>'; //console.log(svg);
    fs.writeFileSync('app/icons/gui-icons.svg', svg);
});

gulp.task('jasmine-standalone', function () {
    return gulp.src('jasmine/SpecRunner.html')
        .pipe(inject(gulp.src(['app/*.js', 'app/*-part/*.js', '!app/**/*_test.js'], {read: false}), {name:'logics', relative: true}))
        .pipe(inject(gulp.src(['app/**/*_test.js'], {read: false}), {name:'tests', relative: true}))
        .pipe(gulp.dest('jasmine/'));
});

gulp.task('compress-images', function () {
	return gulp.src('app/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/'));
});

gulp.task('sass', function () {
    return gulp.src('app/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream());
});

gulp.task('closure-compiler', function () {
    return gulp.src('email-verifier/**/*.js', {base: './'})
        .pipe(sourcemaps.init())
        .pipe(closureCompiler({
            compilation_level: 'ADVANCED',
            warning_level: 'VERBOSE',
            js_output_file: 'output.min.js'
        }))
        .pipe(sourcemaps.write('/')) // gulp-sourcemaps automatically adds the sourcemap url comment 
        .pipe(gulp.dest('dist/'));
});

gulp.task('update-npm-packages', function () {
    fs.readFile('package.json', 'utf8', function (err, data) {
        if (err) {return console.log(err);}
        var key, dependencies = [], devDependencies = [], packageJson = JSON.parse(data);
        for (key in packageJson.dependencies) {
            dependencies.push(key);
        }
        for (key in packageJson.devDependencies) {
            devDependencies.push(key);
        }
        packageJson.dependencies = {};
        packageJson.devDependencies = {};
        fs.writeFile('package.json', JSON.stringify(packageJson, null, '    '), 'utf8', function (err) {
            if (err) {return console.log(err);}
            console.log('npm install --save ' + dependencies.join(' '));
            require('child_process').exec('npm install --save ' + dependencies.join(' '), function (err, stdout, stderr) {
                console.log(stdout); console.log(stderr);
            });
            console.log('npm install --save-dev ' + devDependencies.join(' '));
            require('child_process').exec('npm install --save-dev ' + devDependencies.join(' '), function (err, stdout, stderr) {
                console.log(stdout); console.log(stderr);
            });
        });
    });
});

gulp.task('update-vendor-scripts', ['update-npm-packages'], function () {
    return gulp.src(['app/script/*.js'])//, '!app/script/angular-drag-and-drop-lists*.js'])
        .pipe(through.obj(function (file, enc, cb) {
            //console.log('node_modules/' + path.parse(file.path).name.replace('.min', '') + '/**/' + path.basename(file.path));
            gulp.src('node_modules/' + path.parse(file.path).name.replace('.min', '') + '/**/' + path.basename(file.path))
                .pipe(through.obj(function (file, enc, cb) {
                    console.log('copying', file.path);
                    fs.copy(file.path, 'app/script-updated/' + path.basename(file.path), function (err) {
                        if (err) {
                            return console.error('error copying from:', file.path, err);
                        }
                        console.log("success!");
                    });
                cb(null, file);
                }));
            cb(null, file);
        }));
        //.pipe(browserSync.stream());
});

gulp.task('reduce-sources', ['update-vendor-scripts'], function () {
    return gulp.src('app/index.html')
        /*.pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
        .pipe(sourcemaps.write('maps'))*/
        .pipe(useref())
        .pipe(gulpif('*app*.js', uglify()))
        .pipe(gulpif('*.css', cleancss()))
        .pipe(gulpif('index.html', rename('index2.html')))
        .pipe(gulp.dest('app/'));
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: "http://localhost:3000",
        port: 4000,
        reloadDelay: 1000,
        files: ["app/**/*.*"],
        logPrefix: "BS " + project.name,
        browser: "google chrome"
    });
    gulp.watch("app/**/*.*").on('change', browserSync.reload);
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch("app/scss/*.scss", ['sass']);
});

gulp.task('build', ['reduce-sources', 'fonts'], function () {
    console.log('Building files');
});

gulp.task('default', ['watch']);