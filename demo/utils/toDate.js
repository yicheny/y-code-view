const _ = require('lodash');

const STRATEGY = Object.freeze({
    timestamp: timestampToDate,
    dateString: dateStringToDate,
    str14: str14ToDate,
    num14: str14ToDate,
    str8: str8ToDate,
    num8: str8ToDate,
});

//toDate :: String -> (String | Number) -> Date
const toDate = _.curry((format, value) => {
    if (!STRATEGY[format]) return null;
    const res = STRATEGY[format](value);
    return String(res) === "Invalid Date" ? null : res;
})

//timestampToDate :: timestamp -> Date
function timestampToDate(value) {
    return _.isNumber(value) ? new Date(value) : null;
}

//dateStringToDate :: dateString -> Date
function dateStringToDate(value) {
    return _.isString(value) ? new Date(value) : null;
}

//str14ToDate :: '20200101020202' -> Date
function str14ToDate(value) {
    const re = /^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$/;
    if(re.test(value)){
        const [year,month,day,hour,min,sec] = re.exec(value).slice(1);
        return new Date(year, month - 1, day, hour, min, sec);
    }
    return null;
}

//str8ToDate :: '20200101020202' -> Date
function str8ToDate(value) {
    const re = /^([0-9]{4})([0-9]{2})([0-9]{2})$/;
    if (re.test(value)) {
        const [year, month, day] = re.exec(value).slice(1);
        return new Date(year, month - 1, day);
    }
    return null;
}

toDate.timestampToDate = toDate('timestamp');//时间戳
toDate.dateStringToDate = toDate('dateString');//标识日期的字符串值
toDate.num14ToDate = toDate('num14');//14位数字
toDate.str14ToDate = toDate('str14');//14位字符串
toDate.num8ToDate = toDate('num8');//8位数字
toDate.str8ToDate = toDate('str8');//8位字符串

module.exports = toDate;