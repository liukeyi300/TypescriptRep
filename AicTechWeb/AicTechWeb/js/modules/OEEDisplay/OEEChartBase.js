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
            var OEEChartBase = (function (_super) {
                __extends(OEEChartBase, _super);
                function OEEChartBase(options) {
                    _super.call(this);
                    this.options = options;
                    this.allOrignalData = [];
                    this.chartType = [];
                    this.circlePickerSeries = [];
                    $.extend(this.viewModel, kendo.observable({
                        series: [],
                        isOverlayShow: true,
                        selectedDataFilter: [],
                        dataFilterSeries: [],
                        dataFilterChanged: function (e) {
                            var instance = Module.ModuleLoad.getModuleInstance(Html.StartUp.currentInstanceName), showRecList = [], currentParValue = $('#' + $(e.target).val()).val();
                            if (typeof currentParValue === 'undefined' || currentParValue === '') {
                                return;
                            }
                            showRecList = instance.filterData();
                            instance.pretreatData(showRecList);
                            instance.redrawChart();
                        },
                        filterData: function (e) {
                            var selectedFilter = this.get('selectedDataFilter'), instance = Module.ModuleLoad.getModuleInstance(Html.StartUp.currentInstanceName), showRecList = [];
                            if (selectedFilter.length > 0) {
                                showRecList = instance.filterData();
                                instance.pretreatData(showRecList);
                                instance.redrawChart();
                            }
                        },
                        selectedCalcMethod: 0,
                        calcMethodSelectChanged: function (e) {
                            Module.ModuleLoad.getModuleInstance(Html.StartUp.currentInstanceName).redrawChart();
                        },
                        selectedCircle: Html.CircleViews.Original,
                        countCircleChanged: function (e) {
                            Module.ModuleLoad.getModuleInstance(Html.StartUp.currentInstanceName).redrawChart();
                        },
                        selectedChartType: Html.ChartType.Line,
                        chartTypeChanged: function (e) {
                            Module.ModuleLoad.getModuleInstance(Html.StartUp.currentInstanceName).switchChartType();
                        },
                    }));
                }
                OEEChartBase.prototype.filterData = function () {
                    var selectedPar = [], selectedParId = this.viewModel.get('selectedDataFilter') || [], i, parNum = selectedParId.length, result = [];
                    for (i = 0; i < parNum; i++) {
                        selectedPar.push({
                            parId: selectedParId[i],
                            parValue: $('#' + selectedParId[0]).val()
                        });
                    }
                    result = Web.Utils.ArrayUtils.filterByParameter(this.allOrignalData, selectedPar, this.allParData);
                    return result;
                };
                OEEChartBase.prototype.pretreatData = function (data) { };
                OEEChartBase.prototype.redrawChart = function () {
                    this._redraw();
                };
                OEEChartBase.prototype.switchChartType = function () { };
                /**
                 * 重绘函数
                 */
                OEEChartBase.prototype._redraw = function (startPoint, maxNum, keyArray, dataArray) { };
                OEEChartBase.prototype.noData = function () {
                    this.viewModel.set('isOverlayShow', true);
                    this.viewModel.set('series', []);
                    this.viewModel.set('timeTipsStart', 'start');
                    this.viewModel.set('timeTipsEnd', 'end');
                };
                OEEChartBase.prototype.hadData = function () {
                    this.viewModel.set('isOverlayShow', false);
                };
                OEEChartBase.prototype.addOptions = function () {
                    var container = this.view.find('.aic-chart-options');
                    container.empty();
                    if (this.options.indexOf(Html.ChartOptionsContent.legend) > -1) {
                        var legendTemplate = kendo.template($('#legend-color-list').html()), legendRe, causeStyleArray = [];
                        Html.StartUp.Instance.allCauseStyle.forEach(function (it) {
                            if (it.causeColor !== null) {
                                causeStyleArray.push({
                                    className: 'vis-item-' + it.causeId,
                                    showName: it.causeId
                                });
                            }
                            else {
                                causeStyleArray.push({
                                    className: 'vis-item-default',
                                    showName: it.causeId
                                });
                            }
                        });
                        if (causeStyleArray.length > 0) {
                            legendRe = legendTemplate(causeStyleArray);
                        }
                        container.append($(legendRe));
                    }
                    if (this.options.indexOf(Html.ChartOptionsContent.chartType) > -1) {
                        var chartTypeTemplate = kendo.template($('#chart-type-list').html()), chartRe = chartTypeTemplate(this.chartType);
                        container.append($(chartRe));
                    }
                    if (this.options.indexOf(Html.ChartOptionsContent.dataSegSingle) > -1) {
                        var dataSegSingleTemplate = kendo.template($('#data-seg-single-list').html()), dataSegSingleRe = dataSegSingleTemplate([]);
                        container.append($(dataSegSingleRe));
                    }
                    if (this.options.indexOf(Html.ChartOptionsContent.dataSeg) > -1) {
                        var dataSegTemplate = kendo.template($('#data-seg-list').html()), dataSegRe = dataSegSingleTemplate([]);
                        container.append($(dataSegRe));
                    }
                    if (this.options.indexOf(Html.ChartOptionsContent.calcCircle) > -1) {
                        var countCircleTemplate = kendo.template($('#count-circle-list').html()), calCircleRe = countCircleTemplate(this.circlePickerSeries);
                        container.append($(calCircleRe));
                    }
                    if (this.options.indexOf(Html.ChartOptionsContent.dataGroup) > -1) {
                    }
                    if (this.options.indexOf(Html.ChartOptionsContent.calcMethod) > -1) {
                        var calcMethodTemplate = kendo.template($('#calc-method-list').html()), calcRe = calcMethodTemplate([]);
                        container.append($(calcRe));
                    }
                    if (this.options.indexOf(Html.ChartOptionsContent.dataFilter) > -1) {
                        var dataFilterTemplate = kendo.template($('#data-filter-list').html()), dataFilterRe = dataFilterTemplate([]);
                        container.append($(dataFilterRe));
                    }
                };
                OEEChartBase.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.addOptions();
                };
                return OEEChartBase;
            })(Module.ModuleBase);
            Html.OEEChartBase = OEEChartBase;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=OEEChartBase.js.map