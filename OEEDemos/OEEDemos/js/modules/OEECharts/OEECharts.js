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
        OEECharts.prototype.initChart = function () {
            $("#oeeChart").kendoChart({
                title: {
                    text: "OEEDemo Charts"
                },
                legend: {
                    position: "top"
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{
                        field: "oeeAVA",
                        name: "OEEAVA"
                    }, {
                        field: "oeePER",
                        name: "OEEPER"
                    }, {
                        field: "oeeQUA",
                        name: "OEEQUE"
                    }, {
                        field: "oeeCOM",
                        name: "OEECOM"
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
                        max: 1.1,
                        line: {
                            visible: false
                        }
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
                var date = new Date(2015, 9, 2);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();
                kendo.ui.progress($("#oeeChart"), true);
                this.ppaServiceContext.PPA_OEE_SUMMARY
                    .filter(function (items) {
                    return (items.PER_START_TIME.year() <= this.year1 && items.PER_START_TIME.month() <= this.month1
                        && items.PER_START_TIME.day() < this.day1);
                }, { day1: day, month1: month, year1: year })
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
                    alert(e.message);
                });
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
        };
        OEECharts.prototype.update = function () {
            $('#viewport').append(this.view);
            this.initChart();
            this.refreshData();
        };
        OEECharts.prototype.destory = function () {
            var chart = $("#oeeChart").data("kendoChart");
            chart.destroy();
        };
        return OEECharts;
    })();
    OEEDemos.OEECharts = OEECharts;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=OEECharts.js.map