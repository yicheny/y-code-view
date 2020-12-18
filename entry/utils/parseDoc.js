import {getUniqkey} from "./utils";

export default function parseDoc(doc){
    const reg = DocReg.create(doc);
    return reg.parse();
}

class DocReg{
    constructor(doc) {
        this._doc = doc;

        this.replaceRunCodeFlag();
    }

    replaceRunCodeFlag(){
        this._doc = _.replace(this._doc,/<!--RunCode-->/gi,'<!--start-code-->').replace(/<!--\/RunCode-->/gi,'<!--end-code-->')
    }

    static create(...params){
        return new DocReg(...params);
    }

    parse(){
        const docs = this._doc.split('<!--end-code-->');
        const res = {
            htmls:[],
            codes:[]
        }
        docs.forEach(x=>{
            if(!x.includes('<!--start-code-->')) return res.htmls.push(x);
            const [html,codeStr] = x.split('<!--start-code-->');
            const key = getUniqkey();
            const code = getCode(codeStr);
            res.htmls.push({value:html, key});
            res.codes.push({value:code, key});
        })
        return res;

        function getCode(s){
            const reg = new RegExp(/```jsx?([\s\S]+)```/gi);
            return reg.exec(s)[1]
        }
    }
}

