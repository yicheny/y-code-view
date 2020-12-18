运行代码1：

<!--RunCode-->

```js
console.log({a:1});
console.log({
    a:0,
    b:'abc',
    c:true,
    d:null,
    e:{
      firstName:'王',
      lastName:'小明'
    },
    f:[1,2,3]
})

//当内容超过一行时，会折换成'...'
console.log([
    1,
    'abc',
    true,
    null,
    [],
    {},
    [2,3],
    {a:1}
])

console.log([
    1,
    'abc',
    true,
    null,
])
```

<!--/RunCode-->

运行代码2：

<!--start-code-->

```js
console.log(111222333);
```

<!--end-code-->
