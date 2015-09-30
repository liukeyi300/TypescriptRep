/// <reference path="../../reference.ts" />
module OEEDemos {
    export class DowntimeTimelineCharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
        });
        needEquipCheck = true;
        view: JQuery;
        viewModel = kendo.observable({
            series: [
                {
                    id: 1,
                    start: new Date("2013/6/6 08:00 AM"),
                    end: new Date("2013/6/6 09:00 AM"),
                    title: "Interview",
                    roomId: "r1" // the event is held in "Small meeting room" whose value is 1
                },
                {
                    id: 2,
                    start: new Date("2013/6/6 08:00 AM"),
                    end: new Date("2013/6/6 09:00 AM"),
                    title: "Meeting",
                    roomId: "r2" // the event is held in "Big meeting room" whose value is 2
                }
            ]
        });

        private initChart(): void {
            $("#downtimeTimelineCharts").kendoScheduler({
                date: new Date("2013/6/6"),
                group: {
                    resources: ["Rooms"],
                    orientation:"vertical"
                },
                views: ["timeline"],
                resources: [{
                    field: "roomId",
                    name: "Rooms",
                    dataSource: [{
                        text:"Room1", value:"r1"
                    }, {
                        text:"Room2", value:"r2"
                    }]
                }],
                height:"100%"
            });
        }

        constructor() { }

        init(view: JQuery) {
            this.view = view;
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view.find("#downtimeTimelineCharts"), this.viewModel);
        }

        update() {
            $('#viewport').append(this.view);
            this.initChart();
        }

        destory() { }
        
    }
}