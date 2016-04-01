var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../../reference.ts" />
var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Html;
        (function (Html) {
            var DowntimeTimelineChart = (function (_super) {
                __extends(DowntimeTimelineChart, _super);
                function DowntimeTimelineChart() {
                    _super.call(this, [Html.ChartOptionsContent.dataFilter, Html.ChartOptionsContent.legend]);
                    this.allRec = [];
                    this.dataItems = new vis.DataSet();
                    this.dataGroups = new vis.DataSet();
                }
                DowntimeTimelineChart.prototype.initWidgets = function () {
                    var container = $('#downtime-timeline-chart')[0];
                    var options = {
                        orientation: 'top',
                        selectable: false
                    };
                    this.timeline = new vis.Timeline(container, this.dataItems, this.dataGroups, options);
                };
                DowntimeTimelineChart.prototype.refreshData = function () {
                    _super.prototype.refreshData.call(this);
                    var allEqu = [], dtInstance = Module.ModuleLoad.getModuleInstance("DowntimeTimelineChart"), start = this.startTime || Web.Utils.DateUtils.lastDay(new Date()), end = this.endTime || new Date(), allEquId = [];
                    if (this.equipId !== null && this.equipId !== "") {
                        allEqu.push({ id: this.equipId, content: this.equipName });
                        this.dataGroups.update({ id: this.equipId, content: this.equipName });
                    }
                    else {
                        allEqu = this.dataGroups.get();
                        this.dataItems.clear();
                    }
                    allEqu.forEach(function (it) {
                        allEquId.push(it.id);
                    });
                    if (allEquId.length > 0) {
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
                                instance.getAllData(start, end, allEquId, function () {
                                    var dataFilterTemplate, dataFilterRe, showRecList;
                                    $('#data-seg').remove();
                                    $('#data-filter').remove();
                                    instance.viewModel.set('selectedDataFilter', []);
                                    dataFilterTemplate = kendo.template($('#data-filter-list').html());
                                    dataFilterRe = dataFilterTemplate(instance.viewModel.get('dataFilterSeries'));
                                    $(dataFilterRe).appendTo($('.aic-chart-options'));
                                    kendo.bind(instance.view, instance.viewModel);
                                    if (instance.allOrignalData.length > 0) {
                                        showRecList = instance.filterData();
                                        instance.pretreatData(showRecList);
                                        dtInstance.timeline.setOptions({
                                            start: start,
                                            end: end
                                        });
                                    }
                                    kendo.ui.progress(instance.view, false);
                                });
                            })(this);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                };
                DowntimeTimelineChart.prototype.getAllData = function (start, end, equId, callback) {
                    var _this = this;
                    var instance = Module.ModuleLoad.getModuleInstance('DowntimeTimelineChart'), currentData, recString;
                    instance.serviceContext.V_PPA_DT_RECORD
                        .order('DT_START_TIME')
                        .filter(function (it) {
                        return (it.EQP_NO in this.equId) && it.DT_START_TIME >= this.start && it.DT_END_TIME <= this.end;
                    }, { start: start, end: end, equId: equId })
                        .map(function (it) {
                        return {
                            recNo: it.REC_NO,
                            startTime: it.DT_START_TIME,
                            endTime: it.DT_END_TIME,
                            dtCause: it.DT_CAU_ID,
                            equNo: it.EQP_NO,
                            equName: it.EQP_NAME,
                            parId: it.PAR_ID,
                            parValue: it.PAR_VALUE,
                            recTime: it.DT_START_TIME
                        };
                    })
                        .toArray(function (re) {
                        if (re.length <= 0) {
                            callback();
                            return;
                        }
                        else {
                            re.forEach(function (it) {
                                currentData = new Html.DowntimeWithEqp(it);
                                recString = currentData.recNo;
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
                                start = new Date(re[re.length - 1].startTime.getTime() + 1);
                                _this.getAllData(start, end, equId, callback);
                            }
                        }
                    }).fail(function (e) {
                        callback();
                        return;
                    });
                };
                DowntimeTimelineChart.prototype.pretreatData = function (allFilterData) {
                    var instance = Module.ModuleLoad.getModuleInstance('DowntimeTimelineChart');
                    instance.dataItems.clear();
                    allFilterData.forEach(function (it) {
                        instance.dataItems.update({
                            id: it.recNo,
                            start: it.startTime,
                            end: it.endTime,
                            group: it.equNo,
                            title: it.equName + "-" + it.dtCause + ": \n" + it.startTime.toDateString() + " - " + it.endTime.toDateString(),
                            className: "vis-item-" + it.dtCause + " aic-vis-item"
                        });
                    });
                };
                DowntimeTimelineChart.prototype.init = function (view) {
                    _super.prototype.init.call(this, view);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                DowntimeTimelineChart.prototype.update = function () {
                    _super.prototype.update.call(this);
                    this.initWidgets();
                    kendo.bind(this.view, this.viewModel);
                    this.refreshData();
                };
                DowntimeTimelineChart.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    this.timeline.destroy();
                    this.dataItems.clear();
                    this.dataGroups.clear();
                    kendo.unbind(this.view);
                };
                return DowntimeTimelineChart;
            })(Html.OEEChartBase);
            Html.DowntimeTimelineChart = DowntimeTimelineChart;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=DowntimeTimelineChart.js.map