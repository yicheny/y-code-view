import React,{useEffect, useMemo, useState} from "react";
import _ from 'lodash';
import clsx from 'clsx';
import {Markdown} from "y-markdown";
import CodeEditor from "./CodeEditor";
import parseHTML_RunCode from "../utils/parseHTML_RunCode";
import ErrorBoundary from "./ErrorBoundary";
import './ConsoleView.scss';
import Icon from "../component/Icon";

function ConsoleView(props) {
    const { theme, delay, babelTransformOptions, dependencies } = props;
    const source = useMemo(() =>{
        const res = props.source || props.children;
        return _.get(res, 'default',res);
    }, [props.source, props.children]);
    const [code, setCode] = useState(parseHTML_RunCode(source).code);
    const [error,setError] = useState(null);
    const [consoleView,setConsoleView] = useState([]);

    useEffect(()=>{
        const timeId = setTimeout(()=>{
            executeCode(code);
            clearTimeout(timeId);
        },delay)

        return ()=>clearTimeout(timeId);

        function executeCode(code){
            const GlobData = [];
            eval(getRunTimeCode(code,GlobData));
            setConsoleView(GlobData);
        }
    },[code,delay])

    const { beforeHTML, afterHTML } = useMemo(() => parseHTML_RunCode(source,true), [source]);

    const view = useMemo(()=>getConsoleView(consoleView),[consoleView])
    return <div className="y-console-view">
        <Markdown>{ beforeHTML }</Markdown>
        <CodeEditor
            expanded
            onChange={ setCode }
            theme={ theme }
            code={ code }
        />
        <ErrorBoundary setError={setError} error={error}>
            <div className="y-console-view-box">{view}</div>
        </ErrorBoundary>
        { afterHTML && <Markdown>{ afterHTML }</Markdown> }
    </div>
}
ConsoleView.defaultProps = {
    theme: 'panda-syntax',
    delay: 600,
    showCode: true,
    babelTransformOptions: {
        presets: ['stage-0', 'react', 'es2015']
    },
    autoExe:true,
}

export default ConsoleView;

//
function getPrintStr(GlobData){
    return `
        let __count = 0;
        function __print(...params){
            GlobData[__count] = params;
            __count++;
        }
        \n
    `
}

function getRunTimeCode(code,GlobData){
    code = getPrintStr(GlobData).concat(code)
    return addPrint(code);

    function addPrint(code){
        if(typeof code !== 'string') return null;
        return code.replace(/console.log/g,'__print');
    }
}

function getConsoleView(source){
    return source.map((x,i)=><ViewCol key={i} data={x}/>);
}

function ViewCol(props){
    const {data} = props;
    return <div className={clsx('v-col')}>
        <Icon name='arrowDown' size={12}/>
        {
            _.map(data,(x,i)=><ViewColValue key={i} data={x}/>)
        }
    </div>
}

function ViewColValue(props){
    const {data} = props;
    const {value,className} = useMemo(()=>getColInfo(data),[data]);
    return <span className={clsx("col-value",className,props.className)}>
        {value}
    </span>
}

function getColInfo(value){
    if(_.isNil(value)) return {className: 'nil',value:String(value)};
    if(_.isBoolean(value)) return {className:'boolean',value:String(value)};
    if(_.isNumber(value)) return {className:'number', value};
    if(_.isPlainObject(value)) return getColInfo.getObjectColInfo(value);
    if(_.isArray(value)) return getColInfo.getArrayColInfo(value);
    return {value:String(value)}
}

//缺少空数组测试
getColInfo.getArrayColInfo = function (source) {
    const prefix = <span className="prefix" key={0}>[</span>
    const suffix = <span className="suffix" key={source.length+1}>]</span>
    const value = source.reduce((acc,x,i)=>{
        acc.push(<ViewColValue key={i+1} data={x}/>);
        const isLast = i === source.length-1;
        return isLast ? acc.concat([suffix]) : acc.concat(',');
    },[prefix]);
    return {value,className:'array'}
}

getColInfo.getObjectColInfo = function (source){
    source = _.entries(source);
    const maxLen = source.length;
    const prefix = <span className="prefix" key={0}>{String('{')}</span>
    const suffix = <span className="suffix" key={maxLen*2+1}>{String('}')}</span>

    const value = source.reduce((acc,x,i)=>{
        const [key,value] = x;
        acc.push(
            <ViewColValue key={i+1} data={key} className='object-name'/>,
            ':',
            <ViewColValue key={i+1+maxLen} data={value}/>,
        );
        const isLast = i === source.length-1;
        return isLast ? acc.concat([suffix]) : acc.concat(',');
    },[prefix])

    return {
        className:'object',
        value
    }
}