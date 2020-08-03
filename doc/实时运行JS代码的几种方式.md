[TOC]

考虑到兼容性问题，在正式执行代码前最好将其转换为`es3`或`es5`，以下是我采用的编译方式：
```js
//需要先引入脚本 
//<script type="text/javascript" src="//cdn.staticfile.org/babel-standalone/6.24.0/babel.min.js"></script>
window.Babel.transform(sourceCode, babelTransformOptions).code;
```

# `evel`
简单直接，也是我采取的方案，使用方式：
```js
evel(code);
```

# `iframe.src`
```js
const iframeDoc = document.querySelector(`${iframe.id}`);

iframeDoc.src = 'data:text/html;charset=utf-8,' + encodeURI(`<script>${code}</script>`);
```

# 通过`appendChild`注入
> 注：不使用`iframe`，直接注入`document`也是可行的，不过一般不这么做 <br/>
> 这个方案是很多在线编译器例如CodePen、JsBin、JsFiddle……的选择，除了注入js脚本，也方便注入html、css
```js
const iframeDoc = document.querySelector(`${iframe.id}`);
const idocument = iframeDoc.contentDocument;
const el = idocument.createElement('script');
el.text = code;
idocument.body.appendChild(el);
```

# 参考文档
- [为Iframe注入脚本的不同方式比较](https://harttle.land/2016/04/14/iframe-script-injection.html)
