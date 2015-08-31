/// <reference path="../reference.ts" />

module OEEDemos{

    export class Navigations {
        view: JQuery;
        dataSource;

        viewModel = kendo.observable({
            data:[]
        });

        constructor(treeDiv: JQuery, data: any) {
            this.view = treeDiv;
            this.dataSource = data;
        }

        initTree(extraOptions = null): void {
            var opt = {
                dataSource: this.dataSource
            };
            if (extraOptions != null) {
                $.extend(true, opt, extraOptions);
            }

            this.view.kendoTreeView(opt);
        }
    }

}