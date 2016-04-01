/// <reference path="../../../reference.ts" />

module AicTech.Web.Html {
    export class OEEChart extends Module.ModuleBase {
        private static maxShowDataNum = 8;

        private allSeriesData = [];
        private redrawStartPoint;

        constructor() {
            super();
            this.viewModel = kendo.observable({
                series: [],
                advanceData: function (e) {
                    (<OEEChart>Module.ModuleLoad.getModuleInstance('OEEChart')).redrawChart(RedrawStatu.Advance);
                },
                backoffData: function (e) {
                    (<OEEChart>Module.ModuleLoad.getModuleInstance('OEEChart')).redrawChart(RedrawStatu.Backoff);
                },
                timeTipsStart: 'start', 
                timeTipsEnd: 'end',
                isOverlayShow: true
            });
        }
        
        private initWidgets() {
            $("#oee-chart").kendoChart({
                legend: {
                    position: "top"
                },
                seriesDefaults: {
                    type: "column",
                    spacing: 0
                },
                series: [{
                    field: "oeeAVA",
                    name: "OEEAVA",
                    color: "#33CC00"
                }, {
                    field: "oeePER",
                    name: "OEEPER"
                }, {
                    field: "oeeQUA",
                    name: "OEEQUE"
                }, {
                    field: "oeeCOM",
                    name: "OEECOM",
                    type: "line",
                    color: "#3333CC"
                }],
                categoryAxis: [{
                    field: "oeeStartTime",
                }],
                valueAxis: [{
                    labels: {
                        format: "{0}"
                    },
                    majorUnit: 0.1,
                    axisCrossingValue: 0
                }],
                tooltip: {
                    visible: true,
                    format: "{0}",
                    template: "#= series.name #: #= value #"
                }
            });
        }
        
        /**
         * 刷新表格数据
         */
        refreshData(): void {
            super.refreshData();
            var start = this.startTime,
                end = this.endTime,
                equId = this.equipId;

            if (typeof equId === "undefined" || equId === "") {
                this.noData();
                return;
            } 

            this.allSeriesData = [];
            kendo.ui.progress(this.view, true);

            try {
                (function (instance: OEEChart) {
                    instance.getAllData(start, end, equId, () => {
                        if (instance.allSeriesData.length > 0) {
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

        /**
         * 获取所有数据
         */
        private getAllData(start: Date, end: Date, equId: string, callback: Function) {
            this.serviceContext.PPA_OEE_SUMMARY
                .order('PER_START_TIME')
                .filter(function (items) {
                    return (items.PER_START_TIME >= this.startDate && items.PER_START_TIME <= this.endDate
                        && items.EQP_NO == this.equid);
                }, {
                        startDate: start, endDate: end,
                        equid: equId
                    })
                .map(function (it) {
                    return {
                        oeeStartTime: it.PER_START_TIME,
                        oeeAVA: it.PPA_AVA,
                        oeePER: it.PPA_PER,
                        oeeQUA: it.PPA_QUA,
                        oeeCOM: it.PPA_COM
                    };
                })
                .toArray((re) => {
                    if (re.length <= 0) {
                        callback();
                        return;
                    } else {
                        this.allSeriesData = this.allSeriesData || [];
                        re.forEach((it) => {
                            this.allSeriesData.push(it);
                        });

                        if (re.length < 100) {
                            callback();
                            return;
                        } else {
                            start = new Date(re[re.length - 1].oeeStartTime.getTime() + 1);
                            this.getAllData(start, end, equId, callback);
                        }
                    }
                }).fail((e) => {
                    callback();
                    console.log("error!" + e.toString());
                });
        }

        /**
         * 计算重绘参数 
         */
        private redrawChart(redrawStatu = RedrawStatu.Complete) {
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
                    if (this.redrawStartPoint > this.allSeriesData.length - OEEChart.maxShowDataNum + 1) {
                        this.redrawStartPoint = this.allSeriesData.length - OEEChart.maxShowDataNum + 1;
                        alert("已经到最后！");
                        return;
                    }
                    break;
                default: break;
            }

            this._redraw();
        }

        /**
         * 重绘图标
         */
        private _redraw() {
            var showData = [],
                max = OEEChart.maxShowDataNum,
                allData = this.allSeriesData,
                start = this.redrawStartPoint,
                minDate = new Date(),
                maxDate = new Date('1971-01-01'),
                length = allData.length,
                i;

            for (i = start - 1; i < length; i++) {
                if (allData[i].oeeStartTime <= minDate) {
                    minDate = allData[i].oeeStartTime;
                }
                if (allData[i].oeeStartTime >= maxDate) {
                    maxDate = allData[i].oeeStartTime;
                }

                showData.push({
                    oeeStartTime: Utils.DateUtils.format(allData[i].oeeStartTime, 'M-d hh:mm'),
                    oeeAVA: allData[i].oeeAVA,
                    oeePER: allData[i].oeePER,
                    oeeQUA: allData[i].oeeQUA,
                    oeeCOM: allData[i].oeeCOM
                });

                if (showData.length >= max) {
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

        private noData() {
            this.viewModel.set('isOverlayShow', true);
            this.viewModel.set('series', []);
        }

        private hadData() {
            this.viewModel.set('isOverlayShow', false);
        }

        init(view: JQuery): void {
            super.init(view);
            this.initWidgets();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
        }
        
        update() {
            super.update();
            this.initWidgets();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
        }

        dispose() {
            super.dispose();
            var chart = $("#oee-chart").data("kendoChart");
            kendo.unbind(this.view);
            if (typeof chart !== 'undefined') {
                chart.destroy();
            }
            this.startTime = null;
            this.endTime = null;
        }
    }
}