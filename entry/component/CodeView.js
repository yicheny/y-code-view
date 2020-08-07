import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import clsx from "clsx";
import copy from 'copy-to-clipboard';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/runmode/runmode';
import { Markdown } from "y-markdown";
import 'y-markdown/lib/index.css';
import CodeEditor from "./CodeEditor";
import message from './Message';
import parseHTML from "../utils/parseHTML";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import WithErrorBoundary from "./ErrorBoundary";

//通过import引入evel代码时会报错
const React = require('react');
const ReactDOM = require('react-dom');

function CodeView(props) {
    const { className, theme } = props;
    const source = useMemo(() => {
        const res = props.source || props.children;
        return _.get(res, 'default', res);
    }, [props.source, props.children]);
    const [code, setCode] = useState(parseHTML(source).code);
    const [showCode, setShowCode] = useState(props.showCode);
    const [error, setError] = useState(error);
    const [editorKey, setEditorKey] = useState(0);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const { beforeHTML, afterHTML } = useMemo(() => parseHTML(source), [source]);

    return <div className={ clsx('y-code-view', className) }>
        <Markdown>{ beforeHTML }</Markdown>
        <div className="y-code-view-box">
            <ExecutorCode { ...props }
                          error={ error }
                          forceUpdate={ forceUpdate }
                          code={ code }
                          setCode={ setCode }
                          setError={ setError }/>

            <CodeViewToolbar
                code={ code }
                source={ source }
                setCode={ setCode }
                setEditorKey={ setEditorKey }
                showCode={ showCode }
                setShowCode={ setShowCode }/>

            <CodeEditor
                lineNumbers
                key={ editorKey }
                className={ 'code-editor' }
                expanded={ showCode }
                onChange={ setCode }
                theme={ theme }
                code={ code }
            />
        </div>
        { afterHTML && <Markdown>{ afterHTML }</Markdown> }
    </div>
}

CodeView.defaultProps = {
    theme: 'panda-syntax',
    delay: 600,
    showCode: false,
    babelTransformOptions: {
        presets: ['stage-0', 'react', 'es2015']
    }
};

export default WithErrorBoundary(CodeView);

function ExecutorCode(props) {
    const { setError, babelTransformOptions, code, delay, dependencies, forceUpdate, error } = props;
    const initialExample = useRef();

    useEffect(() => {
        const timeId = setTimeout(() => {
            executeCode(code)
        }, delay);

        return () => clearTimeout(timeId);
    }, [code, delay]);


    return <div className="y-code-view-wrap">
        {
            error ? <pre className="code-view-error">{ error }</pre>
                : <div className="code-view">{ initialExample.current || <div>Loading...</div> }</div>
        }
    </div>

    function executeCode(nextCode) {
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
    }
}

function CodeViewToolbar(props) {
    const { showCode, setShowCode, code, setCode, setEditorKey, source } = props;

    return <div className="y-code-view-toolbar">
        <Tooltip onClick={ () => setShowCode(x => !x) } title={ showCode ? '收起代码' : '显示代码' }>
            <Icon name='crossUnfold'/>
        </Tooltip>

        <Tooltip onClick={ handleCopy } title='复制代码'>
            <Icon name='copy'/>
        </Tooltip>

        <Tooltip onClick={ handleReset } title='重置代码'>
            <Icon name='revoke'/>
        </Tooltip>
    </div>

    function handleCopy() {
        try {
            copy(code);
            message.show({ info: '复制成功！', icon: 'success' });
        } catch ( e ) {
            message.show({ info: '复制失败！', icon: 'error' });
            console.error('handleCopy执行失败', e);
        }
    }

    function handleReset() {
        let sourceCode = parseHTML(source).code;
        if (sourceCode === code) sourceCode = sourceCode.concat(' ');
        setCode(sourceCode)
        setEditorKey(x => ++x);
        message.show({ info: `已将代码重置回初始状态`, icon: 'success' })
    }
}
