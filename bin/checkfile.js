var path = require('path');
var fs = require('fs');
var projectPath = process.cwd();
var looger = console.log.bind(console);

module.exports = function(dir) {
    var hasFile = true;
    var filePath = path.resolve(projectPath, './' + dir);

    try {
        fs.accessSync(filePath);
    } catch (ex) {
        hasFile = false;
    }

    if (!hasFile) {
        looger('%s', filePath);
        looger('   未能在以上路径找到%s, 请考虑使用"zent-kit init"对项目初始化', dir);
        return false;
    }

    return filePath;
};
