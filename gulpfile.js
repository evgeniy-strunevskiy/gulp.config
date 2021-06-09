const {src, dest} = require('gulp') 

const file = [
  'src/styles/*.scss',
  '!src/styles/two.scss'
]

function copy() {
  return src(file).pipe(dest('dist'))
}

exports.copy = copy;
