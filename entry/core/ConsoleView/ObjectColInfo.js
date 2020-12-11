import clsx from "clsx";
import _ from "lodash";
import React from "react";
import ColInfo from "./ColInfo";

export default class ObjectColInfo extends ColInfo{
    static create(...params){
        return new ObjectColInfo(...params);
    }

    _createCurrentData(){
        return this._curryCreateCurrentData(Array.isArray(this._source) ? 'none' : 'block');
    }

    get _content(){
        const {status,uniqKey} = this._currentData;
        return <span key={1} className={clsx('content',uniqKey)}>
            <span className="content-shrink" style={{display:this._getShrinkDisplay(status)}}>...</span>
            {!_.isEmpty(this._lines) && <span className="content-unfold" style={{display:status}}>{this._lines}</span>}
    </span>;
    }

    get _wrap() {
        return this._createWrap(` {`,`} `);
    }

    get info(){
        return this._createInfo('object');
    }
}
