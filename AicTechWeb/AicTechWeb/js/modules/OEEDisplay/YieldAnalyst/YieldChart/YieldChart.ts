﻿/// <reference path = "../../../../reference.ts" />

module AicTech.Web.Html {
    export class YieldChart extends OEEChartBase<YieldDataModel> {
        private allParValueList;

        private allYldDataForShow = {
            baseData: null,
            shiftData: null,
            dateData: null
        };
        private redrawStartPoint: number;
        private allRec = [];
        private allShift = [];
        private allDate = [];
        
        constructor() {
            super([ChartOptionsContent.calcCircle, ChartOptionsContent.dataFilter]);
            this.circlePickerSeries = [{
                circleName: '原始数据',
                circleValue: CircleViews.Original
            }, {
                circleName: '班组',
                circleValue: CircleViews.Shift
            }, {
                circleName: '日',
                circleValue: CircleViews.Day
            }];
            $.extend(this.viewModel, kendo.observable({
                series: [],
                isOverlayShow: true,
                timeTipsStart: 'start',
                timeTipsEnd: 'end',
                advanceData: function (e) {
                    (<YieldChart>Module.ModuleLoad.getModuleInstance('YieldChart')).redrawChart(RedrawStatu.Advance);
                },
                backoffData: function (e) {
                    (<YieldChart>Module.ModuleLoad.getModuleInstance('YieldChart')).redrawChart(RedrawStatu.Backoff);
                }
            }));
            this.viewModel.set('selectedCircle', CircleViews.Original);
        }

        private initWidgets() {
            $('#yield-chart').kendoChart({
                title: {
                    visible: false
                },
                legend: {
                    visible: true,
                    position:'top'
                },
                series: [{
                    field: 'singleValue',
                    name: '单独',
                    axis: 'single',
                    type: 'column'
                }, {
                    field: 'sumValue',
                    name: '累积',
                    axis: 'sum',
                    type: 'line',
                    color:'#3333CC'
                }],
                categoryAxis: [{
                    field:"categoryName",
                    axisCrossingValue: [0, 20]
                }],
                valueAxis: [{
                    name: "single"
                }, {
                    name: "sum",
                    color: "#007EFF"
                 }],
                tooltip: {
                    visible: true,
                    template:"#:category# : #:value#"
                }
            });
        }

