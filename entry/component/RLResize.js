import React, { useRef, useState } from 'react';
import clsx from "clsx";
import './RLResize.scss'

function RLResize(props) {
    const {maxWidth,height,itemMinWidth} = props;
    const [move,setMove] = useState(false);
    const [leftWidth,setLeftWidth] = useState(parseInt(maxWidth/2));
    const prevXRef = useRef(null);

    return (<div className={clsx('cv-RLResize',{resize:move})}
                 style={{width:maxWidth,height}}
                 onMouseMove={handleMove}
                 onMouseLeave={()=>setMove(false)}
                 onMouseUp={()=>setMove(false)}>
        <div className="item html" style={{width:leftWidth,height,minWidth:itemMinWidth}}>
            {props.left}
        </div>
        <div className={clsx("line",{resize:move})}
             onMouseDown={()=>setMove(true)}/>
        <div className="item view" style={{width:maxWidth - leftWidth,height,minWidth:itemMinWidth}}>
            {props.right}
        </div>
    </div>);

    function handleMove(e){
        if(!move) return;
        e.preventDefault();
        e.stopPropagation();
        const prevX = prevXRef.current;
        prevXRef.current = e.clientX;
        if(prevX===null) return null;
        const offset = e.clientX - prevX;
        setLeftWidth(x=>x+offset);
    }
}
RLResize.defaultProps = {
    maxWidth:900,
    height:540,
    itemMinWidth:120,
    left:'left',
    right:'right'
}

export default RLResize;
//出于性能的考虑，SyntheticEvent事件可能会被重用，在事件回调函数调用后，所有属性都会失效
//如果需要异步使用属性，有以下方案：
//1. 使用变量保留需要异步使用的属性
//2. 使用e.persist()