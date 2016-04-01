/// <reference path="../../../../reference.ts" />
module AicTech.Web.Html {
    export class DownTimePieChart extends Module.ModuleBase {
        constructor() {
            super();
            this.viewModel = kendo.observable({
                pieChartsSeries: [{
                    id: "无",
                    dtTime: 0,
                    dtCauId: "无",
                    currentPercent: 1,
                    dtTimes: 0
                }]
            });
        }

        private initWidgets() {
            $('#downtime-pie-chart').kendoChart({
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

            $('#downtime-pie-chart-2').kendoChart({
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

        refreshData(): void {
            try {
                super.refreshData();
                var start = this.startTime || Utils.DateUtils.lastDay(new Date()),
                    endTime = this.endTime || new Date(),
                    equId = this.equipId,
                    instance = <DownTimePieChart>Module.ModuleLoad.getModuleInstance("DownTimePieChart");

                if (typeof equId === "undefined" || equId === "") {
                    this.viewModel.set('isOverlayShow', true);
                    return;
                }
                
                if (equId !== "") {
                    instance.serviceContext.PPA_DT_RECORD
                        .filter(function (it) { return it.EQP_NO == this.eqid && it.DT_START_TIME >= this.startTime && it.DT_END_TIME <= this.endTime },
                        { eqid: equId, startTime: start, endTime: endTime })
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
                                $('.downtime-pie-chart-container .aic-overlay').removeClass('hide').addClass('show');
                                instance.viewModel.set("pieChartsSeries", [{
                                    id: "无",
                                    dtTime: 0,
                                    dtCauId: "无",
                                    currentPercent: 1,
                                    dtTimes: 0
                                }]);
                                return;
                            }
                            $('.downtime-pie-chart-container .aic-overlay').removeClass('show').addClass('hide');
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
                                        id: Utils.TreeUtils.EquimentsName[it.id],
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

                            instance.viewModel.set("pieChartsSeries", data);
                        })
                        .fail(function (e: { message: string }) {
                            $('.downtime-pie-chart-container .aic-overlay').removeClass('hide').addClass('show');
                            instance.viewModel.set("pieChartsSeries", [{
                                id: "无",
                                dtTime: 0,
                                dtCauId: "无",
                                currentPercent: 1,
                                dtTimes: 0
                            }]);
                            alert(e.message);
                        });
                } else {
                    instance.viewModel.set("pieChartsSeries", [{
                        id: "无",
                        dtTime: 0,
                        dtCauId: "无",
                        currentPercent: 1,
                        dtTimes: 0
                    }]);
                    $('.downtime-pie-chart-container .aic-overlay').removeClass('hide').addClass('show');
                    return;
                }
            } catch (e) {
                console.log(e.toString());
            }
        }

        init(view: JQuery) {
            super.init(view);
            kendo.bind(this.view, this.viewModel);
            this.initWidgets();
            this.refreshData();
        }

        update() {
            super.update();
            kendo.bind(this.view, this.viewModel);
            this.initWidgets();
            this.refreshData();
        }

        dispose() {
            super.dispose();
            var chart = $('#downtime-pie-chart').data('kendoChart'),
                chart2 = $('#downtime-pie-chart-2').data('kendoChart');
            kendo.unbind(this.view);
            if (typeof chart !== 'undefined') {
                chart.destroy();
            }
            if (typeof chart2 !== 'undefined') {
                chart2.destroy();
            }
        }
    }
}