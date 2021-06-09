const {src, dest, task, series} = require('gulp')
const rm = require( 'gulp-rm' ) 

const file = [
  'src/styles/*.scss',
  '!src/styles/two.scss'
]

task( 'clean', () => {
  return src( 'dist/**/*', { read: false })
    .pipe( rm() )
})

task( 'copy', series('clean', () =>  {
  return src(file).pipe(dest('dist'))}
))