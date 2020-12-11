import { ViewColValue } from "./ConsoleViewBox";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import ColInfo from "./ColInfo";

export default class ArrayColInfo extends ColInfo{
    static create(...params){
        return new ArrayColInfo(...params);
    }

    _getNormalLines(){
        return this._data.map((x,i,ary)=>{
            const isLast = i === ary.length-1;
            return <span className='item' key={i}>
                <ViewColValue data={Array.isArray(x) ? `Array(${x.length})` : x} source={ary}/>{isLast ? null : ','}
            </span>;
        });
    }

    _createCurrentData(){
        return this._curryCreateCurrentData('none');
    }

    get _content(){
        return <ColValueContent key={1} currentData={this._currentData}
                                getShrinkDisplay={this._getShrinkDisplay} normalLines={this._getNormalLines()} lines={this._lines}/>
    }

    get _wrap() {
        return this._createWrap(` [`,`] `);
    }

    get info(){
        return this._createInfo('array');
    }
}

//组件
function ColValueContent({currentData,normalLines,lines,getShrinkDisplay}){
    const {status,uniqKey} = currentData;
    const [isWrap,setIsWrap] = useState(false);
    const containerRef = useRef();
    const shrinkRef = useRef();

    useEffect(()=>{
        const containerY = containerRef.current.getBoundingClientRect().y;
        const shrinkY = shrinkRef.current.getBoundingClientRect().y;
        const offset = containerY - shrinkY;
        if(offset >= 12) setIsWrap(true);
    },[]);

    return <span className={clsx('content',uniqKey)} ref={containerRef}>
        <span ref={shrinkRef} className="content-shrink" style={{display:getShrinkDisplay(status)}}>
            {isWrap ? `...` : normalLines}
        </span>
        <span className="content-unfold" style={{display:status}}>{lines}</span>
    </span>
}
