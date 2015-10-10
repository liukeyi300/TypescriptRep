/// <reference path="../../reference.ts" />
module OEEDemos {
    export class DowntimeTimelineCharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
        });
        needEquipCheck = true;
        view: JQuery;
        viewModel = kendo.observable({});
        private dataItems;

        private initChart(): void {
            //$("#downtimeTimelineCharts").kendoScheduler({
            //    date: new Date("2015/9/1"),
            //    group: {
            //        resources: ["testRe","testColor"],
            //        orientation:"vertical"
            //    },
            //    editable: false,
            //    views: ["timeline"],
            //    resources: [{
            //        field: "id",
            //        name: "testRe",
            //        dataSource: [{
            //            text:"Filler12313", value:"Filler1123213"
            //        }]
            //    }, {
            //            field: "title",
            //            name: "testColor",
            //            dataSource: [{
            //                text: "Filler12313", value: "Cause1", color: '#CC00CC'
            //            }, {
            //                    text: "Filler12313", value: "Cause2",  color: '#F9F915'
            //                }]
            //    }],
            //    height:"100%"
            //});
            var container = $('#downtimeTimelineCharts')[0];
            var options = {
                orientation:'top'
            };
        }

        private equipNodeSelect(e: kendo.ui.TreeViewSelectEvent, sender): void {
            var equId = sender.dataItem(e.node).id;
            var dtInstance = ModuleLoad.getModuleInstance("DowntimeTimelineCharts");

            dtInstance.currentNode = equId;
            dtInstance.ppaServiceContext.PPA_DT_RECORD
                .filter(function (it) { return it.EQP_ID == this.eqid }, { eqid: equId })
                .map((it) => {
                    return {
                        id: it.EQP_ID,
                        start: it.DT_START_TIME,
                        end: it.DT_END_TIME,
                        title: it.DT_CAU_ID
                    }
                })
                .toArray((re) => {
                    if (re.length === 0) {
                        alert("There are no DownTime-datas for this equipment!");
                        return;
                    }
                    dtInstance.viewModel.set("series", re);
                    var resource = [{
                        field: "id",
                        name: "testRe",
                        dataSource: [{
                            text:re[0].id, value:re[0].id
                        }]
                    }];
                    var groups = {
                        resources: ["testRe"],
                        orientation: "vertical"
                    }
                    var chart = $('#downtimeTimelineCharts').data('kendoScheduler');
                    chart.destroy();
                    kendo.unbind($('#downtimeTimelineCharts'));
                    $('#downtimeTimelineCharts').empty();
                    $("#downtimeTimelineCharts").kendoScheduler({
                        date: new Date("2015/9/1"),
                        workDayStart: new Date("2013/1/1 00:00:00"),
                        workDayEnd: new Date("2013/1/1 23:59:59"),
                        group: groups,
                        editable: false,
                        views: ["timeline"],
                        resources: resource,
                        height: "100%",
                        footer: false
                    });
                    kendo.bind($('#downtimeTimelineCharts'), dtInstance.viewModel);
                
                    $('.k-event-template:not(.k-event-time)').parent('div').each(function () {
                        var time = $(this).find('.k-event-time').text();
                        var title = $(this).find('.k-event-template:not(.k-event-time)').text();
                        $(this).parent('div').removeAttr("title");
                        $(this).parent('div').attr('title', time + " : " + title);
                        $(this).parent('div').css("background-color",'#CC00CC');
                    });
                })
                .fail(function (e: { message: string }) {
                    //kendo.ui.progress($("#oeeChart"), false);
                    alert(e.message);
                });
        }

        constructor() { }

        init(view: JQuery) {
            this.view = view;
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        }

        update() {
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        }

        destory() {
            //var chart = $('#downtimeTimelineCharts').data("kendoScheduler");
            kendo.unbind(this.view);
            //chart.destroy();
            //$('#downtimeTimelineCharts').empty();
            StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
        }
        
    }
}