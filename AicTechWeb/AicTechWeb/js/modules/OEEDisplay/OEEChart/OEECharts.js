/// <reference path="../../../reference.ts" />
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
            var OEECharts = (function (_super) {
                __extends(OEECharts, _super);
                function OEECharts() {
                    _super.call(this);
                    this.allSeriesData = [];
                    this.viewModel = kendo.observable({
                        series: [],
                        advanceData: function (e) {
                            Module.ModuleLoad.getModuleInstance('OEECharts').redrawChart(Html.RedrawStatu.Advance);
                        },
                        backoffData: function (e) {
                            Module.ModuleLoad.getModuleInstance('OEECharts').redrawChart(Html.RedrawStatu.Backoff);
                        },
                        timeTipsStart: 'start',
                        timeTipsEnd: 'end',
                        isOverlayShow: true
                    });
                }
                OEECharts.prototype.initWidgets = function () {
                    $("#oee-chart").kendoChart({
                        legend: {
                            position: "top"
                        },
                        seriesDefaults: {
                            type: "column",
                            spacing: 0
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
                                field: "oeeStartTime",
                            }],
                        valueAxis: [{
                                labels: {
                                    format: "{0}"
                                },
                                majorUnit: 0.1,
                                axisCrossingValue: 0
                            }],
                        tooltip: {
                            visible: true,
                            format: "{0}",
                            template: "#= series.name #: #= value #"
                        }
                    });
                };
                /**
                 * 刷新表格数据
                 */
                OEECharts.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var start = this.startTime, end = this.endTime, equId = this.equipId;
                    if (typeof equId === "undefined" || equId === "") {
                        this.noData();
                        return;
                    }
                    this.allSeriesData = [];
                    kendo.ui.progress(this.view, true);
                    try {
                        (function (instance) {
                            instance.getAllData(start, end, equId, function () {
                                if (instance.allSeriesData.length > 0) {
                                    instance.redrawChart();
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
                /**
                 * 获取所有数据
                 */
                OEECharts.prototype.getAllData = function (start, end, equId, callback) {
                    var _this = this;
                    this.serviceContext.PPA_OEE_SUMMARY
                        .order('PER_START_TIME')
                        .filter(function (items) {
                        return (items.PER_START_TIME >= this.startDate && items.PER_START_TIME <= this.endDate
                            && items.EQP_NO == this.equid);
                    }, {
                        startDate: start, endDate: end,
                        equid: equId
                    })
                        .map(function (it) {
                        return {
                            oeeStartTime: it.PER_START_TIME,
                            oeeAVA: it.PPA_AVA,
                            oeePER: it.PPA_PER,
                            oeeQUA: it.PPA_QUA,
                            oeeCOM: it.PPA_COM
                        };
                    })
                        .toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        else {
                            _this.allSeriesData = _this.allSeriesData || [];
                            re.forEach(function (it) {
                                _this.allSeriesData.push(it);
                            });
                            if (re.length < 100) {
                                callback();
                                return;
                            }
                            else {
                                start = new Date(re[re.length - 1].oeeStartTime.getTime() + 1);
                                _this.getAllData(start, end, equId, callback);
                            }
                        }
                    }).fail(function (e) {
                        callback();
                        console.log("error!" + e.toString());
                    });
                };
                /**
                 * 计算重绘参数
                 */
                OEECharts.prototype.redrawChart = function (redrawStatu) {
                    if (redrawStatu === void 0) { redrawStatu = Html.RedrawStatu.Complete; }
                    switch (redrawStatu) {
                        case Html.RedrawStatu.Complete:
                            this.redrawStartPoint = 1;
                            break;
                        case Html.RedrawStatu.Backoff:
                            this.redrawStartPoint--;
                            if (this.redrawStartPoint <= 0) {
                                this.redrawStartPoint = 1;
                                alert("已经到最前！");
                                return;
                            }
                            break;
                        case Html.RedrawStatu.Advance:
                            this.redrawStartPoint++;
                            if (this.redrawStartPoint > this.allSeriesData.length - OEECharts.maxShowDataNum + 1) {
                                this.redrawStartPoint = this.allSeriesData.length - OEECharts.maxShowDataNum + 1;
                                alert("已经到最后！");
                                return;
                            }
                            break;
                        default: break;
                    }
                    this._redraw();
                };
                /**
                 * 重绘图标
                 */
                OEECharts.prototype._redraw = function () {
                    var showData = [], max = OEECharts.maxShowDataNum, allData = this.allSeriesData, start = this.redrawStartPoint, minDate = new Date(), maxDate = new Date('1971-01-01'), length = allData.length, i;
                    for (i = start - 1; i < length; i++) {
                        if (allData[i].oeeStartTime <= minDate) {
                            minDate = allData[i].oeeStartTime;
                        }
                        if (allData[i].oeeStartTime >= maxDate) {
                            maxDate = allData[i].oeeStartTime;
                        }
                        showData.push({
                            oeeStartTime: Web.Utils.DateUtils.format(allData[i].oeeStartTime, 'M-d hh:mm'),
                            oeeAVA: allData[i].oeeAVA,
                            oeePER: allData[i].oeePER,
                            oeeQUA: allData[i].oeeQUA,
                            oeeCOM: allData[i].oeeCOM
                        });
                        if (showData.length >= max) {
                            break;
                        }
                    }
                    if (showData.length > 0) {
                        this.viewModel.set('series', showData);
                        this.viewModel.set('timeTipsStart', Web.Utils.DateUtils.format(minDate, 'yyyy-MM-dd'));
                        this.viewModel.set('timeTipsEnd', Web.Utils.DateUtils.format(maxDate, 'yyyy-MM-dd'));
                        this.hadData();
                    }
                    else {
                        this.noData();
                    }
                };
                OEECharts.prototype.noData = function () {
                    this.viewModel.set('isOverlayShow', true);
                    this.viewModel.set('series', []);
                };
                OEECharts.prototype.hadData = function () {
                    this.viewModel.set('isOverlayShow', false);
                };
                OEECharts.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                OEECharts.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                OEECharts.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var chart = $("#oee-chart").data("kendoChart");
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    this.startTime = null;
                    this.endTime = null;
                };
                OEECharts.maxShowDataNum = 8;
                return OEECharts;
            })(Module.ModuleBase);
            Html.OEECharts = OEECharts;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=OEECharts.js.map