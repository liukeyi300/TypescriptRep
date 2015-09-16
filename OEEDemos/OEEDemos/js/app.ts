/// <reference path="reference.ts" />

module OEEDemos {

    export class StartUp {
        static currentInstanceName: string;
        static Instance: StartUp = new StartUp();
        private nav: Navigations;
        private currentServer: string;
        constructor() {
        }

        public startUp(): void {
            this.initWidgets();
            this.initEventsBinding();
        }

        private initWidgets() {
            this.nav = new Navigations(
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

                $('#content').empty();
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
        }

        private initEventsBinding(): void{
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

                        $.getJSON("js/moduleList.json", null, function (d) {
                            var data = [];
                            for (var key in d) {
                                data.push(d[key]);
                            }
                            StartUp.Instance.nav.setData(AppUtils.getTree(data, 0));
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