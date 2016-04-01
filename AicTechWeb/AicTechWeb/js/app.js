/// <reference path="reference.ts" />
var Service = AicTech.Web.Core.Service;
var Module = AicTech.Web.Core.Module;
var Utils = AicTech.Web.Utils;
var Controls = AicTech.Web.Controls;
var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Html;
        (function (Html) {
            var StartUp = (function () {
                //#endregion
                //#region constructor
                function StartUp() {
                    this.dataContextService = new Service.DataContextService();
                    //#endregion
                    //#region ViewModel
                    this.viewModel = kendo.observable({
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
                                .then(function (value) {
                                StartUp.Instance.loginResultProcess(value);
                            }).fail(function (e) {
                                console.log(e);
                            });
                        },
                        keydown: function (e) {
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
                            }
                            else {
                                StartUp.Instance.showMenu();
                            }
                        },
                        menuSelect: function (e) {
                            var dataItem = Module.ModuleLoad.allModules[$(e.item).find('span.k-state-selected').text()], currentModule = dataItem.moduleName, baseUrl = dataItem.baseUrl;
                            if (baseUrl === "" || currentModule === StartUp.currentInstanceName) {
                                return;
                            }
                            var lastInstance = Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName);
                            if (typeof lastInstance !== "undefined") {
                                lastInstance.dispose();
                            }
                            $('#viewport').empty();
                            StartUp.currentInstanceName = currentModule;
                            if ($('#startTimeSelect').val() !== "") {
                                StartUp.Instance.viewModel.set('startTime', new Date($('#startTimeSelect').val() + ":00"));
                            }
                            else {
                                StartUp.Instance.viewModel.set('startTime', Web.Utils.DateUtils.lastDay(new Date()));
                            }
                            if ($('#endTimeSelect').val() !== "") {
                                StartUp.Instance.viewModel.set('endTime', new Date($('#endTimeSelect').val() + ":00"));
                            }
                            else {
                                StartUp.Instance.viewModel.set('endTime', Web.Utils.DateUtils.lastDay(new Date()));
                            }
                            var instance = Module.ModuleLoad.getModuleInstance(currentModule);
                            if (typeof instance !== "undefined") {
                                $('#viewport').append(instance.view);
                                instance.update();
                                if (instance.needEquiptree) {
                                    StartUp.Instance.showEquipmentTree();
                                }
                                else {
                                    StartUp.Instance.hideEquimentTree();
                                }
                            }
                            else {
                                Module.ModuleLoad.createModuleInstance({
                                    baseUrl: baseUrl,
                                    moduleName: currentModule,
                                    onInstantiated: function (instance, viewTemplate) {
                                        var view = $(viewTemplate);
                                        setTimeout(function () {
                                            if (instance.needEquiptree) {
                                                StartUp.Instance.showEquipmentTree();
                                            }
                                            else {
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
                    this.currentEquipmentId = "";
                    this.currentEquipmentName = "";
                    this.allUOMID = [];
                    this.allEngId = [];
                    this.allEngName = [];
                    this.allCauseStyle = [];
                }
                Object.defineProperty(StartUp.prototype, "startTime", {
                    //#endregion
                    //#region Public Properties
                    get: function () {
                        return this.viewModel.get('startTime');
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StartUp.prototype, "endTime", {
                    get: function () {
                        return this.viewModel.get('endTime');
                    },
                    enumerable: true,
                    configurable: true
                });
                //#endregion
                //#region Public Methods
                StartUp.prototype.startUp = function () {
                    this.initWidgets();
                    kendo.bind($('body'), this.viewModel);
                    this.initEquipTree();
                    this.showLoginModal();
                    this.loadBackgroundMethods();
                };
                //#endregion
                //#region Private Methods
                //#region Init Widgets 
                StartUp.prototype.initWidgets = function () {
                    $("#startTimeSelect").kendoDateTimePicker({
                        format: "yyyy/MM/dd HH:mm",
                        timeFormat: "HH:mm"
                    });
                    $("#endTimeSelect").kendoDateTimePicker({
                        format: "yyyy/MM/dd HH:mm",
                        timeFormat: "HH:mm"
                    });
                    setTimeout(function () {
                        $('#refresh-data').addClass('right');
                    }, 10);
                };
                StartUp.prototype.initEquipTree = function () {
                    var that = this;
                    that.equipTree = new Web.Controls.TreeView($("#equip-tree"), {
                        select: function (e) {
                            that.equipNodeSelect(e, this);
                        },
                        expand: function (e) {
                            that.equipNodeExpand(e, this);
                        }
                    });
                    that.hideEquimentTree();
                };
                //#region Equipment Tree Events
                StartUp.prototype.equipNodeSelect = function (e, sender) {
                    var that = StartUp.Instance;
                    that.currentEquipmentId = sender.dataItem(e.node).id;
                    that.currentEquipmentName = sender.dataItem(e.node).text;
                    console.log(that.currentEquipmentId + ":" + that.currentEquipmentName);
                    if (StartUp.currentInstanceName !== '') {
                        Module.ModuleLoad.getModuleInstance(StartUp.currentInstanceName).refreshData();
                    }
                };
                /**
                 * Expand a Node of Equipment-Tree
                 *
                 * @params {kendo.ui.TreeViewExpandEvent} e
                 * @params {kendo.ui.TreeView} sender
                 */
                StartUp.prototype.equipNodeExpand = function (e, sender) {
                    var li = $(e.node), that = StartUp.Instance;
                    var isExpanded = li.data('expanded');
                    if (isExpanded) {
                        return;
                    }
                    var eqpId = sender.dataItem(e.node).id;
                    var tree = sender;
                    li.data('expanded', true);
                    kendo.ui.progress(li, true);
                    Web.Utils.TreeUtils.expandTreeNodeAsync(eqpId)
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
                };
                //#endregion
                //#endregion
                //#region Login Logout Services
                StartUp.prototype.logOut = function () {
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
                };
                StartUp.prototype.loginResultProcess = function (value) {
                    if (value) {
                        this.setContext();
                        var serviceContext = this.dataContextService.getServiceContext(), roles = [], allPermisstions = [], i, length;
                        $('#page-content').css('height', '100%');
                        Service.AuthenticationService.roleServiceClient.getRolesForCurrentUserAsync().then(function (roles) {
                            StartUp.Instance.processRoles(roles);
                        }, null);
                        Web.Utils.TreeUtils.expandTreeNodeAsync("null").then(function (data) {
                            StartUp.Instance.equipTree.setData(Web.Utils.TreeUtils.getTree(data, 'null', true));
                            StartUp.Instance.hideEquimentTree();
                            kendo.ui.progress($('#login-modal'), false);
                        }).fail(function (e) {
                            console.log(e);
                            kendo.ui.progress($('#login-modal'), false);
                        });
                        if (typeof this.preLoadFun !== 'undefined') {
                            length = this.preLoadFun.length;
                        }
                        else {
                            length = 0;
                        }
                        for (i = 0; i < length; i++) {
                            this.preLoadFun[i].call(StartUp.Instance);
                        }
                    }
                    else {
                        alert("登录失败！");
                        kendo.ui.progress($('#login-modal'), false);
                    }
                };
                StartUp.prototype.processRoles = function (roles) {
                    $('#aic-menu').kendoPanelBar({
                        select: this.viewModel.get('menuSelect')
                    });
                    var allPermissions, menu = $('#aic-menu').data('kendoPanelBar');
                    if (roles.indexOf('Administrator') >= 0) {
                        $.getJSON("js/core/module/ModuleList.json")
                            .then(function (d, status, jqXHR) {
                            var data = [];
                            for (var key in d) {
                                data.push(d[key]);
                                Module.ModuleLoad.allModules[d[key].text] = d[key];
                            }
                            menu.setOptions({
                                dataSource: Web.Utils.TreeUtils.getTree(data, 0)
                            });
                            StartUp.Instance.logined();
                        });
                    }
                    else {
                        roles.forEach(function (role) {
                            if (roles.indexOf(role) === roles.length - 1) {
                                Service.AuthenticationService.credServiceClient.getPermissionsInRoleAsync(role)
                                    .then(function (permissions) {
                                    permissions.forEach(function (per) {
                                        allPermissions.push(per);
                                    });
                                }, null)
                                    .then(function () {
                                    $.getJSON("js/core/module/ModuleList.json")
                                        .then(function (d) {
                                        var data = [];
                                        for (var key in d) {
                                            if (allPermissions.indexOf("Page_" + d[key].moduleName) >= 0) {
                                                data.push(d[key]);
                                                Module.ModuleLoad.allModules[d[key].text] = d[key];
                                            }
                                        }
                                        menu.setOptions({
                                            dataSource: Web.Utils.TreeUtils.getTree(data, 0)
                                        });
                                        StartUp.Instance.logined();
                                    });
                                });
                            }
                            else {
                                Service.AuthenticationService.credServiceClient.getPermissionsInRoleAsync(role)
                                    .then(function (permissions) {
                                    permissions.forEach(function (per) {
                                        allPermissions.push(per);
                                    });
                                });
                            }
                        });
                    }
                };
                StartUp.prototype.setContext = function () {
                    var _context = new AicTech.PPA.DataModel.PPAEntities({
                        name: 'oData',
                        oDataServiceHost: Service.AuthenticationService.serviceAddress + Service.AuthenticationService.ppaEntitiesDataRoot
                    });
                    this.dataContextService.setServiceContext(_context);
                };
                //#endregion
                //#region 模块中需要预先异步加载一部分参数，在loadBackgroundMethods方法注册到preLoadFun数组中
                StartUp.prototype.loadBackgroundMethods = function () {
                    this.preLoadFun = this.preLoadFun || [];
                    this.preLoadFun.push(this.loadAllDowntimeStyle);
                    this.preLoadFun.push(this.loadAllUomId);
                    this.preLoadFun.push(this.loadAllEngId);
                };
                /**
                 * 获取所有停机事件不同停机原因的样式
                 * DowntimeTimelineCharts
                 */
                StartUp.prototype.loadAllDowntimeStyle = function () {
                    var _this = this;
                    console.log("");
                    var context = this.dataContextService.getServiceContext();
                    this.allCauseStyle = [];
                    context.MD_DOM_VALUE
                        .filter(function (it) {
                        return it.DOM_ID == 'DTCAUSE_SHOWCOLOR';
                    })
                        .map(function (it) {
                        return {
                            causeId: it.VALUE,
                            causeColor: it.DESCRIPTION
                        };
                    })
                        .toArray(function (re) {
                        var styleText = $('#cause-color').text();
                        styleText = "";
                        re.forEach(function (it) {
                            _this.allCauseStyle.push(it);
                            if (it.causeColor != null) {
                                styleText += ".vis-item-" + it.causeId + '{\n background-color:' + it.causeColor + ' !important;\n border-color:'
                                    + it.causeColor + ' !important \n}\n';
                            }
                        });
                        $('#cause-color').text(styleText);
                    }).fail(function (e) {
                        console.log(e);
                    });
                };
                StartUp.prototype.loadAllUomId = function () {
                    var _this = this;
                    var context = this.dataContextService.getServiceContext();
                    this.allUOMID = [];
                    context.MD_UNITS_OF_MEASURE
                        .toArray(function (re) {
                        re.forEach(function (it) {
                            _this.allUOMID.push(it.UOM_ID);
                        });
                    }).fail(function (e) {
                        console.log(e);
                    });
                };
                StartUp.prototype.loadAllEngId = function () {
                    var _this = this;
                    var context = this.dataContextService.getServiceContext();
                    this.allEngId = [];
                    this.allEngName = [];
                    context.MD_DOM_VALUE
                        .toArray(function (re) {
                        re.forEach(function (it) {
                            _this.allEngId.push(it.VALUE);
                            _this.allEngName.push(it.DESCRIPTION);
                        });
                    }).fail(function (e) {
                        console.log(e);
                    });
                };
                //#endregion
                //#region Layout Operations
                StartUp.prototype.showLoginModal = function () {
                    $('#login-modal').modal('show');
                };
                StartUp.prototype.hideLoginModal = function () {
                    $('#login-modal').modal('hide');
                };
                StartUp.prototype.hideEquimentTree = function () {
                    $('#equip-container').css("display", "none");
                    $('#viewport').css('width', '100%');
                };
                StartUp.prototype.showEquipmentTree = function () {
                    $('#equip-container').css("display", "block");
                    $('#viewport').css('width', '83%');
                };
                StartUp.prototype.showMenu = function () {
                    $('#navigation').css('width', '16%');
                    $('#navigation .inner').css('margin-left', '6px');
                    $('#content').css({ 'width': '84%', 'margin-left': '-6px' });
                    $('#content .inner').css('margin-left', '6px');
                    $('#hover-nav').find('img').attr('src', 'images/icons/8_8/arrow_left.png');
                    $('#navigation').data('state', 'showed');
                    $('#hover-nav').attr('title', '隐藏菜单栏');
                };
                StartUp.prototype.hideMenu = function () {
                    $('#navigation').css('width', '0%');
                    $('#content .inner').css('margin-left', '12px');
                    $('#content').css({ 'width': '100%', 'margin-left': '-12px' });
                    $('#navigation .inner').css('margin-left', '0');
                    $('#hover-nav').find('img').attr('src', 'images/icons/8_8/arrow_right.png');
                    $('#navigation').data('state', 'hidden');
                    $('#hover-nav').attr('title', '打开菜单栏');
                };
                StartUp.prototype.logined = function () {
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
                };
                StartUp.currentInstanceName = '';
                StartUp.Instance = new StartUp();
                return StartUp;
            })();
            Html.StartUp = StartUp;
            window.onload = function () {
                StartUp.Instance.startUp();
            };
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=app.js.map