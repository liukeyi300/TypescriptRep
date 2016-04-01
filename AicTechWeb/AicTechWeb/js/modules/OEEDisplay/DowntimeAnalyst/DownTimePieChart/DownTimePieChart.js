var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../../reference.ts" />
var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Html;
        (function (Html) {
            var DownTimePieChart = (function (_super) {
                __extends(DownTimePieChart, _super);
                function DownTimePieChart() {
                    _super.call(this);
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
                DownTimePieChart.prototype.initWidgets = function () {
                    $('#downtime-pie-chart').kendoChart({
                        title: {
                            text: "设备停机时间(次数)"
                        },
                        legend: {
                            position: 'bottom'
                        },
                        chartArea: {
                            background: ""
                        },
                        seriesDefaults: {
                            labels: {
                                visible: false
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
                    $('#downtime-pie-chart-2').kendoChart({
                        title: {
                            text: "设备停机时间(分钟)"
                        },
                        legend: {
                            position: 'bottom'
                        },
                        chartArea: {
                            background: ""
                        },
                        seriesDefaults: {
                            labels: {
                                visible: false
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
                            template: "#=dataItem.dtCauId# : #=dataItem.dtTime #分钟"
                        }
                    });
                };
                DownTimePieChart.prototype.refreshData = function () {
                    try {
                        _super.prototype.refreshData.call(this);
                        var start = this.startTime || Web.Utils.DateUtils.lastDay(new Date()), endTime = this.endTime || new Date(), equId = this.equipId, instance = Module.ModuleLoad.getModuleInstance("DownTimePieChart");
                        if (typeof equId === "undefined" || equId === "") {
                            this.viewModel.set('isOverlayShow', true);
                            return;
                        }
                        if (equId !== "") {
                            instance.serviceContext.PPA_DT_RECORD
                                .filter(function (it) { return it.EQP_NO == this.eqid && it.DT_START_TIME >= this.startTime && it.DT_END_TIME <= this.endTime; }, { eqid: equId, startTime: start, endTime: endTime })
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
                                    $('.downtime-pie-chart-container .aic-overlay').removeClass('hide').addClass('show');
                                    instance.viewModel.set("pieChartsSeries", [{
                                            id: "无",
                                            dtTime: 0,
                                            dtCauId: "无",
                                            currentPercent: 1,
                                            dtTimes: 0
                                        }]);
                                    return;
                                }
                                $('.downtime-pie-chart-container .aic-overlay').removeClass('show').addClass('hide');
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
                                            id: Web.Utils.TreeUtils.EquimentsName[it.id],
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
                                instance.viewModel.set("pieChartsSeries", data);
                            })
                                .fail(function (e) {
                                $('.downtime-pie-chart-container .aic-overlay').removeClass('hide').addClass('show');
                                instance.viewModel.set("pieChartsSeries", [{
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
                            instance.viewModel.set("pieChartsSeries", [{
                                    id: "无",
                                    dtTime: 0,
                                    dtCauId: "无",
                                    currentPercent: 1,
                                    dtTimes: 0
                                }]);
                            $('.downtime-pie-chart-container .aic-overlay').removeClass('hide').addClass('show');
                            return;
                        }
                    }
                    catch (e) {
                        console.log(e.toString());
                    }
                };
                DownTimePieChart.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    kendo.bind(this.view, this.viewModel);
                    this.initWidgets();
                    this.refreshData();
                };
                DownTimePieChart.prototype.update = function () {
                    _super.prototype.update.call(this);
                    kendo.bind(this.view, this.viewModel);
                    this.initWidgets();
                    this.refreshData();
                };
                DownTimePieChart.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var chart = $('#downtime-pie-chart').data('kendoChart'), chart2 = $('#downtime-pie-chart-2').data('kendoChart');
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    if (typeof chart2 !== 'undefined') {
                        chart2.destroy();
                    }
                };
                return DownTimePieChart;
            })(Module.ModuleBase);
            Html.DownTimePieChart = DownTimePieChart;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=DownTimePieChart.js.map