# gulp-mq-remove

Remove all media queries, inlining a default set.

This is mostly useful when dealing with older browsers that do not support media queries without
falling back to something like respond.js.

## `mqRemove(query[, options])` 

* `query`: Media query matching [css-mediaquery](https://github.com/ericf/css-mediaquery)
* `options`: Output options matching [css](https://github.com/reworkcss/css)

## Example

	var gulp     = require("gulp"),
		mqRemove = require("gulp-mq-remove");

	gulp.task("ie8styles", function () {
			return gulp.src("styles/**/*.css")
				.pipe(mqRemove({ width: "1024px" }))
				.pipe(gulp.dest("build"));
		});
