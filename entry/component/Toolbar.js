import React, { useCallback } from 'react';
import Tooltip from "./Tooltip";
import Icon from "./Icon";
import Switch from "./Switch";
import copy from "copy-to-clipboard";
import message from "./Message";

function Toolbar({autoExe,setAutoExe,expanded,setExpanded,sourceCode,setCode,code,setEditorKey,execute}) {
    const handleCopy = useCopyCode(code);
    const handleResetCode = useResetCode({sourceCode,setCode,setEditorKey})

    return <div className="y-code-view-toolbar">
        <Tooltip onClick={()=>setExpanded(x=>!x)} title={ expanded ? '收起代码' : '显示代码' }>
            <Icon name='crossUnfold'/>
        </Tooltip>

        <Tooltip onClick={handleCopy} title='复制代码'>
            <Icon name='copy'/>
        </Tooltip>

        <Tooltip onClick={handleResetCode} title='重置代码'>
            <Icon name='revoke'/>
        </Tooltip>

        <Tooltip title='手动执行(Ctrl+S)' targetClassName={autoExe && 'disabled'} onClick={()=>execute(code)}>
            <Icon name='start'/>
        </Tooltip>

        <Tooltip title={autoExe ? '自动执行开启中' : '自动执行已关闭'}>
            <Switch defaultChecked={autoExe} onChange={setAutoExe} checkedChildren='开' unCheckedChildren='关'/>
        </Tooltip>
    </div>
}

export default Toolbar;

//
function useCopyCode(code){
    return useCallback(()=>{
        try {
            copy(code);
            message.show({ info: '复制成功！', icon: 'success' });
        } catch ( e ) {
            message.show({ info: '复制失败！', icon: 'error' });
            console.error('useCopyCode执行失败', e);
        }
    },[code])
}

function useResetCode({sourceCode,setCode,setEditorKey}){
    return useCallback(()=>{
        setCode(x=>(x===sourceCode ? x.concat(' ') : sourceCode))
        setEditorKey(x=>++x);
        message.show({ info: `已将代码重置回初始状态`, icon: 'success' })
    },[sourceCode,setCode,setEditorKey]);
}
