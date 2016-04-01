var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Utils;
        (function (Utils) {
            /**
             * 未完成！！！！
             * 请勿使用！！！
             */
            var AsyncUtils = (function () {
                function AsyncUtils() {
                }
                AsyncUtils.createDeferred = function () {
                    return $.Deferred();
                };
                AsyncUtils.createPromise = function () {
                    return $.Deferred().promise();
                };
                return AsyncUtils;
            })();
        })(Utils = Web.Utils || (Web.Utils = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=AsyncUtils.js.map