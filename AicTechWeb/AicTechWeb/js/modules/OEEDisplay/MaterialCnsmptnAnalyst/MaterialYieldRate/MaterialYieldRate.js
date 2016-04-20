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
            var MaterialYieldRate = (function (_super) {
                __extends(MaterialYieldRate, _super);
                function MaterialYieldRate() {
                    _super.call(this, [Html.ChartOptionsContent.calcCircle, Html.ChartOptionsContent.dataSegSingle]);
                    this.allMatYieldData /*: MatRecordDataModel[]*/ = [];
                    this.allStandardQuantity /*: BOMItem2BOMDataModel[]*/ = [];
                    this.allMatYieldDataForShow = {
                        shiftData: null,
                        dateData: null
                    };
                    this.allRec = [];
                    this.allShift = [];
                    this.allDate = [];
                    this.allDefId = [];
                    this.allDefName = [];
                    this.isAllStandardQuantityLoaded = false;
                    this.isAllMatRecordLoaded = false;
                    this.circlePickerSeries = [{
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
                            Module.ModuleLoad.getModuleInstance('MaterialYieldRate').redrawChart(Html.RedrawStatu.Advance);
                        },
                        backoffData: function (e) {
                            Module.ModuleLoad.getModuleInstance('MaterialYieldRate').redrawChart(Html.RedrawStatu.Advance);
                        },
                    }));
                    this.viewModel.set('selectedCircle', Html.CircleViews.Shift);
                }
                MaterialYieldRate.prototype.initWidgets = function () {
                    $('#mat-yield-charts').kendoChart({
                        title: {
                            visible: false
                        },
                        legend: {
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
                                field: 'yieldRate',
                                name: '物料收得率',
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
                            template: '#: category#: #:value#'
                        }
                    });
                };
                /**
                 * 数据预处理
                 * 计算各个周期的数据
                 */
                MaterialYieldRate.prototype.pretreatData = function (allData /*: MatRecordDataModel[]*/) {
                    var instance = Module.ModuleLoad.getModuleInstance('MaterialYieldRate'), i, key, length, shiftString = "", dateString = "", tmpShiftDt = {
                        length: 0
                    }, tmpDateDt = {
                        length: 0
                    }, tmpAllShiftDt = [], tmpAllDateDt = [];
                    instance.allShift = [];
                    instance.allDate = [];
                    instance.allMatYieldDataForShow.shiftData = {
                        length: 0
                    };
                    instance.allMatYieldDataForShow.dateData = {
                        length: 0
                    };
                    allData.forEach(function (it /*: MatRecordDataModel*/) {
                        shiftString = it.shNo + ":" + it.defId;
                        dateString = Web.Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd') + ":" + it.defId;
                        if (it.matcType === 'c') {
                            //统计班组数据
                            instance.allShift[it.defId] = instance.allShift[it.defId] || [];
                            if (typeof instance.allMatYieldDataForShow.shiftData[shiftString] === 'undefined') {
                                instance.allMatYieldDataForShow.shiftData[shiftString] = {
                                    showName: Web.Utils.DateUtils.format(it.recTime, 'MM-dd') + ":" + it.shId,
                                    recTime: it.recTime,
                                    defId: it.defId,
                                    cQuantity: it.quantity,
                                    mQuantity: 0,
                                    k: 0
                                };
                                instance.allMatYieldDataForShow.shiftData.length++;
                                instance.allShift[it.defId].push(shiftString);
                            }
                            else {
                                instance.allMatYieldDataForShow.shiftData[shiftString].cQuantity += it.quantity;
                            }
                            //统计按日计算数据
                            instance.allDate[it.defId] = instance.allDate[it.defId] || [];
                            if (typeof instance.allMatYieldDataForShow.dateData[dateString] === 'undefined') {
                                instance.allMatYieldDataForShow.dateData[dateString] = {
                                    showName: Web.Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd'),
                                    recTime: it.recTime,
                                    defId: it.defId,
                                    cQuantity: it.quantity,
                                    mQuantity: 0,
                                    k: 0
                                };
                                instance.allMatYieldDataForShow.dateData.length++;
                                instance.allDate[it.defId].push(dateString);
                            }
                            else {
                                instance.allMatYieldDataForShow.dateData[dateString].cQuantity += it.quantity;
                            }
                        }
                        else {
                            //统计班组数据
                            if (typeof tmpShiftDt[shiftString] === 'undefined') {
                                tmpShiftDt[shiftString] = {
                                    shiftNo: it.shNo,
                                    mQuantity: it.quantity,
                                };
                                tmpShiftDt.length++;
                                tmpAllShiftDt.push(shiftString);
                            }
                            else {
                                tmpShiftDt[shiftString].mQuantity += it.quantity;
                            }
                            //统计按日计算数据
                            if (typeof tmpDateDt[dateString] === 'undefined') {
                                tmpDateDt[dateString] = {
                                    date: Web.Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd'),
                                    mQuantity: 0,
                                };
                                tmpDateDt.length++;
                                tmpAllDateDt.push(dateString);
                            }
                            else {
                                tmpDateDt[dateString].mQuantity += it.quantity;
                            }
                        }
                    });
                    for (key in instance.allMatYieldDataForShow.shiftData) {
                        if (key === 'length') {
                            continue;
                        }
                        var shiftNo = key.split(":")[0];
                        (function (curentShiftData) {
                            var defId, defIId, re;
                            for (var key in tmpShiftDt) {
                                if (key === 'length') {
                                    continue;
                                }
                                if (shiftNo === tmpShiftDt[key].shiftNo) {
                                    defId = key.split(":")[1];
                                    defIId = curentShiftData.defId;
                                    curentShiftData.mQuantity = tmpShiftDt[key].mQuantity;
                                    re = instance.allStandardQuantity.filter(function (it) {
                                        return it.bomDefId === defId && it.bomIDefId === defIId;
                                    });
                                    if (re.length > 0) {
                                        curentShiftData.k = re[0].getStandardYieldQuantity();
                                    }
                                    break;
                                }
                            }
                        })(instance.allMatYieldDataForShow.shiftData[key]);
                    }
                    for (key in instance.allMatYieldDataForShow.dateData) {
                        if (key === 'length') {
                            continue;
                        }
                        var date = key.split(":")[0];
                        (function (currentDateData) {
                            var defId, defIId, re;
                            for (var key in tmpDateDt) {
                                if (key === 'length') {
                                    continue;
                                }
                                if (date === tmpDateDt[key].date) {
                                    defId = key.split(":")[1];
                                    defIId = currentDateData.defId;
                                    currentDateData.mQuantity = tmpDateDt[key].mQuantity;
                                    re = instance.allStandardQuantity.filter(function (it) {
                                        return it.bomDefId === defId && it.bomIDefId === defIId;
                                    });
                                    if (re.length > 0) {
                                        currentDateData.k = re[0].getStandardYieldQuantity();
                                    }
                                    break;
                                }
                            }
                        })(instance.allMatYieldDataForShow.dateData[key]);
                    }
                };
                /**
                 * 计算重绘参数
                 */
                MaterialYieldRate.prototype.redrawChart = function (redrawStatu) {
                    if (redrawStatu === void 0) { redrawStatu = Html.RedrawStatu.Complete; }
                    var keyArray = [], dataArray = [], maxNum, currentView = parseInt(this.viewModel.get('selectedCircle')), currentDefId = this.allDefId[this.allDefName.indexOf(this.viewModel.get("selectedDataSeg"))];
                    switch (currentView) {
                        case Html.CircleViews.Shift:
                            keyArray = this.allShift[currentDefId];
                            dataArray = this.allMatYieldDataForShow.shiftData;
                            maxNum = Html.CircleDataNum.Shift;
                            break;
                        case Html.CircleViews.Day:
                            keyArray = this.allDate[currentDefId];
                            dataArray = this.allMatYieldDataForShow.dateData;
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
                MaterialYieldRate.prototype._redraw = function (startPoint, maxNum, keyArray, dataArray) {
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
                            quantity: dataArray[key].mQuantity,
                            actual: dataArray[key].cQuantity * dataArray[key].k,
                            yieldRate: (dataArray[key].cQuantity * dataArray[key].k * 100 / dataArray[key].mQuantity).toFixed(2)
                        });
                        if (showData.length >= maxNum) {
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
                //#region load data
                MaterialYieldRate.prototype.loadAllStandardQuantity = function (bomNo) {
                    var instance = Module.ModuleLoad.getModuleInstance("MaterialYieldRate"), currentData;
                    bomNo = isNaN(bomNo) ? -1 : bomNo;
                    instance.serviceContext.V_MM_BOM_DETAIL
                        .order('BOM_NO')
                        .filter(function (it) {
                        return it.BOM_NO > this.bomNo;
                    }, { bomNo: bomNo })
                        .map(function (it) {
                        return {
                            bomNo: it.BOM_NO,
                            bomDefNo: it.DEF_NO,
                            bomDefId: it.DEF_ID,
                            bomDefName: it.DEF_NAME,
                            bomIDefNo: it.IDEF_NO,
                            bomIDefId: it.IDEF_ID,
                            bomIDefName: it.IDEF_NAME,
                            rate: it.RATIO,
                            yield: it.YIELD
                        };
                    })
                        .toArray(function (re) {
                        re.forEach(function (it) {
                            //currentData = new BOMItem2BOMDataModel(it);
                            instance.allStandardQuantity.push(currentData);
                            instance.allDefId.push(it.bomIDefId);
                            instance.allDefName.push(it.bomIDefName);
                        });
                        if (re.length >= 100) {
                            instance.loadAllStandardQuantity(parseInt(re[99].bomNo));
                        }
                        else {
                            instance.isAllStandardQuantityLoaded = true;
                            instance.tryToPaintChart();
                        }
                    }).fail(function (e) {
                        console.log('Failed when loaded standard quantity, ', e);
                    });
                };
                MaterialYieldRate.prototype.loadAllMatRecord = function (startTime, endTime, equNo) {
                    var instance = Module.ModuleLoad.getModuleInstance("MaterialYieldRate"), 
                    //currentData: MatRecordDataModel,
                    startTime, endTime, recString;
                    startTime = startTime || Web.Utils.DateUtils.lastDay(new Date());
                    endTime = endTime || new Date();
                    instance.serviceContext.V_PPA_MAT_RECORD
                        .order('D_RECORD')
                        .filter(function (it) {
                        return it.EQP_NO == this.equNo && it.D_RECORD >= this.start && it.D_RECORD <= this.end && (it.MATC_TYPE == "c" || it.MATC_TYPE == "m") && it.DEF_ID != null;
                    }, { equNo: equNo, start: startTime, end: endTime })
                        .toArray(function (re) {
                        re.forEach(function (it) {
                            recString = it.REC_NO + ":" + it.DEF_ID;
                            //currentData = new MatRecordDataModel({
                            //    recTime: it.D_RECORD,
                            //    matcType: it.MATC_TYPE,
                            //    defId: it.DEF_ID,
                            //    poId: it.PO_ID,
                            //    quantity: it.QUANTITY,
                            //    shId: it.SH_ID,
                            //    shNo: it.SH_NO
                            //});
                            //instance.allRec = instance.allRec || [];
                            //if (instance.allRec.indexOf(recString) === -1) {
                            //    instance.allMatYieldData.push(currentData);
                            //    instance.allRec.push(recString);
                            //}
                        });
                        if (re.length >= 100) {
                            startTime = new Date(re[99].D_RECORD.getTime() + 1);
                            instance.loadAllMatRecord(startTime, endTime, equNo);
                        }
                        else {
                            instance.isAllMatRecordLoaded = true;
                            instance.tryToPaintChart();
                        }
                    }).fail(function (e) {
                        console.log('Failed when loaded MatRecord, ', e);
                    });
                };
                //#endregion
                MaterialYieldRate.prototype.loadAllData = function () {
                    var start = this.startTime || Web.Utils.DateUtils.lastDay(new Date()), end = this.endTime || new Date();
                    this.allStandardQuantity = [];
                    this.allDefId = [];
                    this.allDefName = [];
                    this.loadAllStandardQuantity();
                    this.allMatYieldData = [];
                    if (typeof this.equipId === 'undefined' || this.equipId === '') {
                        return;
                    }
                    kendo.ui.progress(this.view, true);
                    this.loadAllMatRecord(start, end, this.equipId);
                };
                MaterialYieldRate.prototype.tryToPaintChart = function () {
                    var dataSegTemplate, dataSegRe;
                    if (this.isAllDataLoaded()) {
                        kendo.ui.progress(this.view, false);
                        $('#data-seg-single').remove();
                        dataSegTemplate = kendo.template($('#data-seg-single-list').html());
                        dataSegRe = dataSegTemplate(this.allDefName);
                        $(dataSegRe).insertBefore($('#count-circle'));
                        kendo.bind(this.view, this.viewModel);
                        this.viewModel.set('selectedDataSeg', this.allDefName[0]);
                        this.pretreatData(this.allMatYieldData);
                        this.redrawChart();
                    }
                };
                MaterialYieldRate.prototype.isAllDataLoaded = function () {
                    return this.isAllMatRecordLoaded && this.isAllStandardQuantityLoaded;
                };
                MaterialYieldRate.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.loadAllData();
                };
                MaterialYieldRate.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.loadAllData();
                };
                MaterialYieldRate.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var chart = $('#mat-yield-charts').data('kendoChart');
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    this.isAllMatRecordLoaded = false;
                    this.isAllStandardQuantityLoaded = false;
                    this.allMatYieldData = [];
                    this.allMatYieldDataForShow = {
                        dateData: null,
                        shiftData: null
                    };
                    this.allDefName = [];
                    this.allDefId = [];
                    this.viewModel.set('selectedCircle', Html.CircleViews.Shift);
                    this.noData();
                };
                return MaterialYieldRate;
            })(Html.OEEChartBase);
            Html.MaterialYieldRate = MaterialYieldRate;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=MaterialYieldRate.js.map