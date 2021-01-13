[TOC]

# 问题
```js
__print(throw new Error('error'))
```
`__print`执行报错后，后续报错无法继续执行。

这是因为`try-catch`捕获的是整个`runtime`的错误，一旦报错后续不再执行。

# 目的
针对性为每一个`__print`执行时添加`try-catch`。

额外提一句，`js`的参数是运行优先，所以是不能在`__print`内部添加`try-catch`来解决这个问题的

比如说：
```js
print(1+2);
```
以这个例子来说，`1+2`会先执行得到运算结果`3`然后再被传递给`print`。

返回现在的场景，就是说在传递给`print`，错误就已经被抛出了，这个错误是在调用`print`的作用域下抛出的，所以`print`是不能在自己的作用域捕获这个错误。

因此，我们需要在调用`print`时为每一个`print`加个`try-catch`作为安全保障，一旦发生错误，我们就捕获并记录这个错误，继续之后下面的代码。

我们需要的执行时代码大概是这样的：
```js
try{
    print(/*参数-可能报错*/);
}catch ( e ){
    //捕获e进行记录
}
```

# 解决思路
> 这里会利用AST进行处理，相比于正则更可靠也更方便

1. 为`console.log` 套上 `try-catch`
2. 将`console.log` 换成 `__print`

# 实现
## 1. 为`console.log` 套上 `try-catch`
首先是对比转换前后`AST`的不同，对比结果如下：
```
TryStatement {
    type:"TryStatment",
    block:BlockStatement{
        type:"BlockStatement",
        body: [
            ExpressionStatement{}//原节点
        ]
    },
    handler:CatchCasuse{},//详细内容不再展开
    finalizer:null
}
```
