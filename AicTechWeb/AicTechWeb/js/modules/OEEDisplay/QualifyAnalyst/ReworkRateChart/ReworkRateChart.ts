/// <reference path="../../../../reference.ts" />

module AicTech.Web.Html {
    export class ReworkRateChart extends OEEChartBase<ReworkRtDataModel> {
        private allParValueList;

        private allRwkDataForShow = {
            shiftData: null,
            dateData: null,
            weekData: null,
            monthData: null
        };
        private redrawStartPoint: number;
        private allShift = [];
        private allDate = [];
        private allWeek = [];
        private allMonth = [];
        private allRec = [];

        constructor() {
            super([ChartOptionsContent.calcCircle, ChartOptionsContent.dataFilter]);
            this.circlePickerSeries = [{
                circleName: '班组',
                circleValue: CircleViews.Shift
            }, {
                circleName: '日',
                circleValue: CircleViews.Day
            }, {
                circleName: '周',
                circleValue: CircleViews.Week
            }, {
                circleName: '月',
                circleValue: CircleViews.Month
            }];

            $.extend(this.viewModel, kendo.observable({
                timeTipsStart: Utils.DateUtils.format(Utils.DateUtils.lastDay(new Date()), 'yyyy-MM-dd'),
                timeTipsEnd: Utils.DateUtils.format(new Date(), 'yyyy-MM-dd'),
                advanceData: function (e) {
                    (<ReworkRateChart>Module.ModuleLoad.getModuleInstance('ReworkRateChart')).redrawChart(RedrawStatu.Advance);
                },
                backoffData: function (e) {
                    (<ReworkRateChart>Module.ModuleLoad.getModuleInstance('ReworkRateChart')).redrawChart(RedrawStatu.Backoff);
                }
            }));

            this.viewModel.set("selectedCircle", CircleViews.Shift);
        }

        private initWidgets() {
            $('#rework-percent-chart').kendoChart({
                legend: {
                    visible: false
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{
                    field: "reworkP",
                    name: "Rework Percent",
                    tooltip: {
                        visible: true,
                        template: "#=dataItem.circleName# : #=dataItem.reworkP# %"
                    }
                }],
                categoryAxis: [{
                    field: "circleName"
                }]
            });
        }
        
