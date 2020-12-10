import clsx from "clsx";
import Icon from "../../component/Icon";
import _ from "lodash";
import React, { useMemo } from "react";
import { getUniqkey } from "../../utils/utils";

export default function ViewCol(props){
    const {data} = props;
    return <div className={clsx('v-col')}>
        <Icon name='arrowDown' size={12}/>
        <div className="content">
            {
                _.map(data,(x,i)=><ViewColValue key={i} data={x}/>)
            }
        </div>
    </div>
}

function ViewColValue(props){
    const {data,source} = props;
    const {value,className,onClick,style} = useMemo(()=>getColInfo(data,source),[data,source]);
    return <span className={clsx("col-value",className,props.className)}
                 onClick={onClick} style={style}>
       {value}
    </span>
}

function getColInfo(value,source){
    if(_.isNil(value)) return {className: 'nil',value:fillEmpty(String(value))};
    if(_.isBoolean(value)) return {className:'boolean',value:fillEmpty(String(value))};
    if(_.isNumber(value)) return {className:'number', value:fillEmpty(String(value))};
    if(_.isPlainObject(value)) return getObjectColInfo(value,source);
    if(_.isArray(value)) return getArrayColInfo(value,source);
    return {value:fillEmpty(String(value))}

    function fillEmpty(x){
        return ` ${x} `
    }
}
function getArrayColInfo(data,source) {
    const normalLines = getNormalLines(data);
    const unfoldLines = getLines(_.entries(data));
    const canClick = getCanClick(source,unfoldLines);

    let currentData = getThisData();
    const value = getInitWrap(` [`,`] `);
    const content = <span key={1}  className={clsx('content',currentData.uniqKey)}>
        <span className="content-shrink" style={{display:getShrinkDisplay(currentData.status)}}>{normalLines}</span>
        <span className="content-unfold" style={{display:currentData.status}}>{unfoldLines}</span>
    </span>

    value.splice(1,0,content)
    return {
        value,
        className:'array',
        onClick:getHandleClick({canClick,currentData}),
        style:{cursor:!canClick ? 'default' : 'pointer'}
    }

    function getThisData(){
        return {
            uniqKey:getUniqkey(),
            status:'none'
        }
    }
    function getNormalLines(data){
        return data.reduce((acc,x,i)=>{
            const isLast = i === data.length-1;
            acc.push(<span className='item' key={i}>
            <ViewColValue data={Array.isArray(x) ? `Array(${x.length})` : x} source={data}/>{isLast ? null : ','}
        </span>);
            return acc;
        },[]);
    }
}
function getObjectColInfo (data,source){
    if(data.__type==='error') return {value:data.value,className:'error'};

    const lines =  getLines(_.entries(data));
    const canClick = getCanClick(source,lines);

    let currentData = getThisData(source);
    const value = getInitWrap(` {`,`} `);
    //<Icon name='start' size={12} color='#6f6f6f' style={{display:'inline-block',transform:`rotate(90deg)`}}/>
    const content = <span key={1} className={clsx('content',currentData.uniqKey)}>
        <span className="content-shrink" style={{display:getShrinkDisplay(currentData.status)}}>...</span>
        {!_.isEmpty(lines) && <span className="content-unfold" style={{display:currentData.status}}>{lines}</span>}
    </span>

    value.splice(1,0,content);
    return {
        className:'object',
        value,
        onClick:getHandleClick({currentData,canClick}),
        style:{cursor:!canClick ? 'default' : 'pointer'}
    }

    function getThisData(source){
        return {
            uniqKey:getUniqkey(),
            status:Array.isArray(source) ? 'none' : 'block'
        }
    }
}

//公用
function getHandleClick({currentData,canClick}){
    return function (e){
        e.stopPropagation();
        e.preventDefault();
        if(!canClick) return null;
        const item = document.querySelector(`.${currentData.uniqKey}`);
        const nextStatus = currentData.status === 'none' ? 'block' : 'none';
        const [shrink,unfold] = item.children;
        unfold.style.display = nextStatus;
        shrink.style.display = getShrinkDisplay(nextStatus);
        currentData.status = nextStatus;
    }
}

function getShrinkDisplay(s){
    return s === 'none' ? 'inline-block' : 'none'
}
function getLines(data){
    return data.reduce((acc,x,i)=>{
        const [key,value] = x;
        const isLast = i === data.length-1;

        acc.push(
            <span className="line" key={i}>
                <ViewColValue data={key} className='object-key'/>
                :
                <ViewColValue data={value}/> { isLast ? null : ','}
            </span>
        );
        return acc;
    },[]);
}
function getCanClick(source,lines){
    if(_.isEmpty(lines)) return false;
    return !Array.isArray(source);
}
function getInitWrap(prefixContent=` {`,suffixContent=`} `){
    const prefix = <span className="prefix" key='prefix'>{prefixContent}</span>
    const suffix = <span className="suffix" key="suffix">{suffixContent}</span>
    return [prefix,suffix];
}
