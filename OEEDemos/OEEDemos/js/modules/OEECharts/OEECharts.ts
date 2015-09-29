/// <reference path="../../reference.ts" />
module OEEDemos {
    export class OEECharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
        }); 
        view: JQuery;
        viewModel = kendo.observable({
            series: [{
                oeeStartTime: 0,
                oeeAVA: 0,
                oeePER: 0,
                oeeQUA: 0,
                oeeCOM:0
            }]
        });
        private startTime: Date;
        private endTime: Date;
        private currentEquipment: string;

        constructor() { }

        private timeRangeListner(startTime: Date, endTime: Date): void {
            var oeeCharts = ModuleLoad.getModuleInstance("OEECharts");
            oeeCharts.startTime = startTime;
            oeeCharts.endTime = endTime;
            oeeCharts.refreshData(); 
        }

        private equipNodeSelect(e: kendo.ui.TreeViewSelectEvent, sender): void {
            var oeeCharts = ModuleLoad.getModuleInstance("OEECharts");
            oeeCharts.currentEquipment = sender.dataItem(e.node).id;
            oeeCharts.refreshData();
        }

        private initChart() {
            $("#oeeChart").kendoChart({
                title: {
                    text: "OEEDemo Charts"
                },
                legend: {
                    position: "top"
                },
                seriesDefaults: {
                    type: "column"
                },
                series: [{
                    field: "oeeAVA",
                    name: "OEEAVA",
                    color:"#33CC00"
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
                    color:"#3333CC"
                }],
                categoryAxis: [{
                    type: "date",
                    field: "oeeStartTime",
                    baseUnit: "hours",
                    justified: true,
                    labels: {
                        dateFormats: {
                            hours: "M-d HH:mm"
                        },
                        rotation: -90
                    },
                    majorGridLines: {
                        visible: false
                    }
                }],
                valueAxis: [{
                    labels: {
                        format: "{0}"
                    },
                    majorUnit: 0.1,
                    axisCrossingValue: 0,
                    max: 1.1
                }],
                tooltip: {
                    visible: true,
                    format: "{0}",
                    template: "#= series.name #: #= value #"
                }
            });
        }
        

        private refreshData(): void {
            try {
                var startDate = this.startTime;
                var endDate = this.endTime;
                var currentEquipment = this.currentEquipment || "";
                if (currentEquipment != "") {
                    if (typeof startDate === "undefined") {
                        startDate = new Date();
                        startDate.setDate(startDate.getDate() - 1);
                    }

                    if (typeof endDate === "undefined") {
                        endDate = new Date();
                    }
                    kendo.ui.progress($("#oeeChart"), true);
                    this.ppaServiceContext.PPA_OEE_SUMMARY
                        .filter(function (items) {
                            return (items.PER_START_TIME >= this.startDate && items.PER_START_TIME < this.endDate
                                && items.EQP_ID === this.equid);
                            }, {
                                startDate: startDate, endDate: endDate,
                                equid: currentEquipment
                            })
                        .map(function (it) {
                            return {
                                oeeStartTime: it.PER_START_TIME,
                                oeeAVA: it.OEE_AVA,
                                oeePER: it.OEE_PER,
                                oeeQUA: it.OEE_QUA,
                                oeeCOM: it.OEE_COM
                            };
                        })
                        .toArray(function (result) {
                            OEEDemos.ModuleLoad.getModuleInstance(StartUp.currentInstanceName).viewModel.set("series", result);
                            kendo.ui.progress($("#oeeChart"), false);
                        }).fail(function (e: { message: string }) {
                            kendo.ui.progress($("#oeeChart"), false);
                            alert(e.message);
                        });

                } else {
                    alert("请选择设备！！");
                    return;
                }
            } catch (e) {
                console.log(e.toString());
            }
        }

        init(view: JQuery): void {
            this.view = view;
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        }
        
        update() {
            $('#viewport').append(this.view);
            this.initChart();
            this.refreshData();
        }

        destory() {
            var chart = $("#oeeChart").data("kendoChart");
            chart.destroy();
            StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
        }
    }
}