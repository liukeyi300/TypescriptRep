/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var TestModule = (function () {
        function TestModule() {
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
        TestModule.prototype.init = function (view) {
            this.view = view;
            $('#content').append(this.view);
            $("#oeeChart").attr("data-bind", "source:series");
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
            //kendo.bind($("#oeeChart"), this.viewModel);
            try {
                var date = new Date(2015, 9, 2);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();
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
                    OEEDemos.ModuleLoad.getModuleInstance("TestModule").viewModel.set("series", result);
                });
            }
            catch (e) {
                console.log(e.toString());
            }
            kendo.bind(this.view, this.viewModel);
        };
        TestModule.prototype.initChart = function (data) {
            alert("abc");
        };
        TestModule.prototype.update = function () {
            $('#content').append(this.view);
            alert("update");
        };
        TestModule.prototype.destory = function () {
            alert("destory");
        };
        return TestModule;
    })();
    OEEDemos.TestModule = TestModule;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=TestModule.js.map