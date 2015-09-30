/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var OEECharts = (function () {
        function OEECharts() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
            });
            this.viewModel = kendo.observable({
                series: [{
                        oeeStartTime: 0,
                        oeeAVA: 0,
                        oeePER: 0,
                        oeeQUA: 0,
                        oeeCOM: 0
                    }]
            });
        }
        OEECharts.prototype.timeRangeListner = function (startTime, endTime) {
            var oeeCharts = OEEDemos.ModuleLoad.getModuleInstance("OEECharts");
            oeeCharts.startTime = startTime;
            oeeCharts.endTime = endTime;
            oeeCharts.refreshData();
        };
        OEECharts.prototype.equipNodeSelect = function (e, sender) {
            var oeeCharts = OEEDemos.ModuleLoad.getModuleInstance("OEECharts");
            oeeCharts.currentEquipment = sender.dataItem(e.node).id;
            oeeCharts.refreshData();
        };
        OEECharts.prototype.initChart = function () {
            $("#oeeChart").kendoChart({
                title: {
                    text: "OEEDemo Charts"
                },
                legend: {
                    position: "top"
                },
                seriesDefaults: {
                    type: "column"
                },
                series: [{
                        field: "oeeAVA",
                        name: "OEEAVA",
                        color: "#33CC00"
                    }, {
                        field: "oeePER",
                        name: "OEEPER"
                    }, {
                        field: "oeeQUA",
                        name: "OEEQUE"
                    }, {
                        field: "oeeCOM",
                        name: "OEECOM",
                        type: "line",
                        color: "#3333CC"
                    }],
                categoryAxis: [{
                        type: "date",
                        field: "oeeStartTime",
                        baseUnit: "hours",
                        justified: true,
                        labels: {
                            dateFormats: {
                                hours: "M-d HH:mm"
                            },
                            rotation: -90
                        },
                        majorGridLines: {
                            visible: false
                        }
                    }],
                valueAxis: [{
                        labels: {
                            format: "{0}"
                        },
                        majorUnit: 0.1,
                        axisCrossingValue: 0,
                        max: 1.1
                    }],
                tooltip: {
                    visible: true,
                    format: "{0}",
                    template: "#= series.name #: #= value #"
                }
            });
        };
        OEECharts.prototype.refreshData = function () {
            try {
                var startDate = this.startTime;
                var endDate = this.endTime;
                var currentEquipment = this.currentEquipment || "";
                if (currentEquipment != "") {
                    if (typeof startDate === "undefined") {
                        startDate = new Date();
                        startDate.setDate(startDate.getDate() - 1);
                    }
                    if (typeof endDate === "undefined") {
                        endDate = new Date();
                    }
                    kendo.ui.progress($("#oeeChart"), true);
                    this.ppaServiceContext.PPA_OEE_SUMMARY
                        .filter(function (items) {
                        return (items.PER_START_TIME >= this.startDate && items.PER_START_TIME < this.endDate
                            && items.EQP_ID === this.equid);
                    }, {
                        startDate: startDate, endDate: endDate,
                        equid: currentEquipment
                    })
                        .map(function (it) {
                        return {
                            oeeStartTime: it.PER_START_TIME,
                            oeeAVA: it.OEE_AVA,
                            oeePER: it.OEE_PER,
                            oeeQUA: it.OEE_QUA,
                            oeeCOM: it.OEE_COM
                        };
                    })
                        .toArray(function (result) {
                        OEEDemos.ModuleLoad.getModuleInstance(OEEDemos.StartUp.currentInstanceName).viewModel.set("series", result);
                        kendo.ui.progress($("#oeeChart"), false);
                    }).fail(function (e) {
                        kendo.ui.progress($("#oeeChart"), false);
                        alert(e.message);
                    });
                }
                else {
                    //alert("请选择设备！！");
                    return;
                }
            }
            catch (e) {
                console.log(e.toString());
            }
        };
        OEECharts.prototype.init = function (view) {
            this.view = view;
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        };
        OEECharts.prototype.update = function () {
            $('#viewport').append(this.view);
            this.initChart();
            this.refreshData();
            OEEDemos.StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        };
        OEECharts.prototype.destory = function () {
            var chart = $("#oeeChart").data("kendoChart");
            chart.destroy();
            OEEDemos.StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
            OEEDemos.StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
        };
        return OEECharts;
    })();
    OEEDemos.OEECharts = OEECharts;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=OEECharts.js.map