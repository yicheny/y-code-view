import React, {Fragment, useEffect, useMemo, useState} from "react";
import _ from 'lodash';
import clsx from 'clsx';
import {Markdown} from "y-markdown";
import CodeEditor from "./CodeEditor";
import parseHTML_RunCode from "../utils/parseHTML_RunCode";
import Icon from "../component/Icon";
import RLResize from "../component/RLResize";
import { getUniqkey } from "../utils/utils";

const vm = require('vm');

function ConsoleView(props) {
    const { theme, delay, direction,dependencies,openConsole } = props;
    const source = useMemo(() =>{
        const res = props.source || props.children;
        return _.get(res, 'default',res);
    }, [props.source, props.children]);
    const [code, setCode] = useState(parseHTML_RunCode(source).code);
    const [consoleView,setConsoleView] = useState([]);

    useEffect(()=>{
        const timeId = setTimeout(()=>{
            executeCode(code);
            clearTimeout(timeId);
        },delay)

        return ()=>clearTimeout(timeId);

        function executeCode(code){
            const GlobData = [];
            try{
                const runTime = vm.runInThisContext(getRunTimeCode(code,dependencies));
                runTime(GlobData,dependencies,openConsole);
            }catch(e){
                GlobData.push([{
                    __type:'error',
                    value:String(e)
                }])
            }
            setConsoleView(GlobData);
        }
    },[code,delay,dependencies,openConsole])

    const { beforeHTML, afterHTML, code:sourceCode } = useMemo(() => parseHTML_RunCode(source), [source]);

    const left_code = <CodeEditor expanded onChange={ setCode } theme={ theme } code={ code }/>;
    const right_view = <div className="cv-console-view-box">
        {consoleView.map((x,i)=><ViewCol key={i} data={x}/>)}
    </div>
    return <div className={"cv-console-view"}>
        <Markdown>{ beforeHTML }</Markdown>
        {
            sourceCode && <div className={clsx('cv-console-view-code-box',direction)}>
                {
                    direction === 'across' ? <RLResize left={left_code} right={right_view} {...props.resizeOps}/>
                        : <Fragment>{left_code} {right_view}</Fragment>
                }
            </div>
        }
        { afterHTML && <Markdown>{ afterHTML }</Markdown> }
    </div>
}
ConsoleView.defaultProps = {
    theme: 'panda-syntax',
    delay: 600,
    direction: 'across', //可选'across'、'vertical',
    resizeOps:{},
    dependencies:null,
    openConsole:false
}

export default ConsoleView;

//
function getRunTimeCode(code,dependencies){
    const {addPrint,addDependencies,getPrintStr,wrapperFunStr } = getRunTimeCode;
    code = addDependencies(dependencies).concat(getPrintStr(),addPrint(code))
    return wrapperFunStr(code);
}
getRunTimeCode.addPrint = function (code) {
    if(typeof code !== 'string') return null;
    return code.replace(/console.log/g,'__print');
}
getRunTimeCode.addDependencies = function (dependencies) {
    return _.reduce(_.keys(dependencies),(acc,x)=>{
        return acc.concat(`var ${x} = dependencies.${x};\n`);//注意这一行的写法
    },'')
}
getRunTimeCode.getPrintStr = function (){
    return `
        let __count = 0;
        function __print(...params){
            GlobData[__count] = params;
            __count++;
            if(openConsole) console.log(...params);
        }
        \n
    `
}
getRunTimeCode.wrapperFunStr = function (content){
    return `(function (GlobData,dependencies,openConsole){${content}})`
}

function ViewCol(props){
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
    const {data} = props;
    const {value,className,onClick,style} = useMemo(()=>getColInfo(data),[data]);
    return <span className={clsx("col-value",className,props.className)}
                 onClick={onClick} style={style}>
       {value}
    </span>
}

function getColInfo(value){
    const {fillEmpty} = getColInfo;

    if(_.isNil(value)) return {className: 'nil',value:fillEmpty(String(value))};
    if(_.isBoolean(value)) return {className:'boolean',value:fillEmpty(String(value))};
    if(_.isNumber(value)) return {className:'number', value:fillEmpty(String(value))};
    if(_.isPlainObject(value)) return getColInfo.getObjectColInfo(value);
    if(_.isArray(value)) return getColInfo.getArrayColInfo(value);
    return {value:fillEmpty(String(value))}
}

getColInfo.fillEmpty = function(x){
    return ` ${x} `
}
getColInfo.getArrayColInfo = function (source) {
    const prefix = <span className="prefix" key={0}> [ </span>
    const suffix = <span className="suffix" key={source.length+1}> ] </span>
    const value = source.reduce((acc,x,i)=>{
        acc.push(<ViewColValue key={i+1} data={x}/>);
        const isLast = i === source.length-1;
        return isLast ? acc : acc.concat(',');
    },[prefix]);
    value.push(suffix)
    return {value,className:'array'}
}
getColInfo.getObjectColInfo = function (source){
    if(source.__type==='error') return {value:source.value,className:'error'};

    source = _.entries(source);
    const prefix = <span className="prefix" key={0}>{String(' {')}</span>
    const suffix = <span className="suffix" key={2}>{String('} ')}</span>
    const value = [prefix,suffix];

    const lines =  source.reduce((acc,x,i)=>{
        const [key,value] = x;
        const isLast = i === source.length-1;

        acc.push(
            <span className="line" key={i}>
                <ViewColValue data={key} className='object-name'/>
                :
                <ViewColValue data={value}/> { isLast ? null : ','}
            </span>
        );
        return acc;
    },[]);

    let {uniqKey,status} = getColInfo.getObjectColInfo.getThisData();
    const content = <span key={1} className={clsx('object-content',uniqKey)}>
        <span className="content-normal">{lines}</span>
        <span className="content-omit" style={{display:'none'}}>...</span>
    </span>

    value.splice(1,0,content);

    return {
        className:'object',
        value,
        onClick:handleClick,
        style:{cursor:_.isEmpty(lines) ? null : 'pointer'}
    }

    //
    function handleClick(e){
        e.stopPropagation();
        e.preventDefault();
        if(_.isEmpty(lines)) return null;
        const item = document.querySelector(`.${uniqKey}`);
        const nextStatus = isClose() ? 'block' : 'none';
        // item.style.display = status;
        const [normal,omit] = item.children;
        normal.style.display = nextStatus;
        omit.style.display = isClose() ? 'none' : 'inline-block';
        status = nextStatus;
    }

    function isClose(){
        return status === 'none';
    }
}
getColInfo.getObjectColInfo.getThisData = function(){
    return {
        uniqKey:getUniqkey(),
        status:'block'
    }
}
