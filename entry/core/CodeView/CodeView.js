import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
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

const React = require('react');
const ReactDOM = require('react-dom');

function CodeView(props) {
    const { className, theme, delay, babelTransformOptions,dependencies } = props;
    const source = useMemo(() => {
        const res = props.source || props.children;
        return _.get(res, 'default', res);
    }, [props.source, props.children]);
    const [code, setCode] = useState(parseHTML(source).code);
    const [showCode, setShowCode] = useState(props.showCode);
    const [error, setError] = useState(error);
    const [editorKey, setEditorKey] = useState(0);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const initialExample = useRef();
    const [autoExe,setAutoExe] = useState(props.autoExe);

    const execute = useCallback((nextCode)=>{
        setError(null);
        const originalRender = ReactDOM.render;
        ReactDOM.render = element => {
            initialExample.current = element;
        };

        try{
            eval(getEvelCode());
            forceUpdate();
        }catch ( err ){
            setError(_.toString(err))
        }finally {
            ReactDOM.render = originalRender;
        }

        function getEvelCode(){
            let code = window.Babel.transform(nextCode, babelTransformOptions).code;
            if (!dependencies) return code;
            let statement = ``;
            Object.keys(dependencies).forEach(key => {
                statement += `var ${ key }= dependencies.${ key };\n `;
            });
            return `${ statement } ${ code }`
        }
    },[dependencies,babelTransformOptions])

    const hotKeyExe = useCallback((nextCode)=>{
        if(!autoExe) execute(nextCode);
    },[execute,autoExe])

    useDelayExecute({code,delay,autoExe,execute});

    const { beforeHTML, afterHTML, code: sourceCode } = useMemo(() => parseHTML(source), [source]);

    return <div className={ clsx('y-code-view', className) }>
        <Markdown>{ beforeHTML }</Markdown>
        {
            sourceCode && <div className="y-code-view-box">
                <ErrorBoundary setError={setError} error={error}>
                    <div className="code-view">{ initialExample.current || <div>Loading...</div> }</div>
                </ErrorBoundary>

                <Toolbar
                    autoExe={autoExe}
                    setAutoExe={setAutoExe}
                    execute={execute}
                    code={ code }
                    sourceCode={ sourceCode }
                    setCode={ setCode }
                    setEditorKey={ setEditorKey }
                    expanded={ showCode }
                    setExpanded={ setShowCode }/>

                <CodeEditor
                    key={ editorKey }
                    expanded={ showCode }
                    onChange={ setCode }
                    theme={ theme }
                    code={ code }
                    hotKeyExe={hotKeyExe}
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

//hook
function useDelayExecute({delay,execute,autoExe,code}){
    useEffect(()=>{
        const timeId = setTimeout(()=>{
            autoExe && execute(code);
            clearTimeout(timeId);
        },delay);
        return ()=>clearTimeout(timeId);
    },[delay,execute,autoExe,code]);
}
