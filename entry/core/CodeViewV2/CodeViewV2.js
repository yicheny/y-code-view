import React, { Fragment, useCallback, useMemo, useState } from 'react';
import _ from "lodash";
import { Markdown } from "y-markdown";
import CodeEditor from "../../component/CodeEditor";
import ErrorBoundary from "../../component/ErrorBoundary";
import supportModule from "../../utils/supportModule";
import Toolbar from "../../component/Toolbar";
import { useDelayExecute, useSource } from "../../utils/hooks";
import parseDoc from "../../utils/parseDoc";
const vm = require('vm');

function CodeViewV2(props) {
    const {dependencies,delay,babelTransformOptions,expanded,autoExe} = props;
    const source = useSource(props);
    const {htmls,codes} = useMemo(()=>parseDoc(source),[source]);

    return (<div className='y-code-view-v2'>
        {
            _.map(htmls,(x,i)=>{
                if(_.isString(x)) return <Markdown key={i}>{x}</Markdown>
                const {value,key} = x;
                const code = _.find(codes,x=>x.key === key);
                return <Fragment key={i}>
                    <Markdown>{value}</Markdown>
                    <CodeBox code={code.value}
                             dependencies={dependencies}
                             delay={delay}
                             expanded={expanded}
                             autoExe={autoExe}
                             babelTransformOptions={babelTransformOptions}/>
                </Fragment>
            })
        }
    </div>);
}

CodeViewV2.staticData = { };
CodeViewV2.method = {
    setStaticData(data){
        if(!_.isPlainObject(data)) throw new Error("CodeViewV2.method.setStaticData要求参数必须是对象类型！")
        CodeViewV2.staticData = data;
    },
    getStaticData(){
        return CodeViewV2.staticData
    }
}

export default CodeViewV2;

//组件
function CodeBox(props){
    const {babelTransformOptions,dependencies,delay} = props;
    const [code,setCode] = useState(props.code);
    const [expanded,setExpanded] = useState(props.expanded);
    const [module,setModule] = useState({exports:null});
    const [error,setError] = useState(null);
    const [editorKey, setEditorKey] = useState(0);
    const [autoExe,setAutoExe] = useState(props.autoExe);

    const execute = useCallback((code)=>{
        try {
            const dep = _.assign(CodeViewV2.method.getStaticData(),dependencies)
            createRunTime(code,babelTransformOptions)(module,_.assign({react:React},dep));
            setError(null);
            setModule(_.clone(module));
        }catch ( e ){
            setError(e);
        }
    },[babelTransformOptions,dependencies]);

    useDelayExecute({delay,execute,autoExe,code});

    const hotKeyExe = useCallback((c)=>(!autoExe && execute(c)),[autoExe,execute]);

    const Component = module.exports;
    return <div className='y-code-view-v2-box'>
        <ErrorBoundary error={error} setError={setError}>
            {Component && <Component/>}
        </ErrorBoundary>
        <Toolbar setCode={setCode} code={code} execute={execute}
                 autoExe={autoExe} setAutoExe={setAutoExe}
                 expanded={expanded} setExpanded={setExpanded}
                 sourceCode={props.code} setEditorKey={setEditorKey}/>
        <CodeEditor key={editorKey} code={code} onChange={setCode} expanded={expanded} hotKeyExe={hotKeyExe}/>
    </div>
}
CodeBox.defaultProps = {
    autoExe:true,
    expanded:true,
    code:null,
    dependencies:null,
    delay:600,
    babelTransformOptions: {
        presets: ['stage-0', 'react', 'es2015']
    },
}

//工具方法
function createRunTime(code,options){
    let runTimeStr = window.Babel.transform(supportModule(code),options).code;
    runTimeStr = `__module.exports = undefined;\n\r`.concat(runTimeStr);
    runTimeStr = `(function (__module,__dependencies){\n${runTimeStr}\n});`
    return vm.runInThisContext(runTimeStr);
}

//hook

