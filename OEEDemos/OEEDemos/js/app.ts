/// <reference path="reference.ts" />

module OEEDemos {

    export class StartUp {
        static currentInstanceName: string;
        static Instance: StartUp = new StartUp();
        private timeRangeListener: ((startTime: string, endTime: string) => void)[];
        private nav: Navigations;
        private currentServer: string;
        constructor() {
        }

        public startUp(): void {
            this.initWidgets();
            this.initEventsBinding();
        }

        public registerTimeRangeListner(listner: (startTime: string, endTime: string) => void): void{
            StartUp.Instance.timeRangeListener = StartUp.Instance.timeRangeListener || [];
            StartUp.Instance.timeRangeListener.push(listner);
        }

        public deleteTimeRangeListner(listner: (startTime: string, endTime: string) => void): void {
            StartUp.Instance.timeRangeListener.splice(StartUp.Instance.timeRangeListener.indexOf(listner), 1);
        }

        private initWidgets() {
            StartUp.Instance.nav = new Navigations(
                $("#nav-tree"),
                {
                    select: function (e) {
                        onNodeSelect(e, this);
                    }
                }
            );
            var onNodeSelect = (e: kendo.ui.TreeViewSelectEvent, sender): void => {
                var dataItem = sender.dataItem(e.node);
                var currentModule = dataItem.moduleName;
                var baseUrl = dataItem.baseUrl;
                if (baseUrl === "") {
                    return;
                }
                var lastInstance = ModuleLoad.getModuleInstance(StartUp.currentInstanceName);
                if (typeof lastInstance !== "undefined") {
                    lastInstance.destory();
                }

                $('#viewport').empty();
                StartUp.currentInstanceName = currentModule;

                var instance = ModuleLoad.getModuleInstance(currentModule);
                if (typeof instance !== "undefined") {
                    instance.update();
                } else {
                    ModuleLoad.createModuleInstance({
                        baseUrl: baseUrl,
                        moduleName: currentModule,
                        onInstantiated: function (instance: ModuleBase, viewTemplate: HTMLElement) {
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
            
        }

        private initEventsBinding(): void{
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
                if (StartUp.currentInstanceName !== "" && typeof ModuleLoad.getModuleInstance(StartUp.currentInstanceName) !== "undefined") {
                    ModuleLoad.getModuleInstance(StartUp.currentInstanceName).destory();
                    $("#viewport").empty();
                    nav.destory();
                    StartUp.currentInstanceName = "";
                    ModuleLoad.clearAllModules();
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
        }
        

        //http://192.168.0.3:6666/Services/AuthenticationService.svc/ajax
        login(
            serverAddress: string,
            userName: string,
            pwd: string): void{
            var authCre = new ApplicationServices.AuthenticationServiceClient(serverAddress);
            kendo.ui.progress($('#nav-tree'), true);
            authCre.logoutAsync();
            this.nav.setData([{
                text:"Loading"
            }]);
            this.currentServer = serverAddress;
            authCre.loginAsync(userName, pwd, '', true)
                .then((value: boolean) => {
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
                            StartUp.Instance.nav.setData(AppUtils.getTree(data, 0));
                            
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
        }
    }
    
    window.onload = () => {
        StartUp.Instance.startUp();
    };
}