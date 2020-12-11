import _ from "lodash";
import React from "react";
import ObjectColInfo from "./ObjectColInfo";
import ArrayColInfo from "./ArrayColInfo";

export default function createColInfo(value,source){
    if(_.isNil(value)) return {className: 'nil',value:fillEmpty(String(value))};
    if(_.isBoolean(value)) return {className:'boolean',value:fillEmpty(String(value))};
    if(_.isNumber(value)) return {className:'number', value:fillEmpty(String(value))};

    if(_.isPlainObject(value)) {
        if(value.__type === 'error') return {value:data.value,className:'error'};
        return ObjectColInfo.create(value,source).info;
    }

    if(_.isArray(value)) return ArrayColInfo.create(value,source).info;
    return {value:fillEmpty(String(value))}

    function fillEmpty(x){
        return ` ${x} `
    }
}
