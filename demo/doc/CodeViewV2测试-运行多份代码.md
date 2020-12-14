这里是初始介绍部分：这里是基础介绍...

```js
//普通代码块不会被运行
console.log(1);
```

<!--start-code-->

```jsx
const {useState} = React;
function Demo(){
    const [num,setNum] = useState(0); 
    return <div>
         <p>{num}</p>
         <button onClick={()=>setNum(num+1)}>点击增加</button>
     </div>;
}
module.exports = Demo;
```

<!--end-code-->

详细介绍：这里是详细介绍...

```js
//普通代码块不会被运行
console.log(2);
```

<!--start-code-->

```jsx
const {useState} = React;

function Demo(){
    const [num,setNum] = useState(100); 
    return <div>
         <p>{num}</p>
         <button onClick={()=>setNum(num+10)}>点击增加</button>
     </div>;
}
module.exports = Demo;
```

<!--end-code-->

详细介绍：这里是详细介绍...
