var assert = require("assert"),
	fs     = require("fs"),
	path   = require("path"),
	es     = require("event-stream"),
	File   = require("vinyl");

var mqRemove = require("../index");

describe("gulp-mq-remove", function () {
	it("should remove media queries", function (done) {
		var test, results, fakeFile, remover;

		test    = fs.readFileSync(path.join(__dirname,    "test.css"));
		results = fs.readFileSync(path.join(__dirname, "results.css"));

		fakeFile = new File({
			contents: new Buffer(test)
		});

		remover = mqRemove({
			width: "1024px"
		}, { compress : true });

		remover.write(fakeFile);
		remover.once("data", function (file) {
			assert.equal(file.contents.toString("utf8"), results);

			done();
		});
	});
});
