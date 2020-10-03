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
        function __print(params){
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

function getConsoleView(source,isBlock){
    return source.map((x,i)=>{
        if(_.isBoolean(x)) return <ViewCol key={i} className='boolean'>{String(x)}</ViewCol>
        if(_.isNumber(x)) return <ViewCol key={i} className='number'>{x}</ViewCol>
        if(_.isPlainObject(x)) return <ViewCol key={i}>{JSON.stringify(x)}</ViewCol>
        if(_.isArray(x)) return <ViewCol key={i}>{JSON.stringify(x)}</ViewCol>
        return <ViewCol key={i}>{String(x)}</ViewCol>
    });
}

function ViewCol(props){
    const {className,children} = props;
    return <div className={clsx('v-col',className)}>
        <Icon name='arrowDown' size={12}/>{children}
    </div>
}