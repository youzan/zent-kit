/**
 * 传入文件名，调整UMD的测试顺序，主要是为了兼容rjs打包
 *
 (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["zent-seed"] = factory(require("react"));
	else
		root["zent-seed"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {

转换成

 (function webpackUniversalModuleDefinition(root, factory) {
    if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof exports === 'object')
		exports["zent-seed"] = factory(require("react"));
	else
		root["zent-seed"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
 */

var fs = require('fs');

function swapLine(lines, a, b) {
    var line = lines[a];
    lines[a] = lines[b];
    lines[b] = line;
}

// FIXME: it's a hack
module.exports = function(filename) {
    var codeString = fs.readFileSync(filename, { encoding: 'utf-8' });
    var codeLines = codeString.split('\n');

    swapLine(codeLines, 2, 4);
    swapLine(codeLines, 1, 3);

    codeLines[1] = codeLines[1].replace(/else\s/, '');
    codeLines[3] = codeLines[3].replace(/if\(/, 'else if(');

    fs.writeFileSync(filename, codeLines.join('\n'), { encoding: 'utf-8' });
};
