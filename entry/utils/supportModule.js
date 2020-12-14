export function replaceImport(txt){
    return txt.replace(/import([\s{}\[\]a-zA-Z0-9_,$-]+)from\s+['"]?([a-zA-Z0-9_,$-]+)['"]?;/gi,value=>{
        const reg = new RegExp(/import([\s{}\[\]a-zA-Z0-9_,$-]+)from\s+['"]?([a-zA-Z0-9_,$-]+)['"]?;/gi);
        const r = reg.exec(value);
        return `var ${r[1]} = ${r[2]};`;
    });
}
