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
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=utils.js.map