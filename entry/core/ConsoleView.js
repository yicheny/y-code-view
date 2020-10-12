import React, {Fragment, useEffect, useMemo, useState} from "react";import _ from 'lodash';import clsx from 'clsx';import {Markdown} from "y-markdown";import CodeEditor from "./CodeEditor";import parseHTML_RunCode from "../utils/parseHTML_RunCode";import Icon from "../component/Icon";import RLResize from "../component/RLResize";import { getUniqkey } from "../utils/utils";const vm = require('vm');function ConsoleView(props) {    const { theme, delay, direction,dependencies,openConsole } = props;    const source = useMemo(() =>{        const res = props.source || props.children;        return _.get(res, 'default',res);    }, [props.source, props.children]);    const [code, setCode] = useState(parseHTML_RunCode(source).code);    const [consoleView,setConsoleView] = useState([]);    useEffect(()=>{        const timeId = setTimeout(()=>{            executeCode(code);            clearTimeout(timeId);        },delay)        return ()=>clearTimeout(timeId);        function executeCode(code){            const GlobData = [];            try{                const runTime = vm.runInThisContext(getRunTimeCode(code,dependencies));                runTime(GlobData,dependencies,openConsole);            }catch(e){                // console.error(e);                GlobData.push([{                    __type:'error',                    value:String(e)                }])            }            setConsoleView(GlobData);        }    },[code,delay,dependencies,openConsole])    const { beforeHTML, afterHTML, code:sourceCode } = useMemo(() => parseHTML_RunCode(source), [source]);    const left_code = <CodeEditor expanded onChange={ setCode } theme={ theme } code={ code }/>;    const right_view = <div className="cv-console-view-box">        {consoleView.map((x,i)=><ViewCol key={i} data={x}/>)}    </div>    return <div className={"cv-console-view"}>        <Markdown>{ beforeHTML }</Markdown>        {            sourceCode && <div className={clsx('cv-console-view-code-box',direction)}>                {                    direction === 'across' ? <RLResize left={left_code} right={right_view} {...props.resizeOps}/>                        : <Fragment>{left_code} {right_view}</Fragment>                }            </div>        }        { afterHTML && <Markdown>{ afterHTML }</Markdown> }    </div>}ConsoleView.defaultProps = {    theme: 'panda-syntax',    delay: 600,    direction: 'across', //可选'across'、'vertical',    resizeOps:{},    dependencies:null,    openConsole:false}export default ConsoleView;//function getRunTimeCode(code,dependencies){    const {addPrint,addDependencies,getPrintStr,wrapperFunStr } = getRunTimeCode;    code = addDependencies(dependencies).concat(getPrintStr(),addPrint(code))    return wrapperFunStr(code);}getRunTimeCode.addPrint = function (code) {    if(typeof code !== 'string') return null;    return code.replace(/console.log/g,'__print');}getRunTimeCode.addDependencies = function (dependencies) {    return _.reduce(_.keys(dependencies),(acc,x)=>{        return acc.concat(`var ${x} = dependencies.${x};\n`);//注意这一行的写法    },'')}getRunTimeCode.getPrintStr = function (){    return `        let __count = 0;        function __print(...params){            GlobData[__count] = params;            __count++;            if(openConsole) console.log(...params);        }        \n    `}getRunTimeCode.wrapperFunStr = function (content){    return `(function (GlobData,dependencies,openConsole){\n${content}\n});`}function ViewCol(props){    const {data} = props;    return <div className={clsx('v-col')}>        <Icon name='arrowDown' size={12}/>        <div className="content">            {                _.map(data,(x,i)=><ViewColValue key={i} data={x}/>)            }        </div>    </div>}function ViewColValue(props){    const {data,source} = props;    const {value,className,onClick,style} = useMemo(()=>getColInfo(data,source),[data,source]);    return <span className={clsx("col-value",className,props.className)}                 onClick={onClick} style={style}>       {value}    </span>}function getColInfo(value,source){    const {fillEmpty} = getColInfo;    if(_.isNil(value)) return {className: 'nil',value:fillEmpty(String(value))};    if(_.isBoolean(value)) return {className:'boolean',value:fillEmpty(String(value))};    if(_.isNumber(value)) return {className:'number', value:fillEmpty(String(value))};    if(_.isPlainObject(value)) return getColInfo.getObjectColInfo(value,source);    if(_.isArray(value)) return getColInfo.getArrayColInfo(value);    return {value:fillEmpty(String(value))}}getColInfo.fillEmpty = function(x){    return ` ${x} `}getColInfo.getArrayColInfo = function (data) {    const prefix = <span className="prefix" key={0}> [ </span>    const suffix = <span className="suffix" key={2}> ] </span>    const value = [prefix,suffix];    const normalLines = getColInfo.getArrayColInfo.getNormalLines(data);    // const unfoldLines = getColInfo.getObjectColInfo.getLines(_.entries(data));    const content = <span key={1} className='array-content'>        <span className="content-shrink">{normalLines}</span>        {/*<span className="content-unfold">{unfoldLines}</span>*/}    </span>    value.splice(1,0,content)    return {value,className:'array'}}getColInfo.getArrayColInfo.getNormalLines = function (data){    return data.reduce((acc,x,i)=>{        const isLast = i === data.length-1;        acc.push(<span className='item' key={i}>            <ViewColValue data={x} source={data}/>{isLast ? null : ','}        </span>);        return acc;    },[]);}getColInfo.getObjectColInfo = function (data,source){    if(data.__type==='error') return {value:data.value,className:'error'};    data = _.entries(data);    const prefix = <span className="prefix" key={0}>{String(' {')}</span>    const suffix = <span className="suffix" key={2}>{String('} ')}</span>    const value = [prefix,suffix];    const lines =  getColInfo.getObjectColInfo.getLines(data);    let {uniqKey,status} = getColInfo.getObjectColInfo.getThisData(source);    const content = <span key={1} className={clsx('object-content',uniqKey)}>        <span className="content-shrink" style={{display:getOmitDisplay(status)}}>...</span>        {!_.isEmpty(lines) && <span className="content-unfold" style={{display:status}}>{lines}</span>}    </span>    value.splice(1,0,content);    return {        className:'object',        value,        onClick:handleClick,        style:{cursor:_.isEmpty(lines) ? null : 'pointer'}    }    function handleClick(e){        e.stopPropagation();        e.preventDefault();        if(_.isEmpty(lines)) return null;        const item = document.querySelector(`.${uniqKey}`);        const nextStatus = status === 'none' ? 'block' : 'none';        const [shrink,unfold] = item.children;        unfold.style.display = nextStatus;        shrink.style.display = getOmitDisplay(nextStatus);        status = nextStatus;    }    function getOmitDisplay(s){        return s === 'none' ? 'inline-block' : 'none'    }}getColInfo.getObjectColInfo.getThisData = function(source){    return {        uniqKey:getUniqkey(),        status:Array.isArray(source) ? 'none' : 'block'    }}getColInfo.getObjectColInfo.getLines = function (data){    return data.reduce((acc,x,i)=>{        const [key,value] = x;        const isLast = i === data.length-1;        acc.push(            <span className="line" key={i}>                <ViewColValue data={key} className='object-key'/>                :                <ViewColValue data={value}/> { isLast ? null : ','}            </span>        );        return acc;    },[]);}