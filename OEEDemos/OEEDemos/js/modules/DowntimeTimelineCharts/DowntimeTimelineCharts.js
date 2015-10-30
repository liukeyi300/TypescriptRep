/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var DowntimeTimelineCharts = (function () {
        function DowntimeTimelineCharts() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
            });
            this.needEquiptree = true;
            this.viewModel = kendo.observable({});
            this.dataItems = new vis.DataSet();
            this.dataGroups = new vis.DataSet();
        }
        DowntimeTimelineCharts.prototype.equipNodeSelect = function (e, sender) {
            var equId = sender.dataItem(e.node).id;
            var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DowntimeTimelineCharts");
            dtInstance.refreshData(equId);
        };
        DowntimeTimelineCharts.prototype.timeRangeListner = function (start, end) {
            var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DowntimeTimelineCharts");
            dtInstance.startTime = start;
            dtInstance.endTime = end;
            dtInstance.refreshData();
        };
        DowntimeTimelineCharts.prototype.initChart = function () {
            var container = $('#downtimeTimelineCharts')[0];
            var options = {
                orientation: 'top',
                selectable: false
            };
            this.timeline = new vis.Timeline(container, this.dataItems, this.dataGroups, options);
        };
        DowntimeTimelineCharts.prototype.refreshData = function (eqId) {
            try {
                var allEqu = [];
                var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DowntimeTimelineCharts");
                if (typeof eqId !== "undefined") {
                    allEqu.push({ id: eqId, content: eqId });
                    this.dataGroups.update({ id: eqId, content: eqId });
                }
                else {
                    allEqu = this.dataGroups.get();
                    this.dataItems.clear();
                }
                if (allEqu.length > 0) {
                    var day = new Date();
                    day.setDate(day.getDate() - 1);
                    var start = this.startTime || day;
                    var end = this.endTime || new Date();
                    for (var i = 0, max = allEqu.length; i < max; i++) {
                        this.ppaServiceContext.PPA_DT_RECORD.filter(function (it) {
                            return it.EQP_ID == this.eqid && it.DT_START_TIME >= this.startDate && it.DT_END_TIME < this.endDate;
                        }, { startDate: start, endDate: end, eqid: allEqu[i].id }).map(function (it) {
                            return {
                                id: it.REC_NO,
                                start: it.DT_START_TIME,
                                end: it.DT_END_TIME,
                                cause: it.DT_CAU_ID,
                                eqp: it.EQP_ID
                            };
                        }).toArray(function (re) {
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
                        }).fail(function (e) {
                            alert(e.message);
                        });
                    }
                }
            }
            catch (e) {
                console.log(e.toString());
            }
        };
        DowntimeTimelineCharts.prototype.init = function (view) {
            this.view = view;
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        };
        DowntimeTimelineCharts.prototype.update = function () {
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        };
        DowntimeTimelineCharts.prototype.destory = function () {
            this.timeline.destroy();
            this.dataItems.clear();
            this.dataGroups.clear();
            kendo.unbind(this.view);
            OEEDemos.StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
            OEEDemos.StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
        };
        return DowntimeTimelineCharts;
    })();
    OEEDemos.DowntimeTimelineCharts = DowntimeTimelineCharts;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=DowntimeTimelineCharts.js.map