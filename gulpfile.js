var path = require('path');
var util = require('util');

var gulp = require('gulp');
var lazypipe = require('lazypipe');
var merge = require('merge-stream');
var cache = require('gulp-cache');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');
var FileCache = require('cache-swap');
var jshintStylish = require('jshint-stylish');

var globals = {};
var globalList = [
	'Bot', 'CommandParser', 'Config', 'DataDownloader', 'Features', 'Formats', 'Settings', 'Tools',
	'colors', 'sys', 'fs', 'path', 'PSClient',
	'reloadConfig', 'reloadFeatures',
	'toId', 'toRoomid', 'ok', 'info', 'error', 'errlog', 'debug', 'cmdr', 'recv', 'sent', 'monitor'
];
globalList.forEach(function (identifier) {globals[identifier] = false;});

function transformLet () {
	// Replacing `var` with `let` is sort of a hack that stops jsHint from
	// complaining that I'm using `var` like `let` should be used, but
	// without having to deal with iffy `let` support.

	return lazypipe()
		.pipe(replace.bind(null, /\bvar\b/g, 'let'))();
}

function lint (jsHintOptions, jscsOptions) {
	function cachedJsHint () {
		return cache(jshint(jsHintOptions, {timeout: 450000}), {
			success: function (file) {
				return file.jshint.success;
			},
			value: function (file) {
				return {jshint: file.jshint};
			},
			fileCache: new FileCache({tmpDir: '.', cacheDirName: 'gulp-cache'})
		});
	}
	return lazypipe()
		.pipe(cachedJsHint)
		.pipe(jscs.bind(jscs, jscsOptions))();
}

var jsHintOptions = {};
jsHintOptions.base = {
	"nonbsp": true,
	"nonew": true,
	"noarg": true,
	"loopfunc": true,
	"latedef": 'nofunc',

	"freeze": true,
	"undef": true,

	"sub": true,
	"evil": true,
	"esnext": true,
	"node": true,
	"eqeqeq": true,

	"globals": globals
};

var jscsOptions = {};
jscsOptions.base = {
	"preset": "yandex",

	"requireCurlyBraces": null,

	"maximumLineLength": null,
	"validateIndentation": '\t',
	"validateQuoteMarks": null,
	"disallowYodaConditions": null,
	"disallowQuotedKeysInObjects": null,
	"requireDotNotation": null,

	"disallowMultipleVarDecl": null,
	"disallowImplicitTypeConversion": null,
	"requireSpaceAfterLineComment": null,
	"validateJSDoc": null,

	"disallowMixedSpacesAndTabs": "smart",
	"requireSpaceAfterKeywords": true,

	"disallowSpacesInFunctionDeclaration": null,
	"requireSpacesInFunctionDeclaration": {
		"beforeOpeningCurlyBrace": true
	},
	"requireSpacesInAnonymousFunctionExpression": {
		"beforeOpeningRoundBrace": true,
		"beforeOpeningCurlyBrace": true
	},
	"disallowSpacesInNamedFunctionExpression": null,
	"requireSpacesInNamedFunctionExpression": {
		"beforeOpeningCurlyBrace": true
	},
	"validateParameterSeparator": ", ",

	"requireBlocksOnNewline": 1,
	"disallowPaddingNewlinesInBlocks": true,

	"requireOperatorBeforeLineBreak": true,
	"disallowTrailingComma": true,

	"requireCapitalizedConstructors": true,

	"validateLineBreaks": require('os').EOL === '\n' ? 'LF' : null,
	"disallowMultipleLineBreaks": null,

	"esnext": true
};
jscsOptions.config = util._extend(util._extend({}, jscsOptions.base), {
	"disallowTrailingComma": null
});

var lintData = [
	{
		dirs: ['./command-parser.js', './data-downloader.js', './index.js', './settings.js', './tools.js', './commands/*.js', './features/*/*.js', './languages/*.js'],
		jsHint: jsHintOptions.base,
		jscs: jscsOptions.base
	}, {
		dirs: ['./config-example.js'],
		jsHint: jsHintOptions.base,
		jscs: jscsOptions.config
	}
];

var linter = function () {
	return (
		merge.apply(
			null,
			lintData.map(function (source) {
				return gulp.src(source.dirs)
					.pipe(transformLet())
					.pipe(lint(source.jsHint, source.jscs));
			})
		).pipe(jshint.reporter(jshintStylish))
		 .pipe(jshint.reporter('fail'))
	);
};

gulp.task('fastlint', function () {
	var source = lintData[0];
	return gulp.src(source.dirs)
		.pipe(transformLet())
		.pipe(lint(source.jsHint, source.jscs))
		.pipe(jshint.reporter(jshintStylish))
		.pipe(jshint.reporter('fail'));
});

gulp.task('lint', linter);
gulp.task('default', linter);
