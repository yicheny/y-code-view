import React from "react";
import ColInfo from "./ColInfo";

export default class ObjectColInfo extends ColInfo{
    static create(...params){
        return new ObjectColInfo(...params);
    }

    _getNormalLines(){
        return this._curryGetLines('item');
    }

    _createCurrentData(){
        // return this._curryCreateCurrentData(Array.isArray(this._source) ? 'none' : 'block');
        return this._curryCreateCurrentData('none');
    }

    get _wrap() {
        return this._createWrap(` {`,`} `);
    }

    get info(){
        return this._createInfo('object');
    }
}
