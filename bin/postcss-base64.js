/* eslint-disable */

// forked from postcss-base64 plugin
// Add fileFilter option

var fs = require('fs');
var path = require('path');
var postcss = require('postcss');

function getUrl(value) {
  var reg = /url\((\s*)(['"]?)(.+?)\2(\s*)\)/g;
  var match = reg.exec(value);
  var url = match[3];
  return url;
}

function replaceFiles(string, opts) {
  var file = getUrl(string);

  if (opts.exclude && opts.exclude.test(file)) {
    return string;
  }

  var ext = path.extname(file).replace('.', '');

  if (ext === 'svg') ext = ext + '+xml';

  var fileContents = fs.readFileSync(path.join(opts.root, file));
  var output =
    'data:image/' + ext + ';base64,' + fileContents.toString('base64');

  return string.replace(file, output);
}

function replaceInline(string, opts) {
  var output = new Buffer(string).toString('base64');
  if (opts.prepend) output = opts.prepend + output;
  return output;
}

module.exports = postcss.plugin('postcss-base64', function(opts) {
  return function(css, result) {
    opts = opts || {};

    var exts, ext, search, file, fileContents, output;

    if (!opts.root) {
      opts.root = process.cwd();
    }

    if (opts.excludeAtFontFace === undefined) {
      opts.excludeAtFontFace = true;
    }

    if (opts.extensions) {
      exts = '\\' + opts.extensions.join('|\\');
      search = new RegExp('url\\(.*(' + exts + ').*\\)', 'i');

      css.each(function(node) {
        if (
          opts.excludeAtFontFace &&
          node.type === 'atrule' &&
          node.name === 'font-face'
        ) {
          // Don't do @font-face rules
          return;
        }

        if (node.replaceValues) {
          node.replaceValues(search, function(string) {
            return replaceFiles(string, opts);
          });
        }
      });
    }

    if (opts.pattern) {
      if (!opts.pattern instanceof RegExp) {
        throw new Error(
          'Given search pattern is not a (valid) regular expression.'
        );
      }

      search = opts.pattern;

      css.replaceValues(search, function(string) {
        return replaceInline(string, opts);
      });
    }
  };
});
