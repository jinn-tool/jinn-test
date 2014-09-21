'use strict';

var exec = require('exec')
  , fs   = require('fs')
  , gulp = require('gulp')

module.exports = function (jinn, cb) {
  jinn.log('installing test harness')

  function setup() {
    var packagejson = process.cwd() + '/' + jinn.appname + '/package.json'
    fs.readFile(packagejson, 'utf8', function (err, content) {
      if (err) throw err
      var pjson = JSON.parse(content)
      pjson.scripts['test:unit'] = 'testem'
      fs.writeFile(packagejson, JSON.stringify(pjson, null, 2), cb)
    })
  }

  function install() {
    var cd = 'cd ' + process.cwd() + '/' + jinn.appname
    var cmd = 'npm install --save-dev testem'
    exec(cd + ' && ' + cmd, setup)
  }

  function copy() {
    var source = __dirname + '/templates/**/*'
    var dest = process.cwd() + '/' + jinn.appname
    gulp.src([source])
      .pipe(gulp.dest(dest))
      .on('end', install)
  }

  copy()
}

module.exports.command = {
  flags: '-u, --test',
  description: 'Adds a testem based test harness for badass testing'
}
