日期选择器组件测试：

<!--start-code-->

```js
function ModalView(props) {
    const [show,setShow] = useState(false);
    const [move,setMove] = useState(false);
    return (<div>
        <Button primary onClick={()=>{setMove(true);setShow(true);}}>可移动对话框</Button>
        <Button primary onClick={()=>{setMove(false);setShow(true);}}>不可移动对话框</Button>
        <Modal visible={show} move={move} cancel={()=>setShow(false)} confirm={()=>setShow(false)}>对话框内容</Modal>
    </div>);
}

const instance = <ModalView/>;

ReactDOM.render(instance);
 ```
 
 <!--end-code-->

日期选择器组件使用介绍：
