﻿/// <reference path="../../reference.ts" />
module OEEDemos {
    export class DowntimeColumnCharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: AccountHelpUtils.serviceAddress + AccountHelpUtils.ppaEntitiesDataRoot
        });
        needEquiptree = true;
        view: JQuery;
        viewModel= kendo.observable({
            columnChartsSeries: [{
                id: "",
                dtTime: 0,
                dtCauId: "",
                currentPercent:0
            }]
        });
        equipmentTree: Navigations;
        private currentEquipment: string;
        private startTime: Date;
        private endTime: Date;

        constructor() {}

        private timeRangeListner(startTime: Date, endTime: Date): void {
            var dtInstance: DowntimeColumnCharts = ModuleLoad.getModuleInstance("DowntimeColumnCharts");
            dtInstance.startTime = startTime;
            dtInstance.endTime = endTime;
            dtInstance.refreshData();
        }

        private equipNodeSelectListner(e: kendo.ui.TreeViewSelectEvent, sender): void {
            var dtInstance: DowntimeColumnCharts = ModuleLoad.getModuleInstance("DowntimeColumnCharts");
            dtInstance.currentEquipment = sender.dataItem(e.node).id;
            dtInstance.refreshData();
        }

        private initCharts(): void {
            $("#downtime-column-charts").kendoChart({
                //title: {
                //    text:"DownTime Column Chart"
                //},
                legend: {
                    visible: true,
                    position:"top"
                },
                seriesDefaults: {
                    type:"column"
                },
                series: [{
                    field: "dtTime",
                    name:"DownTime",
                    axis: "dtTime",
                    tooltip: {
                        visible: true,
                        template: "#= dataItem.id # - #= dataItem.dtCauId # : #= value #mins"
                    }
                }, {
                    field: "currentPercent",
                    name:"DownTime Percent",
                    axis: "totalDtTime",
                    type: "line",
                    tooltip: {
                        visible: true,
                        template:"#= dataItem.currentPercent # %" 
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
                    name: "totalDtTime",
                    min: 0,
                    max: 110,
                    color:"#007EFF"
                }]
            });
            
        }

        private refreshData(): void {
            var startTime: Date,
                endTime: Date,
                dtInstance: DowntimeColumnCharts = ModuleLoad.getModuleInstance("DowntimeColumnCharts"),
                equId = dtInstance.currentEquipment,
                day = new Date();

            day.setDate(day.getDate() - 1);
            startTime = dtInstance.startTime || day
            endTime = dtInstance.endTime || new Date();
            try {
                if (equId !== "") {
                    if (startTime > endTime) {
                        alert("StartTime is bigger than entTime, please fix this problem!");
                        $('.downtime-charts-container .aic-overlay').removeClass('hide').addClass('show');
                        dtInstance.viewModel.set("columnChartsSeries", [{
                            id: "",
                            dtTime: 0,
                            dtCauId: "",
                            currentPercent: 0
                        }]);
                        return;
                    }
                    dtInstance.ppaServiceContext.PPA_DT_RECORD
                        .filter(function (it) { return it.EQP_NO == this.eqid && it.DT_START_TIME >= this.start && it.DT_END_TIME <= this.end }, { eqid: equId, start: startTime, end: endTime })
                        .map((it) => {
                            return {
                                id: it.EQP_NO,
                                startTime: it.DT_START_TIME,
                                endTime: it.DT_END_TIME,
                                dtCauId: it.DT_CAU_ID,
                                recNo: it.REC_NO
                            }
                        })
                        .toArray((re) => {
                            if (re.length === 0) {
                                $('.downtime-charts-container .aic-overlay').removeClass('hide').addClass('show');
                                dtInstance.viewModel.set("columnChartsSeries", [{
                                    id: "",
                                    dtTime: 0,
                                    dtCauId: "",
                                    currentPercent: 0
                                }]);
                                return;
                            }
                            $('.downtime-charts-container .aic-overlay').removeClass('show').addClass('hide');
                            var data = [];
                            var hash = [];
                            var totalTime = 0;
                            re.forEach(function (it) {
                                var curDtTime = (it.endTime - it.startTime) / 60000;
                                if (curDtTime < 0) {
                                    alert("The Record," + it.recNo + ", is invalid! Its` startTime is bigger than endTime!");
                                    $('.oeeChartsContainer .aic-overlay').removeClass('hide').addClass('show');
                                    return;
                                }
                                totalTime += curDtTime;
                                if (typeof hash[it.dtCauId] === "undefined") {
                                    hash[it.dtCauId] = {
                                        id: AppUtils.EquimentsName[it.id],
                                        dtTime: curDtTime,
                                        dtCauId: it.dtCauId,
                                        currentPercent: 0
                                    };
                                } else {
                                    hash[it.dtCauId].dtTime += curDtTime;
                                }
                            });

                            var currentTime = 0;
                            for (var key in hash) {
                                data.push(hash[key]);
                            }

                            data.sort((a: any, b: any) => {
                                return a.dtTime - b.dtTime <= 0 ? 1 : -1;
                            });

                            data.forEach(function (it) {
                                currentTime += it.dtTime;
                                it.currentPercent = ((currentTime / totalTime) * 100).toFixed(2);
                                it.dtTime = it.dtTime.toFixed(2);
                            });

                            dtInstance.viewModel.set("columnChartsSeries", data);
                        })
                        .fail(function (e: { message: string }) {
                            $('.oeeChartsContainer .aic-overlay').removeClass('hide').addClass('show');
                            dtInstance.viewModel.set("columnChartsSeries", [{
                                id: "",
                                dtTime: 0,
                                dtCauId: "",
                                currentPercent: 0
                            }]);
                            alert(e.message);
                        });
                } else {
                    dtInstance.viewModel.set("columnChartsSeries", [{
                        id: "",
                        dtTime: 0,
                        dtCauId: "",
                        currentPercent: 0
                    }]);
                    $('.oeeChartsContainer .aic-overlay').removeClass('hide').addClass('show');
                    return;
                }
            } catch (e) {
                console.log(e.toString());
            }
        }

        init(view: JQuery): void {
            this.view = view;
            $('#viewport').append(this.view);
            this.initCharts();
            kendo.bind(this.view, this.viewModel);
            this.currentEquipment = StartUp.Instance.currentEquipmentId;
            this.startTime = StartUp.Instance.startTime;
            this.endTime = StartUp.Instance.endTime;
            this.refreshData();
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelectListner);
        }

        update(): void {
            $('#viewport').append(this.view);
            this.initCharts();
            kendo.bind(this.view, this.viewModel);
            this.currentEquipment = StartUp.Instance.currentEquipmentId;
            this.startTime = StartUp.Instance.startTime;
            this.endTime = StartUp.Instance.endTime;
            this.refreshData();
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelectListner);
        }

        destory(): void {
            var chart = $("#downtime-column-charts").data("kendoChart");
            kendo.unbind(this.view);
            chart.destroy();
            this.currentEquipment = "";
            this.startTime = null;
            this.endTime = null;
            StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelectListner);
        }
    }
}