/// <reference path="../../reference.ts" />
module OEEDemos {
    export class DownTimePieCharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: AccountHelpUtils.serviceAddress + AccountHelpUtils.ppaEntitiesDataRoot
        });
        view: JQuery;
        needEquiptree = true;
        viewModel = kendo.observable({
            pieChartsSeries: [{
                id: "无",
                dtTime: 0,
                dtCauId: "无",
                currentPercent:1,
                dtTimes:0
            }]
        });
        private currentEquipment: string;
        private startTime: Date;
        private endTime: Date;

        constructor() { }

        private timeRangeListner(startTime: Date, endTime: Date): void {
            var dtInstance: DownTimePieCharts = ModuleLoad.getModuleInstance("DownTimePieCharts");
            dtInstance.startTime = startTime;
            dtInstance.endTime = endTime;
            dtInstance.refreshData();
        }

        private equipNodeSelect(e: kendo.ui.TreeViewSelectEvent, sender): void {
            var dtInstance: DownTimePieCharts = ModuleLoad.getModuleInstance("DownTimePieCharts");
            dtInstance.currentEquipment = sender.dataItem(e.node).id;
            dtInstance.refreshData();
        }

        private initWidget() {
            $('#downtime-pie-charts').kendoChart({
                title: {
                    text:"设备停机时间(次数)"
                },
                legend: {
                    position:'bottom'
                },
                chartArea: {
                    background:""
                },
                seriesDefaults: {
                    labels: {
                        visible: false
                    }
                },
                series: [{
                    type: 'pie',
                    startAngle: 150,
                    categoryField: "dtCauId",
                    field: "dtTimes",
                }],
                tooltip: {
                    visible: true,
                    template:"#=dataItem.dtCauId# : #=dataItem.dtTimes #次"
                }
            });

            $('#downtime-pie-charts-2').kendoChart({
                title: {
                    text: "设备停机时间(分钟)"
                },
                legend: {
                    position: 'bottom'
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        visible: false
                    }
                },
                series: [{
                    type: 'pie',
                    startAngle: 150,
                    categoryField: "dtCauId",
                    field: "dtTime",
                }],
                tooltip: {
                    visible: true,
                    template:"#=dataItem.dtCauId# : #=dataItem.dtTime #分钟"
                }
            });
        }

        private refreshData(): void {
            try {
                var dtInstance: DownTimePieCharts = ModuleLoad.getModuleInstance("DownTimePieCharts"),
                    equId = dtInstance.currentEquipment,
                    start: Date,
                    end: Date,
                    day = new Date();

                day.setDate(day.getDate() - 1);
                start = dtInstance.startTime || day
                end = dtInstance.endTime || new Date();
                if (equId !== "") {
                    dtInstance.ppaServiceContext.PPA_DT_RECORD
                        .filter(function (it) { return it.EQP_NO == this.eqid && it.DT_START_TIME >= this.startTime && it.DT_END_TIME <= this.endTime },
                            { eqid: equId, startTime: start, endTime: end })
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
                                $('.downtime-pie-charts-container .aic-overlay').removeClass('hide').addClass('show');
                                dtInstance.viewModel.set("pieChartsSeries", [{
                                    id: "无",
                                    dtTime: 0,
                                    dtCauId: "无",
                                    currentPercent: 1,
                                    dtTimes: 0
                                }]);
                                return;
                            }
                            $('.downtime-pie-charts-container .aic-overlay').removeClass('show').addClass('hide');
                            var data = [];
                            var hash = [];
                            var totalTime = 0;
                            re.forEach(function (it) {
                                var curDtTime = (it.endTime - it.startTime) / 60000;
                                if (curDtTime < 0) {
                                    alert("The Record," + it.recNo + ", is invalid! Its` startTime is bigger than endTime!");
                                    return;
                                }
                                totalTime += curDtTime;
                                if (typeof hash[it.dtCauId] === "undefined") {
                                    hash[it.dtCauId] = {
                                        id: AppUtils.EquimentsName[it.id],
                                        dtTime: curDtTime,
                                        dtCauId: it.dtCauId,
                                        currentPercent: 0,
                                        dtTimes: 1
                                    };
                                } else {
                                    hash[it.dtCauId].dtTime += curDtTime;
                                    hash[it.dtCauId].dtTimes++;
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
                                currentTime = it.dtTime;
                                it.currentPercent = ((currentTime / totalTime) * 100).toFixed(2);
                                it.dtTime = it.dtTime.toFixed(2);
                            });

                            dtInstance.viewModel.set("pieChartsSeries", data);
                        })
                        .fail(function (e: { message: string }) {
                            $('.downtime-pie-charts-container .aic-overlay').removeClass('hide').addClass('show');
                            dtInstance.viewModel.set("pieChartsSeries", [{
                                id: "无",
                                dtTime: 0,
                                dtCauId: "无",
                                currentPercent: 1,
                                dtTimes: 0
                            }]);
                            alert(e.message);
                        });
                } else {
                    dtInstance.viewModel.set("pieChartsSeries", [{
                        id: "无",
                        dtTime: 0,
                        dtCauId: "无",
                        currentPercent: 1,
                        dtTimes: 0
                    }]);
                    $('.downtime-pie-charts-container .aic-overlay').removeClass('hide').addClass('show');
                    return;
                }
            } catch (e) {
                console.log(e.toString());
            }
        }

        init(view: JQuery) {
            this.view = view;
            this.view.appendTo($('#viewport'));
            this.currentEquipment = StartUp.Instance.currentEquipmentId;
            this.startTime = StartUp.Instance.startTime;
            this.endTime = StartUp.Instance.endTime;
            kendo.bind(this.view, this.viewModel);
            this.initWidget();
            this.refreshData();
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        }

        update() {
            $('#viewport').append(this.view);
            this.currentEquipment = StartUp.Instance.currentEquipmentId;
            this.startTime = StartUp.Instance.startTime;
            this.endTime = StartUp.Instance.endTime;
            kendo.bind(this.view, this.viewModel);
            this.initWidget();
            this.refreshData();
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
        }

        destory() {
            var chart = $('#downtime-pie-charts').data('kendoChart'),
                chart2 = $('#downtime-pie-charts-2').data('kendoChart');
            kendo.unbind(this.view);
            chart.destroy();
            chart2.destroy();
            this.currentEquipment = "";
            this.startTime = null;
            this.endTime = null;
            StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
            StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
        }
    }
}