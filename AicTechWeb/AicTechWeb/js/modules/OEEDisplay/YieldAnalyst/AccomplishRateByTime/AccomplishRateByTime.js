/// <referene path="../../../../reference.ts" />
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
            var AccomplishRateByTime = (function (_super) {
                __extends(AccomplishRateByTime, _super);
                function AccomplishRateByTime() {
                    _super.call(this);
                    this.allShift = [];
                    this.allQuantityShift = [];
                    $.extend(this.viewModel, kendo.observable({
                        series: [],
                        isOverlayShow: true,
                        timeTipsStart: 'start',
                        timeTipsEnd: 'end',
                        advanceData: function (e) {
                            Module.ModuleLoad.getModuleInstance('AccomplishRateByTime').redrawChart(Html.RedrawStatu.Advance);
                        },
                        backoffData: function (e) {
                            Module.ModuleLoad.getModuleInstance('AccomplishRateByTime').redrawChart(Html.RedrawStatu.Backoff);
                        }
                    }));
                }
                AccomplishRateByTime.prototype.initWidgets = function () {
                    $('#ar-time-chart').kendoChart({
                        title: {
                            visible: false
                        },
                        legend: {
                            visible: true,
                            position: 'top'
                        },
                        seriesDefaults: {
                            type: 'column',
                            spacing: 0
                        },
                        series: [{
                                field: 'quantity',
                                name: '计划产量',
                                axis: 'amount'
                            }, {
                                field: 'actual',
                                name: '实际产量',
                                axis: 'amount'
                            }, {
                                field: 'accomplishRate',
                                name: '时间达成率',
                                axis: 'rate',
                                type: 'line',
                                tooltip: {
                                    visible: true,
                                    template: "#:category# : #:value# %"
                                },
                                color: '#3333CC'
                            }],
                        categoryAxis: [{
                                field: 'categoryName',
                                axisCrossingValue: [0, 20]
                            }],
                        valueAxis: [{
                                name: "amount"
                            }, {
                                name: "rate",
                                color: "#007EFF"
                            }],
                        tooltip: {
                            visible: true,
                            template: "#:category# : #:value#"
                        }
                    });
                };
                AccomplishRateByTime.prototype.getAllActualData = function (start, end, equId, callback) {
                    var instance = Module.ModuleLoad.getModuleInstance("AccomplishRateByTime"), currentData;
                    instance.serviceContext.PPA_PER_RECORD
                        .order('D_RECORD')
                        .filter(function (it) {
                        return it.D_RECORD >= this.start && it.D_RECORD <= this.end && it.EQP_NO == this.equId;
                    }, { start: start, end: end, equId: equId })
                        .map(function (it) {
                        return {
                            recNo: it.REC_NO,
                            recTime: it.D_RECORD,
                            shiftNo: it.SH_NO,
                            actual: it.ACTUAL
                        };
                    })
                        .toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        re.forEach(function (it) {
                            currentData = new Html.TimeAccmplshRtDataModel(it);
                            if (typeof instance.allARData[currentData.shiftNo] === 'undefined') {
                                instance.allARData[currentData.shiftNo] = {
                                    showName: "No Data",
                                    actual: currentData.actual,
                                    quantity: 0
                                };
                                instance.allARData.length++;
                                instance.allShift.push(currentData.shiftNo);
                            }
                            else {
                                instance.allARData[currentData.shiftNo].actual += currentData.actual;
                            }
                        });
                        if (re.length < 100) {
                            callback();
                            return;
                        }
                        else {
                            start = new Date((re[re.length - 1].recTime).getTime() + 1);
                            instance.getAllActualData(start, end, equId, callback);
                        }
                    }).fail(function (e) {
                        callback();
                        console.log(e);
                    });
                };
                AccomplishRateByTime.prototype.getAllQuantityData = function (callback, ppsNo) {
                    var instance = Module.ModuleLoad.getModuleInstance('AccomplishRateByTime'), currentData, allShift = instance.allShift;
                    ppsNo = ppsNo || [];
                    instance.allShift = instance.allShift || [];
                    var filter;
                    if (ppsNo.length === 0) {
                        filter = instance.serviceContext.V_PPA_PRD_PLAN
                            .filter(function (it) {
                            return it.SH_NO in this.allShift;
                        }, { allShift: allShift });
                    }
                    else {
                        filter = instance.serviceContext.V_PPA_PRD_PLAN
                            .filter(function (it) {
                            return it.SH_NO in this.allShift && !(it.PPS_NO in this.ppsNo);
                        }, { allShift: allShift, ppsNo: ppsNo });
                    }
                    filter.map(function (it) {
                        return {
                            shiftId: it.SH_ID,
                            shiftStartTime: it.SH_START_TIME,
                            quantity: it.PLAN_QUANTITY,
                            ppsNo: it.PPS_NO,
                            shiftNo: it.SH_NO,
                            recNo: it.PPS_NO,
                            recTime: it.SH_START_TIME
                        };
                    })
                        .toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        re.forEach(function (it) {
                            currentData = new Html.TimeAccmplshRtDataModel(it);
                            currentData.shiftId = it.shiftId;
                            currentData.shiftStartTime = it.shiftStartTime;
                            ppsNo.push(it.ppsNo);
                            if (instance.allQuantityShift.indexOf(currentData.shiftNo) === -1) {
                                instance.allQuantityShift.push(currentData.shiftNo);
                            }
                            if (typeof instance.allARData[currentData.shiftNo] !== 'undefined') {
                                instance.allARData[currentData.shiftNo].showName = Web.Utils.DateUtils.format(currentData.shiftStartTime, 'yyyy-MM-dd') +
                                    ":" + currentData.shiftId;
                                instance.allARData[currentData.shiftNo].quantity += currentData.quantity;
                                instance.allARData[currentData.shiftNo].shiftStartTime = currentData.shiftStartTime;
                            }
                        });
                        if (re.length < 100) {
                            callback();
                            return;
                        }
                        else {
                            instance.getAllQuantityData(callback, ppsNo);
                        }
                    }).fail(function (e) {
                        callback();
                        console.log(e);
                    });
                };
                AccomplishRateByTime.prototype.redrawChart = function (redrawStatu) {
                    if (redrawStatu === void 0) { redrawStatu = Html.RedrawStatu.Complete; }
                    var keyArray = this.allShift, dataArray = this.allARData, maxNum = Html.CircleDataNum.Shift;
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
                AccomplishRateByTime.prototype._redraw = function (startPoint, maxNum, keyArray, dataArray) {
                    var showData = [], minDate = new Date(), maxDate = new Date('1971-01-01'), length = keyArray.length, i, key;
                    keyArray = keyArray || [];
                    dataArray = dataArray || [];
                    for (i = startPoint - 1; i < length; i++) {
                        key = keyArray[i];
                        if (typeof dataArray[key] === "undefined" || isNaN(dataArray[key].quantity) || dataArray[key].quantity === 0) {
                            continue;
                        }
                        if (dataArray[key].shiftStartTime <= minDate) {
                            minDate = dataArray[key].shiftStartTime;
                        }
                        if (dataArray[key].shiftStartTime >= maxDate) {
                            maxDate = dataArray[key].shiftStartTime;
                        }
                        if (dataArray[key].quantity > 0) {
                            showData.push({
                                categoryName: dataArray[key].showName,
                                actual: dataArray[key].actual.toFixed(3),
                                quantity: dataArray[key].quantity.toFixed(3),
                                accomplishRate: (dataArray[key].actual * 100 / dataArray[key].quantity).toFixed(2)
                            });
                        }
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
                AccomplishRateByTime.prototype.noData = function () {
                    this.viewModel.set('isOverlayShow', true);
                    this.viewModel.set('series', []);
                    this.viewModel.set('timeTipsStart', 'start');
                    this.viewModel.set('timeTipsEnd', 'end');
                };
                AccomplishRateByTime.prototype.hadData = function () {
                    this.viewModel.set('isOverlayShow', false);
                };
                AccomplishRateByTime.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var start = this.startTime || Web.Utils.DateUtils.lastDay(new Date), end = this.endTime || new Date, equId = this.equipId;
                    if (typeof equId === 'undefined' || equId === "") {
                        return;
                    }
                    this.allARData = {
                        length: 0
                    };
                    this.allShift = [];
                    this.allQuantityShift = [];
                    kendo.ui.progress(this.view, true);
                    try {
                        (function (instance) {
                            instance.getAllActualData(start, end, equId, function () {
                                if (instance.allShift.length > 0) {
                                    (function (instance) {
                                        instance.getAllQuantityData(function () {
                                            if (instance.allQuantityShift.length > 0) {
                                                instance.redrawChart();
                                            }
                                            else {
                                                instance.noData();
                                            }
                                        });
                                    })(instance);
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
                AccomplishRateByTime.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                AccomplishRateByTime.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                AccomplishRateByTime.prototype.destory = function () {
                    var chart = $('#ar-time-chart').data('kendoChart');
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    this.noData();
                };
                return AccomplishRateByTime;
            })(Module.ModuleBase);
            Html.AccomplishRateByTime = AccomplishRateByTime;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=AccomplishRateByTime.js.map