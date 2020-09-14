import React,{useEffect,useRef,useState,useLayoutEffect} from 'react';
import _ from 'lodash';
import CodeMirror from 'codemirror';
// import 'codemirror/addon/hint/show-hint.js'
// import 'codemirror/addon/hint/show-hint.css'
// import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';

function CodeEditor(props) {
    const { code,onChange,className,lineNumbers, lineWrapping, matchBrackets, tabSize, readOnly, theme, expanded } = props;
    const [editor,setEditor] = useState();

    const textareaRef = useRef();
    const sub = useRef();
    const container = useRef();

    useLayoutEffect(() => {
        if(expanded && sub.current && container.current){
            if(isInit()) sub.current.style.height='auto';//初始化时必须将高度设置为`auto`，否则父级将不能响应子级的高度变化
            else sub.current.style.height = `${container.current.offsetHeight + 12}px`;//12为外边距
        }else{
            if(sub.current){
                if(isInit()) sub.current.style.height = '0px';//用于解决初始化页面闪烁的问题
                else setTimeout(()=>sub.current.style.height = '0px',0)
            }
        }

        return ()=>{
            if (expanded && sub.current && container.current) {
                sub.current.style.height = `${container.current.offsetHeight}px`;
            }
        }

        function isInit() {
            return sub.current.style.height==='';
        }
    }, [expanded]);

    useEffect(()=>{
        if(_.isNil(textareaRef.current)) return ()=>{};
        let e = null;
        if (CodeMirror !== undefined) {
            e = CodeMirror.fromTextArea(textareaRef.current, {
                mode: 'jsx',
                lineNumbers,
                lineWrapping,
                matchBrackets,
                tabSize,
                readOnly,
                theme,
                extraKeys: {
                    // "Tab": "autocomplete"
                },
                foldGutter: true,
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            });
            setEditor(e);
            e.on('change', handleChange);
        }

        function handleChange() {
            if(!readOnly && _.isFunction(onChange)){
                onChange(e.getValue());
            }
        }
    },[]);

    useEffect(()=>{
        if(readOnly) editor.setValue();
    },[readOnly]);

    return <div className={className} ref={sub}>
        <div ref={container}>
            <textarea ref={textareaRef} defaultValue={_.trim(code)}/>
        </div>
    </div>
}
CodeEditor.defaultProps = {
    matchBrackets: true,//匹配括号
    tabSize: 2,
    expanded:false,
};

export default CodeEditor;
