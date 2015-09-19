/// <reference path="reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var StartUp = (function () {
        function StartUp() {
        }
        StartUp.prototype.startUp = function () {
            this.initWidgets();
            this.initEventsBinding();
        };
        StartUp.prototype.registerTimeRangeListner = function (listner) {
            StartUp.Instance.timeRangeListener = StartUp.Instance.timeRangeListener || [];
            StartUp.Instance.timeRangeListener.push(listner);
        };
        StartUp.prototype.deleteTimeRangeListner = function (listner) {
            StartUp.Instance.timeRangeListener.splice(StartUp.Instance.timeRangeListener.indexOf(listner), 1);
        };
        StartUp.prototype.initWidgets = function () {
            StartUp.Instance.nav = new OEEDemos.Navigations($("#nav-tree"), {
                select: function (e) {
                    onNodeSelect(e, this);
                }
            });
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
                            }, 100);
                        }
                    });
                }
            };
            $("#startTimeSelect").kendoDateTimePicker();
            $("#endTimeSelect").kendoDateTimePicker();
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
                for (var i = 0, max = StartUp.Instance.timeRangeListener.length, listeners = StartUp.Instance.timeRangeListener; i < max; i++) {
                    if (listeners[i]) {
                        var startTime = $("#startTimeSelect").val();
                        var endTime = $("#endTimeSelect").val();
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
                    //var equipTree = new Navigations($("#equTree"), {
                    //    select: function (e) {
                    //        onselectNode(e, this);
                    //    }
                    //});
                    //var onselectNode = function (e: kendo.ui.TreeViewSelectEvent, sender) {
                    //    alert(sender.dataItem(e.node).id);
                    //};
                    $.getJSON("js/moduleList.json", null, function (d) {
                        var data = [];
                        for (var key in d) {
                            data.push(d[key]);
                        }
                        StartUp.Instance.nav.setData(OEEDemos.AppUtils.getTree(data, 0));
                        //serviceContext.PM_EQUIPMENT.map((it) => {
                        //    return {
                        //        id: it.EQP_ID,
                        //        parent: it.PARENT,
                        //        text: it.NAME
                        //    }
                        //}).toArray(function (data) {
                        //    equipTree.setData(AppUtils.getTree(data, '-'));
                        //    kendo.ui.progress($("#equipTree"), false);
                        //});
                        kendo.ui.progress($("#nav-tree"), false);
                        $("#loginModal").modal("hide");
                    });
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