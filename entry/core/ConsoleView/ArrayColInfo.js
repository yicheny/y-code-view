import { ViewColValue } from "./ConsoleViewBox";
import React from "react";
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

    get _wrap() {
        return this._createWrap(` [`,`] `);
    }

    get info(){
        return this._createInfo('array');
    }
}
