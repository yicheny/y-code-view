import _ from "lodash";
import { ViewColValue } from "./ConsoleViewBox";
import { getUniqkey } from "../../utils/utils";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default class ColInfo{
    constructor(data,source) {
        this._data = data;
        this._source = source;

        this._lines = this._getLines();
        this._canClick = this._getCanClick();
        this._currentData = this._createCurrentData();
        this._normalLines = this._getNormalLines();

        return this;
    }

    _getLines(){
       return this._curryGetLines("line");
    }

    _getCanClick(){
        if(_.isEmpty(this._lines)) return false;
        return !Array.isArray(this._source);
    }

    _getShrinkDisplay(s){
        return s === 'none' ? 'inline-block' : 'none'
    }

    _createWrap(prefixContent,suffixContent){
        const prefix = <span className="prefix" key='prefix'>{prefixContent}</span>
        const suffix = <span className="suffix" key="suffix">{suffixContent}</span>
        return [prefix,suffix];
    }

    _createInfo(className){
        const [prefix,suffix] = this._wrap;
        return {
            className,
            children:[prefix,this._content,suffix],
            onClick:this._onClick,
            style:{cursor:!this._canClick ? 'default' : 'pointer'}
        }
    }

    _curryCreateCurrentData(status){
        return {
            uniqKey:getUniqkey(),
            status
        }
    }

    _curryGetLines(className){
        return _.entries(this._data).map((x,i,ary)=>{
            const [key,value] = x;
            const isLast = i === ary.length-1;

            return  <span className={className} key={i}>
                <ViewColValue data={key} className='object-key'/>:<ViewColValue data={value}/>{ isLast ? null : ','}
            </span>;
        })
    }

    get _onClick(){
        return (e)=>{
            const {status,uniqKey} = this._currentData;
            e.stopPropagation();
            e.preventDefault();
            if(!this._canClick) return null;
            const item = document.querySelector(`.${uniqKey}`);
            const nextStatus = status === 'none' ? 'block' : 'none';
            const [shrink,unfold] = item.children;
            unfold.style.display = nextStatus;
            shrink.style.display = this._getShrinkDisplay(nextStatus);
            this._currentData.status = nextStatus;
        }
    }

    get _content(){
        return <ColValueContent key='content' data={this}/>
    }
}

//组件
function ColValueContent({data}){
    const {_currentData,_normalLines,_lines,_getShrinkDisplay} = data;
    const {status,uniqKey} = _currentData;
    const [isWrap,setIsWrap] = useState(false);
    const containerRef = useRef();
    const shrinkRef = useRef();

    useEffect(()=>{
        const containerY = containerRef.current.getBoundingClientRect().y;
        const shrinkY = shrinkRef.current.getBoundingClientRect().y;
        const offset = containerY - shrinkY;
        if(offset >= 6) setIsWrap(true);
    },[]);

    return <span className={clsx('content',uniqKey)} ref={containerRef}>
        <span ref={shrinkRef} className="content-shrink" style={{display:_getShrinkDisplay(status)}}>
            {isWrap ? `...` : _normalLines}
        </span>
        <span className="content-unfold" style={{display:status}}>{_lines}</span>
    </span>
}
