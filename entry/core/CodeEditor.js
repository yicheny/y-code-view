import React, { useEffect, useRef, useState, useLayoutEffect, useMemo, useCallback } from 'react';
import _ from 'lodash';
import CodeMirror from 'codemirror';
// import 'codemirror/addon/hint/show-hint.js'
// import 'codemirror/addon/hint/show-hint.css'
// import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import clsx from "clsx";

function CodeEditor(props) {
    const { code,onChange,className,lineNumbers, lineWrapping, matchBrackets, tabSize, readOnly, theme, expanded,hotKeyExe } = props;
    const [editor,setEditor] = useState();
    const [textareaContent,setTextareaContent] = useState(null);
    const textareaRef = useCallback((e)=>{
        setTextareaContent(e)
    },[]);
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

    const e = useMemo(()=>{
        if(_.isNil(textareaContent)) return null;
        if(!CodeMirror) return null;
        return CodeMirror.fromTextArea(textareaContent, {
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
    },[textareaContent])

    useEffect(()=>{
        if(!e) return ;
        setEditor(e);
        e.on('change', handleChange);

        function handleChange() {
            if(!readOnly && _.isFunction(onChange)){
                onChange(e.getValue());
            }
        }
    },[e]);

    useEffect(()=>{
        if(!e) return ;
        e.on('keydown',handleHotKeyExe);
        function handleHotKeyExe(e,nativeE){
            if(nativeE.ctrlKey && nativeE.keyCode===83){
                nativeE.preventDefault();
                nativeE.stopPropagation();
                if(hotKeyExe) hotKeyExe(e.getValue());
            }
        }
    },[hotKeyExe,e])

    useEffect(()=>{
        if(readOnly) editor.setValue();
    },[readOnly]);

    return <div className={clsx('code-editor',className)} ref={sub} onTransitionEnd={transitionEnd}>
        <div ref={container}>
            <textarea ref={textareaRef} defaultValue={_.trim(code)}/>
        </div>
    </div>

    function transitionEnd() {
        if(expanded) sub.current.style.height = 'auto';//设置为`auto`的原因是需要保证子级菜单展开时，父级菜单的高度响应变化
    }
}
CodeEditor.defaultProps = {
    matchBrackets: true,//匹配括号
    tabSize: 2,
    expanded:false,
    lineNumbers:true
};

export default CodeEditor;
