组件测试：

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

组件API介绍：

是否实现|API|类型|作用|
---|---|---|---
 ✅ | `visible`        | Boolean  | 控制对话框显隐
 ✅ | `move`           | Boolean  | 是否可移动【默认false】
 ✅ | `header`         | String/React.Element/HtmlElement | 标题
 ✅ | `children`       | String/React.Element/HtmlElement | 内容
 ✅ | `footerVisible`  | Boolean | 控制底部显隐
 ✅ | `confirmVisible` | Boolean | 控制确认按钮显隐
 ✅ | `cancelVisible`  | Boolean | 控制取消按钮显隐
 ✅ | `confirmText`    | Boolean | 自定义确认按钮文字
 ✅ | `cancelText`     | Boolean | 自定义取消按钮文字
 ✅ | `confirm`        | Function | 确认按钮回调
 ✅ | `cancel`         | Function | 取消及退出按钮回调
 ✅ | `className`      | String | css类名
 ✅ | `style`          | Object | 样式
