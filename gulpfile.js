const {src, dest, task} = require('gulp')
const rm = require( 'gulp-rm' ) 

const file = [
  'src/styles/*.scss',
  '!src/styles/two.scss'
]

task( 'clean', () => {
  return src( 'dist/**/*', { read: false })
    .pipe( rm() )
})

function copy() {
  return src(file).pipe(dest('dist'))
}

exports.copy = copy;
