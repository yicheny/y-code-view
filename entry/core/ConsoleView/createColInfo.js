import _ from "lodash";
import React from "react";
import ObjectColInfo from "./ObjectColInfo";
import ArrayColInfo from "./ArrayColInfo";

export default function createColInfo(value,source){
    if(_.isNil(value)) return createInfo('nil');
    if(_.isBoolean(value)) return createInfo('boolean');
    if(_.isNumber(value)) return createInfo('number');

    if(_.isPlainObject(value)) {
        if(value.__type === 'error') return {children:value.info,className:'error'};
        return ObjectColInfo.create(value,source).info;
    }

    if(_.isArray(value)) return ArrayColInfo.create(value,source).info;
    return createInfo();

    function createInfo(className){
        return {className,children:` ${String(value)} `}
    }
}
