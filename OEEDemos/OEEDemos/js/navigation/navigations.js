/// <reference path="../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var Navigations = (function () {
        function Navigations(treeDiv, options) {
            this.viewModel = kendo.observable({
                treeDataSource: [{
                        text: "Please Login!"
                    }]
            });
            this.view = treeDiv;
            this.initView(options);
        }
        Navigations.prototype.initView = function (options) {
            this.view.attr("data-bind", "source: treeDataSource");
            this.view.kendoTreeView(options);
            kendo.bind(this.view, this.viewModel);
        };
        Navigations.prototype.getData = function () {
            return this.viewModel.get("treeDataSource");
        };
        Navigations.prototype.setData = function (data) {
            this.viewModel.set("treeDataSource", data);
        };
        return Navigations;
    })();
    OEEDemos.Navigations = Navigations;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=navigations.js.map