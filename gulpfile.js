const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require("gulp-rm");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");
const concat = require("gulp-concat");
const browserSync = require('browser-sync').create();
const reload = browserSync.reload
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');

const {DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS} = require('./gulp.config');

task("clean", () => {
  return src("${DIST_PATH}/**/*", { read: false }).pipe(rm());
});

task("copy:html", () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(`${DIST_PATH}`))
    .pipe(reload({stream: true}));
});



const styles = [
  ...STYLES_LIBS,
  "src/styles/main.scss",
];

task("styles", () => {
  return src(styles)
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.scss"))
    .pipe(sassGlob())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(px2rem())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest(`${DIST_PATH}`))
    .pipe(reload({stream: true}));
  });
  
  const libs = [
    ...JS_LIBS,
    'src/scripts/*.js'
  ]

  task('scripts', () => {
    return src(libs)
      .pipe(sourcemaps.init())
      .pipe(concat('main.min.js', {newLine: ';'}))
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(dest(`${DIST_PATH}`))
      .pipe(reload({ stream: true }));
   });

   task('icons', () => {
    return src(`${SRC_PATH}/images/icons/*.svg`)
      .pipe(svgo({
        plugins: [
          {
            removeAttrs: {
              attrs: '(fill|stroke|style|width|height|data.*)'
            }
          }
        ]
      }))
      .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg'
          }
        }
      }))
      .pipe(dest(`${DIST_PATH}/images/icons`));
   });

   task('server', () => {
  browserSync.init({
      server: {
          baseDir: `./${DIST_PATH}`
      }, 
      open: false
  });
});


watch(`${SRC_PATH}/styles/**/*.scss`, series("styles"));
watch(`${SRC_PATH}/*.html`, series("copy:html"));
watch(`${SRC_PATH}/scripts/*.js`, series('scripts'));
watch(`${SRC_PATH}/images/icons/*.svg`, series('icons'));

task(
  "default", 
  series("clean", parallel("copy:html", "styles", "scripts", "icons"), "server"));
