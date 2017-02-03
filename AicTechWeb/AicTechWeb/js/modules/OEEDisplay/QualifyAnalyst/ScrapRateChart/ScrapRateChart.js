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
            var ScrapRateChart = (function (_super) {
                __extends(ScrapRateChart, _super);
                function ScrapRateChart() {
                    _super.call(this, [Html.ChartOptionsContent.calcCircle, Html.ChartOptionsContent.dataFilter]);
                    this.allScrpDataForShow = {
                        shiftData: null,
                        dateData: null,
                        weekData: null,
                        monthData: null
                    };
                    this.allShift = [];
                    this.allDate = [];
                    this.allWeek = [];
                    this.allMonth = [];
                    this.allRec = [];
                    this.circlePickerSeries = [{
                            circleName: '班组',
                            circleValue: Html.CircleViews.Shift
                        }, {
                            circleName: '日',
                            circleValue: Html.CircleViews.Day
                        }, {
                            circleName: '周',
                            circleValue: Html.CircleViews.Week
                        }, {
                            circleName: '月',
                            circleValue: Html.CircleViews.Month
                        }];
                    $.extend(this.viewModel, kendo.observable({
                        timeTipsStart: Web.Utils.DateUtils.format(Web.Utils.DateUtils.lastDay(new Date()), 'yyyy-MM-dd'),
                        timeTipsEnd: Web.Utils.DateUtils.format(new Date(), 'yyyy-MM-dd'),
                        isOverlayShow: true,
                        advanceData: function (e) {
                            Module.ModuleLoad.getModuleInstance('ScrapRateChart').redrawChart(Html.RedrawStatu.Advance);
                        },
                        backoffData: function (e) {
                            Module.ModuleLoad.getModuleInstance('ScrapRateChart').redrawChart(Html.RedrawStatu.Backoff);
                        }
                    }));
                    this.viewModel.set("selectedCircle", Html.CircleViews.Shift);
                }
                ScrapRateChart.prototype.initWidgets = function () {
                    $('#scrap-percent-chart').kendoChart({
                        legend: {
                            visible: false
                        },
                        seriesDefaults: {
                            type: "line"
                        },
                        series: [{
                                field: "scrapP",
                                name: "Scrap Percent",
                                tooltip: {
                                    visible: true,
                                    template: "#=dataItem.circleName# : #=dataItem.scrapP# %"
                                }
                            }],
                        categoryAxis: [{
                                field: "circleName"
                            }]
                    });
                };
                /**
                 * 获取所有数据
                 */
                ScrapRateChart.prototype.getAllData = function (start, end, equId, callback) {
                    var instance = Module.ModuleLoad.getModuleInstance("ScrapRateChart"), currentData, recString;
                    instance.serviceContext.V_PPA_QA_RECORD
                        .order("D_RECORD")
                        .filter(function (it) {
                        return it.D_RECORD >= this.start && it.D_RECORD <= this.end && it.EQP_NO == this.equId;
                    }, { start: start, end: end, equId: equId })
                        .map(function (it) {
                        return {
                            recNo: it.REC_NO,
                            recTime: it.D_RECORD,
                            shiftNo: it.SH_NO,
                            scrap: it.SCRAP,
                            total: it.TOTAL,
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
                        else {
                            re.forEach(function (it) {
                                currentData = new Html.ScrapRtDataModel(it);
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
                ScrapRateChart.prototype.pretreatData = function (allData) {
                    var instance = Module.ModuleLoad.getModuleInstance('ScrapRateChart'), currentParValue, i, length, shiftString = "", dateString = "", weekString = "", monthString = "";
                    instance.allShift = [];
                    instance.allDate = [];
                    instance.allWeek = [];
                    instance.allMonth = [];
                    instance.allScrpDataForShow.shiftData = {
                        length: 0
                    };
                    instance.allScrpDataForShow.dateData = {
                        length: 0
                    };
                    instance.allScrpDataForShow.weekData = {
                        length: 0
                    };
                    instance.allScrpDataForShow.monthData = {
                        length: 0
                    };
                    allData.forEach(function (it) {
                        dateString = Web.Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd'),
                            weekString = "",
                            monthString = Web.Utils.DateUtils.format(it.recTime, 'yyyy-MM');
                        //统计班组数据
                        if (typeof instance.allScrpDataForShow.shiftData[it.shiftNo + ""] === "undefined") {
                            instance.allScrpDataForShow.shiftData[it.shiftNo + ""] = {
                                showName: Web.Utils.DateUtils.format(it.recTime, 'MM-dd') + ":" + it.shiftId,
                                recTime: it.recTime,
                                scrap: it.scrap,
                                total: it.total
                            };
                            instance.allScrpDataForShow.shiftData.length++;
                            instance.allShift.push(it.shiftNo);
                        }
                        else {
                            instance.allScrpDataForShow.shiftData[it.shiftNo].scrap += it.scrap;
                            instance.allScrpDataForShow.shiftData[it.shiftNo].total += it.total;
                        }
                        //统计日计算数据
                        if (typeof instance.allScrpDataForShow.dateData[dateString] === "undefined") {
                            instance.allScrpDataForShow.dateData[dateString] = {
                                showName: dateString,
                                recTime: it.recTime,
                                scrap: it.scrap,
                                total: it.total
                            };
                            instance.allScrpDataForShow.dateData.length++;
                            instance.allDate.push(dateString);
                        }
                        else {
                            instance.allScrpDataForShow.dateData[dateString].scrap += it.scrap;
                            instance.allScrpDataForShow.dateData[dateString].total += it.total;
                        }
                        //统计周计算数据
                        //在记录D_RECORD的时候，每个周的统计周期只记录当前周的第一天
                        //周索引记录规则：W加上第几周，故周索引数组长度即为当前第几周的数字
                        var currentDate = new Date(it.recTime.getFullYear(), it.recTime.getMonth(), it.recTime.getDate());
                        if (instance.allWeek.length === 0) {
                            (function () {
                                var startDate = new Date(currentDate.getTime() - currentDate.getDay() * 1000 * 60 * 60 * 24);
                                startDate = startDate < instance.startTime ? instance.startTime : startDate;
                                weekString = "W1-" + Web.Utils.DateUtils.format(startDate, 'yyyy/MM/dd');
                            })();
                        }
                        else {
                            var lastDay = instance.allScrpDataForShow.weekData[instance.allWeek[instance.allWeek.length - 1]].recTime, lastDate = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate()), weekDiffer = ((currentDate.getTime() - currentDate.getDay() * 1000 * 60 * 60 * 24) -
                                (lastDate.getTime() - lastDate.getDay() * 1000 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24 * 7);
                            if (weekDiffer > 0) {
                                for (var i = 0; i < weekDiffer - 1; i++) {
                                    instance.allWeek.push("W" + (instance.allWeek.length + i + 1));
                                }
                                (function () {
                                    var startDate = new Date(currentDate.getTime() - currentDate.getDay() * 1000 * 60 * 60 * 24);
                                    weekString = "W" + (instance.allWeek.length + 1) + "-" + Web.Utils.DateUtils.format(startDate, 'yyyy/MM/dd');
                                })();
                            }
                            else {
                                weekString = instance.allWeek[instance.allWeek.length - 1];
                            }
                        }
                        if (typeof instance.allScrpDataForShow.weekData[weekString] === "undefined") {
                            instance.allScrpDataForShow.weekData[weekString] = {
                                showName: weekString,
                                recTime: it.recTime,
                                scrap: it.scrap,
                                total: it.total
                            };
                            instance.allScrpDataForShow.weekData.length++;
                            instance.allWeek.push(weekString);
                        }
                        else {
                            instance.allScrpDataForShow.weekData[weekString].scrap += it.scrap;
                            instance.allScrpDataForShow.weekData[weekString].total += it.total;
                        }
                        //统计月计算数据
                        if (typeof instance.allScrpDataForShow.monthData[monthString] === "undefined") {
                            instance.allScrpDataForShow.monthData[monthString] = {
                                showName: monthString,
                                recTime: it.recTime,
                                scrap: it.scrap,
                                total: it.total
                            };
                            instance.allScrpDataForShow.monthData.length++;
                            instance.allMonth.push(monthString);
                        }
                        else {
                            instance.allScrpDataForShow.monthData[monthString].scrap += it.scrap;
                            instance.allScrpDataForShow.monthData[monthString].total += it.total;
                        }
                    });
                };
                /**
                 * 计算重绘参数
                 */
                ScrapRateChart.prototype.redrawChart = function (redrawStatu) {
                    if (redrawStatu === void 0) { redrawStatu = Html.RedrawStatu.Complete; }
                    var keyArray = [], dataArray = [], maxNum, currentView = parseInt(this.viewModel.get('selectedCircle'));
                    switch (currentView) {
                        case Html.CircleViews.Shift:
                            keyArray = this.allShift;
                            dataArray = this.allScrpDataForShow.shiftData;
                            maxNum = Html.CircleDataNum.Shift;
                            break;
                        case Html.CircleViews.Day:
                            keyArray = this.allDate;
                            dataArray = this.allScrpDataForShow.dateData;
                            maxNum = Html.CircleDataNum.Day;
                            break;
                        case Html.CircleViews.Week:
                            keyArray = this.allWeek;
                            dataArray = this.allScrpDataForShow.weekData;
                            maxNum = Html.CircleDataNum.Week;
                            break;
                        case Html.CircleViews.Month:
                            keyArray = this.allMonth;
                            dataArray = this.allScrpDataForShow.monthData;
                            maxNum = Html.CircleDataNum.Month;
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
                    }
                    this._redraw(this.redrawStartPoint, maxNum, keyArray, dataArray);
                };
                /**
                 * 重绘图表
                 */
                ScrapRateChart.prototype._redraw = function (startPoint, maxNum, keyArray, dataArray) {
                    var showData = [], minDate = new Date(), maxDate = new Date('1971-01-01'), length = keyArray.length, i, key;
                    keyArray = keyArray || [];
                    dataArray = dataArray || [];
                    for (i = startPoint - 1; i < length; i++) {
                        key = keyArray[i];
                        if (typeof dataArray[key] === "undefined" || typeof dataArray[key].total === "undefined" || dataArray[key].total === 0) {
                            continue;
                        }
                        if (typeof dataArray[key].recTime === 'undefined') {
                            if (dataArray[key].startTime <= minDate) {
                                minDate = dataArray[key].startTime;
                            }
                            if (dataArray[key].endTime >= maxDate) {
                                maxDate = dataArray[key].endTime;
                            }
                        }
                        else {
                            if (dataArray[key].recTime <= minDate) {
                                minDate = dataArray[key].recTime;
                            }
                            if (dataArray[key].recTime >= maxDate) {
                                maxDate = dataArray[key].recTime;
                            }
                        }
                        showData.push({
                            circleName: dataArray[key].showName,
                            scrapP: (dataArray[key].scrap * 100 / dataArray[key].total).toFixed(2)
                        });
                        if (showData.length >= maxNum) {
                            break;
                        }
                    }
                    if (showData.length > 0) {
                        this.hadData();
                        this.viewModel.set('series', showData);
                        this.viewModel.set('timeTipsStart', Web.Utils.DateUtils.format(minDate, 'yyyy-MM-dd'));
                        this.viewModel.set('timeTipsEnd', Web.Utils.DateUtils.format(maxDate, 'yyyy-MM-dd'));
                    }
                    else {
                        this.noData();
                    }
                };
                /**
                 * 刷新数据
                 */
                ScrapRateChart.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var start = this.startTime || Web.Utils.DateUtils.lastDay(new Date()), end = this.endTime || (new Date()), equId = this.equipId;
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
                    this.allRec = [];
                    kendo.ui.progress(this.view, true);
                    try {
                        (function (instance) {
                            instance.getAllData(start, end, equId, function () {
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
                ScrapRateChart.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                ScrapRateChart.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                ScrapRateChart.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var chart = $('#scrap-percent-chart').data('kendoChart');
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    this.noData();
                    this.viewModel.set('selectedCircle', Html.CircleViews.Shift);
                };
                return ScrapRateChart;
            })(Html.OEEChartBase);
            Html.ScrapRateChart = ScrapRateChart;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=ScrapRateChart.js.map