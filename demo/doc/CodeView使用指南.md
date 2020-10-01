TOC

# 渲染markdown文档内容
首先配置`webpack.config.js`：
```
{
    test: /\.md$/,
    use: [
        {
            loader: "raw-loader"
        }
    ]
}
```

使用方式如下：
- `<CodeView source={require('./doc').default}/>`
- `<CodeView source={require('./doc')/>`
- `<CodeView>require('./doc').default</CodeView>`
- `<CodeView>require('./doc')</CodeView>`

# 可以使用的主题
- `lucario`
- `neo`
- `panda-syntax`
- `ttcn`
