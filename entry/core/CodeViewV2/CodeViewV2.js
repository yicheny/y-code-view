import React, {Fragment, useMemo} from 'react';
import parseDoc from "./parseDoc";
import _ from "lodash";
import Markdown from "y-markdown/entry/component/Markdown";

{/*{
    _.map(htmls,(x,i)=>{
        if(_.isString(x)) return <Markdown key={i}>{x}</Markdown>
        const {value,key} = x;
        const code = _.find(codes,x=>x.key === key);
        return <Fragment>
            <Markdown>{value}</Markdown>
            <CodeBox code={code}/>
        </Fragment>
    })
}*/}

function CodeViewV2(props) {
    const source = useSource(props);
    // const {htmls,codes} = useMemo(()=>parseDoc(source),[source]);

    // console.log(htmls,codes);
    // console.log(parseDoc(source))
    return (<div> </div>);
}

export default CodeViewV2;

//组件
function CodeBox({code}){
    console.log(code);
    return <div>
        codeBox
    </div>
}

//hook
function useSource(props){
    return useMemo(() =>{
        const res = props.source || props.children;
        return _.get(res, 'default',res);
    }, [props.source, props.children]);
}
