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
                    },
                    expand: function (e) {
                        var li = $(e.node);
                        var isExpanded = li.data('expanded');
                        if (isExpanded) {
                            return;
                        } 
                        var eqpId = this.dataItem(e.node).id;
                        var tree = this;
                        li.data('expanded', true);

                        kendo.ui.progress(li, true);
                        
                        AppUtils.expandTreeNode(eqpId, (data: any[]) => {
                             if (data.length === 0) {
                                StartUp.Instance.equipTree.getTree().dataItem(li).set('items', null);
                                kendo.ui.progress(li, false);
                                return;
                            }
                            StartUp.Instance.equipTree.getTree().append(data, $(e.node));
                            kendo.ui.progress(li, false);
                        }, (e: { message: string }) => {
                            alert(e.message);
                            kendo.ui.progress(li, false);
                        });
                    }
                }
            );
            
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
                kendo.ui.progress($('#loginModal'), true);
                AccountHelpUtils.login(serverAddress, userName, pwd, function (value: boolean) {
                        if (value) {
                            var serviceContext = new AicTech.PPA.DataModel.PPAEntities({
                                name: 'oData',
                                oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
                            });
                            var roles = [];
                            var allPermissions = [];
                            AccountHelpUtils.roleServiceClient.getRolesForCurrentUserAsync().then((roless: string[]) => {
                                roles = roless;
                            }, null).then(function () {
                                if (roles.indexOf('Administrator') >= 0) {
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
                                } else {
                                    roles.forEach((role) => {
                                        if (roles.indexOf(role) === roles.length - 1) {
                                            AccountHelpUtils.credServiceClient.getPermissionsInRoleAsync(role).then((permissions) => {
                                                permissions.forEach((per) => {
                                                    allPermissions.push(per);
                                                })
                                            }, null).then(function () {
                                                $.getJSON("js/moduleList.json", null, function (d) {
                                                    var data = [];
                                                    for (var key in d) {
                                                        if (allPermissions.indexOf("Page_" + d[key].moduleName) >= 0) {
                                                            data.push(d[key]);
                                                        }
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
                                            }, null);
                                        } else {
                                            AccountHelpUtils.credServiceClient.getPermissionsInRoleAsync(role).then((permissions) => {
                                                permissions.forEach((per) => {
                                                    allPermissions.push(per);
                                                })
                                            }, null);
                                        }
                                    });
                                }
                            }, null);

                            AppUtils.expandTreeNode("null",
                                (data: any[]) => {
                                    StartUp.Instance.equipTree.setData(AppUtils.getTree(data, 'null', true));
                                    StartUp.Instance.hideEquimentTree();
                                    kendo.ui.progress($('loginModal'), false);
                                },
                                (e: { message: string }) => {
                                    alert(e.message);
                                    kendo.ui.progress($("loginModal"), false);
                                });
                        } else {
                            alert("登录失败！");
                            kendo.ui.progress($('#loginModal'), false);
                        }
                    },
                    function () {
                        kendo.ui.progress($('#loginModal'), false);
                        alert("登录失败！");
                    });
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

            $('#loginModal').on('shown.bs.modal', function (e) {
                kendo.ui.progress($('html'), false);
            });
        }

        private logOut(): void {
            AccountHelpUtils.logOut();
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

            $('#startTimeSelect').val("");
            $('#endTimeSelect').val("");

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
            $('#equip-container').css("display", "none");
            $('#viewport').removeClass("col-md-9").addClass('col-md-12')
        }

        private showEquipmentTree(): void {
            $('#equip-container').css("display", "block");
            $('#viewport').removeClass("col-md-12").addClass('col-md-9')
        }
    }
    
    window.onload = () => {
        StartUp.Instance.startUp();
    };
}