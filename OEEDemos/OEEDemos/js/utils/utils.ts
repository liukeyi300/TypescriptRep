/// <reference path="../reference.ts" />

module OEEDemos {
    interface IPromise<T> extends JQueryPromise<T> {
    }

    export class AppUtils {
        constructor() {}

        /**
         * 根据给定的data和根节点生成树形结构的对象
         * data中数据项需要有独一无二的id和parentId
         */
        static getTree(data: any[], rootLevel: number|string): Object {
            var hash = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var id = item["id"];
                var parentId = item["parent"];

                hash[id] = hash[id] || [];
                hash[parentId] = hash[parentId] || [];

                item.items = hash[id];
                hash[parentId].push(item);
            }

            hash[rootLevel].forEach(function (d) {
                AppUtils.cleanData(d);
            });
            return hash[rootLevel];
        }

        private static cleanData(data: { items: [any] }) {
            if (data.items.length > 0) {
                data.items.forEach(function (item) {
                    AppUtils.cleanData(item);
                });
            } else {
                delete data.items;
            }
        }
    }

    export class DateUtils {
        constructor() {}

        /**
         * 从日期字符串转换日期对象
         * eg: '/Date(1440662295000+0800)/'
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

    export class AccountHelpUtils {
        constructor() { }
        public static serviceAddress: string;
        public static authServiceClient: ApplicationServices.AuthenticationServiceClient;
        public static credServiceClient: ApplicationServices.CredentialServiceClient;
        public static roleServiceClient: ApplicationServices.RoleServiceClient;

        private static authServiceRoot = "/Services/AuthenticationService.svc/ajax";
        private static credServiceRoot = "/Services/CredentialService.svc/ajax";
        private static roleServiceRoot = "/Services/RoleService.svc/ajax";

        /**
         * 登录
         */
        public static login(
            serviceAddress: string,
            userName: string,
            pwd: string,
            successCallback: ((value: boolean) => void),
            failCallback?: () => void,
            doneCallback?: () => void) {

            AccountHelpUtils.serviceAddress = serviceAddress;
            AccountHelpUtils.authServiceClient = new ApplicationServices.AuthenticationServiceClient(serviceAddress + AccountHelpUtils.authServiceRoot);
            AccountHelpUtils.credServiceClient = new ApplicationServices.CredentialServiceClient(serviceAddress + AccountHelpUtils.credServiceRoot);
            AccountHelpUtils.roleServiceClient = new ApplicationServices.RoleServiceClient(serviceAddress + AccountHelpUtils.roleServiceRoot);
            failCallback = failCallback || (() => void {});
            doneCallback = doneCallback || (() => void {});

            AccountHelpUtils.logOut();
            try {
                AccountHelpUtils.authServiceClient.loginAsync(userName, pwd, "", true)
                    .then((value: boolean) => {
                        successCallback(value);
                    },
                        () => {
                            failCallback();
                            alert("failed!");
                        })
                    .fail(failCallback)
                    .done(doneCallback);
            } catch (ex) {
                console.log(ex);
            }
        }

        /**
         * 登出
         */
        public static logOut() {
            if (typeof AccountHelpUtils.authServiceClient !== 'undefined') {
                try {
                    AccountHelpUtils.authServiceClient.logoutAsync();
                } catch (ex) {
                    console.log(ex);
                }
            }
        }
    }
}