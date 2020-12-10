import React, { useMemo } from "react";
import getColInfo from "./getColInfo";
import clsx from "clsx";

export default function ViewColValue(props){
    const {data,source} = props;
    const {value,className,onClick,style} = useMemo(()=>getColInfo(data,source),[data,source]);
    return <span className={clsx("col-value",className,props.className)}
                 onClick={onClick} style={style}>
       {value}
    </span>
}
