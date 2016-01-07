/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var DownTimePieCharts = (function () {
        function DownTimePieCharts() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: OEEDemos.AccountHelpUtils.serviceAddress + OEEDemos.AccountHelpUtils.ppaEntitiesDataRoot
            });
            this.needEquiptree = true;
            this.viewModel = kendo.observable({
                pieChartsSeries: [{
                        id: "无",
                        dtTime: 0,
                        dtCauId: "无",
                        currentPercent: 1,
                        dtTimes: 0
                    }]
            });
        }
        DownTimePieCharts.prototype.timeRangeListner = function (startTime, endTime) {
            var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DownTimePieCharts");
            dtInstance.startTime = startTime;
            dtInstance.endTime = endTime;
            dtInstance.refreshData();
        };
        DownTimePieCharts.prototype.equipNodeSelect = function (e, sender) {
            var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DownTimePieCharts");
            dtInstance.currentEquipment = sender.dataItem(e.node).id;
            dtInstance.refreshData();
        };
        DownTimePieCharts.prototype.initWidget = function () {
            $('#downtime-pie-charts').kendoChart({
                legend: {
                    position: 'bottom'
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        visible: true,
                        background: "transparent",
                        template: "#=dataItem.dtCauId# : \n #=dataItem.dtTimes#次"
                    }
                },
                series: [{
                        type: 'pie',
                        startAngle: 150,
                        categoryField: "dtCauId",
                        field: "dtTimes",
                    }],
                tooltip: {
                    visible: true,
                    template: "#=dataItem.dtCauId# : #=dataItem.dtTimes #次"
                }
            });
            $('#downtime-pie-charts-2').kendoChart({
                legend: {
                    position: 'bottom'
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        visible: true,
                        background: "transparent",
                        template: "#=dataItem.dtCauId# : \n #=dataItem.dtTime#"
                    }
                },
                series: [{
                        type: 'pie',
                        startAngle: 150,
                        categoryField: "dtCauId",
                        field: "dtTime",
                    }],
                tooltip: {
                    visible: true,
                    template: "#=dataItem.dtCauId# : #=dataItem.dtTime #次"
                }
            });
        };
        DownTimePieCharts.prototype.refreshData = function () {
            try {
                var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DownTimePieCharts"), equId = dtInstance.currentEquipment, start, end, day = new Date();
                day.setDate(day.getDate() - 1);
                start = dtInstance.startTime || day;
                end = dtInstance.endTime || new Date();
                if (equId !== "") {
                    dtInstance.ppaServiceContext.PPA_DT_RECORD
                        .filter(function (it) { return it.EQP_NO == this.eqid && it.DT_START_TIME >= this.startTime && it.DT_END_TIME <= this.endTime; }, { eqid: equId, startTime: start, endTime: end })
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
                            $('.downtime-pie-charts-container .aic-overlay').removeClass('hide').addClass('show');
                            dtInstance.viewModel.set("pieChartsSeries", [{
                                    id: "无",
                                    dtTime: 0,
                                    dtCauId: "无",
                                    currentPercent: 1,
                                    dtTimes: 0
                                }]);
                            return;
                        }
                        $('.downtime-pie-charts-container .aic-overlay').removeClass('show').addClass('hide');
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
                                    currentPercent: 0,
                                    dtTimes: 1
                                };
                            }
                            else {
                                hash[it.dtCauId].dtTime += curDtTime;
                                hash[it.dtCauId].dtTimes++;
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
                            currentTime = it.dtTime;
                            it.currentPercent = ((currentTime / totalTime) * 100).toFixed(2);
                            it.dtTime = it.dtTime.toFixed(2);
                        });
                        dtInstance.viewModel.set("pieChartsSeries", data);
                    })
                        .fail(function (e) {
                        $('.downtime-pie-charts-container .aic-overlay').removeClass('hide').addClass('show');
                        dtInstance.viewModel.set("pieChartsSeries", [{
                                id: "无",
                                dtTime: 0,
                                dtCauId: "无",
                                currentPercent: 1,
                                dtTimes: 0
                            }]);
                        alert(e.message);
                    });
                }
                else {
                    dtInstance.viewModel.set("pieChartsSeries", [{
                            id: "无",
                            dtTime: 0,
                            dtCauId: "无",
                            currentPercent: 1,
                            dtTimes: 0
                        }]);
                    $('.downtime-pie-charts-container .aic-overlay').removeClass('hide').addClass('show');
                    return;
                }
            }
            catch (e) {
                console.log(e.toString());
            }
        };
        DownTimePieCharts.prototype.init = function (view) {
            this.view = view;
            this.view.appendTo($('#viewport'));
            this.currentEquipment = OEEDemos.StartUp.Instance.currentEquipmentId;
            this.startTime = OEEDemos.StartUp.Instance.startTime;
            this.endTime = OEEDemos.StartUp.Instance.endTime;
            kendo.bind(this.view, this.viewModel);
            this.initWidget();
            this.refreshData();
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        };
        DownTimePieCharts.prototype.update = function () {
            $('#viewport').append(this.view);
            this.currentEquipment = OEEDemos.StartUp.Instance.currentEquipmentId;
            this.startTime = OEEDemos.StartUp.Instance.startTime;
            this.endTime = OEEDemos.StartUp.Instance.endTime;
            kendo.bind(this.view, this.viewModel);
            this.initWidget();
            this.refreshData();
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        };
        DownTimePieCharts.prototype.destory = function () {
            var chart = $('#downtime-pie-charts').data('kendoChart'), chart2 = $('#downtime-pie-charts-2').data('kendoChart');
            kendo.unbind(this.view);
            chart.destroy();
            chart2.destroy();
            this.currentEquipment = "";
            this.startTime = null;
            this.endTime = null;
            OEEDemos.StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
            OEEDemos.StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
        };
        return DownTimePieCharts;
    })();
    OEEDemos.DownTimePieCharts = DownTimePieCharts;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=DownTimePieCharts.js.map