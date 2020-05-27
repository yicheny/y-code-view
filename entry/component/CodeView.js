import React,{useEffect,useRef,useState,useReducer,useMemo} from 'react';
import ReactDOM from 'react-dom';
import clsx from "clsx";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/runmode/runmode';
import {Markdown} from "y-markdown";
import 'y-markdown/lib/index.css';
import CodeEditor from "./CodeEditor";
import {Obj, parseHTML} from "./commonFun";

function CodeView(props) {
    const {source,className,theme,babelTransformOptions, dependencies,delay} = props;
    const [error,setError] = useState(null);
    const [,forceUpdate] = useReducer(x=>x+1,0);
    const initialExample = useRef();

    const { code,beforeHTML, afterHTML } = useMemo(()=>Obj(parseHTML(source)),[source]);

    useEffect(()=>{
        const timeId = setTimeout(()=>{
            executeCode(code)
        },delay);

        return ()=>clearTimeout(timeId);
    },[code,delay]);

    return <div className={clsx('y-code-view',className)}>
        <Markdown>{beforeHTML}</Markdown>
        <div className="y-code-view-box">
            <Preview hasError={!error} errorMessage={error}>
                <div>{initialExample.current || <div>Loading...</div>}</div>
            </Preview>
            <CodeEditor
                lineNumbers
                key="jsx"
                theme={`base16-${theme}`}
                code={code}
            />
        </div>
        <Markdown>{afterHTML}</Markdown>
    </div>;

    function executeCode(nextCode) {
        const originalRender = ReactDOM.render;
        setError(null);
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
        } catch (err) {
            setError(err);
            console.error('y-code-view executeCode出错！',err);
        } finally {
            ReactDOM.render = originalRender;
            if (!error) forceUpdate();
        }
    }
}
CodeView.defaultProps = {
    theme:'light',
    delay:0,
    babelTransformOptions: {
        presets: ['stage-0', 'react', 'es2015']
    }
};

export default CodeView;

function Preview(props) {
    const {children,hasError,errorMessage} = props;

    if (hasError) return <pre className="code-view-error">{errorMessage}</pre>;
    return <div className="code-view">{children}</div>;
}
