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
            var AverageRangeChart = (function (_super) {
                __extends(AverageRangeChart, _super);
                function AverageRangeChart() {
                    _super.call(this, [Html.ChartOptionsContent.dataSegSingle, Html.ChartOptionsContent.dataFilter]);
                    this.allAvgRngForShow = [];
                    this.allRec = [];
                    this.dataSegSingle = ['Qualify', 'Scrap', 'Rework'];
                    $.extend(this.viewModel, kendo.observable({
                        timeTipsStart: "Start",
                        timeTipsEnd: "End",
                        advanceData: function (e) {
                            var instance = Module.ModuleLoad.getModuleInstance('AverageRangeChart');
                            instance.redrawChart(Html.RedrawStatu.Advance);
                        },
                        backoffData: function (e) {
                            var instance = Module.ModuleLoad.getModuleInstance('AverageRangeChart');
                            instance.redrawChart(Html.RedrawStatu.Backoff);
                        },
                        sampleNum: 5,
                        sampleNumChanged: function (e) {
                            var instance = Module.ModuleLoad.getModuleInstance('AverageRangeChart'), showRecList = [];
                            showRecList = instance.filterData();
                            instance.pretreatData(showRecList);
                            instance.redrawChart();
                        },
                        meanValue: 0,
                        sigmaValue: 0,
                        uclValue: 0,
                        lclValue: 0,
                        singleSigma: 0,
                        doubleSigma: 0,
                        tripleSigma: 0
                    }));
                    this.viewModel.set('selectedDataSegSingle', 'Qualify');
                }
                AverageRangeChart.prototype.initWidgets = function () {
                    $('#avg-chart').kendoChart({
                        title: {
                            visible: true,
                            text: '均值',
                            align: 'left'
                        },
                        legend: {
                            visible: false
                        },
                        series: [{
                                field: 'avgValue',
                                name: '均值',
                                type: 'line',
                                axis: 'avg'
                            }],
                        categoryAxis: [{
                                field: 'categoryName',
                                axisCrossingValue: [0],
                                visible: false
                            }],
                        valueAxis: [{
                                name: 'avg'
                            }],
                        tooltip: {
                            visible: true,
                            template: '#=dataItem.categoryName# : #=dataItem.avgValue#'
                        }
                    });
                    $('#range-chart').kendoChart({
                        title: {
                            visible: true,
                            text: '极差',
                            align: 'left'
                        },
                        legend: {
                            visible: false
                        },
                        series: [{
                                field: 'rangeValue',
                                name: '极差',
                                type: 'line'
                            }],
                        categoryAxis: [{
                                field: 'categoryName',
                                visible: false
                            }],
                        tooltip: {
                            visible: true,
                            template: '#=dataItem.categoryName# : #=dataItem.rangeValue#'
                        }
                    });
                };
                AverageRangeChart.prototype.noData = function () {
                    _super.prototype.noData.call(this);
                    this.viewModel.set('meanValue', 0);
                    this.viewModel.set('sigmaValue', 0);
                    this.viewModel.set('uclValue', 0);
                    this.viewModel.set('lclValue', 0);
                    this.viewModel.set('singleSigma', 0);
                    this.viewModel.set('doubleSigma', 0);
                    this.viewModel.set('tripleSigma', 0);
                };
                AverageRangeChart.prototype.getAllData = function (start, end, equId, callback) {
                    var instance = Module.ModuleLoad.getModuleInstance('AverageRangeChart'), currentData, recString;
                    instance.serviceContext.V_PPA_QA_RECORD
                        .order('D_RECORD')
                        .filter(function (it) {
                        return it.D_RECORD >= this.start && it.D_RECORD <= this.end && it.EQP_NO == this.equId;
                    }, { start: start, end: end, equId: equId })
                        .map(function (it) {
                        return {
                            recNo: it.REC_NO,
                            recTime: it.D_RECORD,
                            qualify: it.QUALIFY,
                            rework: it.REWORK,
                            scrap: it.SCRAP,
                            parId: it.PAR_ID,
                            parValue: it.PAR_VALUE
                        };
                    }).toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        re.forEach(function (it) {
                            currentData = new Html.QualifyAvgAnalystDataModel(it);
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
                            start = new Date(re[re.length - 1].recTime.getTime() + 1);
                            instance.getAllData(start, end, equId, callback);
                        }
                    }).fail(function (e) {
                        console.log(e);
                    });
                };
                /**
                * 数据预处理
                * 计算均值，极差，标准差
                */
                AverageRangeChart.prototype.pretreatData = function (allData) {
                    var instance = Module.ModuleLoad.getModuleInstance('AverageRangeChart'), currentParValue, dataForShow = [], i, j, cnt, maxQ, minQ, maxS, minS, maxR, minR, totalQ = 0, totalS = 0, totalR = 0, sampleNum = parseInt(instance.viewModel.get('sampleNum')), length = Math.floor(allData.length / sampleNum);
                    instance.qualifyAvg = 0;
                    instance.scrapAvg = 0;
                    instance.reworkAvg = 0;
                    for (i = 0; i < length; i++) {
                        maxQ = 0;
                        minQ = allData[i * sampleNum].qualify;
                        maxS = 0;
                        minS = allData[i * sampleNum].scrap;
                        maxR = 0;
                        minR = allData[i * sampleNum].rework;
                        for (j = 0; j < sampleNum; j++) {
                            cnt = i * sampleNum + j;
                            if (allData[cnt].qualify < minQ) {
                                minQ = allData[cnt].qualify;
                            }
                            if (allData[cnt].qualify > maxQ) {
                                maxQ = allData[cnt].qualify;
                            }
                            if (allData[cnt].scrap < minS) {
                                minS = allData[cnt].scrap;
                            }
                            if (allData[cnt].scrap > maxS) {
                                maxS = allData[cnt].scrap;
                            }
                            if (allData[cnt].rework < minR) {
                                minR = allData[cnt].rework;
                            }
                            if (allData[cnt].rework > maxR) {
                                maxR = allData[cnt].rework;
                            }
                            if (typeof dataForShow[i] === 'undefined') {
                                dataForShow[i] = {
                                    recTime: allData[cnt].recTime,
                                    showName: Web.Utils.DateUtils.format(allData[cnt].recTime, 'MM-dd hh:mm'),
                                    qualify: allData[cnt].qualify,
                                    scrap: allData[cnt].scrap,
                                    rework: allData[cnt].rework,
                                    rangeQ: 0,
                                    rangeS: 0,
                                    rangeR: 0
                                };
                            }
                            else {
                                dataForShow[i].qualify += allData[cnt].qualify;
                                dataForShow[i].scrap += allData[cnt].scrap;
                                dataForShow[i].rework += allData[cnt].rework;
                            }
                        }
                        dataForShow[i].qualify /= sampleNum;
                        dataForShow[i].scrap /= sampleNum;
                        dataForShow[i].rework /= sampleNum;
                        dataForShow[i].rangeQ = maxQ - minQ;
                        dataForShow[i].rangeS = maxS - minS;
                        dataForShow[i].rangeR = maxR - minR;
                        totalQ += dataForShow[i].qualify;
                        totalS += dataForShow[i].scrap;
                        totalR += dataForShow[i].rework;
                    }
                    instance.qualifyAvg = totalQ / length;
                    instance.scrapAvg = totalS / length;
                    instance.reworkAvg = totalR / length;
                    if (dataForShow.length <= 1) {
                        instance.qualifySigma = -1;
                        instance.scrapSigma = -1;
                        instance.reworkSigma = -1;
                    }
                    else {
                        instance.qualifySigma = 0;
                        instance.scrapSigma = 0;
                        instance.reworkSigma = 0;
                        for (i = 0; i < length; i++) {
                            instance.qualifySigma += Math.pow(dataForShow[i].qualify - instance.qualifyAvg, 2);
                            instance.scrapSigma += Math.pow(dataForShow[i].scrap - instance.scrapAvg, 2);
                            instance.reworkSigma += Math.pow(dataForShow[i].rework - instance.reworkAvg, 2);
                        }
                        instance.qualifySigma = Math.sqrt(instance.qualifySigma / (length - 1));
                        instance.scrapSigma = Math.sqrt(instance.scrapSigma / (length - 1));
                        instance.reworkSigma = Math.sqrt(instance.reworkSigma / (length - 1));
                    }
                    instance.allAvgRngForShow = dataForShow;
                };
                /**
                * 计算重绘参数
                */
                AverageRangeChart.prototype.redrawChart = function (redrawStatu) {
                    if (redrawStatu === void 0) { redrawStatu = Html.RedrawStatu.Complete; }
                    var maxNum = 15;
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
                            if (this.redrawStartPoint > this.allAvgRngForShow.length - maxNum + 1) {
                                this.redrawStartPoint = this.allAvgRngForShow.length - maxNum + 1;
                                alert("已经到最后！");
                                return;
                            }
                            break;
                        default:
                            this.redrawStartPoint = this.redrawStartPoint > 0 ? this.redrawStartPoint : 1;
                            break;
                    }
                    this._redraw(this.redrawStartPoint, maxNum);
                };
                /**
                 * 重绘图表
                 */
                AverageRangeChart.prototype._redraw = function (startPoint, maxNum) {
                    var instance = Module.ModuleLoad.getModuleInstance('AverageRangeChart'), showData = [], minDate = new Date(), maxDate = new Date('1971-01-01'), length = instance.allAvgRngForShow.length, i, dataSeg = instance.viewModel.get('selectedDataSegSingle'), avgChart = $('#avg-chart').data('kendoChart'), avgValue, sigmaValue, axisMin, axisMax;
                    switch (dataSeg) {
                        case "Qualify":
                            for (i = startPoint - 1; i < length; i++) {
                                if (instance.allAvgRngForShow[i].recTime <= minDate) {
                                    minDate = instance.allAvgRngForShow[i].recTime;
                                }
                                if (instance.allAvgRngForShow[i].recTime >= maxDate) {
                                    maxDate = instance.allAvgRngForShow[i].recTime;
                                }
                                showData.push({
                                    categoryName: instance.allAvgRngForShow[i].showName,
                                    avgValue: instance.allAvgRngForShow[i].qualify.toFixed(3),
                                    rangeValue: instance.allAvgRngForShow[i].rangeQ.toFixed(3)
                                });
                                if (showData.length >= maxNum) {
                                    break;
                                }
                            }
                            avgValue = instance.qualifyAvg;
                            sigmaValue = instance.qualifySigma;
                            break;
                        case "Scrap":
                            for (i = startPoint - 1; i < length; i++) {
                                if (instance.allAvgRngForShow[i].recTime <= minDate) {
                                    minDate = instance.allAvgRngForShow[i].recTime;
                                }
                                if (instance.allAvgRngForShow[i].recTime >= maxDate) {
                                    maxDate = instance.allAvgRngForShow[i].recTime;
                                }
                                showData.push({
                                    categoryName: instance.allAvgRngForShow[i].showName,
                                    avgValue: instance.allAvgRngForShow[i].scrap.toFixed(3),
                                    rangeValue: instance.allAvgRngForShow[i].rangeS.toFixed(3)
                                });
                                if (showData.length >= maxNum) {
                                    break;
                                }
                            }
                            avgValue = instance.scrapAvg;
                            sigmaValue = instance.scrapSigma;
                            break;
                        case "Rework":
                            for (i = startPoint - 1; i < length; i++) {
                                if (instance.allAvgRngForShow[i].recTime <= minDate) {
                                    minDate = instance.allAvgRngForShow[i].recTime;
                                }
                                if (instance.allAvgRngForShow[i].recTime >= maxDate) {
                                    maxDate = instance.allAvgRngForShow[i].recTime;
                                }
                                showData.push({
                                    categoryName: instance.allAvgRngForShow[i].showName,
                                    avgValue: instance.allAvgRngForShow[i].rework.toFixed(3),
                                    rangeValue: instance.allAvgRngForShow[i].rangeR.toFixed(3)
                                });
                                if (showData.length >= maxNum) {
                                    break;
                                }
                            }
                            avgValue = instance.reworkAvg;
                            sigmaValue = instance.reworkSigma;
                            break;
                        default:
                            throw ('No this data-seg');
                            break;
                    }
                    if (showData.length > 0) {
                        this.hadData();
                        axisMin = Math.floor(avgValue - sigmaValue * 4) - 5;
                        axisMax = Math.floor(avgValue + sigmaValue * 4) + 5;
                        avgChart.setOptions({
                            valueAxis: [{
                                    name: 'avg',
                                    min: axisMin,
                                    max: axisMax,
                                    minorUnit: 0.1,
                                    plotBands: [{
                                            from: avgValue - sigmaValue * 3,
                                            to: avgValue + sigmaValue * 3,
                                            color: "#46B1C2",
                                            opacity: 0.5
                                        }, {
                                            from: avgValue - sigmaValue * 2,
                                            to: avgValue + sigmaValue * 2,
                                            color: "#76C82D",
                                            opacity: 0.7
                                        }, {
                                            from: avgValue - sigmaValue,
                                            to: avgValue + sigmaValue,
                                            color: "#ECB346",
                                            opacity: 1
                                        }, {
                                            from: avgValue - (sigmaValue / 100 < 0.05 ? 0.05 : sigmaValue / 100),
                                            to: avgValue + (sigmaValue / 100 < 0.05 ? 0.05 : sigmaValue / 100),
                                            color: "#FFFFFF",
                                            opacity: 1
                                        }]
                                }]
                        });
                        avgChart.refresh();
                        this.viewModel.set('series', showData);
                        this.viewModel.set('timeTipsStart', Web.Utils.DateUtils.format(minDate, 'yyyy-MM-dd'));
                        this.viewModel.set('timeTipsEnd', Web.Utils.DateUtils.format(maxDate, 'yyyy-MM-dd'));
                        this.viewModel.set('meanValue', avgValue.toFixed(3));
                        this.viewModel.set('sigmaValue', sigmaValue.toFixed(3));
                        this.viewModel.set('uclValue', (avgValue + sigmaValue * 3).toFixed(3));
                        this.viewModel.set('lclValue', (avgValue - sigmaValue * 3).toFixed(3));
                        this.viewModel.set('singleSigma', sigmaValue.toFixed(3));
                        this.viewModel.set('doubleSigma', (sigmaValue * 2).toFixed(3));
                        this.viewModel.set('tripleSigma', (sigmaValue * 3).toFixed(3));
                    }
                    else {
                        this.noData();
                    }
                };
                AverageRangeChart.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var startTime = this.startTime || Web.Utils.DateUtils.lastDay(new Date()), endTime = this.endTime || new Date(), equId = this.equipId;
                    if (typeof equId === 'undefined' || equId === '') {
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
                            instance.getAllData(startTime, endTime, equId, function () {
                                var dataFilterTemplate, dataFilterRe, showRecList;
                                $('#data-filter').remove();
                                instance.viewModel.set('selectedDataFilter', []);
                                dataFilterTemplate = kendo.template($('#data-filter-list').html());
                                dataFilterRe = dataFilterTemplate(instance.viewModel.get('dataFilterSeries'));
                                $(dataFilterRe).appendTo('.aic-chart-options');
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
                AverageRangeChart.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                AverageRangeChart.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                AverageRangeChart.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var avgChart = $('#avg-chart').data('kendoChart'), rangeChart = $('#range-chart').data('kendoChart');
                    kendo.unbind(this.view);
                    if (typeof avgChart !== 'undefined') {
                        avgChart.destroy();
                    }
                    if (typeof rangeChart !== 'undefined') {
                        rangeChart.destroy();
                    }
                    this.viewModel.set('selectedCircle', Html.CircleViews.Shift);
                    this.viewModel.set('selectedDataSegSingle', 'Qualify');
                    this.noData();
                };
                return AverageRangeChart;
            })(Html.OEEChartBase);
            Html.AverageRangeChart = AverageRangeChart;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=AverageRangeChart.js.map