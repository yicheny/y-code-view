日期选择器组件测试：

<!--start-code-->

```js
 const instance = (<div style={{display:'flex'}}>
     <DatePicker onChange={console.log}/>
     <DatePicker value={new Date(2030,6,1)} onChange={console.log}/>
 </div>);

ReactDOM.render(instance);
 ```
 
 <!--end-code-->

日期选择器组件使用介绍：
