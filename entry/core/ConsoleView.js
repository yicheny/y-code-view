import React,{useEffect, useMemo, useState} from "react";
import {Markdown} from "y-markdown";
import CodeEditor from "./CodeEditor";
import parseHTML_RunCode from "../utils/parseHTML_RunCode";
import ErrorBoundary from "./ErrorBoundary";

const vm = require('vm');

function ConsoleView(props) {
    const { theme, delay, babelTransformOptions, dependencies } = props;
    const source = useMemo(() => {
        const res = props.source || props.children;
        return _.get(res, 'default', res);
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
            // vm.runInThisContext(getRunTimeCode(code,mockGlobData));
            // console.log(getRunTimeCode(code, mockGlobData));
            eval(getRunTimeCode(code,GlobData));
            console.log('mockGlobData',GlobData);
            // setConsoleView(GlobData);
        }
    },[code,delay])

    const { beforeHTML, afterHTML, code: sourceCode } = useMemo(() => parseHTML_RunCode(source), [source]);

    return <div className="y-console-view">
        <Markdown>{ beforeHTML }</Markdown>
        <CodeEditor
            expanded
            onChange={ setCode }
            theme={ theme }
            code={ code }
        />
        <ErrorBoundary setError={setError} error={error}>
            <div className="y-console-view-box">{consoleView}</div>
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
