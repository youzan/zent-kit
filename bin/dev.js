var tmp = require('tmp');
var fs = require('fs');
var exec = require('child_process').exec;

var checkfile = require('./checkfile');
var build = require('./build');
var server = require('./server');
var pkg = require('../package.json');

var tmpDir = tmp.dirSync().name;

function setupEnvironment(dir, callback) {
    var reactVersion = pkg.dependencies.react;
    var reactDomVersion = pkg.dependencies['react-dom'];
    console.log('Setup build environment...');
    var cmd = 'npm init -y && npm install react@' + reactVersion + ' react-dom@' + reactDomVersion;
    exec(cmd, {
        cwd: dir
    }, callback);
}

module.exports = function() {
    if (checkfile('examples')) {
        setupEnvironment(tmpDir, function(error, stdout, stderr) {
            if (error) {
                console.error(error);
                process.exit(-2);
            }

            build(tmpDir);
            server(tmpDir);
        });
    }
};
