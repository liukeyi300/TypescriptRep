/// <reference path="../../reference.ts" />
module OEEDemos {
    export class OEECharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: AccountHelpUtils.serviceAddress + AccountHelpUtils.ppaEntitiesDataRoot
        }); 
        view: JQuery;
        needEquiptree = true;
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
            var oeeCharts: OEECharts = ModuleLoad.getModuleInstance("OEECharts");
            oeeCharts.startTime = startTime;
            oeeCharts.endTime = endTime;
            oeeCharts.refreshData(); 
        }

        private equipNodeSelect(e: kendo.ui.TreeViewSelectEvent, sender): void {
            var oeeCharts: OEECharts = ModuleLoad.getModuleInstance("OEECharts");
            oeeCharts.currentEquipment = sender.dataItem(e.node).id;
            oeeCharts.refreshData();
        }

        private initChart() {
            $("#oee-chart").kendoChart({
                //title: {
                //    text: "OEEDemo Charts"
                //},
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
                    justified: false,
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
                var currentEquipment = this.currentEquipment || "",
                    oeeCharts: OEECharts = ModuleLoad.getModuleInstance("OEECharts"),
                    start: Date,
                    end: Date,
                    day = new Date();

                day.setDate(day.getDate() - 1);
                start = oeeCharts.startTime || day
                end = oeeCharts.endTime || new Date();

                if (currentEquipment !== "") {
                    kendo.ui.progress($("#oee-chart"), true);
                    this.ppaServiceContext.PPA_OEE_SUMMARY
                        .filter(function (items) {
                        return (items.PER_START_TIME >= this.startDate && items.PER_START_TIME < this.endDate
                            && items.EQP_NO == this.equid);
                            }, {
                            startDate: start, endDate: end,
                                equid: currentEquipment
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
                        .toArray(function (result) {
                            if (result.length === 0) {
                                $('.oee-chart-container .aic-overlay').removeClass('hide').addClass('show');
                            } else {
                                $('.oee-chart-container .aic-overlay').removeClass('show').addClass('hide');
                            }
                            oeeCharts.viewModel.set("series", result);
                            kendo.ui.progress($("#oee-chart"), false);
                        }).fail(function (e: { message: string }) {
                            $('.oee-chart-container .aic-overlay').removeClass('hide').addClass('show');
                            kendo.ui.progress($("#oee-chart"), false);
                            alert(e.message);
                        });
                } else {
                    $('.oee-chart-container .aic-overlay').removeClass('hide').addClass('show');
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
            this.currentEquipment = StartUp.Instance.currentEquipmentId;
            this.startTime = StartUp.Instance.startTime;
            this.endTime = StartUp.Instance.endTime;
            this.refreshData();
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        }
        
        update() {
            $('#viewport').append(this.view);
            this.initChart();
            kendo.bind(this.view, this.viewModel);
            this.currentEquipment = StartUp.Instance.currentEquipmentId;
            this.startTime = StartUp.Instance.startTime;
            this.endTime = StartUp.Instance.endTime;
            this.refreshData();
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        }

        destory() {
            var chart = $("#oee-chart").data("kendoChart");
            kendo.unbind(this.view);
            chart.destroy();
            this.currentEquipment = "";
            this.startTime = null;
            this.endTime = null;
            StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
        }
    }
}