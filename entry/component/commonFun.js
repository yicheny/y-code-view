import _ from "lodash";

export function parseHTML(source) {
    if(!_.isString(source)) return;
    // const findCode = source.match(/<!-+\ ?start-code\ ?-+>([\s\S]+)<!-+\ ?end-code\ ?-+>/gi);
    const reg = new RegExp(/(```)([\s\S]+)(```)/);
    const findCode = reg.exec(source)[2];
    if (!findCode) return {beforeHTML: source};

    return {
        code:findCode,
        beforeHTML:source.match(/([\s\S]+)<!-+\ ?start-code\ ?-+>/gi).join(''),
        afterHTML:source.match(/<!-+\ ?end-code\ ?-+>([\s\S]+)/gi).join(''),
    };

    function addParentDom(x) {
        const elem = document.createElement('div');
        elem.innerHTML = x;
        return elem;
    }
}

export function Obj(x,defaultValue={}) {
    return _.isObject(x) ? x : defaultValue;
}
