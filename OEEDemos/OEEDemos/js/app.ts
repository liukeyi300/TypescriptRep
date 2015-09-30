/// <reference path="reference.ts" />

module OEEDemos {

    export class StartUp {
        static currentInstanceName: string;
        static Instance: StartUp = new StartUp();
        public nav: Navigations;
        public equipTree: Navigations;
        private timeRangeListner: ((startTime: Date, endTime: Date) => void)[];
        private equipNodeSelectListner: ((e: kendo.ui.TreeViewSelectEvent, sender) => void)[];
        private currentServer: string;
        
        constructor() {
        }

        public startUp(): void {
            this.initWidgets();
            this.initEventsBinding();
            $("#loginModal").modal("show");
        }

        public registerTimeRangeListner(listner: (startTime: Date, endTime: Date) => void): void{
            StartUp.Instance.timeRangeListner = StartUp.Instance.timeRangeListner || [];
            StartUp.Instance.timeRangeListner.push(listner);
        }

        public deleteTimeRangeListner(listner: (startTime: Date, endTime: Date) => void): void {
            StartUp.Instance.timeRangeListner.splice(StartUp.Instance.timeRangeListner.indexOf(listner), 1);
        }

        public registerEquipNodeSelectListner(listner: (e: kendo.ui.TreeViewSelectEvent, sender) => void): void {
            StartUp.Instance.equipNodeSelectListner = StartUp.Instance.equipNodeSelectListner || [];
            StartUp.Instance.equipNodeSelectListner.push(listner);
        }

        public deleteEquipNodeSelectListner(listner: (e: kendo.ui.TreeViewSelectEvent, sender) => void): void {
            StartUp.Instance.equipNodeSelectListner.splice(StartUp.Instance.equipNodeSelectListner.indexOf(listner), 1);
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

            StartUp.Instance.equipTree = new Navigations(
                $("#equip-tree"),
                {
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
                }
            );

            StartUp.Instance.equipTree.setData([{text:"Equipments Waiting......"}]);

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
                } else {
                    ModuleLoad.createModuleInstance({
                        baseUrl: baseUrl,
                        moduleName: currentModule,
                        onInstantiated: function (instance: ModuleBase, viewTemplate: HTMLElement) {
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
                format:"yyyy-MM-dd HH:mm",
                timeFormat:"HH:mm"
            });
            $("#endTimeSelect").kendoDateTimePicker({
                format:"yyyy-MM-dd HH:mm",
                timeFormat:"HH:mm"
            });
            
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
        }
        

        //http://192.168.0.3:6666/Services/AuthenticationService.svc/ajax
        private login(serverAddress: string, userName: string, pwd: string): void{
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

                        $.getJSON("js/moduleList.json", null, function (d) {
                            var data = [];
                            for (var key in d) {
                                data.push(d[key]);
                            }
                            StartUp.Instance.nav.setData(AppUtils.getTree(data, 0));
                          
                            kendo.ui.progress($("#nav-tree"), false);
                            $("#loginModal").modal("hide");
                        });

                        kendo.ui.progress($('#equipTree'), true);
                        serviceContext.PM_EQUIPMENT
                            .map((it) => {
                                return {
                                    id: it.EQP_ID,
                                    parent: it.PARENT,
                                    text: it.NAME
                                }
                            })
                            .toArray(function (data) {
                                StartUp.Instance.equipTree.setData(AppUtils.getTree(data, '-'));
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
        }
    }
    
    window.onload = () => {
        StartUp.Instance.startUp();
    };
}