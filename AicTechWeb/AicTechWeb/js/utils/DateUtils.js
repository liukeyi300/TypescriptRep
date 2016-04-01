var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            var DateUtils = (function () {
                function DateUtils() {
                }
                /**
                * Get number of Days in a month
                *
                * @param {Date} date
                * @return {number} days
                */
                DateUtils.getDayOfMonth = function (date) {
                    var m = date.getMonth(), y = date.getFullYear();
                    if (m !== 1) {
                        return DateUtils.numberOfDays[m];
                    }
                    else {
                        if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
                            return 29;
                        }
                        else {
                            return 28;
                        }
                    }
                };
                DateUtils.getDayOfYear = function (x) {
                    var y = x.getFullYear();
                    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
                        return 366;
                    }
                    else {
                        return 365;
                    }
                };
                DateUtils.nextMonth = function (date) {
                    var time = date.getTime();
                    time += 1000 * 60 * 60 * 24 * DateUtils.getDayOfMonth(date);
                    return new Date(time);
                };
                DateUtils.lastMonth = function (date) {
                    var time = date.getTime(), _date;
                    if (date.getMonth() === 0) {
                        _date = new Date(date.getFullYear(), 11, date.getDate());
                    }
                    else {
                        _date = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
                    }
                    time -= 1000 * 60 * 60 * 24 * DateUtils.getDayOfMonth(_date);
                    return new Date(time);
                };
                DateUtils.nextWeek = function (date) {
                    var time = date.getTime();
                    time += 1000 * 60 * 60 * 24 * 7;
                    return new Date(time);
                };
                DateUtils.lastWeek = function (date) {
                    var time = date.getTime();
                    time -= 1000 * 60 * 60 * 24 * 7;
                    return new Date(time);
                };
                DateUtils.nextDay = function (date) {
                    var time = date.getTime();
                    time += 1000 * 60 * 60 * 24;
                    return new Date(time);
                };
                DateUtils.lastDay = function (date) {
                    var time = date.getTime();
                    time -= 1000 * 60 * 60 * 24;
                    return new Date(time);
                };
                /**
                 * From Date string to Date object
                 * eg: '/Date(1440662295000+0800)/'
                 *
                 * @param {string || Date} date
                 * @return {Date} date object
                 */
                DateUtils.dateString2Date = function (date) {
                    if (date instanceof Date) {
                        return date;
                    }
                    else if (date.substring(0, 6) === '/Date(') {
                        return new Date(parseInt(date.substr(6)));
                    }
                    else {
                        //ISODate without Z? Safari compatible with Z
                        if (date.indexOf('Z') === -1 && !date.match('T.*[+-]'))
                            date += 'Z';
                        return new Date(date);
                    }
                };
                /**
                 * 格式化日期
                 * author: meizz
                 *
                 * @param {Date} date
                 * @param {string} format
                 * @return {string} date string
                 */
                DateUtils.format = function (date, fmt) {
                    var o = {
                        "M+": date.getMonth() + 1,
                        "d+": date.getDate(),
                        "h+": date.getHours(),
                        "m+": date.getMinutes(),
                        "s+": date.getSeconds(),
                        "q+": Math.floor((date.getMonth() + 3) / 3),
                        "S": date.getMilliseconds() //毫秒 
                    };
                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                };
                DateUtils.numberOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                return DateUtils;
            })();
            Utils.DateUtils = DateUtils;
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=DateUtils.js.map