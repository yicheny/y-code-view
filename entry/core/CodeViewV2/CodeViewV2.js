import React, {Fragment, useMemo,useState} from 'react';
import parseDoc from "./parseDoc";
import _ from "lodash";
import { Markdown } from "y-markdown";
import CodeEditor from "../CodeEditor";

function CodeViewV2(props) {
    const source = useSource(props);
    const {htmls,codes} = useMemo(()=>parseDoc(source),[source]);

    // console.log(htmls,codes);
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
    const [code,setCode] = useState(props.code);

    return <div>
        <CodeEditor code={code} onChange={setCode} expanded/>
    </div>
}

//hook
function useSource(props){
    return useMemo(() =>{
        const res = props.source || props.children;
        return _.get(res, 'default',res);
    }, [props.source, props.children]);
}
