/// <reference path="../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var Navigations = (function () {
        function Navigations(treeDiv, options) {
            this.viewModel = kendo.observable({
                treeDataSource: [{
                        text: "Waiting..."
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
        //public setStyle(options: kendo.ui.TreeViewOptions): void {
        //    var tree = this.view.data("kendoTreeView");
        //    tree.setOptions(options);
        //}
        Navigations.prototype.destory = function () {
            this.viewModel.set("treeDataSource", [{ text: "Waiting..." }]);
            var tree = this.view.data("kendoTreeView");
            kendo.unbind(this.view);
            tree.destroy();
        };
        return Navigations;
    })();
    OEEDemos.Navigations = Navigations;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=navigations.js.map