import React,{ useCallback, useMemo, useState } from 'react';
import clsx from "clsx";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/runmode/runmode';
import { Markdown } from "y-markdown";
import CodeEditor from "../../component/CodeEditor";
import parseHTML from "./parseHTML";
import ErrorBoundary from "../../component/ErrorBoundary";
import 'y-markdown/lib/index.css';
import Toolbar from "../../component/Toolbar";
import { useDelayExecute, useSource } from "../../utils/hooks";
import _ from "lodash";

const vm = require('vm');

/*
* @deprecated
* 请使用CodeViewV2，CodeView组件将逐渐放弃维护
* */
function CodeView(props) {
    const { className, theme, delay, babelTransformOptions,dependencies } = props;
    const source = useSource(props);
    const [code, setCode] = useState(parseHTML(source).code);
    const [showCode, setShowCode] = useState(props.showCode);
    const [error, setError] = useState(error);
    const [editorKey, setEditorKey] = useState(0);
    const [module,setModule] = useState({exports:null});
    const [autoExe,setAutoExe] = useState(props.autoExe);

    const execute = useCallback((code)=>{
        try{
            const __dependencies = _.assign({React},dependencies);
            createRunTime(code,babelTransformOptions,__dependencies)(module,__dependencies)
            setError(null);
            setModule(_.clone(module))
        }catch ( e ){
            setError(e)
        }
    },[dependencies,babelTransformOptions]);

    const hotKeyExe = useCallback((nextCode)=>{
        if(!autoExe) execute(nextCode);
    },[execute,autoExe])

    useDelayExecute({code,delay,autoExe,execute});

    const { beforeHTML, afterHTML, code: sourceCode } = useMemo(() => parseHTML(source), [source]);

    const Component = module.exports;
    return <div className={ clsx('y-code-view', className) }>
        <Markdown>{ beforeHTML }</Markdown>
        {
            sourceCode && <div className="y-code-view-box">
                <ErrorBoundary setError={setError} error={error}>
                    <div className="code-view">{ Component ? <Component/> : <div>Loading...</div> }</div>
                </ErrorBoundary>

                <Toolbar autoExe={autoExe} setAutoExe={setAutoExe}
                    execute={execute} sourceCode={ sourceCode }
                    code={ code } setCode={ setCode }
                    setEditorKey={ setEditorKey }
                    expanded={ showCode } setExpanded={ setShowCode }/>

                <CodeEditor key={ editorKey } expanded={ showCode }
                    onChange={ setCode } theme={ theme }
                    code={ code } hotKeyExe={hotKeyExe}
                />
            </div>
        }
        { afterHTML && <Markdown>{ afterHTML }</Markdown> }
    </div>
}

CodeView.defaultProps = {
    theme: 'panda-syntax',
    delay: 600,
    showCode: false,
    babelTransformOptions: {
        presets: ['stage-0', 'react', 'es2015']
    },
    autoExe:true,
};

export default CodeView;

//
function createRunTime(code,options,dependencies){
    let runTimeStr = '';
    _.forEach(dependencies,(value,key) => {
        runTimeStr += `var ${ key }= __dependencies.${ key };\n `;
    });
    runTimeStr = runTimeStr.concat(window.Babel.transform(supportRender(code), options).code);
    runTimeStr = `__module.exports = undefined;\n\r`.concat(runTimeStr);
    runTimeStr = `(function (__module,__dependencies){\n${runTimeStr}\n});`
    return vm.runInThisContext(runTimeStr);
}

//兼容旧的写法
function supportRender(code){
    return _.replace(code,/ReactDOM.render\(<([\w]+)\/>\)/gi,(value)=>{
        const reg = new RegExp(/ReactDOM.render\(<([\w]+)\/>\)/gi);
        const r = reg.exec(value);
        return r ? `__module.exports = ${r[1]}` : null;
    });
}
