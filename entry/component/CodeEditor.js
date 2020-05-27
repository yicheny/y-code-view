import React,{useEffect,useRef,useState} from 'react';
import _ from 'lodash';
import CodeMirror from 'codemirror';

function CodeEditor(props) {
    const { code,onChange,lineNumbers, lineWrapping, matchBrackets, tabSize, readOnly, theme } = props;
    const [editor,setEditor] = useState();

    const textareaRef = useRef();

    useEffect(()=>{
        if (CodeMirror !== undefined) {
            const e = CodeMirror.fromTextArea(textareaRef.current, {
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
        if(readOnly) editor.setValue()
    },[readOnly]);

    return <div className='code show'>
        <textarea ref={textareaRef}
                  style={{display:'block'}}
                  defaultValue={_.trim(code)} />
    </div>
}
CodeEditor.defaultProps = {
    matchBrackets: true,
    tabSize: 2,
    theme: 'default'
};

export default CodeEditor;