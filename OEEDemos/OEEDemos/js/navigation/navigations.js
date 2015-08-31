/// <reference path="../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var Navigations = (function () {
        function Navigations(treeDiv, data) {
            this.viewModel = kendo.observable({
                data: []
            });
            this.view = treeDiv;
            this.dataSource = data;
        }
        Navigations.prototype.initTree = function (extraOptions) {
            if (extraOptions === void 0) { extraOptions = null; }
            var opt = {
                dataSource: this.dataSource
            };
            if (extraOptions != null) {
                $.extend(true, opt, extraOptions);
            }
            this.view.kendoTreeView(opt);
        };
        return Navigations;
    })();
    OEEDemos.Navigations = Navigations;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=navigations.js.map