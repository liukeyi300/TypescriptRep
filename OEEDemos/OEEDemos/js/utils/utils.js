/// <reference path="../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var AppUtils = (function () {
        function AppUtils() {
        }
        /**
         * 根据给定的data和根节点生成树形结构的对象
         * data中数据项需要有独一无二的id和parentId
         */
        AppUtils.getTree = function (data, rootLevel) {
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
        };
        /**
         * 根据树形data获取树的深度
         */
        AppUtils.getTreeDepth = function (data) {
            var current = [];
            var dataLength = data.length;
            var curLength = data[dataLength - 1].length;
            for (var i = 0; i < curLength; i++) {
                if (typeof data[dataLength - 1][i].items !== 'undefined') {
                    for (var j = 0, max = data[dataLength - 1][i].items.length; j < max; j++) {
                        current.push(data[dataLength - 1][i].items[j]);
                    }
                }
            }
            if (current.length > 0) {
                var a = [];
                data.push(a);
                dataLength++;
                for (var i = 0, length = current.length; i < length; i++) {
                    data[dataLength - 1].push(current[i]);
                }
                AppUtils.getTreeDepth(data);
            }
            return data.length;
        };
        AppUtils.cleanData = function (data) {
            if (data.items.length > 0) {
                data.items.forEach(function (item) {
                    AppUtils.cleanData(item);
                });
            }
            else {
                delete data.items;
            }
        };
        return AppUtils;
    })();
    OEEDemos.AppUtils = AppUtils;
    var DateUtils = (function () {
        function DateUtils() {
        }
        /**
         * 从日期字符串转换日期对象
         * eg: '/Date(1440662295000+0800)/'
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
        return DateUtils;
    })();
    OEEDemos.DateUtils = DateUtils;
    var AccountHelpUtils = (function () {
        function AccountHelpUtils() {
        }
        /**
         * 登录
         */
        AccountHelpUtils.login = function (serviceAddress, userName, pwd, successCallback, failCallback, doneCallback) {
            AccountHelpUtils.serviceAddress = serviceAddress;
            AccountHelpUtils.authServiceClient = new ApplicationServices.AuthenticationServiceClient(serviceAddress + AccountHelpUtils.authServiceRoot);
            AccountHelpUtils.credServiceClient = new ApplicationServices.CredentialServiceClient(serviceAddress + AccountHelpUtils.credServiceRoot);
            AccountHelpUtils.roleServiceClient = new ApplicationServices.RoleServiceClient(serviceAddress + AccountHelpUtils.roleServiceRoot);
            failCallback = failCallback || (function () { return void {}; });
            doneCallback = doneCallback || (function () { return void {}; });
            AccountHelpUtils.logOut();
            try {
                AccountHelpUtils.authServiceClient.loginAsync(userName, pwd, "", true)
                    .then(function (value) {
                    successCallback(value);
                }, function () {
                    failCallback();
                    alert("failed!");
                })
                    .fail(failCallback)
                    .done(doneCallback);
            }
            catch (ex) {
                console.log(ex);
            }
        };
        /**
         * 登出
         */
        AccountHelpUtils.logOut = function () {
            if (typeof AccountHelpUtils.authServiceClient !== 'undefined') {
                try {
                    AccountHelpUtils.authServiceClient.logoutAsync();
                }
                catch (ex) {
                    console.log(ex);
                }
            }
        };
        AccountHelpUtils.authServiceRoot = "/Services/AuthenticationService.svc/ajax";
        AccountHelpUtils.credServiceRoot = "/Services/CredentialService.svc/ajax";
        AccountHelpUtils.roleServiceRoot = "/Services/RoleService.svc/ajax";
        return AccountHelpUtils;
    })();
    OEEDemos.AccountHelpUtils = AccountHelpUtils;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=utils.js.map