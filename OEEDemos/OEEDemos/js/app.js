/// <reference path="reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var StartUp = (function () {
        function StartUp() {
        }
        StartUp.prototype.startUp = function () {
            this.initWidgets();
            this.initEventsBinding();
            $("#loginModal").modal("show");
        };
        StartUp.prototype.registerTimeRangeListner = function (listner) {
            StartUp.Instance.timeRangeListner = StartUp.Instance.timeRangeListner || [];
            StartUp.Instance.timeRangeListner.push(listner);
        };
        StartUp.prototype.deleteTimeRangeListner = function (listner) {
            StartUp.Instance.timeRangeListner.splice(StartUp.Instance.timeRangeListner.indexOf(listner), 1);
        };
        StartUp.prototype.registerEquipNodeSelectListner = function (listner) {
            StartUp.Instance.equipNodeSelectListner = StartUp.Instance.equipNodeSelectListner || [];
            StartUp.Instance.equipNodeSelectListner.push(listner);
        };
        StartUp.prototype.deleteEquipNodeSelectListner = function (listner) {
            StartUp.Instance.equipNodeSelectListner.splice(StartUp.Instance.equipNodeSelectListner.indexOf(listner), 1);
        };
        StartUp.prototype.initWidgets = function () {
            StartUp.Instance.nav = new OEEDemos.Navigations($("#nav-tree"), {
                select: function (e) {
                    onNodeSelect(e, this);
                }
            });
            StartUp.Instance.equipTree = new OEEDemos.Navigations($("#equip-tree"), {
                select: function (e) {
                    if (typeof StartUp.Instance.equipNodeSelectListner === "undefined") {
                        return;
                    }
                    for (var i = 0, max = StartUp.Instance.equipNodeSelectListner.length, listners = StartUp.Instance.equipNodeSelectListner; i < max; i++) {
                        if (listners[i]) {
                            listners[i](e, this);
                        }
                    }
                },
                checkboxes: {
                    checkChildren: true
                }
            });
            StartUp.Instance.equipTree.setData([{ text: "Equipments Waiting......" }]);
            var onNodeSelect = function (e, sender) {
                var dataItem = sender.dataItem(e.node);
                var currentModule = dataItem.moduleName;
                var baseUrl = dataItem.baseUrl;
                if (baseUrl === "") {
                    return;
                }
                var lastInstance = OEEDemos.ModuleLoad.getModuleInstance(StartUp.currentInstanceName);
                if (typeof lastInstance !== "undefined") {
                    lastInstance.destory();
                }
                $('#viewport').empty();
                StartUp.currentInstanceName = currentModule;
                var instance = OEEDemos.ModuleLoad.getModuleInstance(currentModule);
                if (typeof instance !== "undefined") {
                    instance.update();
                }
                else {
                    OEEDemos.ModuleLoad.createModuleInstance({
                        baseUrl: baseUrl,
                        moduleName: currentModule,
                        onInstantiated: function (instance, viewTemplate) {
                            var view = $(viewTemplate);
                            setTimeout(function () {
                                instance.init(view);
                                //if (instance.needEquipCheck) {
                                //    StartUp.Instance.equipTree.setStyle({
                                //        checkboxes: {
                                //            checkChildren: true
                                //        }
                                //    });
                                //} else {
                                //    StartUp.Instance.equipTree.setStyle({
                                //        checkboxes: false
                                //    });
                                //}
                            }, 100);
                        }
                    });
                }
            };
            $("#startTimeSelect").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm",
                timeFormat: "HH:mm"
            });
            $("#endTimeSelect").kendoDateTimePicker({
                format: "yyyy-MM-dd HH:mm",
                timeFormat: "HH:mm"
            });
        };
        StartUp.prototype.initEventsBinding = function () {
            var nav = StartUp.Instance.nav;
            $('#loginConfirm').on("click", function (e) {
                var serverAddress = $("#inputServerAddress").val();
                var userName = $("#inputUserName").val();
                var pwd = $("#inputPwd").val();
                StartUp.Instance.login(serverAddress, userName, pwd);
            });
            $('#logoutBtn').on("click", function (e) {
                var authCre = new ApplicationServices.AuthenticationServiceClient(StartUp.Instance.currentServer);
                authCre.logoutAsync();
                if (StartUp.currentInstanceName !== "" && typeof OEEDemos.ModuleLoad.getModuleInstance(StartUp.currentInstanceName) !== "undefined") {
                    OEEDemos.ModuleLoad.getModuleInstance(StartUp.currentInstanceName).destory();
                    $("#viewport").empty();
                    nav.destory();
                    StartUp.currentInstanceName = "";
                    OEEDemos.ModuleLoad.clearAllModules();
                }
            });
            $('#comfirmFunctionNav').on('click', function (e) {
                if (typeof StartUp.Instance.timeRangeListner === "undefined") {
                    return;
                }
                for (var i = 0, max = StartUp.Instance.timeRangeListner.length, listeners = StartUp.Instance.timeRangeListner; i < max; i++) {
                    if (listeners[i]) {
                        var startDatePicker = $('#startTimeSelect').data("kendoDateTimePicker");
                        var endDatePicker = $('#endTimeSelect').data("kendoDateTimePicker");
                        var startTime = startDatePicker.value();
                        var endTime = endDatePicker.value();
                        listeners[i](startTime, endTime);
                    }
                }
            });
        };
        //http://192.168.0.3:6666/Services/AuthenticationService.svc/ajax
        StartUp.prototype.login = function (serverAddress, userName, pwd) {
            var authCre = new ApplicationServices.AuthenticationServiceClient(serverAddress);
            kendo.ui.progress($('#nav-tree'), true);
            authCre.logoutAsync();
            this.nav.setData([{
                    text: "Loading"
                }]);
            this.currentServer = serverAddress;
            authCre.loginAsync(userName, pwd, '', true)
                .then(function (value) {
                if (value) {
                    var serviceContext = new AicTech.PPA.DataModel.PPAEntities({
                        name: 'oData',
                        oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
                    });
                    $.getJSON("js/moduleList.json", null, function (d) {
                        var data = [];
                        for (var key in d) {
                            data.push(d[key]);
                        }
                        StartUp.Instance.nav.setData(OEEDemos.AppUtils.getTree(data, 0));
                        kendo.ui.progress($("#nav-tree"), false);
                        $("#loginModal").modal("hide");
                    });
                    kendo.ui.progress($('#equipTree'), true);
                    serviceContext.PM_EQUIPMENT
                        .map(function (it) {
                        return {
                            id: it.EQP_ID,
                            parent: it.PARENT,
                            text: it.NAME
                        };
                    })
                        .toArray(function (data) {
                        StartUp.Instance.equipTree.setData(OEEDemos.AppUtils.getTree(data, '-'));
                        kendo.ui.progress($("#equipTree"), false);
                    })
                        .fail(function (e) {
                        kendo.ui.progress($("#equipTree"), false);
                    });
                    var cookies = document.cookie;
                    var a = 0;
                    a++;
                }
            }, function () {
                kendo.ui.progress($('#nav-tree'), false);
                alert("Login failed!");
            });
        };
        StartUp.Instance = new StartUp();
        return StartUp;
    })();
    OEEDemos.StartUp = StartUp;
    window.onload = function () {
        StartUp.Instance.startUp();
    };
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=app.js.map