/// <reference path="reference.ts" />
import Service = AicTech.Web.Core.Service;
import Module = AicTech.Web.Core.Module;
import Utils = AicTech.Web.Utils;
import Controls = AicTech.Web.Controls;

module AicTech.Web.Html {
    export class StartUp  {

        //#region Private Properties
        private equipTree: Controls.TreeView;
        private timeRangeListner: ((startTime: Date, endTime: Date) => void)[];
        private equipNodeSelectListner: ((e: kendo.ui.TreeViewSelectEvent, sender) => void)[];
        private preLoadFun: (() => void)[];
        private dataContextService = new Service.DataContextService<AicTech.PPA.DataModel.PPAEntities>();
        //#endregion

        //#region ViewModel
        private viewModel = kendo.observable({
            serverAddress: "http://192.168.0.3/ppa",
            userName: "lky",
            password: "lky",
            startTime: new Date(2016, 2, 13),
            endTime: new Date(2016, 2, 18),
            login: function () {
                var serverAddress = this.get('serverAddress');
                var userName = this.get('userName');
                var pwd = this.get('password');
                if (serverAddress === "" || userName === "" || pwd === "") {
                    return;
                }
                kendo.ui.progress($('#login-modal'), true);

                Service.AuthenticationService.login(serverAddress, userName, pwd)
                    .then(function (value: boolean) {
                        StartUp.Instance.loginResultProcess(value);
                    }).fail((e) => {
                        console.log(e);
                    });
            },
            keydown: function (e: KeyboardEvent) {
                if (e.keyCode === 13 && $('#login-modal').hasClass("in")) {
                    this.get('login').call(this, []);
                }
            },
            modalShow: function () {
                kendo.ui.progress($('html'), false);
            },
            refreshData: function () {
                if (StartUp.currentInstanceName !== '') {
                    Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName).refreshData();
                }
            },
            hoverNav: function () {
                if ($('#navigation').data('state') === "showed") {
                    StartUp.Instance.hideMenu();
                } else {
                    StartUp.Instance.showMenu();
                }
            },
            menuSelect: function (e: kendo.ui.PanelBarSelectEvent) {
                var dataItem = Module.ModuleLoad.allModules[$(e.item).find('span.k-state-selected').text()],
                    currentModule = dataItem.moduleName,
                    baseUrl = dataItem.baseUrl;
                if (baseUrl === "" || currentModule === StartUp.currentInstanceName) {
                    return;
                }
                var lastInstance: Module.ModuleBase = Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName);
                if (typeof lastInstance !== "undefined") {
                    lastInstance.dispose();
                }

                $('#viewport').empty();
                StartUp.currentInstanceName = currentModule;

                if ($('#startTimeSelect').val() !== "") {
                    StartUp.Instance.viewModel.set('startTime', new Date($('#startTimeSelect').val() + ":00"));
                } else {
                    StartUp.Instance.viewModel.set('startTime', Utils.DateUtils.lastDay(new Date()));
                }

                if ($('#endTimeSelect').val() !== "") {
                    StartUp.Instance.viewModel.set('endTime', new Date($('#endTimeSelect').val() + ":00"));
                } else {
                    StartUp.Instance.viewModel.set('endTime', Utils.DateUtils.lastDay(new Date()));
                }

                var instance: Module.ModuleBase = Module.ModuleLoad.getModuleInstance(currentModule);
                if (typeof instance !== "undefined") {
                    $('#viewport').append(instance.view);
                    instance.update();
                    if (instance.needEquiptree) {
                        StartUp.Instance.showEquipmentTree();
                    } else {
                        StartUp.Instance.hideEquimentTree();
                    }
                } else {
                    Module.ModuleLoad.createModuleInstance({
                        baseUrl: baseUrl,
                        moduleName: currentModule,
                        onInstantiated: (instance: Module.ModuleBase, viewTemplate: HTMLElement) => {
                            var view = $(viewTemplate);
                            setTimeout(function () {
                                if (instance.needEquiptree) {
                                    StartUp.Instance.showEquipmentTree();
                                } else {
                                    StartUp.Instance.hideEquimentTree();
                                }
                                $('#viewport').append(view);
                                instance.init(view);
                            }, 100);
                        }
                    });
                }
            }
        });
        //#endregion
        
        //#region Public Properties
        public get startTime(): Date {
            return this.viewModel.get('startTime');
        }

        public get endTime(): Date {
            return this.viewModel.get('endTime');
        }

        static currentInstanceName: string = '';
        static Instance: StartUp = new StartUp();
        public currentEquipmentId: string = "";
        public currentEquipmentName: string = "";
        public allUOMID: string[] = [];
        public allEngId: string[] = [];
        public allEngName: string[] = [];
        public allCauseStyle: IDowntimeCauseColor[] = [];
        //#endregion

        //#region constructor
        constructor() { }
        //#endregion

        //#region Public Methods
        public startUp(): void {
            this.initWidgets();
            kendo.bind($('body'), this.viewModel);
            this.initEquipTree();
            this.showLoginModal();
            this.loadBackgroundMethods();
        }
        //#endregion

        //#region Private Methods
        //#region Init Widgets 
        private initWidgets() {
            $("#startTimeSelect").kendoDateTimePicker({
                format:"yyyy/MM/dd HH:mm",
                timeFormat: "HH:mm"
            });
            $("#endTimeSelect").kendoDateTimePicker({
                format: "yyyy/MM/dd HH:mm",
                timeFormat: "HH:mm"
            });

            setTimeout(function () {
                $('#refresh-data').addClass('right');
            }, 10);
        }

        private initEquipTree() {
            var that: StartUp = this;
            that.equipTree = new Controls.TreeView(
                $("#equip-tree"),
                {
                    select: function (e) {
                        that.equipNodeSelect(e, this);
                    },
                    expand: function (e) {
                        that.equipNodeExpand(e, this);
                    }
                }
            );
            that.hideEquimentTree();
        }

        //#region Equipment Tree Events
        private equipNodeSelect(e, sender) {
            var that = StartUp.Instance;
            that.currentEquipmentId = sender.dataItem(e.node).id;
            that.currentEquipmentName = sender.dataItem(e.node).text;
            console.log(that.currentEquipmentId + ":" + that.currentEquipmentName);
            if (StartUp.currentInstanceName !== '') {
                Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName).refreshData();
            }
        }

        /**
         * Expand a Node of Equipment-Tree
         *
         * @params {kendo.ui.TreeViewExpandEvent} e
         * @params {kendo.ui.TreeView} sender
         */
        private equipNodeExpand(e: kendo.ui.TreeViewExpandEvent, sender: kendo.ui.TreeView) {
            var li = $(e.node),
                that = StartUp.Instance;
            var isExpanded = li.data('expanded');
            if (isExpanded) {
                return;
            }
            var eqpId = sender.dataItem(e.node).id;
            var tree = sender;
            li.data('expanded', true);

            kendo.ui.progress(li, true);

            Utils.TreeUtils.expandTreeNodeAsync(eqpId)
                .then(function (data) {
                    if (data.length === 0) {
                        that.equipTree.getTree().dataItem(li).set('items', null);
                        kendo.ui.progress(li, false);
                        return;
                    }
                    that.equipTree.getTree().append(data, $(e.node));
                    kendo.ui.progress(li, false);
                }).fail(function (e) {
                    console.log(e.message);
                    kendo.ui.progress(li, false);
                });
        }
        //#endregion
        //#endregion
        
        //#region Login Logout Services
        private logOut(): void {
            Service.AuthenticationService.logOut();

            if (StartUp.currentInstanceName !== "" && typeof Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName) !== "undefined") {
                Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName).dispose();
                StartUp.currentInstanceName = "";
                kendo.ui.progress($('div'), false);
            }
            $("#viewport").empty();
            $('#btn-log').html('登录');
            $('#btn-log').unbind('click');
            $('#btn-log').attr("data-toggle", "modal").attr("data-target", "#login-modal");
            $('#show-user-name').html("欢迎，请登录!");

            $('#page-content').css('height', '0');
            var menu = $('#aic-menu').data('kendoPanelBar');
            menu.destroy();
            $('#aic-menu').empty();
            this.hideEquimentTree();
            this.viewModel.set('startTime', new Date(2016, 2, 13));
            this.viewModel.set('endTime', new Date());
            this.currentEquipmentId = "";
            this.hideLoginModal();
        }

        private loginResultProcess(value: boolean) {
            if (value) {
                this.setContext();
                var serviceContext = this.dataContextService.getServiceContext(),
                    roles = [],
                    allPermisstions = [],
                    i,
                    length;

                $('#page-content').css('height', '100%');

                Service.AuthenticationService.roleServiceClient.getRolesForCurrentUserAsync().then((roles: string[]) => {
                    StartUp.Instance.processRoles(roles);
                }, null);

                Utils.TreeUtils.expandTreeNodeAsync("null").then(function (data) {
                    StartUp.Instance.equipTree.setData(Utils.TreeUtils.getTree(data, 'null', true));
                    StartUp.Instance.hideEquimentTree();
                    kendo.ui.progress($('#login-modal'), false);
                }).fail(function (e) {
                    console.log(e);
                    kendo.ui.progress($('#login-modal'), false);
                });

                if (typeof this.preLoadFun !== 'undefined') {
                    length = this.preLoadFun.length;
                } else {
                    length = 0;
                }

                for (i = 0; i < length; i++) {
                    this.preLoadFun[i].call(StartUp.Instance);
                }
            } else {
                alert("登录失败！");
                kendo.ui.progress($('#login-modal'), false);
            }
        }

        private processRoles(roles: string[]) {
            $('#aic-menu').kendoPanelBar({
                select: this.viewModel.get('menuSelect')
            });
            var allPermissions: string[],
                menu = $('#aic-menu').data('kendoPanelBar');

            if (roles.indexOf('Administrator') >= 0) {

                $.getJSON("js/core/module/ModuleList.json")
                    .then((d: any, status: string, jqXHR: JQueryXHR) => {
                        var data = [];
                        for (var key in d) {
                            data.push(d[key]);
                            Module.ModuleLoad.allModules[d[key].text] = d[key];
                        }
                        menu.setOptions({
                            dataSource: Utils.TreeUtils.getTree(data, 0)
                        });

                        StartUp.Instance.logined();
                    });

            } else {
                roles.forEach((role) => {

                    if (roles.indexOf(role) === roles.length - 1) {

                        Service.AuthenticationService.credServiceClient.getPermissionsInRoleAsync(role)
                            .then((permissions) => {
                                permissions.forEach((per) => {
                                    allPermissions.push(per);
                                })
                            }, null)
                            .then(function () {

                                $.getJSON("js/core/module/ModuleList.json")
                                    .then((d) => {
                                        var data = [];
                                        for (var key in d) {
                                            if (allPermissions.indexOf("Page_" + d[key].moduleName) >= 0) {
                                                data.push(d[key]);
                                                Module.ModuleLoad.allModules[d[key].text] = d[key];
                                            }
                                        }
                                        menu.setOptions({
                                            dataSource: Utils.TreeUtils.getTree(data, 0)
                                        });

                                        StartUp.Instance.logined();
                                    });
                            });
                    } else {
                        Service.AuthenticationService.credServiceClient.getPermissionsInRoleAsync(role)
                            .then((permissions) => {
                                permissions.forEach((per) => {
                                    allPermissions.push(per);
                                })
                            });
                    }
                });
            }
        }

        private setContext() {
            var _context = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: Service.AuthenticationService.serviceAddress + Service.AuthenticationService.ppaEntitiesDataRoot
            });
            this.dataContextService.setServiceContext(_context);
        }
        //#endregion

        //#region 模块中需要预先异步加载一部分参数，在loadBackgroundMethods方法注册到preLoadFun数组中
        private loadBackgroundMethods() {
            this.preLoadFun = this.preLoadFun || [];
            this.preLoadFun.push(this.loadAllDowntimeStyle);
            this.preLoadFun.push(this.loadAllUomId);
            this.preLoadFun.push(this.loadAllEngId);
        }

        /**
         * 获取所有停机事件不同停机原因的样式
         * DowntimeTimelineCharts
         */
        private loadAllDowntimeStyle() {
            console.log("");
            var context = this.dataContextService.getServiceContext();
            this.allCauseStyle = [];
            context.MD_DOM_VALUE
                .filter(function (it) {
                    return it.DOM_ID == 'DTCAUSE_SHOWCOLOR';
                })
                .map((it) => {
                    return {
                        causeId: it.VALUE,
                        causeColor: it.DESCRIPTION
                    }
                })
                .toArray((re) => {
                    var styleText = $('#cause-color').text();
                    styleText = "";
                    re.forEach((it) => {
                        this.allCauseStyle.push(it);
                        if (it.causeColor != null) {
                            styleText += ".vis-item-" + it.causeId + '{\n background-color:' + it.causeColor + ' !important;\n border-color:'
                                + it.causeColor + ' !important \n}\n';
                        }
                    });
                    $('#cause-color').text(styleText);
                }).fail((e) => {
                    console.log(e);
                });
        }
        
        private loadAllUomId() {
            var context = this.dataContextService.getServiceContext();
            this.allUOMID = [];
            context.MD_UNITS_OF_MEASURE
                .toArray((re) => {
                    re.forEach((it) => {
                        this.allUOMID.push(it.UOM_ID);
                    });
                }).fail((e) => {
                    console.log(e);
                });
        }

        private loadAllEngId() {
            var context = this.dataContextService.getServiceContext();
            this.allEngId = [];
            this.allEngName = [];
            context.MD_DOM_VALUE
                .toArray((re) => {
                    re.forEach((it) => {
                        this.allEngId.push(it.VALUE);
                        this.allEngName.push(it.DESCRIPTION);
                    });
                }).fail((e) => {
                    console.log(e);
                });
        }
        //#endregion

        //#region Layout Operations
        private showLoginModal(): void {
            $('#login-modal').modal('show');
        }   

        private hideLoginModal(): void {
            $('#login-modal').modal('hide');
        }

        private hideEquimentTree(): void {
            $('#equip-container').css("display", "none");
            $('#viewport').css('width', '100%');
        }

        private showEquipmentTree(): void {
            $('#equip-container').css("display", "block");
            $('#viewport').css('width', '83%');
        }

        private showMenu(): void {
            $('#navigation').css('width', '16%'); 
            $('#navigation .inner').css('margin-left', '6px');
            $('#content').css({ 'width': '84%', 'margin-left': '-6px' }); 
            $('#content .inner').css('margin-left', '6px');
            $('#hover-nav').find('img').attr('src', 'images/icons/8_8/arrow_left.png');
            $('#navigation').data('state', 'showed');
            $('#hover-nav').attr('title', '隐藏菜单栏');
        }

        private hideMenu(): void {
            $('#navigation').css('width', '0%');
            $('#content .inner').css('margin-left', '12px');
            $('#content').css({ 'width': '100%', 'margin-left': '-12px' });
            $('#navigation .inner').css('margin-left', '0');
            $('#hover-nav').find('img').attr('src', 'images/icons/8_8/arrow_right.png');
            $('#navigation').data('state', 'hidden');
            $('#hover-nav').attr('title', '打开菜单栏');
        }

        private logined() {
            var userName = this.viewModel.get('userName');
            this.hideLoginModal();
            $('#btn-log').removeAttr("data-toggle").removeAttr("data-target");
            $('#btn-log').html("登出");
            $('#show-user-name').html('欢迎  ' + userName + "!");
            $('#btn-log').on('click', function (e) {
                StartUp.Instance.logOut();
                $('#btn-log').unbind('click');
                e.stopPropagation();
            });
        }
        //#endregion

        //#endregion
    }
    
    window.onload = () => {
        StartUp.Instance.startUp();
    };
}