#!/usr/bin/env node
module.exports = function(params) {
	var ch = require('child_process');
	var spawn = ch.spawn;
	var path = require('path');

	var p = path.resolve(__dirname, '../node_modules/jest/bin/jest.js');

	var jest = spawn(p, params.split(' '), {stdio: 'inherit'});
};
