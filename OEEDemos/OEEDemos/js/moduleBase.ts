/// <reference path="reference.ts" />
module OEEDemos {
    export interface ModuleBase {
        ppaServiceContext: AicTech.PPA.DataModel.PPAEntities;
        view: JQuery;
        viewModel: kendo.data.ObservableObject;
        needEquiptree: boolean;
        init(view: JQuery): void;
        destory(): void;
        update(): void;
    }

    export class ModuleBaseClass {
        public ppaServiceContext: AicTech.PPA.DataModel.PPAEntities;
        public view: JQuery;
        public viewModel: kendo.data.ObservableObject;

        constructor(viewModel: kendo.data.ObservableObject) {
            this.viewModel = viewModel;
            kendo.bind(this.view, this.viewModel);
        }

        protected init(view: JQuery): void { }

        protected destory(): void { }

        protected update(): void { }
    }
}