/// <reference path="../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var AppUtils = (function () {
        function AppUtils() {
        }
        AppUtils.getTree = function (data, rootLevel /*, sort = false, sortFun = null*/) {
            //if (sort) {
            //    if (sortFun != null) {
            //        data.sort(sortFun);
            //    } else {
            //        data.sort(function (d1, d2) {
            //            if (d1.parent == d2.parent) {
            //                return d1.id - d2.id;
            //            } else {
            //                return d1.parent - d2.parent;
            //            }
            //        });
            //    }
            //} 
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