        private getAllData(start: Date, end: Date, equId: string, callback: Function) {
            var instance = <YieldChart>Module.ModuleLoad.getModuleInstance('YieldChart'),
                currentData: YieldDataModel,
                recString;
            instance.serviceContext.V_PPA_PER_RECORD
                .order('D_RECORD')
                .filter(function (it) {
                    return it.D_RECORD >= this.start && it.D_RECORD <= this.end && it.EQP_NO == this.equId;
                }, { start: start, end: end, equId: equId })
                .map((it) => {
                    return {
                        recNo: it.REC_NO,
                        recTime: it.D_RECORD,
                        shiftNo: it.SH_NO,
                        actual: it.ACTUAL,
                        shiftId: it.SH_ID,
                        parId: it.PAR_ID,
                        parValue: it.PAR_VALUE
                    };
                })
                .toArray((re) => {
                    if (re.length <= 0) {
                        callback();
                        return;
                    }

                    re.forEach((it) => {
                        currentData = new YieldDataModel(it);
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
                        start = new Date((re[re.length - 1].recTime).getTime() + 1);
                        instance.getAllData(start, end, equId, callback);
                    }
                }).fail((e) => {
                    console.log(e);
                });
        }
        
        /**
         * 数据预处理
         * 计算各个周期的数据
         */
        protected pretreatData(allData: YieldDataModel[]) {
            var instance = <YieldChart>Module.ModuleLoad.getModuleInstance('YieldChart'),
                currentParValue,
                i,
                length,
                recString = "",
                shiftString = "",
                dateString = "";

            instance.allRec = [];
            instance.allShift = [];
            instance.allDate = [];
            instance.allYldDataForShow.baseData = {
                length: 0
            };
            instance.allYldDataForShow.shiftData = {
                length: 0
            };
            instance.allYldDataForShow.dateData = {
                length: 0
            };
          

            allData.forEach((it: YieldDataModel) => {
                recString = it.recNo;
                shiftString = it.shiftNo;
                dateString = Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd');

                //统计原始数据
                if (typeof instance.allYldDataForShow.baseData['total'] === 'undefined') {
                    instance.allYldDataForShow.baseData['total'] = it.actual;
                } else {
                    instance.allYldDataForShow.baseData['total'] += it.actual
                }
                if (typeof instance.allYldDataForShow.baseData[recString] === 'undefined') {
                    instance.allYldDataForShow.baseData[recString] = {
                        recTime: it.recTime,
                        singleValue: it.actual,
                        sumValue: instance.allYldDataForShow.baseData['total'],
                        showName: it.recNo
                    }
                    instance.allYldDataForShow.baseData.length++;
                    instance.allRec.push(recString);
                } else {
                    instance.allYldDataForShow.baseData[recString].singleValue += it.actual;
                    instance.allYldDataForShow.baseData[recString].sumValue += it.actual;
                }

                //统计班组数据
                if (typeof instance.allYldDataForShow.shiftData['total'] === 'undefined') {
                    instance.allYldDataForShow.shiftData['total'] = it.actual;
                } else {
                    instance.allYldDataForShow.shiftData['total'] += it.actual;
                }
                if (typeof instance.allYldDataForShow.shiftData[shiftString] === 'undefined') {
                    instance.allYldDataForShow.shiftData[shiftString] = {
                        recTime: it.recTime,
                        singleValue: it.actual,
                        sumValue: instance.allYldDataForShow.shiftData['total'],
                        showName: Utils.DateUtils.format(it.recTime, 'MM-dd') + ":" + it.shiftId
                    }
                    instance.allYldDataForShow.shiftData.length++;
                    instance.allShift.push(shiftString);
                } else {
                    instance.allYldDataForShow.shiftData[shiftString].singleValue += it.actual;
                    instance.allYldDataForShow.shiftData[shiftString].sumValue += it.actual;
                }

                //统计按日计算数据
                if (typeof instance.allYldDataForShow.dateData['total'] === 'undefined') {
                    instance.allYldDataForShow.dateData['total'] = it.actual;
                } else {
                    instance.allYldDataForShow.dateData['total'] += it.actual;
                }
                if (typeof instance.allYldDataForShow.dateData[dateString] === 'undefined') {
                    instance.allYldDataForShow.dateData[dateString] = {
                        recTime: it.recTime,
                        singleValue: it.actual,
                        sumValue: instance.allYldDataForShow.dateData['total'],
                        showName: Utils.DateUtils.format(it.recTime, 'yyyy-MM-dd')
                    }
                    instance.allYldDataForShow.dateData.length++;
                    instance.allDate.push(dateString);
                } else {
                    instance.allYldDataForShow.dateData[dateString].singleValue += it.actual;
                    instance.allYldDataForShow.dateData[dateString].sumValue += it.actual;
                } 
            });
        }

        protected redrawChart(redrawStatu = RedrawStatu.Complete) {
            var keyArray = [],
                dataArray = [],
                maxNum,
                currentView = parseInt(this.viewModel.get('selectedCircle'));
            switch (currentView) {
                case CircleViews.Original:
                    keyArray = this.allRec;
                    dataArray = this.allYldDataForShow.baseData;
                    maxNum = CircleDataNum.Orginal;
                    break;
                case CircleViews.Shift:
                    keyArray = this.allShift;
                    dataArray = this.allYldDataForShow.shiftData;
                    maxNum = CircleDataNum.Shift;
                    break;
                case CircleViews.Day:
                    keyArray = this.allDate;
                    dataArray = this.allYldDataForShow.dateData;
                    maxNum = CircleDataNum.Day;
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

        protected _redraw(startPoint: number, maxNum: number, keyArray: any[], dataArray: any[]) {
            var showData = [],
                minDate = new Date(),
                maxDate = new Date('1971-01-01'),
                length = keyArray.length,
                i,
                key;

            keyArray = keyArray || [];
            dataArray = dataArray || [];

            for (i = startPoint-1; i < length; i++) {
                key = keyArray[i];

                if (dataArray[key].recTime <= minDate) {
                    minDate = dataArray[key].recTime;
                }
                if (dataArray[key].recTime >= maxDate) {
                    maxDate = dataArray[key].recTime;
                }

                showData.push({
                    categoryName: dataArray[key].showName,
                    singleValue: dataArray[key].singleValue.toFixed(3),
                    sumValue: dataArray[key].sumValue.toFixed(3)
                });
                
                if (showData.length >= maxNum) {
                    break;
                }
            }

            if (showData.length > 0) {
                this.viewModel.set('series', showData);
                this.viewModel.set('timeTipsStart', Utils.DateUtils.format(minDate, 'yyyy-MM-dd'));
                this.viewModel.set('timeTipsEnd', Utils.DateUtils.format(maxDate, 'yyyy-MM-dd'));
                this.hadData();
            } else {
                this.noData();
            }
        }



        refreshData() {
            super.refreshData();
            var start = this.startTime || Utils.DateUtils.lastDay(new Date()),
                end = this.endTime || new Date(),
                equId = this.equipId;

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

            kendo.ui.progress(this.view.find('.aic-chart'), true);

            try {
                (function (instance: YieldChart) {
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
            var chart = $('#yield-chart').data('kendoChart');
            kendo.unbind(this.view);
            if (typeof chart !== 'undefined') {
                chart.destroy();
            }
            this.viewModel.set('selectedCircle', CircleViews.Original);
            this.noData();
        }
    }
}