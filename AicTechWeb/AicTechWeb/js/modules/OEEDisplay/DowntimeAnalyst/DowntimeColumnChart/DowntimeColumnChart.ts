/// <reference path="../../../../reference.ts" />

module AicTech.Web.Html {
    export class DowntimeColumnChart extends OEEChartBase<Downtime> {
        private allParValueList;
        private allSeriesData;
        private allKeys = [];
        private totalTime = 0;
        private totalTimes = 0;
        private allRec = [];

        constructor() {
            super([ChartOptionsContent.calcMethod, ChartOptionsContent.dataFilter]);
        }

        private initWidgets(): void {
            $("#downtime-column-chart").kendoChart({
                legend: {
                    visible: true,
                    position:"top"
                },
                seriesDefaults: {
                    type:"column"
                },
                series: [{
                    field: "dtTime",
                    name: "停机时间",
                    axis: "dtTime",
                    tooltip: {
                        visible: true,
                        template: "#= dataItem.showName # - #= dataItem.dtCauId # : #= value #mins"
                    }
                }, {
                    field: "currentPercent",
                    name:"停机时间占比",
                    axis: "dtPercent",
                    type: "line",
                    tooltip: {
                        visible: true,
                        template: "#= dataItem.showName # : #= dataItem.currentPercent # %" 
                    },
                    color:"#007EFF"
                }],
                categoryAxis: [{
                    field: "dtCauId",
                    majorGridLines: {
                        visible: false
                    },
                    axisCrossingValue: [0,10],
                    justified: true
                }],
                valueAxis: [{
                    name: "dtTime",
                    min: 0
                }, {
                    name: "dtPercent",
                    min: 0,
                    max: 105,
                    color:"#007EFF"
                }]
            });
        }

        /**
         * 获取所有数据
         */
        private getAllData(start: Date, end: Date, equId: string, callback: Function) {
            var instance = <DowntimeColumnChart>Module.ModuleLoad.getModuleInstance('DowntimeColumnChart'),
                currentData: Downtime,
                recString: string;
            instance.serviceContext.V_PPA_DT_RECORD
                    .order('DT_START_TIME').
                    filter(function (items) {
                        return (items.DT_START_TIME >= this.startDate && items.DT_END_TIME <= this.endDate
                            && items.EQP_NO == this.equid);
                    }, { startDate: start, endDate: end, equid: equId })
                    .map((it) => {
                        return {
                            recTime: it.DT_START_TIME,
                            startTime: it.DT_START_TIME,
                            endTime: it.DT_END_TIME,
                            dtCause: it.DT_CAU_ID,
                            recNo: it.REC_NO,
                            parId: it.PAR_ID,
                            parValue: it.PAR_VALUE
                        }
                    })
                    .toArray((re) => {
                        if (re.length <= 0) {
                            callback();
                            return;
                        } else {
                            re.forEach((it) => {
                                currentData = new Downtime(it);
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
                                start = new Date(re[re.length - 1].startTime.getTime() + 1);
                                this.getAllData(start, end, equId, callback);
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
        protected pretreatData(allData: Downtime[]) {
            var instance = <DowntimeColumnChart>Module.ModuleLoad.getModuleInstance('DowntimeColumnChart'),
                dtTime: number;

            this.allSeriesData = {
                length: 0
            };
            this.allKeys = [];
            this.totalTime = 0;
            this.totalTimes = 0;
            this.allKeys = [];

            allData.forEach((it: Downtime) => {
                if (it.endTime !== null) {
                    dtTime = (it.endTime.getTime() - it.startTime.getTime()) / 60000;
                    if (dtTime >= 0) {
                        instance.totalTime += dtTime;
                        instance.totalTimes++;
                        if (typeof instance.allSeriesData[it.dtCause + ""] === "undefined") {
                            instance.allSeriesData[it.dtCause + ""] = {
                                showName: StartUp.Instance.currentEquipmentName,
                                dtTime: dtTime,
                                dtCauId: it.dtCause,
                                currentPercent: 0,
                                times: 1
                            };

                            instance.allSeriesData.length++;
                            instance.allKeys.push(it.dtCause);
                        } else {
                            instance.allSeriesData[it.dtCause + ""].dtTime += dtTime;
                            instance.allSeriesData[it.dtCause + ""].times++;
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
        protected _redraw() {
            var showData = [],
                currentTime = 0,
                currentCalcMethod = parseInt(this.viewModel.get('selectedCalcMethod')),
                chart = $('#downtime-column-chart').data('kendoChart'),
                chartSeries = chart.options.series;
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
                chartSeries[0].name = "停机时间";
                chartSeries[0].field = "dtTime";
                chartSeries[0].tooltip.template = "#= dataItem.showName # - #= dataItem.dtCauId # : #= value #mins";
            } else {
                showData.sort((a: { times: number }, b: { times: number }) => {
                    return b.times - a.times;
                });

                for (var i = 0, length = showData.length; i < length; i++) {
                    currentTime += showData[i].times;
                    showData[i].currentPercent = (currentTime * 100 / this.totalTimes).toFixed(2);
                }
                chartSeries[0].name = "停机次数";
                chartSeries[0].field = 'times';
                chartSeries[0].tooltip.template = "#= dataItem.showName # - #= dataItem.dtCauId # : #= value #次";
            }

            if (showData.length > 0) {
                chart.setOptions({
                    series: chartSeries
                });
                chart.refresh();

                this.viewModel.set('series', showData);
                this.hadData();
            } else {
                this.noData();
            }
        }

        //#region override methods
        /**
         * 刷新图表数据
         */
        refreshData(): void {
            super.refreshData();
            var start = this.startTime || Utils.DateUtils.lastDay(new Date()),
                endTime = this.endTime || new Date(),
                equId = this.equipId;

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
                (function (instance: DowntimeColumnChart) {
                    instance.getAllData(start, endTime, equId, () => {
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
            var chart = $("#downtime-column-chart").data("kendoChart");
            kendo.unbind(this.view);
            if (typeof chart !== 'undefined') {
                chart.destroy();
            }
            this.noData();
            this.viewModel.set('selectedCalcMethod', 0);
        }
        //#endregion
    }
}