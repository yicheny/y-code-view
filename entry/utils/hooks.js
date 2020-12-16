import { useMemo, useReducer } from "react";
import _ from "lodash";

export function useSource(props){
    return useMemo(() =>{
        const res = props.source || props.children;
        return _.get(res, 'default',res);
    }, [props.source, props.children]);
}

export function useForceUpdate(){
    const [,forceUpdate] = useReducer(x=>x+1,0);
    return forceUpdate;
}
