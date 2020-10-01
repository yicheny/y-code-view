import _ from "lodash";

export default function parseHTMLRunCode(source) {
    if(!_.isString(source)) return {};
    const code  = _.get(new RegExp(/<!--RunCode-->\s*(```jsx?)([\s\S]+)(```)\s*<!--\/RunCode-->/gi).exec(source),'2');
    if (!code) return {beforeHTML: source,};

    return {
        code,
        beforeHTML:_.get(new RegExp(/([\s\S]+)<!--RunCode-->\s*(```js)([\s\S]+)(```)\s*<!--\/RunCode-->/gi).exec(source),'1',''),
        afterHTML:_.get(new RegExp(/<!--RunCode-->\s*(```js)([\s\S]+)(```)\s*<!--\/RunCode-->([\s\S]+)/gi).exec(source),'4','')
    };
}
