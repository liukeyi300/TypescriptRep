/// <reference path="../reference.ts" />

module AicTech.Web.Controls{

    export class TreeView {
        view: JQuery;

        viewModel = kendo.observable({
            treeDataSource: [{
                text: "等待中，请稍后。。。"
            }]
        });

        constructor(treeDiv: JQuery, options?: kendo.ui.TreeViewOptions) {
            this.view = treeDiv;
            this.initView(options);
        }

        private initView(options: kendo.ui.TreeViewOptions): void {
            this.view.attr("data-bind", "source: treeDataSource");
            this.view.kendoTreeView(options);
            kendo.bind(this.view, this.viewModel);
        }

        public getData() {
            return this.viewModel.get("treeDataSource");
        }

        public setData(data) {
            this.viewModel.set("treeDataSource", data);
        }

        public destory() {
            this.viewModel.set("treeDataSource", [{ text: "Please Login!" }]);
            var tree = this.view.data("kendoTreeView");
            kendo.unbind(this.view);
            if (typeof tree !== "undefined") {
                tree.destroy();
            }
        }

        public getTree(): kendo.ui.TreeView {
            var tree = this.view.data('kendoTreeView');
            return tree;
        }
    }

}