        /**
         * 获取所有数据
         */
        private getAllData(start: Date, end: Date, equId: string, callback: Function) {
            var instance = <ReworkRateChart>Module.ModuleLoad.getModuleInstance("ReworkRateChart"),
                currentData: ReworkRtDataModel,
                recString;
            instance.serviceContext.V_PPA_QA_RECORD
                .order("D_RECORD")
                .filter(function (it) {
                    return it.D_RECORD >= this.start && it.D_RECORD <= this.end && it.EQP_NO == this.equId;
                }, { start: start, end: end, equId: equId })
                .map((it) => {
                    return {
                        recNo: it.REC_NO,
                        recTime: it.D_RECORD,
                        shiftNo: it.SH_NO,
                        rework: it.REWORK,
                        total: it.TOTAL,
                        parId: it.PAR_ID,
                        parValue: it.PAR_VALUE,
                        shiftId: it.SH_ID
                    };
                })
                .toArray((re) => {

                    if (re.length <= 0) {
                        callback();
                        return;
                    } else {
                        re.forEach((it) => {
                            currentData = new ReworkRtDataModel(it);
                            recString = currentData.recNo;

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
                            start = new Date(re[re.length - 1].recTime.getTime() + 1);
                            instance.getAllData(start, end, equId, callback);
                        }
                    }
                }).fail((e) => {
                    callback();
                    console.log("error!" + e.toString());
                });
        }
        
        /**
         * 数据预处理
         * 计算各个周期的数据
         */
        protected pretreatData(allData: ReworkRtDataModel[]) {
            var instance = <ReworkRateChart>Module.ModuleLoad.getModuleInstance('ReworkRateChart'),
                currentParValue,
                i,
                length,
                shiftString = "",
                dateString = "",
                weekString = "",
                monthString = "";

            instance.allShift = [];
            instance.allDate = [];
            instance.allWeek = [];
            instance.allMonth = [];
            instance.allRwkDataForShow.shiftData = {
                length: 0
            };
            instance.allRwkDataForShow.dateData = {
                length: 0
            };
            instance.allRwkDataForShow.weekData = {
                length: 0
            };
            instance.allRwkDataForShow.monthData = {
                length: 0
            };

            allData.forEach((it: ReworkRtDataModel) => {
                dateString = Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd'),
                weekString = "",
                monthString = Utils.DateUtils.format(it.recTime, 'yyyy-MM');

                //统计班组数据
                if (typeof instance.allRwkDataForShow.shiftData[it.shiftNo + ""] === "undefined") {
                    instance.allRwkDataForShow.shiftData[it.shiftNo + ""] = {
                        showName: Utils.DateUtils.format(it.recTime, 'MM-dd') + ":" + it.shiftId,
                        recTime: it.recTime,
                        rework: it.rework,
                        total: it.total
                    };
                    instance.allRwkDataForShow.shiftData.length++;
                    instance.allShift.push(it.shiftNo);
                } else {
                    instance.allRwkDataForShow.shiftData[it.shiftNo].rework += it.rework;
                    instance.allRwkDataForShow.shiftData[it.shiftNo].total += it.total;
                }

                //统计日计算数据
                if (typeof instance.allRwkDataForShow.dateData[dateString] === "undefined") {
                    instance.allRwkDataForShow.dateData[dateString] = {
                        showName: dateString,
                        recTime: it.recTime,
                        rework: it.rework,
                        total: it.total
                    };
                    instance.allRwkDataForShow.dateData.length++;
                    instance.allDate.push(dateString);
                } else {
                    instance.allRwkDataForShow.dateData[dateString].rework += it.rework;
                    instance.allRwkDataForShow.dateData[dateString].total += it.total;
                }

                //统计周计算数据
                //在记录D_RECORD的时候，每个周的统计周期只记录当前周的第一天
                //周索引记录规则：W加上第几周，故周索引数组长度即为当前第几周的数字
                var currentDate: Date = new Date(it.recTime.getFullYear(), it.recTime.getMonth(), it.recTime.getDate());
                if (instance.allWeek.length === 0) {
                    (function () {
                        var startDate = new Date(currentDate.getTime() - currentDate.getDay() * 1000 * 60 * 60 * 24);
                        startDate = startDate < instance.startTime ? instance.startTime : startDate;
                        weekString = "W1-" + Utils.DateUtils.format(startDate, 'yyyy/MM/dd');
                    })();
                } else {
                    var lastDay: Date = instance.allRwkDataForShow.weekData[instance.allWeek[instance.allWeek.length - 1]].recTime,
                        lastDate: Date = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate()),
                        weekDiffer = ((currentDate.getTime() - currentDate.getDay() * 1000 * 60 * 60 * 24) -
                            (lastDate.getTime() - lastDate.getDay() * 1000 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24 * 7);

                    if (weekDiffer > 0) {
                        for (var i = 0; i < weekDiffer - 1; i++) {
                            instance.allWeek.push("W" + (instance.allWeek.length + i + 1));
                        }
                        (function () {
                            var startDate = new Date(currentDate.getTime() - currentDate.getDay() * 1000 * 60 * 60 * 24);
                            weekString = "W" + (instance.allWeek.length + 1) + "-" + Utils.DateUtils.format(startDate, 'yyyy/MM/dd');
                        })();
                    } else {
                        weekString = instance.allWeek[instance.allWeek.length - 1];
                    }
                }
                if (typeof instance.allRwkDataForShow.weekData[weekString] === "undefined") {
                    instance.allRwkDataForShow.weekData[weekString] = {
                        showName: weekString,
                        recTime: it.recTime,
                        rework: it.rework,
                        total: it.total
                    };
                    instance.allRwkDataForShow.weekData.length++;
                    instance.allWeek.push(weekString);
                } else {
                    instance.allRwkDataForShow.weekData[weekString].rework += it.rework;
                    instance.allRwkDataForShow.weekData[weekString].total += it.total;
                }

                //统计月计算数据
                if (typeof instance.allRwkDataForShow.monthData[monthString] === "undefined") {
                    instance.allRwkDataForShow.monthData[monthString] = {
                        showName: monthString,
                        recTime: it.recTime,
                        rework: it.rework,
                        total: it.total
                    };
                    instance.allRwkDataForShow.monthData.length++;
                    instance.allMonth.push(monthString);
                } else {
                    instance.allRwkDataForShow.monthData[monthString].rework += it.rework;
                    instance.allRwkDataForShow.monthData[monthString].total += it.total;
                }

            });
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
                case CircleViews.Shift:
                    keyArray = this.allShift;
                    dataArray = this.allRwkDataForShow.shiftData;
                    maxNum = CircleDataNum.Shift;
                    break;
                case CircleViews.Day:
                    keyArray = this.allDate;
                    dataArray = this.allRwkDataForShow.dateData;
                    maxNum = CircleDataNum.Day;
                    break;
                case CircleViews.Week:
                    keyArray = this.allWeek;
                    dataArray = this.allRwkDataForShow.weekData;
                    maxNum = CircleDataNum.Week;
                    break;
                case CircleViews.Month:
                    keyArray = this.allMonth;
                    dataArray = this.allRwkDataForShow.monthData;
                    maxNum = CircleDataNum.Month;
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
                minDate = new Date(),
                maxDate = new Date('1971-01-01'),
                length = keyArray.length,
                i,
                key;

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
                } else {
                    if (dataArray[key].recTime <= minDate) {
                        minDate = dataArray[key].recTime;
                    }
                    if (dataArray[key].recTime >= maxDate) {
                        maxDate = dataArray[key].recTime;
                    }
                }

                showData.push({
                    circleName: dataArray[key].showName,
                    reworkP: (dataArray[key].rework * 100 / dataArray[key].total).toFixed(2)
                });
                if (showData.length >= maxNum) {
                    break;
                }
            }

            if (showData.length > 0) {
                this.hadData();
                this.viewModel.set('series', showData);
                this.viewModel.set('timeTipsStart', Utils.DateUtils.format(minDate, 'yyyy-MM-dd'));
                this.viewModel.set('timeTipsEnd', Utils.DateUtils.format(maxDate, 'yyyy-MM-dd'));
            } else {
                this.noData();
            }
        }

        /**
        * 刷新数据
        */
        refreshData() {
            super.refreshData();
            var start = this.startTime || Utils.DateUtils.lastDay(new Date()),
                end = this.endTime || (new Date()),
                equId = this.equipId;

            if (typeof equId === "undefined" || equId === "") {
                this.noData()
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
                (function (instance: ReworkRateChart) {
                    instance.getAllData(start, end, equId, () => {
                        var dataFilterTemplate,
                            dataFilterRe,
                            showRecList;

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
                    })
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
            var chart = $('#rework-percent-chart').data('kendoChart');
            if (typeof chart !== 'undefined') {
                kendo.unbind(this.view);
            }
            chart.destroy();
            this.noData();
            this.viewModel.set('selectedCircle', CircleViews.Shift);
        }
    }
}