/// <reference path="../../../../reference.ts" />

module AicTech.Web.Html {
    export class MTBFChart extends OEEChartBase<Downtime> {
        private allParValueList;

        private allDtDataForShow = {
            monthData: null,
            yearData: null
        }
        private allRec = [];
        private allMonth = [];
        private allYear = [];
        private redrawStartPoint;

        constructor() {
            super([ChartOptionsContent.chartType, ChartOptionsContent.calcCircle, ChartOptionsContent.dataFilter]);
            this.circlePickerSeries = [{
                circleName: '月',
                circleValue: CircleViews.Month
            }, {
                circleName: '年',
                circleValue: CircleViews.Year
            }];
            this.chartType = [{
                chartTypeName: "折线图",
                chartTypeValue: ChartType.Line
            }, {
                chartTypeName: "柱状图",
                chartTypeValue: ChartType.Column
                }];

            this.viewModel.set('selectedCircle', CircleViews.Month);
            this.viewModel.set('selectedChartType', ChartType.Line);

            $.extend(this.viewModel, kendo.observable({
                timeTipsStart: 'start',
                timeTipsEnd: 'end',
                advanceData: function (e) {
                    (<MTBFChart>Module.ModuleLoad.getModuleInstance('MTBFChart')).redrawChart(RedrawStatu.Advance);
                },
                backoffData: function (e) {
                    (<MTBFChart>Module.ModuleLoad.getModuleInstance('MTBFChart')).redrawChart(RedrawStatu.Backoff);
                }
            }));
        }

        private initWidgets() {
            $('#mtbf-chart').kendoChart({
                title: {
                    align: 'left',
                    text:"平均故障间隔时间(MTBF，单位：小时)"
                },
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type:"line"
                },
                series: [{
                    field: "mtbfValue",
                    name: "MTBF",
                    tooltip: {
                        visible: true,
                        template:"#= dataItem.circleName # : #= dataItem.mtbfValue# H"
                    }
                }],
                categoryAxis: [{
                    field:'circleName'
                }]
            });

