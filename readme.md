# Zent Kit to Develop React Component

[![version][version-image]][download-url]
[![download][download-image]][download-url]
[version-image]: http://npm.qima-inc.com/badge/v/@youzan/zent-kit.svg?style=flat-square
[download-image]: http://npm.qima-inc.com/badge/d/@youzan/zent-kit.svg?style=flat-square
[download-url]: http://npm.qima-inc.com/package/@youzan/zent-kit

## Install

```bash
ynpm install @youzan/zent-kit -g
```

### 初始化组件

```bash
zent-kit init <your component name>
```

### 开发模式

```bash
zent-kit dev
```

### 测试

```bash
zent-kit test
```

### 发布

```bash
zent-kit prepublish
```

### File Structure

```bash
// 源文件(由开发者编写)
-- src
    // 组件源文件目录
-- assets
    // sass源文件目录
-- examples
    // demo文件目录
-- package.json

// 生成文件(由zent-kit生成)
-- readme.md
    // 由package.json和src下文件生成
-- lib
    // 经过babel转码的组件文件以及编译过的css
-- dist
    // 经过webpack打包的，符合UMD规范的组件文件
```

### Style

* 考虑到让用户更加容易自定义样式，尽量不要在组件源文件当中import样式文件，应该在examples目录下的文件中进行import
* 用户如果需要使用组件样式，可以直接引入我们在assets文件夹下的sass源文件，或者lib文件夹下编译完成的css文件

### ReadME

ReactME文件的规范包含：

```bash
-- description
    // 必选项：简单描述包特性(写在package.json中)
-- scene
    // 可选项：简单描述组件场景(写在src下文件中)
-- tips
    // 可选项：一些简单的设计思想的描述,或者特殊接口的介绍(写在src下文件中)
-- api
    // 必选项：介绍本组件的使用方式(写在src下文件中)
```

### package.json

如果不使用zent-kit init，自行编写的package.json需参考以下代码

```bash
{
  ...
  "description": "这是一个React组件",
  "main": "./lib/Index.js",
  "scripts": {
    "dev": "zent-kit dev",
    "lint": "node node_modules/eslint/bin/eslint ./src",
    "prepublish": "npm run lint && zent-kit prepublish"
  },
  "dependencies": {
    "react": "^15.0.x"
  },
  "files": [
    "src/",
    "assets/",
    "examples/",
    "lib/",
    "dist/"
  ],
  "devDependencies": {
    "eslint": "^2.8.x",
    "eslint-config-airbnb": "^7.0.x",
    "eslint-plugin-jsx-a11y": "^0.6.x",
    "eslint-plugin-react": "^5.0.x"
  }
  ...
}
```
