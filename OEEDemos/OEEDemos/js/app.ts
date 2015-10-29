/// <reference path="reference.ts" />

module OEEDemos {

    export class StartUp {
        static currentInstanceName: string;
        static Instance: StartUp = new StartUp();
        public nav: Navigations;
        public equipTree: Navigations;
        private timeRangeListner: ((startTime: Date, endTime: Date) => void)[];
        private equipNodeSelectListner: ((e: kendo.ui.TreeViewSelectEvent, sender) => void)[];
        private equipNodeCheckListner: ((e: kendo.ui.TreeViewSelectEvent, sender) => void)[];
        private currentServer: string;
        private viewModel = kendo.observable({
        });

        constructor() {}

        public startUp(): void {
            this.initWidgets();
            this.initEventsBinding();
        }

        public registerTimeRangeListner(listner: (startTime: Date, endTime: Date) => void): void {
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

        public registerEquipNodeCheckListner(listner: (e: kendo.ui.TreeViewSelectEvent, sender) => void): void {
            StartUp.Instance.equipNodeCheckListner = StartUp.Instance.equipNodeCheckListner || [];
            StartUp.Instance.equipNodeCheckListner.push(listner);
        }

        public deleteEquipNodeCheckListner(listner: (e: kendo.ui.TreeViewSelectEvent, sender) => void): void {
            StartUp.Instance.equipNodeCheckListner.splice(StartUp.Instance.equipNodeCheckListner.indexOf(listner), 1);
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
                    }
                    //},
                    //check: function (e) {
                    //    if (typeof StartUp.Instance.equipNodeCheckListner === 'undefined') {
                    //        return;
                    //    }
                    //    for (var i = 0, max = StartUp.Instance.equipNodeCheckListner.length, listners = StartUp.Instance.equipNodeCheckListner; i < max; i++) {
                    //        if (listners[i]) {
                    //            listners[i](e, this);
                    //        }
                    //    }
                    //},
                    //checkboxes: {
                    //    checkChildren: true
                    //}
                }
            );

            StartUp.Instance.equipTree.setData([{ text: "Please Login!" }]);
            StartUp.Instance.hideEquimentTree();

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
                    if (instance.needEquiptree) {
                        StartUp.Instance.showEquipmentTree();
                    } else {
                        StartUp.Instance.hideEquimentTree();
                    }
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
                                if (instance.needEquiptree) {
                                    StartUp.Instance.showEquipmentTree();
                                } else {
                                    StartUp.Instance.hideEquimentTree();
                                }
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

            //kendo.bind($("body"), this.viewModel);
        }

        private initEventsBinding(): void{
            var nav = StartUp.Instance.nav;

            $('#loginConfirm').on("click", function (e) {
                var serverAddress = $("#inputServerAddress").val();
                var userName = $("#inputUserName").val();
                var pwd = $("#inputPwd").val();
                if (serverAddress === "" || userName === "" || pwd === "") {
                    return;
                }
                StartUp.Instance.login(serverAddress, userName, pwd);
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

            $(document).keydown(function (e: KeyboardEvent) {
                if (e.keyCode === 13 && $('#loginModal').hasClass("in")) {
                    $('#loginConfirm').trigger('click');
                }
            });

            this.showLoginModal();
        }
        

        //http://192.168.0.3:6666/Services/AuthenticationService.svc/ajax
        private login(serverAddress: string, userName: string, pwd: string): void {
            var authCre = new ApplicationServices.AuthenticationServiceClient(serverAddress);
            var credClient = new ApplicationServices.CredentialServiceClient("http://192.168.0.3:6666/Services/CredentialService.svc/ajax");
            var roleClient = new ApplicationServices.RoleServiceClient("http://192.168.0.3:6666/Services/RoleService.svc/ajax");
  
            kendo.ui.progress($('html'), true);
            authCre.logoutAsync();
            this.nav.setData([{
                text:"Please Login!"
            }]);
            this.currentServer = serverAddress;
            
            authCre.loginAsync(userName, pwd, '', true)
                .then((value: boolean) => {
                if (value) {
                    //credClient.getAllRolesAsync().then((userInfo: string[]) => {
                    //    var a = 0;
                    //    a++;
                    //}, null);
                    //credClient.getAllPermissionsAsync().then((userInfo: string[]) => {
                    //    var a = 0;
                    //    a++;
                    //}, null);
                    
                    //credClient.getPermissionsInRoleAsync("Engineer").then((useinfo: string[]) => {
                    //    var a = 0;
                    //    a++;
                    //}, function () {
                    //    var a = 0;
                    //    a++;
                    //}); 
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
                        StartUp.Instance.hideLoginModal();
                        $('#logBtn').removeClass('btn-primary').addClass('btn-danger').removeAttr("data-toggle").removeAttr("data-target");
                        $('#logBtn').html("登出");
                        $('#spanUserName').html(userName);
                        $('#logBtn').on('click', function (e) {
                            StartUp.Instance.logOut();
                        });
                    });
                        
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
                            StartUp.Instance.hideEquimentTree();
                            kendo.ui.progress($("html"), false);
                        })
                        .fail(function (e: { message: string }) {
                            alert(e.message);
                            kendo.ui.progress($("html"), false);
                        });
                    }
                }, function () {
                    kendo.ui.progress($('#nav-tree'), false);
                    alert("Login failed!");
                });
        }

        private logOut(): void {
            var authCre = new ApplicationServices.AuthenticationServiceClient(StartUp.Instance.currentServer);
            authCre.logoutAsync();
            if (StartUp.currentInstanceName !== "" && typeof ModuleLoad.getModuleInstance(StartUp.currentInstanceName) !== "undefined") {
                ModuleLoad.getModuleInstance(StartUp.currentInstanceName).destory();
                StartUp.currentInstanceName = "";
                ModuleLoad.clearAllModules();
            }
            $("#viewport").empty();
            $('#logBtn').html('登录');
            $('#logBtn').unbind('click');
            $('#logBtn').removeClass('btn-danger').addClass('btn-primary').attr("data-toggle", "modal").attr("data-target", "#loginModal");
            $('#spanUserName').html("");

            StartUp.Instance.nav.setData([{ text: "Please Login!" }]);
            StartUp.Instance.equipTree.setData([{ text: "Please Login!" }]);
            StartUp.Instance.hideEquimentTree();
            this.hideLoginModal();
        }

        private showLoginModal(): void {
            $('#loginModal').modal('show');
        }   

        private hideLoginModal(): void {
            $('#loginModal').modal('hide');
        }

        private hideEquimentTree(): void {
            $('#equip-tree').css("display", "none");
            $('#viewport').css('width', "100%");
        }

        private showEquipmentTree(): void {
            $('#equip-tree').css("display", "block");
            $('#viewport').css('width', "80%");
        }
    }
    
    window.onload = () => {
        StartUp.Instance.startUp();
    };
}