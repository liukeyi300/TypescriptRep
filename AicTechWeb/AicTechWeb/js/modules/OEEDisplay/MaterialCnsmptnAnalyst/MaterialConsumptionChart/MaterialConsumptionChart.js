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
            var MaterialConsumptionChart = (function (_super) {
                __extends(MaterialConsumptionChart, _super);
                function MaterialConsumptionChart() {
                    _super.call(this, [Html.ChartOptionsContent.chartType, Html.ChartOptionsContent.dataSeg, Html.ChartOptionsContent.calcCircle, Html.ChartOptionsContent.dataFilter]);
                    this.allMatDataForShow = {
                        baseData: null,
                        shiftData: null,
                        dateData: null
                    };
                    this.allDefId = [];
                    this.allRec = [];
                    this.allShift = [];
                    this.allDate = [];
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
                    this.chartType = [{
                            chartTypeName: "折线图",
                            chartTypeValue: Html.ChartType.Line
                        }, {
                            chartTypeName: "柱状图",
                            chartTypeValue: Html.ChartType.Column
                        }];
                    $.extend(this.viewModel, kendo.observable({
                        timeTipsStart: "Start",
                        timeTipsEnd: "End",
                        advanceData: function (e) {
                            Module.ModuleLoad.getModuleInstance('MaterialConsumptionChart').redrawChart(Html.RedrawStatu.Advance);
                        },
                        backoffData: function (e) {
                            Module.ModuleLoad.getModuleInstance('MaterialConsumptionChart').redrawChart(Html.RedrawStatu.Backoff);
                        }
                    }));
                    this.viewModel.set('selectedCircle', Html.CircleViews.Original);
                    this.viewModel.set('selectedChartType', Html.ChartType.Line);
                }
                MaterialConsumptionChart.prototype.initWidgets = function () {
                    $('#mat-consumption-chart').kendoChart({
                        title: {
                            visible: false
                        },
                        legend: {
                            position: 'top'
                        },
                        seriesDefaults: {
                            type: 'line'
                        },
                        series: [],
                        categoryAxis: [{
                                field: 'categoryName'
                            }],
                        tooltip: {
                            visible: true,
                            template: '#: category#: #:value#'
                        }
                    });
                };
                /**
                 * 获取所有数据
                 */
                MaterialConsumptionChart.prototype.getAllData = function (start, end, equId, callback) {
                    var instance = Module.ModuleLoad.getModuleInstance('MaterialConsumptionChart'), currentData, recString;
                    instance.serviceContext.V_PPA_MAT_RECORD
                        .order('D_RECORD')
                        .filter(function (it) {
                        return it.D_RECORD >= this.start && it.D_RECORD <= this.end && it.EQP_NO == this.equId && it.MATC_TYPE == 'c' && it.DEF_ID != null;
                    }, { start: start, end: end, equId: equId })
                        .map(function (it) {
                        return {
                            recNo: it.REC_NO,
                            recTime: it.D_RECORD,
                            shiftNo: it.SH_NO,
                            shiftId: it.SH_ID,
                            shiftStartTime: it.SH_START_TIME,
                            parId: it.PAR_ID,
                            parValue: it.PAR_VALUE,
                            defId: it.DEF_ID,
                            quantity: it.QUANTITY
                        };
                    })
                        .toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        re.forEach(function (it) {
                            currentData = new Html.ConsumptionTimeDataModel(it);
                            recString = currentData.recNo + ":" + it.defId;
                            //根据DEF_ID对原始数据分组
                            if (instance.allRec.indexOf(recString) === -1) {
                                instance.allOrignalData.push(currentData);
                                instance.allRec.push(recString);
                            }
                            if (instance.allDefId.indexOf(it.defId) === -1) {
                                instance.allDefId.push(it.defId);
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
                MaterialConsumptionChart.prototype.pretreatData = function (allData) {
                    var instance = Module.ModuleLoad.getModuleInstance('MaterialConsumptionChart'), currentParValue, i, length, shiftString = "", dateString = "", recString = "";
                    instance.allRec = [];
                    instance.allShift = [];
                    instance.allDate = [];
                    instance.allMatDataForShow.baseData = {
                        length: 0
                    };
                    instance.allMatDataForShow.shiftData = {
                        length: 0
                    };
                    instance.allMatDataForShow.dateData = {
                        length: 0
                    };
                    allData.forEach(function (it) {
                        recString = it.recNo + ":" + it.typeId;
                        shiftString = it.shiftNo + ":" + it.typeId;
                        dateString = Web.Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd') + ":" + it.typeId;
                        //统计原始数据
                        if (typeof instance.allMatDataForShow.baseData[recString] === 'undefined') {
                            instance.allMatDataForShow.baseData[recString] = {
                                showName: it.recNo,
                                recTime: it.recTime,
                                quantity: it.quantity
                            };
                            instance.allMatDataForShow.baseData.length++;
                            instance.allRec.push(recString);
                        }
                        else {
                            instance.allMatDataForShow.baseData[recString].quantity += it.quantity;
                        }
                        //统计班组数据
                        if (typeof instance.allMatDataForShow.shiftData[shiftString] === 'undefined') {
                            instance.allMatDataForShow.shiftData[shiftString] = {
                                showName: Web.Utils.DateUtils.format(it.recTime, 'MM-dd') + ":" + it.shiftId,
                                recTime: it.recTime,
                                quantity: it.quantity
                            };
                            instance.allMatDataForShow.shiftData.length++;
                            instance.allShift.push(shiftString);
                        }
                        else {
                            instance.allMatDataForShow.shiftData[shiftString].quantity += it.quantity;
                        }
                        //统计按日计算数据
                        if (typeof instance.allMatDataForShow.dateData[dateString] === 'undefined') {
                            instance.allMatDataForShow.dateData[dateString] = {
                                showName: Web.Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd'),
                                recTime: it.recTime,
                                quantity: it.quantity
                            };
                            instance.allMatDataForShow.dateData.length++;
                            instance.allDate.push(dateString);
                        }
                        else {
                            instance.allMatDataForShow.dateData[dateString].quantity += it.quantity;
                        }
                    });
                };
                /**
                 * 计算重绘参数
                 */
                MaterialConsumptionChart.prototype.redrawChart = function (redrawStatu) {
                    if (redrawStatu === void 0) { redrawStatu = Html.RedrawStatu.Complete; }
                    var keyArray = [], dataArray = [], maxNum, currentView = parseInt(this.viewModel.get('selectedCircle'));
                    switch (currentView) {
                        case Html.CircleViews.Original:
                            keyArray = this.allRec;
                            dataArray = this.allMatDataForShow.baseData;
                            maxNum = Html.CircleDataNum.Orginal;
                            break;
                        case Html.CircleViews.Shift:
                            keyArray = this.allShift;
                            dataArray = this.allMatDataForShow.shiftData;
                            maxNum = Html.CircleDataNum.Shift;
                            break;
                        case Html.CircleViews.Day:
                            keyArray = this.allDate;
                            dataArray = this.allMatDataForShow.dateData;
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
                            if (typeof keyArray)
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
                MaterialConsumptionChart.prototype._redraw = function (startPoint, maxNum, keyArray, dataArray) {
                    var showData = [], minDate = new Date(), maxDate = new Date('1971-01-01'), length = keyArray.length, i, key, key2, sepKey, index, j, allCheckedDef = this.viewModel.get('selectedDataSeg'), length2 = allCheckedDef.length, valueData = {
                        length: 0
                    }, chart = $('#mat-consumption-chart').data('kendoChart'), newSeries = [], colorString = ['#33CC00', '#3333CC'], value = [];
                    for (i = 0; i < length2; i += 1) {
                        newSeries.push({
                            field: 'value[' + i + ']',
                            name: allCheckedDef[i],
                            color: colorString[i] || null
                        });
                    }
                    for (i = startPoint - 1; i < length; i += 1) {
                        key = keyArray[i];
                        sepKey = key.split(':');
                        index = allCheckedDef.indexOf(sepKey[1]);
                        value = [];
                        if (index === -1) {
                            continue;
                        }
                        if (dataArray[key].recTime <= minDate) {
                            minDate = dataArray[key].recTime;
                        }
                        if (dataArray[key].recTime >= maxDate) {
                            maxDate = dataArray[key].recTime;
                        }
                        value[index] = dataArray[key].quantity;
                        if (typeof valueData[dataArray[key].showName] === 'undefined') {
                            valueData[dataArray[key].showName] = value;
                            valueData.length++;
                        }
                        else {
                            valueData[dataArray[key].showName][index] = dataArray[key].quantity;
                        }
                        if (valueData.length >= maxNum) {
                            break;
                        }
                    }
                    for (var keys in valueData) {
                        if (keys !== 'length') {
                            showData.push({
                                categoryName: keys,
                                value: valueData[keys]
                            });
                        }
                    }
                    chart.setOptions({
                        series: newSeries
                    });
                    chart.refresh();
                    if (showData.length <= 0) {
                        this.noData();
                    }
                    else {
                        this.viewModel.set('series', showData);
                        this.viewModel.set('timeTipsStart', Web.Utils.DateUtils.format(minDate, 'yyyy-MM-dd'));
                        this.viewModel.set('timeTipsEnd', Web.Utils.DateUtils.format(maxDate, 'yyyy-MM-dd'));
                        this.switchChartType();
                        this.hadData();
                    }
                };
                MaterialConsumptionChart.prototype.switchChartType = function () {
                    var chartTypeValue = parseInt(this.viewModel.get('selectedChartType')), chart = $('#mat-consumption-chart').data('kendoChart'), length = chart.options.series.length, i;
                    switch (chartTypeValue) {
                        case Html.ChartType.Column:
                            for (i = 0; i < length; i++) {
                                chart.options.series[i].type = 'column';
                            }
                            break;
                        case Html.ChartType.Line:
                            for (i = 0; i < length; i++) {
                                chart.options.series[i].type = 'line';
                            }
                            break;
                        default: break;
                    }
                    chart.refresh();
                };
                MaterialConsumptionChart.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var start = this.startTime || Web.Utils.DateUtils.lastDay(new Date()), end = this.endTime || new Date(), equId = this.equipId;
                    if (typeof equId === 'undefined' || equId === '') {
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
                    this.allDefId = [];
                    this.allRec = [];
                    kendo.ui.progress(this.view, true);
                    try {
                        (function (instance) {
                            instance.getAllData(start, end, equId, function () {
                                var dataSegTemplate, dataFilterTemplate, dataSegRe, dataFilterRe, showRecList;
                                $('#data-seg').remove();
                                $('#data-filter').remove();
                                instance.viewModel.set('selectedDataFilter', []);
                                dataSegTemplate = kendo.template($('#data-seg-list').html());
                                dataFilterTemplate = kendo.template($('#data-filter-list').html());
                                dataSegRe = dataSegTemplate(instance.allDefId);
                                dataFilterRe = dataFilterTemplate(instance.viewModel.get('dataFilterSeries'));
                                $(dataSegRe).insertAfter($('#chart-type'));
                                $(dataFilterRe).appendTo($('.aic-chart-options'));
                                instance.viewModel.set('selectedDataSeg', [instance.allDefId[0]]);
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
                MaterialConsumptionChart.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                MaterialConsumptionChart.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                MaterialConsumptionChart.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var chart = $('#mat-consumption-chart').data('kendoChart');
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    this.viewModel.set('selectedCircle', Html.CircleViews.Original);
                    this.viewModel.set('selectedChartType', Html.ChartType.Line);
                    this.noData();
                };
                return MaterialConsumptionChart;
            })(Html.OEEChartBase);
            Html.MaterialConsumptionChart = MaterialConsumptionChart;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=MaterialConsumptionChart.js.map