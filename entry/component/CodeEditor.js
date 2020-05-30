import React,{useEffect,useRef,useState} from 'react';
import _ from 'lodash';
import CodeMirror from 'codemirror';

function CodeEditor(props) {
    const { code,onChange,className,lineNumbers, lineWrapping, matchBrackets, tabSize, readOnly, theme } = props;
    const [editor,setEditor] = useState();

    const textareaRef = useRef();

    useEffect(()=>{
        let e = null;
        if (CodeMirror !== undefined) {
            e = CodeMirror.fromTextArea(textareaRef.current, {
                mode: 'jsx',
                lineNumbers,
                lineWrapping,
                matchBrackets,
                tabSize,
                readOnly,
                theme
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

    return <div className={className}>
        <textarea ref={textareaRef} defaultValue={_.trim(code)} />
    </div>
}
CodeEditor.defaultProps = {
    matchBrackets: true,
    tabSize: 2,
    theme: 'default'
};

export default CodeEditor;
