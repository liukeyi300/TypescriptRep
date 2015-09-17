/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var DowntimeCharts = (function () {
        function DowntimeCharts() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
            });
            this.viewModel = kendo.observable({
                series: [{
                        id: "",
                        dtTime: 0,
                        dtCauId: ""
                    }]
            });
        }
        DowntimeCharts.prototype.initCharts = function () {
            $("#dtCharts").kendoChart({
                title: {
                    text: "DownTime Chart"
                },
                legend: {
                    position: "top"
                },
                seriesDefaults: {
                    type: "column"
                },
                series: [{
                        field: "dtTime"
                    }],
                categoryAxis: [{
                        field: "dtCauId",
                        majorGridLines: {
                            visible: false
                        }
                    }],
                valueAxis: [{}],
                tooltip: {
                    visible: true,
                    template: "#= dataItem.id # : #= value #mins"
                }
            });
        };
        DowntimeCharts.prototype.testData = function () {
            var equipTree = new OEEDemos.Navigations($('#equipTree'), {
                select: function (e) {
                    onselectNode(e, this);
                }
            });
            var onselectNode = function (e, sender) {
                var equId = sender.dataItem(e.node).id;
                var dtInstance = OEEDemos.ModuleLoad.getModuleInstance("DowntimeCharts");
                dtInstance.ppaServiceContext.PPA_DT_RECORD
                    .filter(function (it) { return it.EQP_ID === this.eqid; }, { eqid: equId })
                    .map(function (it) {
                    return {
                        id: it.EQP_ID,
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
                    re.forEach(function (it) {
                        var curDtTime = (it.endTime - it.startTime) / 60000;
                        if (curDtTime < 0) {
                            alert("The Record," + it.recNo + ", is invalid! Its` startTime is bigger than endTime!");
                            return;
                        }
                        if (typeof hash[it.dtCauId] === "undefined") {
                            hash[it.dtCauId] = {
                                id: it.id,
                                dtTime: curDtTime,
                                dtCauId: it.dtCauId
                            };
                        }
                        else {
                            hash[it.dtCauId].dtTime += curDtTime;
                        }
                    });
                    for (var key in hash) {
                        hash[key].dtTime = hash[key].dtTime.toFixed(2);
                        data.push(hash[key]);
                    }
                    dtInstance.viewModel.set("series", data);
                });
            };
            kendo.ui.progress($('#equipTree'), true);
            this.ppaServiceContext.PM_EQUIPMENT.map(function (it) {
                return {
                    id: it.EQP_ID,
                    parent: it.PARENT,
                    text: it.NAME
                };
            }).toArray(function (data) {
                equipTree.setData(OEEDemos.AppUtils.getTree(data, '-'));
                kendo.ui.progress($("#equipTree"), false);
            });
            this.equipmentTree = equipTree;
        };
        DowntimeCharts.prototype.init = function (view) {
            this.view = view;
            $('#content').append(this.view);
            this.initCharts();
            kendo.bind(this.view, this.viewModel);
            this.testData();
        };
        DowntimeCharts.prototype.update = function () {
            $('#content').append(this.view);
            this.initCharts();
            //alert("DowntimeUpdate()");
        };
        DowntimeCharts.prototype.destory = function () {
            //alert("DowntimeDetory()");
        };
        return DowntimeCharts;
    })();
    OEEDemos.DowntimeCharts = DowntimeCharts;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=DowntimeCharts.js.map