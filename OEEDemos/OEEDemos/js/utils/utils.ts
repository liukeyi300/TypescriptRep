/// <reference path="../reference.ts" />

module OEEDemos {
    interface IPromise<T> extends JQueryPromise<T> {
    }

    interface Dictionary {
        [index: string]: string;
        length: string;
    }

    export class AppUtils {
        static EquimentsName: Dictionary = {
            length:"0"
        };
        constructor() { }

        /**
         * 根据给定的data和根节点生成树形结构的对象
         * data中数据项需要有独一无二的id和parentId
         */
        static getTree(data: any[], rootLevel: number|string, notNeedClean = false): Object {
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
            if (!notNeedClean) {
                hash[rootLevel].forEach(function (d) {
                    AppUtils.cleanData(d);
                });
            }
            return hash[rootLevel];
        }

        /**
         * 根据树形data获取树的深度
         */
        static getTreeDepth(data: any[]): number {
            var current = [],
                dataLength = data.length,
                curLength = data[data.length - 1].length,
                i,
                j,
                max;
            for (i = 0; i < curLength; i++) {
                if (typeof data[dataLength - 1][i].items !== 'undefined') {
                    for (j = 0, max = data[dataLength - 1][i].items.length; j < max; j++) {
                        current.push(data[dataLength - 1][i].items[j]);
                    }
                }
            }

            if (current.length > 0) {
                var a = [];
                data.push(a);
                dataLength++;
                for (i = 0, length = current.length; i < length; i++) {
                    data[dataLength - 1].push(current[i]);
                }
                AppUtils.getTreeDepth(data);
            } 
            return data.length;
        }

        static expandTreeNode(curNode: number | string, successCallback: (data: any[]) => void, failCallback: (e: any) => void): void {
            var ppaEntities = new AicTech.PPA.DataModel.PPAEntities({
                name:"oData",
                oDataServiceHost:AccountHelpUtils.serviceAddress + AccountHelpUtils.ppaEntitiesDataRoot
            });
            if (curNode === "null") {
                ppaEntities.PM_EQUIPMENT
                    .filter(function (it) {
                        return it.MASTER_NO == null;
                    })
                    .map((it) => {
                        return {
                            id: it.EQP_NO,
                            parent: it.MASTER_NO,
                            text: it.EQP_NAME
                        }
                    })
                    .toArray(function (data) {
                        successCallback(data);
                        data.forEach((it) => {
                            AppUtils.EquimentsName[it.id + ""] = it.text;
                            var length = parseInt(AppUtils.EquimentsName.length);
                            length++;
                            AppUtils.EquimentsName.length = length + "";
                        });
                    })
                    .fail(function (e) {
                        failCallback(e);
                    });
            } else {
                ppaEntities.PM_EQUIPMENT
                    .filter(function (it) {
                        return it.MASTER_NO == this.eqpNo;
                    }, { eqpNo: curNode })
                    .map((it) => {
                        return {
                            id: it.EQP_NO,
                            parent: it.MASTER_NO,
                            text: it.EQP_NAME,
                            items:[]
                        }
                    })
                    .toArray(function (data) {
                        successCallback(data);
                        data.forEach((it) => {
                            AppUtils.EquimentsName[it.id + ""] = it.text;
                            var length = parseInt(AppUtils.EquimentsName.length);
                            length++;
                            AppUtils.EquimentsName.length = length + "";
                        });
                    })
                    .fail(function (e) {
                        failCallback(e);
                    });
            }
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
        public static ppaEntitiesDataRoot = "/Services/PPAEntitiesDataService.svc"

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