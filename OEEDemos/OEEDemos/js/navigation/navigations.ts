/// <reference path="../reference.ts" />

module OEEDemos{

    export class Navigations {
        view: JQuery;
        dataSource;

        constructor(treeDiv: JQuery, data = null) {
            this.view = treeDiv;

            if (data != null) {
                this.dataSource = data;
            }
        }

        initTree(): void {
            if (this.dataSource != null) {
                this.view.kendoTreeView({
                    dataSource: this.dataSource
                });
            } else {
                alert("NULL");
            }
        }
    }

}