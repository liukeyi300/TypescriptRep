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
            var EquipmentDTPercent = (function (_super) {
                __extends(EquipmentDTPercent, _super);
                function EquipmentDTPercent() {
                    _super.call(this, [Html.ChartOptionsContent.chartType, Html.ChartOptionsContent.calcMethod, Html.ChartOptionsContent.dataFilter]);
                    this.allKeys = [];
                    this.totalTime = 0;
                    this.totalTimes = 0;
                    this.allRec = [];
                    this.chartColumnOptions = {
                        series: [{
                                field: "dtTime",
                                name: "停机时间",
                                axis: "dtTime",
                                type: 'column',
                                tooltip: {
                                    visible: true,
                                    template: "#= dataItem.showName # : #= value #mins"
                                }
                            }, {
                                field: "currentPercent",
                                name: "停机时间占比",
                                axis: "dtPercent",
                                type: "line",
                                tooltip: {
                                    visible: true,
                                    template: "#= dataItem.currentPercent # %"
                                },
                                color: "#007EFF"
                            }],
                        categoryAxis: [{
                                field: "showName",
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
                    };
                    this.chartPieOptions = {
                        series: [{
                                type: 'pie',
                                startAngle: 150,
                                categoryField: "showName",
                                field: "dtTime",
                                name: "停机时间",
                                tooltip: {
                                    visible: true,
                                    template: "#= dataItem.showName # : #= value #mins"
                                }
                            }],
                        categoryAxis: [],
                        valueAxis: []
                    };
                    this.chartType = [{
                            chartTypeName: "柱状图",
                            chartTypeValue: Html.ChartType.Column
                        }, {
                            chartTypeName: "饼图",
                            chartTypeValue: Html.ChartType.Pie
                        }];
                    this.viewModel.set('selectedCalcMethod', 0);
                    this.viewModel.set('selectedChartType', Html.ChartType.Column);
                }
                EquipmentDTPercent.prototype.initWidgets = function () {
                    $('#equip-dtpercent-chart').kendoChart({
                        title: {
                            visible: false
                        },
                        legend: {
                            visible: true,
                            position: 'top'
                        }
                    });
                };
                EquipmentDTPercent.prototype.getAllData = function (start, end, equId, callback) {
                    var instance = Module.ModuleLoad.getModuleInstance('EquipmentDTPercent'), currentData, recString;
                    instance.serviceContext.V_PPA_DT_RECORD
                        .order('DT_START_TIME')
                        .filter(function (it) {
                        return it.DT_START_TIME >= this.start && it.DT_START_TIME <= this.end && it.MASTER_NO == this.equId;
                    }, { start: start, end: end, equId: equId })
                        .map(function (it) {
                        return {
                            recNo: it.REC_NO,
                            equNo: it.EQP_NO,
                            equName: it.EQP_NAME,
                            startTime: it.DT_START_TIME,
                            endTime: it.DT_END_TIME,
                            dtCause: it.DT_CAU_ID,
                            parId: it.PAR_ID,
                            parValue: it.PAR_VALUE
                        };
                    })
                        .toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        re.forEach(function (it) {
                            currentData = new Html.DowntimeWithEqp(it);
                            recString = it.recNo;
                            //根据DEF_ID对原始数据分组
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
               * 计算各个周期的数据
               */
                EquipmentDTPercent.prototype.pretreatData = function (allData) {
                    var instance = Module.ModuleLoad.getModuleInstance('EquipmentDTPercent'), dtTime;
                    this.allSeriesData = {
                        length: 0
                    };
                    this.allKeys = [];
                    this.totalTime = 0;
                    this.totalTimes = 0;
                    instance.allSeriesData = {
                        length: 0
                    };
                    instance.allKeys = [];
                    allData.forEach(function (it) {
                        if (it.endTime !== null) {
                            dtTime = it.getDowntime() / 60000;
                            if (dtTime >= 0) {
                                instance.totalTime += dtTime;
                                instance.totalTimes++;
                                if (typeof instance.allSeriesData[it.equName] === "undefined") {
                                    instance.allSeriesData[it.equName] = {
                                        showName: it.equName,
                                        dtTime: dtTime,
                                        currentPercent: 0,
                                        times: 1
                                    };
                                    instance.allSeriesData.length++;
                                    instance.allKeys.push(it.equName);
                                }
                                else {
                                    instance.allSeriesData[it.equName].dtTime += dtTime;
                                    instance.allSeriesData[it.equName].times++;
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
                EquipmentDTPercent.prototype._redraw = function () {
                    var showData = [], currentTime = 0, currentCalcMethod = parseInt(this.viewModel.get('selectedCalcMethod')), chart = $('#equip-dtpercent-chart').data('kendoChart');
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
                        this.chartPieOptions.series[0].name = "停机时间";
                        this.chartPieOptions.series[0].field = "dtTime";
                        this.chartPieOptions.series[0].tooltip.template = "#= dataItem.showName # : #= value #mins";
                        this.chartColumnOptions.series[0].name = "停机时间";
                        this.chartColumnOptions.series[0].field = "dtTime";
                        this.chartColumnOptions.series[0].tooltip.template = "#= dataItem.showName # : #= value #mins";
                    }
                    else {
                        showData.sort(function (a, b) {
                            return b.times - a.times;
                        });
                        for (var i = 0, length = showData.length; i < length; i++) {
                            currentTime += showData[i].times;
                            showData[i].currentPercent = (currentTime * 100 / this.totalTimes).toFixed(2);
                        }
                        this.chartPieOptions.series[0].name = "停机次数";
                        this.chartPieOptions.series[0].field = 'times';
                        this.chartPieOptions.series[0].tooltip.template = "#= dataItem.showName # : #= value #次";
                        this.chartColumnOptions.series[0].name = "停机次数";
                        this.chartColumnOptions.series[0].field = "times";
                        this.chartColumnOptions.series[0].tooltip.template = "#= dataItem.showName # : #= value #次";
                    }
                    if (showData.length > 0) {
                        this.viewModel.set('series', showData);
                        this.hadData();
                        this.switchChartType();
                    }
                    else {
                        this.noData();
                    }
                };
                /**
                * 切换图表类型
                */
                EquipmentDTPercent.prototype.switchChartType = function () {
                    var currentType = parseInt(this.viewModel.get('selectedChartType')), chart = $('#equip-dtpercent-chart').data('kendoChart'), instance = Module.ModuleLoad.getModuleInstance('EquipmentDTPercent');
                    switch (currentType) {
                        case Html.ChartType.Column:
                            chart.setOptions(instance.chartColumnOptions);
                            break;
                        case Html.ChartType.Pie:
                            chart.setOptions(instance.chartPieOptions);
                            break;
                        default: break;
                    }
                    chart.refresh();
                };
                /**
                 * 刷新图表数据
                 */
                EquipmentDTPercent.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var start = this.startTime || Web.Utils.DateUtils.lastDay(new Date()), end = this.endTime || new Date(), equId = this.equipId;
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
                EquipmentDTPercent.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                EquipmentDTPercent.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                EquipmentDTPercent.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var chart = $('#equip-dtpercent-chart').data('kendoChart');
                    kendo.unbind(this.view);
                    if (typeof chart !== 'undefined') {
                        chart.destroy();
                    }
                    this.noData();
                    this.viewModel.set('selectedChartType', Html.ChartType.Column);
                };
                return EquipmentDTPercent;
            })(Html.OEEChartBase);
            Html.EquipmentDTPercent = EquipmentDTPercent;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=EquipmentDTPercent.js.map