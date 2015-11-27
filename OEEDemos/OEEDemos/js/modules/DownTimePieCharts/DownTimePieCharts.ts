/// <reference path="../../reference.ts" />
module OEEDemos {
    export class DownTimePieCharts implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
        });
        view: JQuery;
        needEquiptree = true;
        viewModel = kendo.observable({
            pieChartsSeries: [{
                id: "",
                dtTime: 0,
                dtCauId: "",
                currentPercent: 0,
                dtTimes:0
            }]
        });

        constructor() { }


        private equipNodeSelect(e: kendo.ui.TreeViewSelectEvent, sender): void {
            var equId = sender.dataItem(e.node).id;
            var dtInstance = ModuleLoad.getModuleInstance("DownTimePieCharts");
            
            dtInstance.ppaServiceContext.PPA_DT_RECORD
                .filter(function (it) { return it.EQP_NO == this.eqid }, { eqid: equId })
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
                                id: AppUtils.EquimentsName[it.id],
                                dtTime: curDtTime,
                                dtCauId: it.dtCauId,
                                currentPercent: 0,
                                dtTimes:1
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
                    //kendo.ui.progress($("#oeeChart"), false);
                    alert(e.message);
                });;
        }

        private initWidget() {
            $('#down-time-pie-charts').kendoChart({
                title: {
                    position: "top",
                    text:"OEE Downtime Pie-Chart"
                },
                legend: {
                    position:'top'
                },
                chartArea: {
                    background:""
                },
                seriesDefaults: {
                    labels: {
                        visible: true,
                        background: "transparent",
                        template:"#=dataItem.dtCauId# : #=dataItem.dtTime#"
                    }
                },
                series: [{
                    type: 'pie',
                    startAngle: 150,
                    categoryField: "dtCauId",
                    field: "dtTime",
                }]
            });
        }

        init(view: JQuery) {
            this.view = view;
            this.view.appendTo($('#viewport'));
            kendo.bind(this.view, this.viewModel);
            this.initWidget();

            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        }

        update() {
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
            this.initWidget();
            StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        }

        destory() {
            var chart = $('#down-time-pie-charts').data('kendoChart');
            kendo.unbind(this.view);
            chart.destroy();
            StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
        }
    }
}