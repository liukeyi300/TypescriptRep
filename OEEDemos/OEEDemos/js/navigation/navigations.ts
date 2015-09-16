/// <reference path="../reference.ts" />

module OEEDemos{

    export class Navigations {
        view: JQuery;

        viewModel = kendo.observable({
            treeDataSource: [{
                text: "Please Login!"
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
    }

}