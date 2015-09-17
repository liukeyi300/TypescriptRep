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
        StartUp.prototype.initWidgets = function () {
            this.nav = new OEEDemos.Navigations($("#nav-tree"), {
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
            $('#loginConfirm').on("click", function (e) {
                var serverAddress = $("#inputServerAddress").val();
                var userName = $("#inputUserName").val();
                var pwd = $("#inputPwd").val();
                StartUp.Instance.login(serverAddress, userName, pwd);
            });
            $('#logoutBtn').on("click", function (e) {
                var authCre = new ApplicationServices.AuthenticationServiceClient(StartUp.Instance.currentServer);
                authCre.logoutAsync();
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
                    $.getJSON("js/moduleList.json", null, function (d) {
                        var data = [];
                        for (var key in d) {
                            data.push(d[key]);
                        }
                        StartUp.Instance.nav.setData(OEEDemos.AppUtils.getTree(data, 0));
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