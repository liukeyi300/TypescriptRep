/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var DowntimeColumnCharts = (function () {
        function DowntimeColumnCharts() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
            });
            this.needEquiptree = true;
            this.viewModel = kendo.observable({
                columnChartsSeries: [{
                        id: "",
                        dtTime: 0,
                        dtCauId: "",
                        currentPercent: 0
                    }]
            });
        }
        DowntimeColumnCharts.prototype.timeRangeListner = function (startTime, endTime) {
            //alert("StartTime: " + startTime + ", EndTime: " + endTime);
            //alert("DTCharts.TimeRangeListner");
        };
        DowntimeColumnCharts.prototype.equipNodeSelect = function (e, sender) {
            var equId = sender.dataItem(e.node).id;
            var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DowntimeColumnCharts");
            dtInstance.currentNode = equId;
            dtInstance.ppaServiceContext.PPA_DT_RECORD
                .filter(function (it) { return it.EQP_NO == this.eqid; }, { eqid: equId })
                .map(function (it) {
                return {
                    id: it.EQP_NO,
                    startTime: it.DT_START_TIME,
                    endTime: it.DT_END_TIME,
                    dtCauId: it.DT_CAU_ID,
                    recNo: it.REC_NO
                };
            })
                .toArray(function (re) {
                if (re.length === 0) {
                    alert("There are no DownTime-datas for this equipment!");
                    return;
                }
                var data = [];
                var hash = [];
                var totalTime = 0;
                re.forEach(function (it) {
                    var curDtTime = (it.endTime - it.startTime) / 60000;
                    if (curDtTime < 0) {
                        alert("The Record," + it.recNo + ", is invalid! Its` startTime is bigger than endTime!");
                        return;
                    }
                    totalTime += curDtTime;
                    if (typeof hash[it.dtCauId] === "undefined") {
                        hash[it.dtCauId] = {
                            id: OEEDemos.AppUtils.EquimentsName[it.id],
                            dtTime: curDtTime,
                            dtCauId: it.dtCauId,
                            currentPercent: 0
                        };
                    }
                    else {
                        hash[it.dtCauId].dtTime += curDtTime;
                    }
                });
                var currentTime = 0;
                for (var key in hash) {
                    data.push(hash[key]);
                }
                data.sort(function (a, b) {
                    return a.dtTime - b.dtTime <= 0 ? 1 : -1;
                });
                data.forEach(function (it) {
                    currentTime += it.dtTime;
                    it.currentPercent = ((currentTime / totalTime) * 100).toFixed(2);
                    it.dtTime = it.dtTime.toFixed(2);
                });
                dtInstance.viewModel.set("columnChartsSeries", data);
            })
                .fail(function (e) {
                //kendo.ui.progress($("#oeeChart"), false);
                alert(e.message);
            });
            ;
        };
        DowntimeColumnCharts.prototype.initCharts = function () {
            $("#columnCharts").kendoChart({
                title: {
                    text: "DownTime Column Chart"
                },
                legend: {
                    visible: true,
                    position: "top"
                },
                seriesDefaults: {
                    type: "column"
                },
                series: [{
                        field: "dtTime",
                        name: "DownTime",
                        axis: "dtTime",
                        tooltip: {
                            visible: true,
                            template: "#= dataItem.id # - #= dataItem.dtCauId # : #= value #mins"
                        }
                    }, {
                        field: "currentPercent",
                        name: "DownTime Percent",
                        axis: "totalDtTime",
                        type: "line",
                        tooltip: {
                            visible: true,
                            template: "#= dataItem.currentPercent # %"
                        },
                        color: "#007EFF"
                    }],
                categoryAxis: [{
                        field: "dtCauId",
                        majorGridLines: {
                            visible: false
                        },
                        axisCrossingValue: [0, 10],
                        justified: true
                    }],
                valueAxis: [{
                        name: "dtTime",
                        min: 0
                    }, {
                        name: "totalDtTime",
                        min: 0,
                        max: 110,
                        color: "#007EFF"
                    }]
            });
        };
        DowntimeColumnCharts.prototype.refreshData = function () {
        };
        DowntimeColumnCharts.prototype.init = function (view) {
            this.view = view;
            $('#viewport').append(this.view);
            this.initCharts();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        };
        DowntimeColumnCharts.prototype.update = function () {
            $('#viewport').append(this.view);
            this.initCharts();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        };
        DowntimeColumnCharts.prototype.destory = function () {
            var chart = $("#columnCharts").data("kendoChart");
            kendo.unbind(this.view);
            chart.destroy();
            OEEDemos.StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
            OEEDemos.StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
        };
        return DowntimeColumnCharts;
    })();
    OEEDemos.DowntimeColumnCharts = DowntimeColumnCharts;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=DowntimeColumnCharts.js.map