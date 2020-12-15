
<!--start-code-->

```jsx
import {useState,useEffect} from 'React';
import {exports} from 'module';

// console.log('exports',exports);
// console.log('useEffect',useEffect);

function Demo(){
    const [num,setNum] = useState(0); 
    return <div>
         <p>{num}</p>
         <button onClick={()=>setNum(num+1)}>点击增加</button>
     </div>;
}

export default Demo;
```

<!--end-code-->
