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
            var EnergyConsumptionChart = (function (_super) {
                __extends(EnergyConsumptionChart, _super);
                function EnergyConsumptionChart() {
                    _super.call(this, [Html.ChartOptionsContent.chartType, Html.ChartOptionsContent.dataSegSingle, Html.ChartOptionsContent.calcCircle, Html.ChartOptionsContent.dataFilter]);
                    this.allEngDataForShow = {
                        baseData: null,
                        shiftData: null,
                        dateData: null
                    };
                    this.allEngId = [];
                    this.allRec = [];
                    this.allShift = [];
                    this.allDate = [];
                    this.chartType = [{
                            chartTypeName: "折线图",
                            chartTypeValue: Html.ChartType.Line
                        }, {
                            chartTypeName: "柱状图",
                            chartTypeValue: Html.ChartType.Column
                        }];
                    this.circlePickerSeries = [{
                            circleName: '原始记录',
                            circleValue: Html.CircleViews.Original
                        }, {
                            circleName: '班组',
                            circleValue: Html.CircleViews.Shift
                        }, {
                            circleName: '日',
                            circleValue: Html.CircleViews.Day
                        }];
                    $.extend(this.viewModel, kendo.observable({
                        timeTipsStart: "Start",
                        timeTipsEnd: "End",
                        advanceData: function (e) {
                            Module.ModuleLoad.getModuleInstance('EnergyConsumptionChart').redrawChart(Html.RedrawStatu.Advance);
                        },
                        backoffData: function (e) {
                            Module.ModuleLoad.getModuleInstance('EnergyConsumptionChart').redrawChart(Html.RedrawStatu.Advance);
                        },
                    }));
                    this.viewModel.set('selectedCircle', Html.CircleViews.Original);
                    this.viewModel.set('selectedChartType', Html.ChartType.Line);
                }
                EnergyConsumptionChart.prototype.initWidgets = function () {
                    $('#energy-consumption-chart').kendoChart({
                        legend: {
                            visible: false
                        },
                        title: {
                            visible: false
                        },
                        seriesDefaults: {
                            type: 'line'
                        },
                        series: [{
                                field: 'value',
                                name: 'Energy Consumption'
                            }],
                        categoryAxis: [{
                                field: 'categoryName'
                            }],
                        tooltip: {
                            visible: true,
                            template: '#=dataItem.categoryName# : #=dataItem.value#'
                        }
                    });
                };
                EnergyConsumptionChart.prototype.getAllData = function (start, end, equId, callback) {
                    var instance = Module.ModuleLoad.getModuleInstance('EnergyConsumptionChart'), currentData, recString;
                    instance.serviceContext.V_PPA_ENG_RECORD
                        .order('D_RECORD')
                        .filter(function (it) {
                        return it.D_RECORD >= this.start && it.D_RECORD <= this.end && it.EQP_NO == this.equId;
                    }, { start: start, end: end, equId: equId })
                        .map(function (it) {
                        return {
                            recNo: it.REC_NO,
                            recTime: it.D_RECORD,
                            shiftNo: it.SH_NO,
                            engId: it.ENG_ID,
                            quantity: it.QUANTITY,
                            parId: it.PAR_ID,
                            parValue: it.PAR_VALUE,
                            shiftId: it.SH_ID
                        };
                    })
                        .toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        re.forEach(function (it) {
                            currentData = new Html.ConsumptionTimeDataModel(it);
                            recString = currentData.recNo + ":" + it.engId;
                            //根据DEF_ID对原始数据分组
                            if (instance.allRec.indexOf(recString) === -1) {
                                instance.allOrignalData.push(currentData);
                                instance.allRec.push(recString);
                            }
                            if (instance.allEngId.indexOf(it.engId) === -1) {
                                instance.allEngId.push(it.engId);
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
                            start = new Date(re[re.length - 1].recTime.getTime() + 1);
                            instance.getAllData(start, end, equId, callback);
                        }
                    }).fail(function (e) {
                        console.log(e);
                    });
                };
                /**
                 * 数据预处理
                 * 计算各个周期的数据
                 */
                EnergyConsumptionChart.prototype.pretreatData = function (allData) {
                    var instance = Module.ModuleLoad.getModuleInstance('EnergyConsumptionChart'), currentParValue, i, length, shiftString = "", dateString = "", recString = "";
                    instance.allRec = [];
                    instance.allShift = [];
                    instance.allDate = [];
                    instance.allEngDataForShow.baseData = {
                        length: 0
                    };
                    instance.allEngDataForShow.shiftData = {
                        length: 0
                    };
                    instance.allEngDataForShow.dateData = {
                        length: 0
                    };
                    allData.forEach(function (it) {
                        recString = it.recNo + ":" + it.typeId;
                        shiftString = it.shiftNo + ":" + it.typeId;
                        dateString = Web.Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd') + ":" + it.typeId;
                        //统计原始数据
                        instance.allRec[it.typeId] = instance.allRec[it.typeId] || [];
                        if (typeof instance.allEngDataForShow.baseData[recString] === 'undefined') {
                            instance.allEngDataForShow.baseData[recString] = {
                                showName: it.recNo,
                                recTime: it.recTime,
                                quantity: it.quantity
                            };
                            instance.allEngDataForShow.baseData.length++;
                            instance.allRec[it.typeId].push(recString);
                        }
                        else {
                            instance.allEngDataForShow.baseData[recString].quantity += it.quantity;
                        }
                        //统计班组数据
                        instance.allShift[it.typeId] = instance.allShift[it.typeId] || [];
                        if (typeof instance.allEngDataForShow.shiftData[shiftString] === 'undefined') {
                            instance.allEngDataForShow.shiftData[shiftString] = {
                                showName: Web.Utils.DateUtils.format(it.recTime, 'MM-dd') + ":" + it.shiftId,
                                recTime: it.recTime,
                                quantity: it.quantity
                            };
                            instance.allEngDataForShow.shiftData.length++;
                            instance.allShift[it.typeId].push(shiftString);
                        }
                        else {
                            instance.allEngDataForShow.shiftData[shiftString].quantity += it.quantity;
                        }
                        //统计按日计算数据
                        instance.allDate[it.typeId] = instance.allDate[it.typeId] || [];
                        if (typeof instance.allEngDataForShow.dateData[dateString] === 'undefined') {
                            instance.allEngDataForShow.dateData[dateString] = {
                                showName: Web.Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd'),
                                recTime: it.recTime,
                                quantity: it.quantity
                            };
                            instance.allEngDataForShow.dateData.length++;
                            instance.allDate[it.typeId].push(dateString);
                        }
                        else {
                            instance.allEngDataForShow.dateData[dateString].quantity += it.quantity;
                        }
                    });
                };
                EnergyConsumptionChart.prototype.redrawChart = function (redrawStatu) {
                    if (redrawStatu === void 0) { redrawStatu = Html.RedrawStatu.Complete; }
                    var keyArray = [], dataArray = [], maxNum, currentEngId, currentView = parseInt(this.viewModel.get('selectedCircle')), currentEngName = this.viewModel.get('selectedDataSegSingle');
                    currentEngId = Html.StartUp.Instance.allEngId[Html.StartUp.Instance.allEngName.indexOf(currentEngName)];
                    switch (currentView) {
                        case Html.CircleViews.Original:
                            dataArray = this.allEngDataForShow.baseData;
                            keyArray = this.allRec[currentEngId];
                            maxNum = Html.CircleDataNum.Orginal;
                            break;
                        case Html.CircleViews.Shift:
                            dataArray = this.allEngDataForShow.shiftData;
                            keyArray = this.allShift[currentEngId];
                            maxNum = Html.CircleDataNum.Shift;
                            break;
                        case Html.CircleViews.Day:
                            dataArray = this.allEngDataForShow.dateData;
                            keyArray = this.allDate[currentEngId];
                            maxNum = Html.CircleDataNum.Day;
                            break;
                        default: break;
                    }
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
                            if (this.redrawStartPoint > keyArray.length - maxNum + 1) {
                                this.redrawStartPoint = keyArray.length - maxNum + 1;
                                alert("已经到最后！");
                                return;
                            }
                            break;
                        default:
                            this.redrawStartPoint = this.redrawStartPoint || 1;
                            break;
                    }
                    this._redraw(this.redrawStartPoint, maxNum, keyArray, dataArray);
                };
                EnergyConsumptionChart.prototype._redraw = function (startPoint, maxNum, keyArray, dataArray) {
                    var showData = [], minDate = new Date(), maxDate = new Date('1971-01-01'), length, i, key;
                    if (typeof keyArray === 'undefined') {
                        length = 0;
                    }
                    else {
                        length = keyArray.length;
                    }
                    for (i = startPoint - 1; i < length; i++) {
                        key = keyArray[i];
                        var key1 = key.split(':');
                        if (dataArray[key].recTime <= minDate) {
                            minDate = dataArray[key].recTime;
                        }
                        if (dataArray[key].recTime >= maxDate) {
                            maxDate = dataArray[key].recTime;
                        }
                        showData.push({
                            categoryName: dataArray[key].showName,
                            value: dataArray[key].quantity
                        });
                        if (showData.length >= maxNum) {
                            break;
                        }
                    }
                    if (showData.length > 0) {
                        this.viewModel.set('series', showData);
                        this.viewModel.set('timeTipsStart', Web.Utils.DateUtils.format(minDate, 'yyyy-MM-dd'));
                        this.viewModel.set('timeTipsEnd', Web.Utils.DateUtils.format(maxDate, 'yyyy-MM-dd'));
                        this.switchChartType();
                        this.hadData();
                    }
                    else {
                        this.noData();
                    }
                };
                EnergyConsumptionChart.prototype.switchChartType = function () {
                    var currentType = parseInt(this.viewModel.get('selectedChartType')), engCharts = $('#energy-consumption-chart').data('kendoChart');
                    switch (currentType) {
                        case Html.ChartType.Line:
                            engCharts.options.series[0].type = 'line';
                            break;
                        case Html.ChartType.Column:
                            engCharts.options.series[0].type = 'column';
                            break;
                        default: break;
                    }
                    engCharts.refresh();
                };
                EnergyConsumptionChart.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var start = this.startTime || Web.Utils.DateUtils.lastDay(new Date()), end = this.endTime || new Date(), equId = this.equipId;
                    if (typeof equId === "undefined" || equId === "") {
                        this.noData();
                        return;
                    }
                    this.allOrignalData = [];
                    this.allParData = {
                        length: 0
                    };
                    this.allParValueList = {
                        length: 0
                    };
                    this.allEngId = [];
                    this.allRec = [];
                    kendo.ui.progress(this.view, true);
                    try {
                        (function (instance) {
                            instance.getAllData(start, end, equId, function () {
                                var dataSegTemplate, dataFilterTemplate, dataSegRe, dataFilterRe, showRecList, allEngName = [], i, length = instance.allEngId.length, index;
                                $('#data-seg-single').remove();
                                $('#data-filter').remove();
                                instance.viewModel.set('selectedDataFilter', []);
                                dataSegTemplate = kendo.template($('#data-seg-single-list').html());
                                dataFilterTemplate = kendo.template($('#data-filter-list').html());
                                for (i = 0; i < length; i++) {
                                    index = Html.StartUp.Instance.allEngId.indexOf(instance.allEngId[i]);
                                    if (index > -1) {
                                        allEngName.push(Html.StartUp.Instance.allEngName[index]);
                                    }
                                }
                                dataSegRe = dataSegTemplate(allEngName);
                                dataFilterRe = dataFilterTemplate(instance.viewModel.get('dataFilterSeries'));
                                $(dataSegRe).insertAfter($('#chart-type'));
                                $(dataFilterRe).appendTo($('.aic-chart-options'));
                                instance.viewModel.set('selectedDataSegSingle', allEngName[0]);
                                kendo.bind(instance.view, instance.viewModel);
                                if (instance.allOrignalData.length > 0) {
                                    showRecList = instance.filterData();
                                    instance.pretreatData(showRecList);
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
                EnergyConsumptionChart.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                EnergyConsumptionChart.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                EnergyConsumptionChart.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var chart = $('#energy-consumption-chart').data('kendoChart');
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    this.viewModel.set('selectedCircle', Html.CircleViews.Original);
                    this.viewModel.set('selectedChartType', Html.ChartType.Line);
                    this.noData();
                };
                return EnergyConsumptionChart;
            })(Html.OEEChartBase);
            Html.EnergyConsumptionChart = EnergyConsumptionChart;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=EnergyConsumptionChart.js.map