            $('#mttr-chart').kendoChart({
                title: {
                    align: 'left',
                    text: "平均维修时间(MTTR，单位：分钟)"
                },
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{
                    field: "mttrValue",
                    name: "MTTR",
                    tooltip: {
                        visible: true,
                        template: "#= dataItem.circleName # : #= dataItem.mttrValue# min"
                    }
                }],
                categoryAxis: [{
                    field:'circleName'
                }]
            });
        }
        
        /**
         * 获取所有数据
         */
        private getAllData(start: Date, end: Date, equId: string, callback: Function) {
            var instance = <MTBFChart>Module.ModuleLoad.getModuleInstance('MTBFChart'),
                currentData: Downtime,
                recString: string;
            instance.serviceContext.V_PPA_DT_RECORD
                .order('DT_START_TIME')
                .filter(function (it) {
                    return it.DT_START_TIME >= this.start && it.DT_START_TIME <= this.end && it.EQP_NO == this.equId;
                }, { start: start, end: end, equId: equId })
                .map((it) => {
                    return {
                        recNo: it.REC_NO,
                        recTime: it.DT_START_TIME,
                        startTime: it.DT_START_TIME,
                        endTime: it.DT_END_TIME,
                        parId: it.PAR_ID,
                        parValue: it.PAR_VALUE,
                        dtCause: it.DT_CAU_ID
                    }
                })
                .toArray((re) => {
                    if (re.length <= 0) {
                        callback();
                        return;
                    } else {
                        re.forEach((it) => {
                            currentData = new Downtime(it);
                            recString = currentData.recNo + ":" + it.defId;

                            //原始数据去重
                            if (instance.allRec.indexOf(recString) === -1) {
                                instance.allOrignalData.push(currentData);
                                instance.allRec.push(recString);
                            }

                            var dataGroup: any[] = instance.viewModel.get('dataFilterSeries');
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
                        } else {
                            start = new Date(re[re.length - 1].startTime.getTime() + 1);
                            this.getAllData(start, end, equId, callback);
                        }
                    }
                }).fail((e) => {
                    console.log(e);
                });
        }

        /**
       * 数据预处理
       * 计算各个周期的数据
       */
        protected pretreatData(allData: Downtime[]) {
            var instance = <MTBFChart>Module.ModuleLoad.getModuleInstance('MTBFChart'),
                currentParValue,
                i,
                length,
                monthString = "",
                yearString = "",
                key,
                totalTime: number;

            instance.allMonth = [];
            instance.allYear = [];

            instance.allDtDataForShow.monthData = {
                length: 0
            };
            instance.allDtDataForShow.yearData = {
                length: 0
            };

            allData.forEach((it: Downtime) => {
                if (it.endTime !== null) {
                    monthString = Utils.DateUtils.format(it.recTime, 'yyyy-MM');
                    yearString = it.recTime.getFullYear() + "";
                    //统计按月计算数据
                    if (typeof instance.allDtDataForShow.monthData[monthString] === 'undefined') {
                        instance.allDtDataForShow.monthData[monthString] = {
                            showName: monthString,
                            times: 1,
                            downtime: it.endTime.getTime() - it.startTime.getTime(),
                            uptime: 0
                        }
                        instance.allDtDataForShow.monthData.length++;
                        instance.allMonth.push(monthString);
                    } else {
                        instance.allDtDataForShow.monthData[monthString].times++;
                        instance.allDtDataForShow.monthData[monthString].downtime += it.endTime.getTime() - it.startTime.getTime();
                    }

                    //统计按年计算数据
                    if (yearString != ((new Date).getFullYear() + "")) {
                        if (typeof instance.allDtDataForShow.yearData[yearString] === 'undefined') {
                            instance.allDtDataForShow.yearData[yearString] = {
                                showName: yearString,
                                times: 1,
                                downtime: it.endTime.getTime() - it.startTime.getTime(),
                                uptime: 0
                            }
                            instance.allDtDataForShow.yearData.length++;
                            instance.allYear.push(yearString);
                        } else {
                            instance.allDtDataForShow.yearData[yearString].times++;
                            instance.allDtDataForShow.yearData[yearString].downtime += it.endTime.getTime() - it.startTime.getTime();
                        }
                    }
                }
            });

            for (i = 0, length = instance.allMonth.length; i < length; i++) {
                key = instance.allMonth[i];
                totalTime = Utils.DateUtils.getDayOfMonth(new Date(key)) * 24 * 60 * 60 * 1000;
                instance.allDtDataForShow.monthData[key].uptime = totalTime - instance.allDtDataForShow.monthData[key].downtime;
            }

            for (i = 0, length = instance.allYear.length; i < length; i++) {
                key = instance.allYear[i];
                totalTime = Utils.DateUtils.getDayOfYear(new Date(key, 1)) * 24 * 60 * 60 * 1000;
                instance.allDtDataForShow.yearData[key].uptime = totalTime - instance.allDtDataForShow.yearData[key].downtime;
            }
        }

        /**
         * 计算重绘参数
         */
        protected redrawChart(redrawStatu = RedrawStatu.Complete) {
            var keyArray = [],
                dataArray = [],
                maxNum,
                currentView = parseInt(this.viewModel.get('selectedCircle'));
            switch (currentView) {
                case CircleViews.Month:
                    keyArray = this.allMonth;
                    dataArray = this.allDtDataForShow.monthData;
                    maxNum = CircleDataNum.Month;
                    break;
                case CircleViews.Year:
                    keyArray = this.allYear;
                    dataArray = this.allDtDataForShow.yearData;
                    maxNum = CircleDataNum.Year;
                    break;
                default: break;
            }

            switch (redrawStatu) {
                case RedrawStatu.Complete:
                    this.redrawStartPoint = 1;
                    break;
                case RedrawStatu.Backoff:
                    this.redrawStartPoint--;
                    if (this.redrawStartPoint <= 0) {
                        this.redrawStartPoint = 1;
                        alert("已经到最前！");
                        return;
                    }
                    break;
                case RedrawStatu.Advance:
                    this.redrawStartPoint++;
                    if (this.redrawStartPoint > keyArray.length - maxNum + 1) {
                        this.redrawStartPoint = keyArray.length - maxNum + 1;
                        alert("已经到最后！");
                        return;
                    }
                    break;
            }

            this._redraw(this.redrawStartPoint, maxNum, keyArray, dataArray);
        }

        /**
         * 重绘图表
         */
        protected _redraw(startPoint: number, maxNum: number, keyArray: any[], dataArray: any[]): void {
            var showData = [],
                minDate = null,
                maxDate = null,
                length = keyArray.length,
                i,
                key;

            keyArray = keyArray || [];
            dataArray = dataArray || [];

            for (i = startPoint - 1; i < length; i++) {
                key = keyArray[i];
                if (typeof dataArray[key] === "undefined" || typeof dataArray[key].times === "undefined" || dataArray[key].times === 0) {
                    continue;
                }

                if (minDate === null) {
                    minDate = key;
                }

                maxDate = key;

                showData.push({
                    circleName: dataArray[key].showName,
                    mtbfValue: ((dataArray[key].uptime / dataArray[key].times) / (1000 * 60 * 60)).toFixed(2),
                    mttrValue: ((dataArray[key].downtime / dataArray[key].times) / (1000 * 60 )).toFixed(2)
                });
                if (showData.length >= maxNum) {
                    break;
                }
            }

            if (showData.length > 0) {
                this.hadData();
                this.viewModel.set('series', showData);
                this.viewModel.set('timeTipsStart', minDate);
                this.viewModel.set('timeTipsEnd', maxDate);
                this.switchChartType();
            } else {
                this.noData();
            }
        }

        /**
         * 切换图表类型
         */
        protected switchChartType() {
            var currentType = parseInt(this.viewModel.get('selectedChartType')),
                mtbfChart = $('#mtbf-chart').data('kendoChart'),
                mttrChart = $('#mttr-chart').data('kendoChart');
            switch (currentType) {
                case ChartType.Line:
                    mtbfChart.options.series[0].type = "line";
                    mttrChart.options.series[0].type = "line";
                    break;
                case ChartType.Column:
                    mtbfChart.options.series[0].type = "column";
                    mttrChart.options.series[0].type = "column";
                    break;
                default: break;
            }

            mtbfChart.refresh();
            mttrChart.refresh();
        }

        /**
         * 刷新数据
         */
        refreshData() {
            super.refreshData();
            var start = this.startTime || Utils.DateUtils.lastDay(new Date()),
                end = this.endTime || new Date(),
                equId = this.equipId;

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
          

            //月_年忽略原则：根据选定的日期，已经过去的时间全部进行计算，如果计算
            //周期包括未来的时间，则忽略该周期
            //eg：当前日期 2016-2-26
            //年-选定 2012-5-1 ~ 2016-2-1 则计算 2012-1-1 ~ 2015-12-31的数据
            //             2012-5-1 ~ 2015-5-1 则计算 2012-1-1 ~ 2015-12-31的数据
            //月-选定 2015-2-5 ~ 2016-2-26 则计算2015-2-1 ~ 2016-1-31的数据
            //             2015-2-5 ~ 2016-1-10 则计算2015-2-1 ~ 2016-1-31的数据
            end = end > (new Date()) ? (new Date()) : end;
            switch (this.viewModel.get('selectedCircle')) {
                case CircleViews.Month:
                    start = new Date(start.getFullYear(), start.getMonth());
                    //由于当前测试数据量不够，所以统计最后一个不足月的数据
                    //(function () {
                    //    var today = new Date();
                    //    if (DateUtils.format(end, 'yyyy-MM') === DateUtils.format(today, 'yyyy-MM')) {
                    //        end = new Date((new Date(end.getFullYear(), end.getMonth())).getTime() - 1);
                    //    } else {
                    //        end = new Date((new Date(DateUtils.nextMonth(end).getFullYear(), DateUtils.nextMonth(end).getMonth())).getTime() - 1);
                    //    }
                    //})();
                    break;
                case CircleViews.Year:
                    start = new Date(start.getFullYear(), 0);
                    if (end.getFullYear() === (new Date()).getFullYear()) {
                        end = new Date(end.getFullYear() - 1, 11, 31);
                    } else {
                        end = new Date(end.getFullYear(), 11, 31);
                    }
                    break;
                default: break;
            }

            kendo.ui.progress(this.view, true);

            try {
                (function (instance: MTBFChart) {
                    instance.getAllData(start, end, equId, () => {
                        var dataFilterTemplate,
                            dataFilterRe,
                            showRecList;

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
                            instance.redrawChart();
                        } else {
                            instance.noData();
                        }
                        kendo.ui.progress(instance.view, false);
                    });
                })(this);
            } catch (e) {
                console.log(e);
            }
        }

        init(view: JQuery): void {
            super.init(view);
            this.initWidgets();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
        }

        update(): void {
            super.update();
            this.initWidgets();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
        }

        dispose(): void {
            super.dispose();
            var mtbfChart = $('#mtbf-chart').data('kendoChart'),
                mttrChart = $('#mttr-chart').data('kendoChart');
            kendo.unbind(this.view);
            if (typeof mtbfChart !== 'undefined') {
                mtbfChart.destroy();
            }
            if (typeof mttrChart !== 'undefined') {
                mttrChart.destroy();
            }
            this.noData();
            this.viewModel.set('selectedCircle', CircleViews.Month);
        }
    }
}