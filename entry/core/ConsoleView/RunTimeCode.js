import supportModule from "../../utils/supportModule";
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
        this._supportModule();
        this._addPrintStr();
        this._replacePrintFun();
        this._wrapperFunStr();
    }

    _supportModule(){
        this._code = supportModule(this._code);
    }

    _replacePrintFun(){
        if(typeof this._code !== 'string') return null;
        this._runTimeCode += this._code.replace(/console.log/g,'__print');
    }

    _addPrintStr(){
        const printStr = `
            let __count = 0;
            function __print(...params){
                __module[__count] = params;
                __count++;
                if(__openConsole) console.log(...params);
            }
            \n
        `
        this._runTimeCode += printStr;
    }

    _wrapperFunStr(){
        this._runTimeCode = `(function ({__module,__dependencies,__openConsole}){\n${this._runTimeCode}\n});`
    }

    get runtime(){
        return vm.runInThisContext(this._runTimeCode);
    }
}
