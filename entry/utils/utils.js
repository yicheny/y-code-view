import _ from 'lodash';

//typeFor :: any -> String
const typeFor = _.curry(function (value){
    let dataType = Object.prototype.toString.call(value);
    dataType = dataType.slice(8, dataType.length - 1);
    return dataType;
})

//checkType :: ([] | '') -> any -> boolean
export const checkType = _.curry(function (types,value){
    if(typeof types === 'string') return typeFor(value) === types;
    if(Array.isArray(types)) return types.includes(typeFor(value));
    throw new Error('checkType参数类型异常')
})