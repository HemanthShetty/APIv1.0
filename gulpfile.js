/**
 * @fileoverview All the gulp tasks needed to run unit tests , check linting and concatenate all the API definitions
 * written in YAML into a single swagger.yaml file whenever there is a change in any of the YAML definitions files.
 * @author Hemanth Shetty
 * @updated Hemanth Shetty 12/13/16
 */
'use strict';
const fs = require('fs');
const YAML = require('js-yaml');
var gulp=require('gulp');
var eslint=require('gulp-eslint');
var jsonReferenceResolver = require('json-refs');


//gulp tasks
/**
 * Registers a gulp task peforms all the operations associated with continous integration
 * @param {string} Name of the gulp task
 * @param {function()} Exit after running all the continous integration tasks(as of now only linting is checked)
 */
gulp.task('travis',['eslint'],function(){
    process.exit(0);
});
//gulp tasks
/**
 * Registers a gulp task checks all the linting rules
 * @param {string} Name of the gulp task
 * @param {function()} Function which runs ESLint to check all the linting rules
 */
gulp.task('eslint', function () {
    return gulp.src([
        'api/**/*.js',
        'middleware/**/*.js'
    ])
        .pipe(eslint()).pipe(eslint.format());
});
//gulp tasks
/**
 * Registers a gulp task which concatenates all the API description files under the definitions folder into a single
 * swagger.yaml document.
 * @param {string} Name of the gulp task
 * @param {function()} Function which reads the index.yaml file under the definitions folder and then resolves all the
 * references in yaml files using 'json-refs' library and then concatenates all the api definitions into a single
 * swagger.yaml files
 */
gulp.task('scripts', function(){
  var root = YAML.load(fs.readFileSync('definitions/index.yaml').toString());
  var options = {
    filter        : ['relative', 'remote'],
    loaderOptions : {
      processContent : function (res, callback) {
        try {
          callback(null, YAML.safeLoad(res.text));
        } catch (exception) {
          console.log(exception);
          callback(null, YAML.load(res.text));
        }
      }
    }
  };
    jsonReferenceResolver.resolveRefs(root, options).then(function (results) {
      try {
          fs.existsSync("api/swagger") || fs.mkdirSync("api/swagger");
          fs.writeFile("api/swagger/swagger.yaml", YAML.dump(results.resolved));
      }catch(exception){
          console.log(exception);
      }
  });
    jsonReferenceResolver.clearCache();
});



//watch task

gulp.task('watch',function(){
  gulp.watch('definitions/**/*.yaml',['scripts']);
});

//Default Task
gulp.task('default',['watch']);
