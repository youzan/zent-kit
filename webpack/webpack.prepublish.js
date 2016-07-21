var projectConf;
var defaultConf = {
    externals: [{
        'react': {
          amd: 'react',
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react'
        },
        'react-dom': {
          amd: 'react-dom',
          root: 'ReactDOM',
          commonjs2: 'react-dom',
          commonjs: 'react-dom'
        }
    }]
};

try {
    projectConf = require(path.resolve(process.cwd(), './zent.webpack.config.js'));
} catch (ex) {
    projectConf = defaultConf;
}

module.exports = function(entry, output) {
    var arr = output.split('/');
    var lab = arr[arr.length - 3];
    var webpackBase = require('./webpack.base.js')(entry, output);

    var webpackConfig = {
        output: {
          filename: 'main.js',
          path: output,
          library: lab,
          libraryTarget: 'umd'
        }
    };

    return Object.assign(webpackBase, webpackConfig, projectConf);
};
