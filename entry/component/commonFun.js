import _ from "lodash";

export function parseHTML(source) {
    if(!_.isString(source)) return {};
    const findCode = _.get(new RegExp(/(```js)([\s\S]+)(```)/gi).exec(source),'2');
    if (!findCode) return {beforeHTML: source,};

    return {
        code:findCode,
        beforeHTML:_.get(new RegExp(/([\s\S]+)(```js)([\s\S]+)(```)/gi).exec(source),'1',''),
        afterHTML:_.get(new RegExp(/(```js)([\s\S]+)(```)([\s\S]+)/gi).exec(source),'4','')
    };
}
