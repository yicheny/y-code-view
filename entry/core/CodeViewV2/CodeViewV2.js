import React, { Fragment, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import parseDoc from "./parseDoc";
import _ from "lodash";
import { Markdown } from "y-markdown";
import CodeEditor from "../CodeEditor";
import ErrorBoundary from "../ErrorBoundary";
import { replaceImport } from "../../utils/supportModule";
const vm = require('vm');

function CodeViewV2(props) {
    const source = useSource(props);
    const {htmls,codes} = useMemo(()=>parseDoc(source),[source]);

    return (<div>
        {
            _.map(htmls,(x,i)=>{
                if(_.isString(x)) return <Markdown key={i}>{x}</Markdown>
                const {value,key} = x;
                const code = _.find(codes,x=>x.key === key);
                return <Fragment key={i}>
                    <Markdown>{value}</Markdown>
                    <CodeBox code={code.value}/>
                </Fragment>
            })
        }
    </div>);
}

export default CodeViewV2;

//组件
function CodeBox(props){
    const {babelTransformOptions} = props;
    const [code,setCode] = useState(props.code);
    const forceUpdate = useForceUpdate();
    const moduleRef = useRef({exports: null});
    const [error,setError] = useState(null);

    useEffect(()=>{
        try {
            createRunTime(code,babelTransformOptions)(React,moduleRef.current);
            setError(null);
            forceUpdate();
       }catch ( e ){
           setError(e);
       }
    },[code,babelTransformOptions])

    const Component = moduleRef.current.exports;
    return <div>
        <ErrorBoundary error={error} setError={setError}>
            {Component && <Component/>}
        </ErrorBoundary>
        <CodeEditor code={code} onChange={setCode} expanded/>
    </div>
}
CodeBox.defaultProps = {
    code:null,
    babelTransformOptions: {
        presets: ['stage-0', 'react', 'es2015']
    },
}

//工具方法
function createRunTime(code,options){
    let runTimeStr = window.Babel.transform(replaceImport(code),options).code;
    runTimeStr = `(function (React,module){\n${runTimeStr}\n});`
    return vm.runInThisContext(runTimeStr);
}

//hook
function useSource(props){
    return useMemo(() =>{
        const res = props.source || props.children;
        return _.get(res, 'default',res);
    }, [props.source, props.children]);
}

function useForceUpdate(){
    const [,forceUpdate] = useReducer(x=>x+1,0);
    return forceUpdate;
}
