<!--start-code-->

```jsx
//import React from 'React;
import React,{useState} from 'React';
import {Modal,Button} from 'y-ui0';

// console.log('dependencies',dependencies['y-ui0']);

function ModalView(props) {
    const [show,setShow] = useState(false);
    const [move,setMove] = useState(false);
    return (<div>
        <Button primary onClick={()=>{setMove(true);setShow(true);}}>可移动对话框</Button>
        <Button primary onClick={()=>{setMove(false);setShow(true);}}>不可移动对话框</Button>
        <Modal visible={show} move={move} cancel={()=>setShow(false)} confirm={()=>setShow(false)}>对话框内容</Modal>
    </div>);
}

export default ModalView;
```
 
 <!--end-code-->
