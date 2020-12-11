import _ from "lodash";
import { ViewColValue } from "./ConsoleViewBox";
import { getUniqkey } from "../../utils/utils";
import React from "react";

export default class ColInfo{
    constructor(data,source) {
        this._data = data;
        this._source = source;

        this._init();
        return this;
    }

    _init(){
        this._lines = this._getLines();
        this._canClick = this._getCanClick();
        this._currentData = this._createCurrentData();
    }

    _getLines(){
        return _.entries(this._data).reduce((acc,x,i,ary)=>{
            const [key,value] = x;
            const isLast = i === ary.length-1;

            acc.push(
                <span className="line" key={i}>
                    <ViewColValue data={key} className='object-key'/>
                    :
                    <ViewColValue data={value}/> { isLast ? null : ','}
                </span>
            );
            return acc;
        },[])
    }

    _getCanClick(){
        if(_.isEmpty(this._lines)) return false;
        return !Array.isArray(this._source);
    }

    _getShrinkDisplay(s){
        return s === 'none' ? 'inline-block' : 'none'
    }

    _getHandleClick(){
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

    _createWrap(prefixContent,suffixContent){
        const prefix = <span className="prefix" key='prefix'>{prefixContent}</span>
        const suffix = <span className="suffix" key="suffix">{suffixContent}</span>
        return [prefix,suffix];
    }

    _createInfo(className){
        const [prefix,suffix] = this._wrap;
        return {
            className,
            value:[prefix,this._content,suffix],
            onClick:this._getHandleClick(),
            style:{cursor:!this._canClick ? 'default' : 'pointer'}
        }
    }

    _curryCreateCurrentData(status){
        return {
            uniqKey:getUniqkey(),
            status
        }
    }
}
