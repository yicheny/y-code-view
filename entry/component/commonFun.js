import _ from "lodash";

export function parseHTML(source) {
    if(!_.isString(source)) return;
    const reg = new RegExp(/([\s\S]+)(```js)([\s\S]+)(```)([\s\S]+)/gi);
    const reg_res = reg.exec(source);
    const findCode = reg_res[3];
    if (!findCode) return {beforeHTML: source};

    return {
        code:findCode,
        beforeHTML:reg_res[1],
        afterHTML:reg_res[5]
    };
}

export function Obj(x,defaultValue={}) {
    return _.isObject(x) ? x : defaultValue;
}
