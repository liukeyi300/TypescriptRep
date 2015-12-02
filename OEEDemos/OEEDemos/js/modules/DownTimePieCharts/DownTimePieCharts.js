/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var DownTimePieCharts = (function () {
        function DownTimePieCharts() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
            });
            this.needEquiptree = true;
            this.viewModel = kendo.observable({
                pieChartsSeries: [{
                        id: "",
                        dtTime: 0,
                        dtCauId: "",
                        currentPercent: 0,
                        dtTimes: 0
                    }]
            });
        }
        DownTimePieCharts.prototype.equipNodeSelect = function (e, sender) {
            var equId = sender.dataItem(e.node).id;
            var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DownTimePieCharts");
            dtInstance.ppaServiceContext.PPA_DT_RECORD
                .filter(function (it) { return it.EQP_NO == this.eqid; }, { eqid: equId })
                .map(function (it) {
                return {
                    id: it.EQP_NO,
                    startTime: it.DT_START_TIME,
                    endTime: it.DT_END_TIME,
                    dtCauId: it.DT_CAU_ID,
                    recNo: it.REC_NO
                };
            })
                .toArray(function (re) {
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
                            id: OEEDemos.AppUtils.EquimentsName[it.id],
                            dtTime: curDtTime,
                            dtCauId: it.dtCauId,
                            currentPercent: 0,
                            dtTimes: 1
                        };
                    }
                    else {
                        hash[it.dtCauId].dtTime += curDtTime;
                        hash[it.dtCauId].dtTimes++;
                    }
                });
                var currentTime = 0;
                for (var key in hash) {
                    data.push(hash[key]);
                }
                data.sort(function (a, b) {
                    return a.dtTime - b.dtTime <= 0 ? 1 : -1;
                });
                data.forEach(function (it) {
                    currentTime = it.dtTime;
                    it.currentPercent = ((currentTime / totalTime) * 100).toFixed(2);
                    it.dtTime = it.dtTime.toFixed(2);
                });
                dtInstance.viewModel.set("pieChartsSeries", data);
            })
                .fail(function (e) {
                //kendo.ui.progress($("#oeeChart"), false);
                alert(e.message);
            });
            ;
        };
        DownTimePieCharts.prototype.initWidget = function () {
            $('#down-time-pie-charts').kendoChart({
                legend: {
                    position: 'bottom'
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        visible: true,
                        background: "transparent",
                        template: "#=dataItem.dtCauId# : \n #=dataItem.dtTimes#次"
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
                    template: "#=dataItem.dtCauId# : #=dataItem.dtTimes #次"
                }
            });
            $('#down-time-pie-charts-2').kendoChart({
                legend: {
                    position: 'bottom'
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        visible: true,
                        background: "transparent",
                        template: "#=dataItem.dtCauId# : \n #=dataItem.dtTime#"
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
                    template: "#=dataItem.dtCauId# : #=dataItem.dtTime #次"
                }
            });
        };
        DownTimePieCharts.prototype.init = function (view) {
            this.view = view;
            this.view.appendTo($('#viewport'));
            kendo.bind(this.view, this.viewModel);
            this.initWidget();
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        };
        DownTimePieCharts.prototype.update = function () {
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
            this.initWidget();
            OEEDemos.StartUp.Instance.registerEquipNodeSelectListner(this.equipNodeSelect);
        };
        DownTimePieCharts.prototype.destory = function () {
            var chart = $('#down-time-pie-charts').data('kendoChart');
            kendo.unbind(this.view);
            chart.destroy();
            OEEDemos.StartUp.Instance.deleteEquipNodeSelectListner(this.equipNodeSelect);
        };
        return DownTimePieCharts;
    })();
    OEEDemos.DownTimePieCharts = DownTimePieCharts;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=DownTimePieCharts.js.map