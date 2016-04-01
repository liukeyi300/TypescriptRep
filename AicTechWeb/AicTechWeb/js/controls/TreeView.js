/// <reference path="../reference.ts" />
var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Controls;
        (function (Controls) {
            var TreeView = (function () {
                function TreeView(treeDiv, options) {
                    this.viewModel = kendo.observable({
                        treeDataSource: [{
                                text: "等待中，请稍后。。。"
                            }]
                    });
                    this.view = treeDiv;
                    this.initView(options);
                }
                TreeView.prototype.initView = function (options) {
                    this.view.attr("data-bind", "source: treeDataSource");
                    this.view.kendoTreeView(options);
                    kendo.bind(this.view, this.viewModel);
                };
                TreeView.prototype.getData = function () {
                    return this.viewModel.get("treeDataSource");
                };
                TreeView.prototype.setData = function (data) {
                    this.viewModel.set("treeDataSource", data);
                };
                TreeView.prototype.destory = function () {
                    this.viewModel.set("treeDataSource", [{ text: "Please Login!" }]);
                    var tree = this.view.data("kendoTreeView");
                    kendo.unbind(this.view);
                    if (typeof tree !== "undefined") {
                        tree.destroy();
                    }
                };
                TreeView.prototype.getTree = function () {
                    var tree = this.view.data('kendoTreeView');
                    return tree;
                };
                return TreeView;
            })();
            Controls.TreeView = TreeView;
        })(Controls = Web.Controls || (Web.Controls = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=TreeView.js.map