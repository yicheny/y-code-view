import React, { useRef, useState,useEffect } from 'react';
import clsx from "clsx";

function RLResize(props) {
    const {itemOps} = props;
    const [move,setMove] = useState(false);
    const [leftWidth,setLeftWidth] = useState(0);
    const prevXRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(()=>{
        const containerWidth = _.get(containerRef.current,'clientWidth');
        setLeftWidth(parseInt(containerWidth/2));
        // document.addEventListener('resize',setContainerWidth);
        // return ()=>document.removeEventListener('resize',setContainerWidth);
        //
        // function setContainerWidth(){
        //     console.log(containerRef.current);
        // }
    },[]);

    const maxWidth = _.get(containerRef.current,'clientWidth');

    return (<div className={clsx('cv-RLResize',{resize:move})}
                 ref={containerRef}
                 onMouseMove={handleMove}
                 onMouseLeave={()=>setMove(false)}
                 onMouseUp={()=>setMove(false)}>
        <div className="cv-RLResize-item" style={{width:`${(leftWidth/maxWidth)*100}%`,...itemOps}}>
            {props.left}
        </div>
        <div className={clsx("cv-RLResize-line",{resize:move})} onMouseDown={()=>setMove(true)}/>
        <div className="cv-RLResize-item" style={{width:`${(1-(leftWidth/maxWidth))*100}%`,...itemOps}}>
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
    itemOps:{
        height:'auto',
        maxHeight:540,
        minWidth:120,
    },
    left:null,
    right:null,
}

export default RLResize;
//出于性能的考虑，SyntheticEvent事件可能会被重用，在事件回调函数调用后，所有属性都会失效
//如果需要异步使用属性，有以下方案：
//1. 使用变量保留需要异步使用的属性
//2. 使用e.persist()
