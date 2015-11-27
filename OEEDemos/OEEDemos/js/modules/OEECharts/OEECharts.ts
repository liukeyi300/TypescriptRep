/// <reference path="../../reference.ts" />
module OEEDemos {
    export class OEECharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
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

        private dataItem = new vis.DataSet();
        private dataGroup = new vis.DataSet();
        private chart: vis.Graph2D;

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
            //var container = $('#oeeChart')[0];
            //var options = {
            //    dataAxis: {
            //        showMinorLabels: false
            //    },
            //    legend: {
            //        left: {
            //            position:"bottom-left"
            //        }
            //    },
            //    start: '2015-09-01',
            //    end:'2015-10-01'
            //};
            //this.chart = new vis.Graph2D(container, this.dataItem, this.dataGroup, options);
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

            var chart = $("#oeeChart").data('kendoChart');
            chart.bind('drag', function (e) {
                
            })
            chart.bind('dragEnd', function (e) {
            })
        }
        

        private refreshData(): void {
            try {
                var startDate = this.startTime;
                var endDate = this.endTime;
                var currentEquipment = this.currentEquipment || "";
                if (currentEquipment !== "") {
                    var day = new Date();
                    day.setDate(day.getDate() - 1);
                    var start = this.startTime || day
                    var end = this.endTime || new Date();
                    kendo.ui.progress($("#oeeChart"), true);
                    this.ppaServiceContext.PPA_OEE_SUMMARY
                        .filter(function (items) {
                            return (items.PER_START_TIME >= this.startDate && items.PER_START_TIME < this.endDate
                                && items.EQP_NO === this.equid);
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
                            OEEDemos.ModuleLoad.getModuleInstance(StartUp.currentInstanceName).viewModel.set("series", result);
                            
                            kendo.ui.progress($("#oeeChart"), false);
                        }).fail(function (e: { message: string }) {
                            kendo.ui.progress($("#oeeChart"), false);
                            alert(e.message);
                        });
                } else {
                    //alert("请选择设备！！");
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
            kendo.bind(this.view, this.viewModel);
            this.refreshData();
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        }

        destory() {
            var chart = $("#oeeChart").data("kendoChart");
            kendo.unbind(this.view);
            chart.destroy();
            StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
        }
    }
}