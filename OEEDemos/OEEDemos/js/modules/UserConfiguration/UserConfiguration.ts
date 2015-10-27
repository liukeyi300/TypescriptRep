module OEEDemos {
    export class UserConfiguration implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
        });
        needEquiptree = false;
        view: JQuery;
        viewModel = kendo.observable({});

        constructor() { }

        init(view: JQuery): void {
            this.view = view;
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
        }

        update(): void {
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
        }

        destory(): void {
            kendo.unbind(this.view);
        }
    }
}