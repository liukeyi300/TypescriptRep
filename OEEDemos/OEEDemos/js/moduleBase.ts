/// <reference path="reference.ts" />
module OEEDemos {
    export interface ModuleBase {
        ppaServiceContext: AicTech.PPA.DataModel.PPAEntities;
        view: JQuery;
        viewModel: kendo.data.ObservableObject;
        needEquipCheck?: boolean;
        init(view: JQuery): void;
        destory(): void;
        update(): void;
    }
}