import _ from "lodash";

export default function parseHTMLRunCode(source) {
    if(!_.isString(source)) return {};
    const _source = replaceOldCodeFlag(source);
    const code  = _.get(new RegExp(/<!--RunCode-->\s*(```jsx?)([\s\S]+)(```)\s*<!--\/RunCode-->/gi).exec(_source),'2');
    if (!code) return {beforeHTML: _source,};

    return {
        code,
        beforeHTML:_.get(new RegExp(/([\s\S]+)<!--RunCode-->\s*(```jsx?)([\s\S]+)(```)\s*<!--\/RunCode-->/gi).exec(_source),'1',''),
        afterHTML:_.get(new RegExp(/<!--RunCode-->\s*(```jsx?)([\s\S]+)(```)\s*<!--\/RunCode-->([\s\S]+)/gi).exec(_source),'4','')
    };
}

function replaceOldCodeFlag(txt){
    return txt.replace(/<!--start-code-->/gi,'<!--RunCode-->').replace(/<!--end-code-->/gi,'<!--/RunCode-->')
}
