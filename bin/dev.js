var checkfile = require('./checkfile');
var build = require('./build');

module.exports = function() {
    if (checkfile('examples')) {
        build();
        require('./server');
    }
};
