import _ from "lodash";

export default function parseHTML(source) {
    if(!_.isString(source)) return {};
    const code  = _.get(new RegExp(/<!--start-code-->\s*(```js)([\s\S]+)(```)\s*<!--end-code-->/gi).exec(source),'2');
    if (!code) return {beforeHTML: source,};

    return {
        code,
        beforeHTML:_.get(new RegExp(/([\s\S]+)<!--start-code-->\s*(```js)([\s\S]+)(```)\s*<!--end-code-->/gi).exec(source),'1',''),
        afterHTML:_.get(new RegExp(/<!--start-code-->\s*(```js)([\s\S]+)(```)\s*<!--end-code-->([\s\S]+)/gi).exec(source),'4','')
    };
}
