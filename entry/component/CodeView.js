import {useEffect, useRef, useState, useReducer, useMemo} from 'react';
import clsx from "clsx";
import copy from 'copy-to-clipboard';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/runmode/runmode';
import {Markdown} from "y-markdown";
import 'y-markdown/lib/index.css';
import CodeEditor from "./CodeEditor";
import message from './Message';
import {parseHTML} from "./commonFun";
import Icon from "./Icon";
import Tooltip from "./Tooltip";

//通过import引入evel代码时会报错
const React = require('react');
const ReactDOM = require('react-dom');

function CodeView(props) {
    const {className,theme,babelTransformOptions, dependencies,delay} = props;
    const source = useMemo(()=>{
        const res = props.source || props.children;
        return _.get(res,'default',res);
    },[props.source,props.children]);
    const [code,setCode] = useState(parseHTML(source).code);
    const [showCode,setShowCode] = useState(props.showCode);
    const [error,setError] = useState(null);
    const [editorKey,setEditorKey] = useState(0);
    const [,forceUpdate] = useReducer(x=>x+1,0);
    const initialExample = useRef();

    const {beforeHTML, afterHTML } = useMemo(()=>parseHTML(source),[source]);

    useEffect(()=>{
        const timeId = setTimeout(()=>{
            executeCode(code)
        },delay);

        return ()=>clearTimeout(timeId);
    },[code,delay]);

    return <div className={clsx('y-code-view',className)}>
        <Markdown>{beforeHTML}</Markdown>
        {
            code && <div className="y-code-view-box">
                <div className="y-code-view-wrap">
                    <Preview error={error}>
                        <div>{initialExample.current || <div>Loading...</div>}</div>
                    </Preview>
                </div>

                <div className="y-code-view-toolbar">
                    <Tooltip onClick={()=>setShowCode(x=>!x)}  title={showCode ? '收起代码' : '显示代码'}>
                        <Icon name='crossUnfold'/>
                    </Tooltip>

                    <Tooltip onClick={handleCopy}  title='复制代码'>
                        <Icon name='copy'/>
                    </Tooltip>

                    <Tooltip onClick={handleReset}  title='重置代码'>
                        <Icon name='revoke'/>
                    </Tooltip>
                </div>

                <CodeEditor
                    lineNumbers
                    key={editorKey}
                    className={'code-editor'}
                    expanded={showCode}
                    onChange={setCode}
                    theme={`base16-${theme}`}
                    code={code}
                />
            </div>
        }
        {afterHTML && <Markdown>{afterHTML}</Markdown>}
    </div>;

    function executeCode(nextCode) {
        setError(null);
        const originalRender = ReactDOM.render;
        ReactDOM.render = element => {
            initialExample.current = element;
        };
        try {
            let code = window.Babel.transform(nextCode, babelTransformOptions).code;
            let statement = '';

            if (dependencies) {
                Object.keys(dependencies).forEach(key => {
                    statement += `var ${key}= dependencies.${key};\n `;
                });
            }

            eval(`${statement} ${code}`);
            forceUpdate();
        } catch (err) {
            setError('y-code-view executeCode出错！');
            console.error('y-code-view executeCode出错！',err);
        } finally {
            ReactDOM.render = originalRender;
        }
    }

    function handleCopy(){
        try{
            copy(code);
            message.show({info:'复制成功！',icon:'success'});
        }catch (e) {
            message.show({info:'复制失败！',icon:'error'});
            console.error('handleCopy执行失败',e);
        }
    }

    function handleReset(){
        let sourceCode = parseHTML(source).code;
        if(sourceCode===code) sourceCode = sourceCode.concat(' ');//
        setCode(sourceCode)
        setEditorKey(x=>++x);
        message.show({info:'已将代码重置会初始状态',icon:'success'})
    }
}
CodeView.defaultProps = {
    theme:'light',
    delay:0,
    showCode:false,
    babelTransformOptions: {
        presets: ['stage-0', 'react', 'es2015']
    }
};

export default CodeView;

function Preview(props) {
    const {children,error} = props;

    if (error) return <pre className="code-view-error">{error}</pre>;
    return <div className="code-view">{children}</div>;
}
