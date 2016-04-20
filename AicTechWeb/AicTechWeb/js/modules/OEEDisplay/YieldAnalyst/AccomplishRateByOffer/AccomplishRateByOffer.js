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
            var AccomplishRateByOffer = (function (_super) {
                __extends(AccomplishRateByOffer, _super);
                function AccomplishRateByOffer() {
                    _super.call(this);
                    this.allPo = [];
                    $.extend(this.viewModel, kendo.observable({
                        series: [],
                        isOverlayShow: true,
                        timeTipsStart: 'start',
                        timeTipsEnd: 'end',
                        advanceData: function (e) {
                            Module.ModuleLoad.getModuleInstance('AccomplishRateByOffer').redrawChart(Html.RedrawStatu.Advance);
                        },
                        backoffData: function (e) {
                            Module.ModuleLoad.getModuleInstance('AccomplishRateByOffer').redrawChart(Html.RedrawStatu.Backoff);
                        }
                    }));
                }
                AccomplishRateByOffer.prototype.initWidgets = function () {
                    $('#ar-offer-chart').kendoChart({
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
                                name: '工单达成率',
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
                AccomplishRateByOffer.prototype.getAllData = function (start, end, equId, callback) {
                    var instance = Module.ModuleLoad.getModuleInstance("AccomplishRateByOffer"), currentData;
                    instance.serviceContext.V_PPA_MAT_RECORD_PLAN
                        .order('D_RECORD')
                        .filter(function (it) {
                        return it.D_RECORD >= this.start && it.D_RECORD <= this.end && it.EQP_NO == this.equId && it.MATC_TYPE == 'm';
                    }, { start: start, end: end, equId: equId })
                        .map(function (it) {
                        return {
                            recTime: it.D_RECORD,
                            actual: it.ACTUAL,
                            quantity: it.QUANTITY,
                            poId: it.PO_ID,
                            recNo: it.REC_NO
                        };
                    })
                        .toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        re.forEach(function (it) {
                            currentData = new Html.OfferAccmplshRtDataModel(it);
                            if (typeof instance.allARData[currentData.poId] === 'undefined' && currentData.actual !== null && currentData.quantity !== null) {
                                instance.allARData[currentData.poId] = {
                                    showName: currentData.poId,
                                    actual: currentData.actual,
                                    quantity: currentData.quantity,
                                    recTime: currentData.recTime
                                };
                                instance.allARData.length++;
                                instance.allPo.push(currentData.poId);
                            }
                            else {
                                instance.allARData[currentData.poId].actual += currentData.actual;
                            }
                        });
                        if (re.length < 100) {
                            callback();
                            return;
                        }
                        else {
                            start = new Date((re[re.length - 1].recTime).getTime() + 1);
                            instance.getAllData(start, end, equId, callback);
                        }
                    }).fail(function (e) {
                        callback();
                        console.log(e);
                    });
                };
                AccomplishRateByOffer.prototype.redrawChart = function (redrawStatu) {
                    if (redrawStatu === void 0) { redrawStatu = Html.RedrawStatu.Complete; }
                    var keyArray = this.allPo, dataArray = this.allARData, maxNum = 10;
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
                AccomplishRateByOffer.prototype._redraw = function (startPoint, maxNum, keyArray, dataArray) {
                    var showData = [], minDate = new Date(), maxDate = new Date('1971-01-01'), length = keyArray.length, i, key;
                    keyArray = keyArray || [];
                    dataArray = dataArray || [];
                    for (i = startPoint - 1; i < length; i++) {
                        key = keyArray[i];
                        if (typeof dataArray[key] === "undefined" || isNaN(dataArray[key].quantity) || dataArray[key].quantity === 0) {
                            continue;
                        }
                        if (dataArray[key].recTime <= minDate) {
                            minDate = dataArray[key].recTime;
                        }
                        if (dataArray[key].recTime >= maxDate) {
                            maxDate = dataArray[key].recTime;
                        }
                        showData.push({
                            categoryName: dataArray[key].showName,
                            actual: dataArray[key].actual.toFixed(3),
                            quantity: dataArray[key].quantity.toFixed(3),
                            accomplishRate: (dataArray[key].actual * 100 / dataArray[key].quantity).toFixed(2)
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
                AccomplishRateByOffer.prototype.noData = function () {
                    this.viewModel.set('isOverlayShow', true);
                    this.viewModel.set('series', []);
                    this.viewModel.set('timeTipsStart', 'start');
                    this.viewModel.set('timeTipsEnd', 'end');
                };
                AccomplishRateByOffer.prototype.hadData = function () {
                    this.viewModel.set('isOverlayShow', false);
                };
                AccomplishRateByOffer.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var start = this.startTime || Web.Utils.DateUtils.lastDay(new Date), end = this.endTime || new Date, equId = this.equipId;
                    if (typeof equId === 'undefined' || equId === "") {
                        return;
                    }
                    this.allARData = {
                        length: 0
                    };
                    this.allPo = [];
                    kendo.ui.progress(this.view, true);
                    try {
                        (function (instance) {
                            instance.getAllData(start, end, equId, function () {
                                if (instance.allARData.length > 0) {
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
                AccomplishRateByOffer.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                AccomplishRateByOffer.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                AccomplishRateByOffer.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var chart = $('#ar-offer-chart').data('kendoChart');
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    this.noData();
                };
                return AccomplishRateByOffer;
            })(Module.ModuleBase);
            Html.AccomplishRateByOffer = AccomplishRateByOffer;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=AccomplishRateByOffer.js.map