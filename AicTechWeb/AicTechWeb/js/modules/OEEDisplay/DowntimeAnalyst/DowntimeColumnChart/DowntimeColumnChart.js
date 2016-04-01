/// <reference path="../../../../reference.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Html;
        (function (Html) {
            var DowntimeColumnChart = (function (_super) {
                __extends(DowntimeColumnChart, _super);
                function DowntimeColumnChart() {
                    _super.call(this, [Html.ChartOptionsContent.calcMethod, Html.ChartOptionsContent.dataFilter]);
                    this.allKeys = [];
                    this.totalTime = 0;
                    this.totalTimes = 0;
                    this.allRec = [];
                }
                DowntimeColumnChart.prototype.initWidgets = function () {
                    $("#downtime-column-chart").kendoChart({
                        legend: {
                            visible: true,
                            position: "top"
                        },
                        seriesDefaults: {
                            type: "column"
                        },
                        series: [{
                                field: "dtTime",
                                name: "停机时间",
                                axis: "dtTime",
                                tooltip: {
                                    visible: true,
                                    template: "#= dataItem.showName # - #= dataItem.dtCauId # : #= value #mins"
                                }
                            }, {
                                field: "currentPercent",
                                name: "停机时间占比",
                                axis: "dtPercent",
                                type: "line",
                                tooltip: {
                                    visible: true,
                                    template: "#= dataItem.showName # : #= dataItem.currentPercent # %"
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
                                name: "dtPercent",
                                min: 0,
                                max: 105,
                                color: "#007EFF"
                            }]
                    });
                };
                /**
                 * 获取所有数据
                 */
                DowntimeColumnChart.prototype.getAllData = function (start, end, equId, callback) {
                    var _this = this;
                    var instance = Module.ModuleLoad.getModuleInstance('DowntimeColumnChart'), currentData, recString;
                    instance.serviceContext.V_PPA_DT_RECORD
                        .order('DT_START_TIME').
                        filter(function (items) {
                        return (items.DT_START_TIME >= this.startDate && items.DT_END_TIME <= this.endDate
                            && items.EQP_NO == this.equid);
                    }, { startDate: start, endDate: end, equid: equId })
                        .map(function (it) {
                        return {
                            recTime: it.DT_START_TIME,
                            startTime: it.DT_START_TIME,
                            endTime: it.DT_END_TIME,
                            dtCause: it.DT_CAU_ID,
                            recNo: it.REC_NO,
                            parId: it.PAR_ID,
                            parValue: it.PAR_VALUE
                        };
                    })
                        .toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        else {
                            re.forEach(function (it) {
                                currentData = new Html.Downtime(it);
                                recString = currentData.recNo;
                                if (instance.allRec.indexOf(recString) === -1) {
                                    instance.allOrignalData.push(currentData);
                                    instance.allRec.push(recString);
                                }
                                var dataGroup = instance.viewModel.get('dataFilterSeries');
                                if (it.parId != null) {
                                    if (dataGroup.indexOf(it.parId) === -1) {
                                        dataGroup.push(it.parId);
                                        instance.viewModel.set('dataFilterSeries', dataGroup);
                                        instance.allParData.length++;
                                    }
                                    instance.allParData[it.parId + ""] = instance.allParData[it.parId + ""] || [];
                                    instance.allParData[it.parId + ""].push({
                                        recNo: it.recNo,
                                        parValue: it.parValue
                                    });
                                    instance.allParValueList[it.parId + ""] = instance.allParValueList[it.parId + ""] || [];
                                    if (instance.allParValueList[it.parId + ""].indexOf(it.parValue) === -1) {
                                        instance.allParValueList[it.parId + ""].push(it.parValue);
                                    }
                                }
                            });
                            if (re.length < 100) {
                                callback();
                                return;
                            }
                            else {
                                start = new Date(re[re.length - 1].startTime.getTime() + 1);
                                _this.getAllData(start, end, equId, callback);
                            }
                        }
                    }).fail(function (e) {
                        callback();
                        console.log("error!" + e.toString());
                    });
                };
                /**
                * 数据预处理
                * 计算各个周期的数据
                */
                DowntimeColumnChart.prototype.pretreatData = function (allData) {
                    var instance = Module.ModuleLoad.getModuleInstance('DowntimeColumnChart'), dtTime;
                    this.allSeriesData = {
                        length: 0
                    };
                    this.allKeys = [];
                    this.totalTime = 0;
                    this.totalTimes = 0;
                    this.allKeys = [];
                    allData.forEach(function (it) {
                        if (it.endTime !== null) {
                            dtTime = (it.endTime.getTime() - it.startTime.getTime()) / 60000;
                            if (dtTime >= 0) {
                                instance.totalTime += dtTime;
                                instance.totalTimes++;
                                if (typeof instance.allSeriesData[it.dtCause + ""] === "undefined") {
                                    instance.allSeriesData[it.dtCause + ""] = {
                                        showName: Html.StartUp.Instance.currentEquipmentName,
                                        dtTime: dtTime,
                                        dtCauId: it.dtCause,
                                        currentPercent: 0,
                                        times: 1
                                    };
                                    instance.allSeriesData.length++;
                                    instance.allKeys.push(it.dtCause);
                                }
                                else {
                                    instance.allSeriesData[it.dtCause + ""].dtTime += dtTime;
                                    instance.allSeriesData[it.dtCause + ""].times++;
                                }
                            }
                            else {
                                alert("该记录：" + it.recNo + "无效，将不会被记录到计算结果中！\n原因：起始时间小于结束时间\n");
                            }
                        }
                    });
                };
                /**
                 * 重绘图表
                 */
                DowntimeColumnChart.prototype._redraw = function () {
                    var showData = [], currentTime = 0, currentCalcMethod = parseInt(this.viewModel.get('selectedCalcMethod')), chart = $('#downtime-column-chart').data('kendoChart'), chartSeries = chart.options.series;
                    for (var key in this.allSeriesData) {
                        if (key === "length") {
                            continue;
                        }
                        showData.push(this.allSeriesData[key]);
                    }
                    if (currentCalcMethod === 1) {
                        showData.sort(function (a, b) {
                            return b.dtTime - a.dtTime;
                        });
                        for (var i = 0, length = showData.length; i < length; i++) {
                            currentTime += parseFloat(showData[i].dtTime);
                            showData[i].currentPercent = (currentTime * 100 / this.totalTime).toFixed(2);
                            showData[i].dtTime = parseFloat(showData[i].dtTime).toFixed(2);
                        }
                        chartSeries[0].name = "停机时间";
                        chartSeries[0].field = "dtTime";
                        chartSeries[0].tooltip.template = "#= dataItem.showName # - #= dataItem.dtCauId # : #= value #mins";
                    }
                    else {
                        showData.sort(function (a, b) {
                            return b.times - a.times;
                        });
                        for (var i = 0, length = showData.length; i < length; i++) {
                            currentTime += showData[i].times;
                            showData[i].currentPercent = (currentTime * 100 / this.totalTimes).toFixed(2);
                        }
                        chartSeries[0].name = "停机次数";
                        chartSeries[0].field = 'times';
                        chartSeries[0].tooltip.template = "#= dataItem.showName # - #= dataItem.dtCauId # : #= value #次";
                    }
                    if (showData.length > 0) {
                        chart.setOptions({
                            series: chartSeries
                        });
                        chart.refresh();
                        this.viewModel.set('series', showData);
                        this.hadData();
                    }
                    else {
                        this.noData();
                    }
                };
                //#region override methods
                /**
                 * 刷新图表数据
                 */
                DowntimeColumnChart.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var start = this.startTime || Web.Utils.DateUtils.lastDay(new Date()), endTime = this.endTime || new Date(), equId = this.equipId;
                    if (typeof equId === "undefined" || equId === "") {
                        this.viewModel.set('isOverlayShow', true);
                        return;
                    }
                    this.allOrignalData = [];
                    this.allParData = {
                        length: 0
                    };
                    this.allParValueList = {
                        length: 0
                    };
                    this.allRec = [];
                    kendo.ui.progress(this.view, true);
                    try {
                        (function (instance) {
                            instance.getAllData(start, endTime, equId, function () {
                                var dataFilterTemplate, dataFilterRe, showRecList;
                                $('#data-filter').remove();
                                instance.viewModel.set('selectedDataFilter', []);
                                dataFilterTemplate = kendo.template($('#data-filter-list').html());
                                dataFilterRe = dataFilterTemplate(instance.viewModel.get('dataFilterSeries'));
                                $(dataFilterRe).appendTo($('.aic-chart-options'));
                                kendo.bind(instance.view, instance.viewModel);
                                if (instance.allOrignalData.length > 0) {
                                    showRecList = instance.filterData();
                                    instance.pretreatData(showRecList);
                                    instance._redraw();
                                }
                                else {
                                    instance.noData();
                                }
                                kendo.ui.progress(instance.view, false);
                            });
                        })(this);
                    }
                    catch (e) {
                        console.log(e);
                    }
                };
                DowntimeColumnChart.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                DowntimeColumnChart.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                DowntimeColumnChart.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var chart = $("#downtime-column-chart").data("kendoChart");
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    this.noData();
                    this.viewModel.set('selectedCalcMethod', 0);
                };
                return DowntimeColumnChart;
            })(Html.OEEChartBase);
            Html.DowntimeColumnChart = DowntimeColumnChart;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=DowntimeColumnChart.js.map