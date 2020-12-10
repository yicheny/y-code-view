import _ from "lodash";
const vm = require('vm');

export default class RunTimeCode{
    constructor(code,dependencies) {
        this._runTimeCode = '';
        this._code = code;
        this._dependencies = dependencies;

        this._init();
        return this;
    }

    static create(...params){
        return new RunTimeCode(...params);
    }

    _init(){
        this._addPrintStr();
        this._addDependencies();
        this._replacePrintFun();
        this._wrapperFunStr();
    }

    _addDependencies(){
        const dependencies = _.reduce(_.keys(this._dependencies),(acc,x)=>{
            return acc.concat(`var ${x} = dependencies.${x};\n`);//注意这一行的写法
        },'');
        this._runTimeCode += dependencies;
    }

    _replacePrintFun(){
        if(typeof this._code !== 'string') return null;
        this._runTimeCode += this._code.replace(/console.log/g,'__print');
    }

    _addPrintStr(){
        const printStr = `
            let __count = 0;
            function __print(...params){
                GlobData[__count] = params;
                __count++;
                if(openConsole) console.log(...params);
            }
            \n
        `
        this._runTimeCode += printStr;
    }

    _wrapperFunStr(){
        this._runTimeCode = `(function (GlobData,dependencies,openConsole){\n${this._runTimeCode}\n});`
    }

    get runtime(){
        return vm.runInThisContext(this._runTimeCode);
    }
}
