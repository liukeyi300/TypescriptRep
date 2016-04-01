module AicTech.Web.Utils {
    export class DateUtils {
        private static numberOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        constructor() { }

        /**
        * Get number of Days in a month
        *
        * @param {Date} date
        * @return {number} days
        */
        static getDayOfMonth(date: Date): number {
            var m = date.getMonth(),
                y = date.getFullYear();
            if (m !== 1) {
                return DateUtils.numberOfDays[m];
            } else {
                if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
                    return 29;
                } else {
                    return 28;
                }
            }
        }

        static getDayOfYear(x: Date): any {
            var y = x.getFullYear();
            if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
                return 366;
            } else {
                return 365;
            }
        }


        static nextMonth(date: Date): Date {
            var time = date.getTime();
            time += 1000 * 60 * 60 * 24 * DateUtils.getDayOfMonth(date);
            return new Date(time);
        }

        static lastMonth(date: Date): Date {
            var time = date.getTime(),
                _date: Date;
            if (date.getMonth() === 0) {
                _date = new Date(date.getFullYear(), 11, date.getDate());
            } else {
                _date = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
            }
            time -= 1000 * 60 * 60 * 24 * DateUtils.getDayOfMonth(_date);
            return new Date(time);
        }

        static nextWeek(date: Date): Date {
            var time = date.getTime();
            time += 1000 * 60 * 60 * 24 * 7;
            return new Date(time);
        }

        static lastWeek(date: Date): Date {
            var time = date.getTime();
            time -= 1000 * 60 * 60 * 24 * 7;
            return new Date(time);
        }

        static nextDay(date: Date): Date {
            var time = date.getTime();
            time += 1000 * 60 * 60 * 24;
            return new Date(time);
        }

        static lastDay(date: Date): Date {
            var time = date.getTime();
            time -= 1000 * 60 * 60 * 24;
            return new Date(time);
        }

        /**
         * From Date string to Date object
         * eg: '/Date(1440662295000+0800)/'
         *
         * @param {string || Date} date
         * @return {Date} date object
         */
        static dateString2Date(date): Date {
            if (date instanceof Date) {
                return date;
            } else if (date.substring(0, 6) === '/Date(') {
                return new Date(parseInt(date.substr(6)));
            } else {
                //ISODate without Z? Safari compatible with Z
                if (date.indexOf('Z') === -1 && !date.match('T.*[+-]'))
                    date += 'Z';
                return new Date(date);
            }
        }

        /**
         * 格式化日期
         * author: meizz 
         *
         * @param {Date} date
         * @param {string} format
         * @return {string} date string
         */
        static format(date: Date, fmt: string): string {
            var o = {
                "M+": date.getMonth() + 1,                 //月份 
                "d+": date.getDate(),                    //日 
                "h+": date.getHours(),                   //小时 
                "m+": date.getMinutes(),                 //分 
                "s+": date.getSeconds(),                 //秒 
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
                "S": date.getMilliseconds()             //毫秒 
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }
}