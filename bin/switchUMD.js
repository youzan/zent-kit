// 传入文件名，同时改两个文件.js .jsx
module.exports = function(pname) {
    var readline = require('readline');
    var fs = require('fs');
    var dist = fs.createWriteStream(pname + 'x');

    var lineReader = readline.createInterface({
      input: fs.createReadStream(pname)
    });

    var index = 0;
    var str;

    lineReader.on('line', function (line) {
        // 非常粗暴直接通过行数进行修改
        if (index === 1 || index === 2) {
            str = '';
        } else if (index === 3) {
            str = line.replace(/else\s/, '');
            str += '\n';
        } else {
            str = line + '\n';
        }

        dist.write(str);
        index++;
    });

    // 改完之后，写回js
    lineReader.on('close', function (line) {
        fs.createReadStream(pname + 'x').pipe(fs.createWriteStream(pname));
    });
}
