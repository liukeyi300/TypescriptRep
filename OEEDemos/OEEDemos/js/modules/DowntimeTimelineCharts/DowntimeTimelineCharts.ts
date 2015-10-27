/// <reference path="../../reference.ts" />
module OEEDemos {
    export class DowntimeTimelineCharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
        });
        needEquiptree = true;
        view: JQuery;
        viewModel = kendo.observable({});
        startTime: Date;
        endTime: Date;
      
        private dataItems = new vis.DataSet();
        private dataGroups = new vis.DataSet();
        private timeline: vis.Timeline;

        private equipNodeSelect(e: kendo.ui.TreeViewSelectEvent, sender): void {
            var equId = sender.dataItem(e.node).id;
            var dtInstance = ModuleLoad.getModuleInstance("DowntimeTimelineCharts");
            dtInstance.refreshData(equId);
        }

        private timeRangeListner(start: Date, end: Date): void {
            var dtInstance = ModuleLoad.getModuleInstance("DowntimeTimelineCharts");
            dtInstance.startTime = start;
            dtInstance.endTime = end;
            dtInstance.refreshData();
        }

        private initChart(): void {
            var container = $('#downtimeTimelineCharts')[0];
            var options = {
                orientation: 'top',
                selectable: false
            };
            this.timeline = new vis.Timeline(container, this.dataItems, this.dataGroups, options);
        }

        private refreshData(eqId?): void {
            try {
                var allEqu = [];
                var dtInstance = ModuleLoad.getModuleInstance("DowntimeTimelineCharts");
                if (typeof eqId !== "undefined") {
                    allEqu.push({ id: eqId, content: eqId });
                    this.dataGroups.update({ id: eqId, content: eqId });
                } else {
                    allEqu = this.dataGroups.get();
                    this.dataItems.clear();
                }
                if (allEqu.length > 0) {
                    var day = new Date();
                    day.setDate(day.getDate() - 1);
                    var start = this.startTime || day
                    var end = this.endTime || new Date();
                    for (var i = 0, max = allEqu.length; i < max; i++) {
                        this.ppaServiceContext.PPA_DT_RECORD.filter(function (it) {
                            return it.EQP_ID == this.eqid && it.DT_START_TIME >= this.startDate && it.DT_END_TIME < this.endDate;
                        }, { startDate: start, endDate: end, eqid: allEqu[i].id }).map((it) => {
                            return {
                                id: it.REC_NO,
                                start: it.DT_START_TIME,
                                end: it.DT_END_TIME,
                                cause: it.DT_CAU_ID,
                                eqp: it.EQP_ID
                            }
                        }).toArray((re) => {
                            re.forEach(function (it) {
                                dtInstance.dataItems.update({
                                    id: it.id,
                                    start: it.start,
                                    end: it.end,
                                    group: it.eqp,
                                    title: it.eqp + "-" + it.cause + ": \n" + it.start + " - " + it.end,
                                    className: "vis-item-" + it.cause
                                });
                            });
                            dtInstance.timeline.setOptions({
                                start: start,
                                end: end
                            });
                        }).fail(function (e: { message: string }) {
                            alert(e.message);
                        });
                    }
                }
            } catch (e) {
                console.log(e.toString());
            }
        }
        constructor() { }

        init(view: JQuery) {
            this.view = view;
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        }

        update() {
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        }

        destory() {
            this.timeline.destroy();
            this.dataItems.clear();
            this.dataGroups.clear();
            kendo.unbind(this.view);
            StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
            StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
        }
        
    }
}