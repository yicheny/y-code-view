import React, { useMemo } from 'react';
import clsx from "clsx";
import Icon from "../../component/Icon";
import _ from "lodash";
import createColInfo from "./createColInfo";

export default function ConsoleViewBox({ data }) {
    return <div className="cv-console-view-box">
        {
            _.map(data,(x,i)=><ViewCol key={i} data={x}/>)
        }
    </div>
}

function ViewCol(props){
    const {data} = props;
    return <div className={clsx('v-col')}>
        <Icon name='arrowDown' size={12}/>
        <div className="content">
            {
                _.map(data,(x,i)=><ViewColValue key={i} data={x}/>)
            }
        </div>
    </div>
}

export function ViewColValue(props){
    const {data,source} = props;
    const {children,className,onClick,style} = useMemo(()=>createColInfo(data,source),[data,source]);
    return <span className={clsx("col-value",className,props.className)}
                 onClick={onClick} style={style}>
       {children}
    </span>
}
