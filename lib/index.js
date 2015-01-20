var through    = require("through2"),
	gutil      = require("gulp-util"),
	css        = require("css"),
	mediaQuery = require("css-mediaquery");

var PluginError = gutil.PluginError;

var mqFlatten, mqRemove, gulpMqRemove;

var PLUGIN_NAME = "gulp-mq-remove";

mqFlatten = function (rules, rule) {
	var nextRules = rules;

	if (!rule.media) {
		nextRules = rule.rules = [];
		rules.push(rule);
	}

	if (rule.rules) {
		rule.rules.reduce(mqFlatten, nextRules);
	}

	return rules;
};

mqRemove = function (query, contents) {
	var data = css.parse(contents.toString()),
		filterRules;

	filterRule = function (rule) {
		if (rule.type === "media" && !mediaQuery.match(rule.media, query)) {
			return false;
		}

		// Recurse
		if (rule.rules) {
			rule.rules = rule.rules.filter(filterRule);
		}

		return true;
	};

	if (data.stylesheet) {
		filterRule(data.stylesheet);
		if (data.stylesheet.rules) {
			data.stylesheet.rules = data.stylesheet.rules.reduce(mqFlatten, []);
		}
	}

	return data;
};

gulpMqRemove = function (query, options) {
	if ("object" !== typeof query) {
		throw new PluginError(PLUGIN_NAME, "Invalid query definition");
	}

	var stream = through.obj(function(file, enc, callback) {

		if (file.isBuffer()) {
			try {
				file.contents = new Buffer(css.stringify(mqRemove(query, file.contents), options));
			} catch (e) {
				this.emit("error", new PluginError(PLUGIN_NAME, e));
			}
		}

		if (file.isStream()) {
			this.emit("error", new PluginError(PLUGIN_NAME, "Streams are not supported"));
		}

		this.push(file);

		return callback();

	});

	return stream;
};

// Exporting the plugin main function
module.exports = gulpMqRemove;
