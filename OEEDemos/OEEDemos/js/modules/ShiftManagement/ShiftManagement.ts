/// <reference path="../../reference.ts" />

module OEEDemos {
    export class ShiftManagement implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
        });
        view: JQuery;
        viewModel: kendo.data.ObservableObject;
        needEquiptree = false;

        constructor() { }

        init(view: JQuery): void {
            this.view = view;
            $('#viewport').append(view);
        }

        update(): void {
            $('#viewport').append(this.view);
        }

        destory(): void {

        }
    }
}