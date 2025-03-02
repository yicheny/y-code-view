import supportModule from "../../utils/supportModule";
const vm = require('vm');

export default class RunTimeCode{
    constructor(code) {
        this._runTimeCode = '';
        this._code = code;

        this._init();
        return this;
    }

    static create(...params){
        return new RunTimeCode(...params);
    }

    _init(){
        this._supportModule();
        this._addDefineCode();
        this._replacePrintFun();
        this._wrapperFunStr();
    }

    _supportModule(){
        this._code = supportModule(this._code);
    }

    _replacePrintFun(){
        this._runTimeCode += ReplaceCode.create(this._code).code;
    }

    _addDefineCode(){
        this._runTimeCode += PredefineCode.create().code;
    }

    _wrapperFunStr(){
        this._runTimeCode =
            `(function ({__module,__dependencies,__openConsole}){
                \r\n${this._runTimeCode}\r\n
            });`
    }

    get runtime(){
        return vm.runInThisContext(this._runTimeCode);
    }
}

class PredefineCode{
    constructor() {
        this._code = '';

        this._addModuleParamsCount();
        this._addNormalPrint();
        this._addErrorPrint();
    }

    static create(...params){
        return new PredefineCode(...params);
    }

    _addModuleParamsCount(){
        this._code += `
            let __count = 0;\r\n
        `
    }

    _addNormalPrint(){
        this._code += `
            function __print(...params){
                __module[__count] = params;
                __count++;
                if(__openConsole) console.log(...params);
            }
            \r\n
        `;
    }

    _addErrorPrint(){
        this._code += `
            function __printError(callback){
                try{
                    const r = callback();  
                    throw new Error(r);
                }catch(e){
                    __module[__count] = [{
                            __type:'error',
                            info:e.message
                        }]
                    __count++;
                }
            }
            \r\n
        `;
    }

    get code(){
        return this._code;
    }
}

class ReplaceCode{
    constructor(sourceCode) {
        this._code = '';
        this._sourceCode = sourceCode;

        this._replaceErrorPrint();
        this._replaceNormalPrint();
    }

    static create(...params){
        return new ReplaceCode(...params);
    }

    _replaceErrorPrint(){
        if(typeof this._sourceCode !== 'string') return null;
        this._code = this._sourceCode.replace(/console.error\((.*)\);/gi,value=>{
            const reg = new RegExp(/console.error\((.*)\);/ig);
            let result = reg.exec(value);
            return `__printError(()=>{
                return ${result[1]};
            });`
        });
    }

    _replaceNormalPrint(){
        if(this._code === '') return null;
        this._code =  this._code.replace(/console.log/gi,'__print')
    }

    get code(){
        return this._code;
    }
}
