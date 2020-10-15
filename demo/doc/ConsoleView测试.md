这里是初始介绍部分：这里是基础介绍...

<!--RunCode-->

```js
//直接值测试
console.log(1234);
console.log('abc');
console.log(true);
console.log(false);
console.log(null);
console.log(undefined);
console.log({})
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
console.log([]);
console.log([1,2,3,4]);
console.log([1,'abc',true,[2,3],null,{a:1},[]])

//一次输出多个值
console.log(1,2,3,4);
console.log(1,'abc',true,[1,2]);

//错误显示测试
// console.log('aaa',a);

//变量测试
console.log(new Date());
const a = 1;
const b = 2;
const c = a + b;
console.log(a);
console.log(b);
console.log(a+b+c);
const add = (a,b)=>(a+b);
console.log(add(10,21));

//传入依赖测试
// console.dir(toDate.timestampToDate(1));
```

<!--/RunCode-->
