import { ViewColValue } from "./ConsoleViewBox";
import clsx from "clsx";
import React from "react";
import ColInfo from "./ColInfo";

export default class ArrayColInfo extends ColInfo{
    static create(...params){
        return new ArrayColInfo(...params);
    }

    _getNormalLines(){
        return this._data.reduce((acc,x,i,ary)=>{
            const isLast = i === ary.length-1;
            acc.push(<span className='item' key={i}>
            <ViewColValue data={Array.isArray(x) ? `Array(${x.length})` : x} source={ary}/>{isLast ? null : ','}
        </span>);
            return acc;
        },[]);
    }

    _createCurrentData(){
        return this._curryCreateCurrentData('none');
    }

    get _content(){
        const {status,uniqKey} = this._currentData;
        return <span key={1}  className={clsx('content',uniqKey)}>
        <span className="content-shrink" style={{display:this._getShrinkDisplay(status)}}>{this._getNormalLines()}</span>
        <span className="content-unfold" style={{display:status}}>{this._lines}</span>
    </span>
    }

    get _wrap() {
        return this._createWrap(` [`,`] `);
    }

    get info(){
        return this._createInfo('array');
    }
}
