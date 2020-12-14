export function replaceImport(txt){
    return _.replace(txt,/import([\s{}\[\]a-zA-Z0-9_,$-]+)from\s+['"]?([a-zA-Z0-9_,$-]+)['"]?;/gi,value=>{
        const reg = new RegExp(/import([\s{}\[\]a-zA-Z0-9_,$-]+)from\s+['"]?([a-zA-Z0-9_,$-]+)['"]?;/gi);
        const r = reg.exec(value);
        return r ? `var ${r[1]} = ${r[2]};` : null;
    });
}

export function replaceExport(txt){
    return _.replace(txt,/export\s+default([\sa-zA-Z0-9_,$-]+);/gi,value=>{
        const reg = new RegExp(/export\s+default([\sa-zA-Z0-9_,$-]+);/gi);
        const r = reg.exec(value);
        return r ?  `module.exports = ${r[1]}` : null;
    });
}

export default function supportModule(txt){
    return replaceExport(replaceImport(txt))
}
