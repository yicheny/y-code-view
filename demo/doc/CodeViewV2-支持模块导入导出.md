
<!--start-code-->

```jsx
import React,{useState,useEffect} from 'react';

// console.log('exports',__module.exports);
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
