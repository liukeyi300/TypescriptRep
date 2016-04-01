/// <reference path="../../../../reference.ts" />

module AicTech.Web.Html {
    export class EquipmentDTPercent extends Module.ModuleBase {
        private chartType = [{
            chartTypeName: "柱状图",
            chartTypeValue: ChartType.Column
        }, {
            chartTypeName: "饼图",
            chartTypeValue: ChartType.Pie
        }];

        private allDtData: DowntimeWithEqp[] = [];
        private allParData;
        private allParValueList;

        private allSeriesData;
        private allKeys = [];
        private totalTime = 0;
        private totalTimes = 0;
        private allRec = [];

        private chartColumnOptions = {
            series: [{
                field: "dtTime",
                name: "停机时间",
                axis: "dtTime",
                type:'column',
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
        private chartPieOptions = {
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
            valueAxis:[]
        };

        constructor() {
            super();
            this.viewModel = kendo.observable({
                series: [],
                isOverlayShow: true,
                selectedCalcMethod: 0,
                calcMethodSelectChanged: function (e) {
                    (<EquipmentDTPercent>Module.ModuleLoad.getModuleInstance('EquipmentDTPercent'))._redraw();
                },
                selectedChartType: ChartType.Column,
                chartTypeChanged: function (e) {
                    (<EquipmentDTPercent>Module.ModuleLoad.getModuleInstance('EquipmentDTPercent')).switchChartType();
                },
                selectedDataFilter: [],
                dataFilterSeries: [],
                dataFilterChanged: function (e) {
                    var instance = <EquipmentDTPercent>Module.ModuleLoad.getModuleInstance('EquipmentDTPercent'),
                        showRecList = [];
                    showRecList = instance.filterData();
                    instance.pretreatData(showRecList);
                    instance._redraw();
                },
                filterData: function (e) {
                    var selectedFilter: any[] = this.get('selectedDataFilter'),
                        instance = <EquipmentDTPercent>Module.ModuleLoad.getModuleInstance("EquipmentDTPercent"),
                        showRecList = [];
                    if (selectedFilter.length > 0) {
                        showRecList = instance.filterData();
                        instance.pretreatData(showRecList);
                        instance._redraw();
                    }
                }
            });
        }

        private initWidgets() {
            var chartTypeTemplate = kendo.template($('#chart-type-list').html()),
                calcMethodTemplate = kendo.template($('#calc-method-list').html()),
                dataFilterTemplate = kendo.template($('#data-filter-list').html()),
                chartRe = chartTypeTemplate(this.chartType),
                calcMethodRe = calcMethodTemplate([]),
                dataFilterRe = dataFilterTemplate([]);

            $('.aic-chart-options').empty();

            $('#equip-dtpercent-chart').kendoChart({
                title: {
                    visible: false
                },
                legend: {
                    visible: true,
                    position:'top'
                }
            });

            $(chartRe).appendTo($('.aic-chart-options'));
            $(calcMethodRe).appendTo($('.aic-chart-options'));
            $(dataFilterRe).appendTo($('.aic-chart-options'));
        }
        
        private getAllData(start: Date, end: Date, equId: string, callback: Function): void {
            var instance = <EquipmentDTPercent>Module.ModuleLoad.getModuleInstance('EquipmentDTPercent'),
                currentData: DowntimeWithEqp,
                recString;
            instance.serviceContext.V_PPA_DT_RECORD
                .order('DT_START_TIME')
                .filter(function (it) {
                    return it.DT_START_TIME >= this.start && it.DT_START_TIME <= this.end && it.MASTER_NO == this.equId;
                }, { start: start, end: end, equId: equId })
                .map((it) => {
                return {
                    recNo: it.REC_NO,
                    equNo: it.EQP_NO,
                    equName: it.EQP_NAME,
                    startTime: it.DT_START_TIME,
                    endTime: it.DT_END_TIME,
                    dtCause: it.DT_CAU_ID,
                    parId: it.PAR_ID,
                    parValue: it.PAR_VALUE
                    }
                })
                .toArray((re) => {
                    if (re.length <= 0) {
                        callback();
                        return;
                    }

                    re.forEach((it) => {
                        currentData = new DowntimeWithEqp(it);
                        recString = it.recNo;

                        //根据DEF_ID对原始数据分组
                        if (instance.allRec.indexOf(recString) === -1) {
                            instance.allDtData.push(currentData);
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
                }).fail((e) => {
                    console.log(e);
                });
        }

        /**
         * 根据参数条件对参数数组进行交叉对比，最后获取符合当前参数筛选的数据数组
         */
        private filterData(): DowntimeWithEqp[]{
            var instance: EquipmentDTPercent = <EquipmentDTPercent>Module.ModuleLoad.getModuleInstance('EquipmentDTPercent'),
                parData = instance.allParData,
                selectedPar: string[] = instance.viewModel.get('selectedDataFilter') || [],
                parNums = selectedPar.length,
                recList: string[] = [],
                result: DowntimeWithEqp[] = [],
                isBreak = false,
                currentList = [],
                i,
                parValue = $('#' + selectedPar[0]).val();

            if (selectedPar.length === 0) {
                return instance.allDtData;
            }

            parData[selectedPar[0]] = parData[selectedPar[0]] || [];
            parData[selectedPar[0]].filter(function (it: { recNo: string, parValue: string }) {
                return it.parValue === parValue;
            }).forEach((it) => {
                recList.push(it.recNo);
            });

            for (i = 1; i < parNums && recList.length > 0; i++) {
                currentList = [];
                parValue = $('#' + selectedPar[i]).val();
                parData[selectedPar[i]].filter(function (it: { recNo: string, parValue: string }) {
                    return it.parValue === parValue;
                }).forEach((it) => {
                    currentList.push(it.recNo);
                });
                if (currentList.length === 0) {
                    recList = [];
                    break;
                } else {
                    recList = recList.filter(function (it) {
                        return currentList.indexOf(it) > -1;
                    });
                    if (recList.length === 0) {
                        break;
                    }
                }
            }

            result = instance.allDtData.filter(function (it: IRecord) {
                return recList.indexOf(it.recNo) > - 1;
            });
            return result;
        }

        /**
       * 数据预处理
       * 计算各个周期的数据
       */
        private pretreatData(allData: DowntimeWithEqp[]) {
            var instance = <EquipmentDTPercent>Module.ModuleLoad.getModuleInstance('EquipmentDTPercent'),
                dtTime: number;

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

            allData.forEach((it: DowntimeWithEqp) => {
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
                        } else {
                            instance.allSeriesData[it.equName].dtTime += dtTime;
                            instance.allSeriesData[it.equName].times++;
                        }
                    } else {
                        alert("该记录：" + it.recNo + "无效，将不会被记录到计算结果中！\n原因：起始时间小于结束时间\n");
                    }
                }
            });
        }

        /**
         * 重绘图表
         */
        private _redraw() {
            var showData = [],
                currentTime = 0,
                currentCalcMethod = parseInt(this.viewModel.get('selectedCalcMethod')),
                chart = $('#equip-dtpercent-chart').data('kendoChart');
            for (var key in this.allSeriesData) {
                if (key === "length") {
                    continue;
                }
                showData.push(this.allSeriesData[key]);
            }

            if (currentCalcMethod === 1) {
                showData.sort((a: { dtTime: number }, b: { dtTime: number }) => {
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
            } else {
                showData.sort((a: { times: number }, b: { times: number }) => {
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
            } else {
                this.noData();
            }
        }

        /**
        * 切换图表类型
        */
        private switchChartType() {
            var currentType = parseInt(this.viewModel.get('selectedChartType')),
                chart = $('#equip-dtpercent-chart').data('kendoChart'),
                instance: EquipmentDTPercent = <EquipmentDTPercent>Module.ModuleLoad.getModuleInstance('EquipmentDTPercent');
            switch (currentType) {
                case ChartType.Column:
                    chart.setOptions(instance.chartColumnOptions)
                    break;
                case ChartType.Pie:
                    chart.setOptions(instance.chartPieOptions);
                    break;
                default: break;
            }
            
            chart.refresh();
        }

        private noData() {
            this.viewModel.set('isOverlayShow', true);
            this.viewModel.set('series', []);
        }
        private hadData() {
            this.viewModel.set('isOverlayShow', false);
        }

        /**
         * 刷新图表数据
         */
        refreshData(): void {
            super.refreshData();
            var start = this.startTime || Utils.DateUtils.lastDay(new Date()),
                end = this.endTime || new Date(),
                equId = this.equipId;

            if (typeof equId === "undefined" || equId === "") {
                this.viewModel.set('isOverlayShow', true);
                return;
            }

            this.allDtData = [];
            this.allParData = {
                length: 0
            };
            this.allParValueList = {
                length: 0
            };
            this.allRec = [];

            kendo.ui.progress(this.view, true);

            try {
                (function (instance: EquipmentDTPercent) {
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

                        if (instance.allDtData.length > 0) {
                            showRecList = instance.filterData();
                            instance.pretreatData(showRecList);
                            instance._redraw();
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
            var chart = $('#equip-dtpercent-chart').data('kendoChart');
            kendo.unbind(this.view);
            if (typeof chart !== 'undefined') {
                chart.destroy();
            }
            this.noData();
            this.viewModel.set('selectedChartType', ChartType.Column);
        }
    }
}