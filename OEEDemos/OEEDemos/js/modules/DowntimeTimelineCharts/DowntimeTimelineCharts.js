/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var DowntimeTimelineCharts = (function () {
        function DowntimeTimelineCharts() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: OEEDemos.AccountHelpUtils.serviceAddress + OEEDemos.AccountHelpUtils.ppaEntitiesDataRoot
            });
            this.needEquiptree = true;
            this.viewModel = kendo.observable({});
            this.dataItems = new vis.DataSet();
            this.dataGroups = new vis.DataSet();
        }
        DowntimeTimelineCharts.prototype.equipNodeSelect = function (e, sender) {
            var equId = sender.dataItem(e.node).id;
            var equName = sender.dataItem(e.node).text;
            var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DowntimeTimelineCharts");
            dtInstance.refreshData(equId, equName);
        };
        DowntimeTimelineCharts.prototype.timeRangeListner = function (start, end) {
            var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DowntimeTimelineCharts");
            dtInstance.startTime = start;
            dtInstance.endTime = end;
            dtInstance.refreshData();
        };
        DowntimeTimelineCharts.prototype.initChart = function () {
            var container = $('#downtime-timeline-chart')[0];
            var options = {
                orientation: 'top',
                selectable: false
            };
            this.timeline = new vis.Timeline(container, this.dataItems, this.dataGroups, options);
        };
        DowntimeTimelineCharts.prototype.refreshData = function (eqId, eqName) {
            try {
                var allEqu = [], dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DowntimeTimelineCharts"), day = new Date(), start, end;
                day.setDate(day.getDate() - 1);
                start = this.startTime || day;
                end = this.endTime || new Date();
                if (typeof eqId !== "undefined") {
                    allEqu.push({ id: eqId, content: eqName });
                    this.dataGroups.update({ id: eqId, content: eqName });
                }
                else {
                    allEqu = this.dataGroups.get();
                    this.dataItems.clear();
                }
                if (allEqu.length > 0) {
                    for (var i = 0, max = allEqu.length; i < max; i++) {
                        this.ppaServiceContext.PPA_DT_RECORD.filter(function (it) {
                            return it.EQP_NO == this.eqid && it.DT_START_TIME >= this.startDate && it.DT_END_TIME < this.endDate;
                        }, { startDate: start, endDate: end, eqid: allEqu[i].id }).map(function (it) {
                            return {
                                id: it.REC_NO,
                                start: it.DT_START_TIME,
                                end: it.DT_END_TIME,
                                cause: it.DT_CAU_ID,
                                eqp: it.EQP_NO
                            };
                        }).toArray(function (re) {
                            re.forEach(function (it) {
                                dtInstance.dataItems.update({
                                    id: it.id,
                                    start: it.start,
                                    end: it.end,
                                    group: it.eqp,
                                    title: OEEDemos.AppUtils.EquimentsName[it.eqp] + "-" + it.cause + ": \n" + it.start + " - " + it.end,
                                    className: "vis-item-" + it.cause + " aic-vis-item"
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
            this.currentEquipmentId = OEEDemos.StartUp.Instance.currentEquipmentId;
            this.currentEquipmentName = OEEDemos.StartUp.Instance.currentEquipmentName;
            this.startTime = OEEDemos.StartUp.Instance.startTime;
            this.endTime = OEEDemos.StartUp.Instance.endTime;
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            if (this.currentEquipmentId !== "" && this.currentEquipmentName !== "") {
                this.refreshData(this.currentEquipmentId, this.currentEquipmentName);
            }
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        };
        DowntimeTimelineCharts.prototype.update = function () {
            this.currentEquipmentId = OEEDemos.StartUp.Instance.currentEquipmentId;
            this.currentEquipmentName = OEEDemos.StartUp.Instance.currentEquipmentName;
            this.startTime = OEEDemos.StartUp.Instance.startTime;
            this.endTime = OEEDemos.StartUp.Instance.endTime;
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            if (this.currentEquipmentId !== "" && this.currentEquipmentName !== "") {
                this.refreshData(this.currentEquipmentId, this.currentEquipmentName);
            }
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        };
        DowntimeTimelineCharts.prototype.destory = function () {
            this.timeline.destroy();
            this.dataItems.clear();
            this.dataGroups.clear();
            this.currentEquipmentId = "";
            this.currentEquipmentName = "";
            this.startTime = null;
            this.endTime = null;
            kendo.unbind(this.view);
            OEEDemos.StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
            OEEDemos.StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
        };
        return DowntimeTimelineCharts;
    })();
    OEEDemos.DowntimeTimelineCharts = DowntimeTimelineCharts;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=DowntimeTimelineCharts.js.map