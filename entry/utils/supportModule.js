export function replaceImport(txt){
    return _.replace(txt,/import([\s{}\[\]\w,$]+)from\s+['"]([\w,$/-]+)['"]\s*;/gi,value=>{
        const reg = new RegExp(/import\s+([\w$]+)?([\s{}\[\]\w,$]+)from\s+['"]([\w,$/-]+)['"]\s*;/gi);
        const r = reg.exec(value);
        if(!r) return null;
        if(r[1] === undefined) return `var ${r[2]} = __dependencies['${r[3]}'];\n\r`
        return `var ${ r[ 1 ] } = __dependencies['${ r[ 3 ] }'];var ${ _.trim(r[ 2 ]).slice(1,Infinity) } = __dependencies['${ r[ 3 ] }'];\r\n`;//注意：这里不可换行，否则会导致注释解析异常
    });
}

export function replaceExport(txt){
    return _.replace(txt,/export\s+default([\sa-zA-Z0-9_,$-]+);/gi,value=>{
        const reg = new RegExp(/export\s+default([\sa-zA-Z0-9_,$-]+);/gi);
        const r = reg.exec(value);
        return r ?  `__module.exports = ${r[1]}` : null;
    });
}

export default function supportModule(txt){
    return replaceExport(replaceImport(txt))
}
