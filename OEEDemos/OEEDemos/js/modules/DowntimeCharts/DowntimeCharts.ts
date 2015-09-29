/// <reference path="../../reference.ts" />
module OEEDemos {
    export class DowntimeCharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
        });
        view: JQuery;
        viewModel= kendo.observable({
            columnChartsSeries: [{
                id: "",
                dtTime: 0,
                dtCauId: "",
                currentPercent:0
            }],
            timeLineChartsSeries: [{

            }]
        });
        equipmentTree: Navigations;
        private currentNode;

        constructor() {}

        private timeRangeListner(startTime: Date, endTime: Date): void {
            //alert("StartTime: " + startTime + ", EndTime: " + endTime);
            alert("DTCharts.TimeRangeListner");
        }

        private equipNodeSelect(e: kendo.ui.TreeViewSelectEvent, sender): void {
            var equId = sender.dataItem(e.node).id;
            var dtInstance = ModuleLoad.getModuleInstance("DowntimeCharts");

            dtInstance.currentNode = equId;
            dtInstance.ppaServiceContext.PPA_DT_RECORD
                .filter(function (it) { return it.EQP_ID === this.eqid }, { eqid: equId })
                .map((it) => {
                    return {
                        id: it.EQP_ID,
                        startTime: it.DT_START_TIME,
                        endTime: it.DT_END_TIME,
                        dtCauId: it.DT_CAU_ID,
                        recNo: it.REC_NO
                    }
                })
                .toArray((re) => {
                    if (re.length === 0) {
                        alert("There are no DownTime-datas for this equipment!");
                        return;
                    }
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
                                id: it.id,
                                dtTime: curDtTime,
                                dtCauId: it.dtCauId,
                                currentPercent:0
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
                        return a.dtTime - b.dtTime <=0 ? 1:-1;
                    });

                    data.forEach(function (it) {
                        currentTime += it.dtTime;
                        it.currentPercent = ((currentTime / totalTime)*100).toFixed(2);
                        it.dtTime = it.dtTime.toFixed(2);
                    });

                    dtInstance.viewModel.set("columnChartsSeries", data);
                });
        }

        private initCharts(): void {
            $("#columnCharts").kendoChart({
                title: {
                    text:"DownTime Chart"
                },
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
            

            $("#timeLineCharts").kendoScheduler({
                date: new Date("2013/6/6"),
                views: [
                    {
                        type: "timelineWeek",
                        columnWidth: 50
                    }
                ],
                dataSource: [
                    {
                        id: 1,
                        start: new Date("2013/6/6 08:00 AM"),
                        end: new Date("2013/6/6 09:00 AM"),
                        title: "Interview"
                    }
                ]
            });
        }

        private refreshData(): void {

        }

        init(view: JQuery): void {
            this.view = view;
            $('#viewport').append(this.view);
            this.initCharts();
            kendo.bind(this.view.find("#columnCharts"), this.viewModel);
            this.refreshData();
            StartUp.Instance.registerTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);

            //解除viewModel和隐藏tab页的绑定并重新将viewModel绑定到显示的tab页
            this.view.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                kendo.unbind(view.find(".tab-content>div"));
                kendo.bind(view.find(".tab-content>div.active"), ModuleLoad.getModuleInstance("DowntimeCharts").viewModel);
            });
        }

        update(): void {
            $('#viewport').append(this.view);
            this.initCharts();
            this.refreshData();
        }

        destory(): void {
            var chart = $("#columnCharts").data("kendoChart");
            chart.destroy();
            StartUp.Instance.deleteTimeRangeListner(this.timeRangeListner);
            StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
        }
    }
}