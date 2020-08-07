这里是初始介绍部分：这里是基础介绍...

```js
//不需要运行实例的代码
const a = 1;
const b = 2;
console.log(a + b);
```

<!--start-code-->

```jsx
function Demo(){
    const [num,setNum] = useState(0); 
    return <div>
         <p>{num}</p>
         <button onClick={()=>setNum(num+1)}>点击增加</button>
     </div>;
}
ReactDOM.render(<Demo/>);
```

<!--end-code-->

详细介绍：这里是详细介绍...

```js
//不需要运行实例的代码
const a = 1;
const b = 2;
console.log(a + b);
```
