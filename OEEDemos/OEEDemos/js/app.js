/// <reference path="reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var StartUp = (function () {
        function StartUp() {
            this.viewModel = kendo.observable({});
        }
        StartUp.prototype.startUp = function () {
            this.initWidgets();
            this.initEventsBinding();
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
        StartUp.prototype.registerEquipNodeCheckListner = function (listner) {
            StartUp.Instance.equipNodeCheckListner = StartUp.Instance.equipNodeCheckListner || [];
            StartUp.Instance.equipNodeCheckListner.push(listner);
        };
        StartUp.prototype.deleteEquipNodeCheckListner = function (listner) {
            StartUp.Instance.equipNodeCheckListner.splice(StartUp.Instance.equipNodeCheckListner.indexOf(listner), 1);
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
                    OEEDemos.AppUtils.expandTreeNode(eqpId, function (data) {
                        if (data.length === 0) {
                            StartUp.Instance.equipTree.getTree().dataItem(li).set('items', null);
                            kendo.ui.progress(li, false);
                            return;
                        }
                        StartUp.Instance.equipTree.getTree().append(data, $(e.node));
                        kendo.ui.progress(li, false);
                    }, function (e) {
                        alert(e.message);
                        kendo.ui.progress(li, false);
                    });
                }
            });
            StartUp.Instance.hideEquimentTree();
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
                    if (instance.needEquiptree) {
                        StartUp.Instance.showEquipmentTree();
                    }
                    else {
                        StartUp.Instance.hideEquimentTree();
                    }
                }
                else {
                    OEEDemos.ModuleLoad.createModuleInstance({
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
                                instance.init(view);
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
            //kendo.bind($("body"), this.viewModel);
        };
        StartUp.prototype.initEventsBinding = function () {
            var nav = StartUp.Instance.nav;
            $('#loginConfirm').on("click", function (e) {
                var serverAddress = $("#inputServerAddress").val();
                var userName = $("#inputUserName").val();
                var pwd = $("#inputPwd").val();
                if (serverAddress === "" || userName === "" || pwd === "") {
                    return;
                }
                kendo.ui.progress($('#loginModal'), true);
                OEEDemos.AccountHelpUtils.login(serverAddress, userName, pwd, function (value) {
                    if (value) {
                        var serviceContext = new AicTech.PPA.DataModel.PPAEntities({
                            name: 'oData',
                            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
                        });
                        var roles = [];
                        var allPermissions = [];
                        OEEDemos.AccountHelpUtils.roleServiceClient.getRolesForCurrentUserAsync().then(function (roless) {
                            roles = roless;
                        }, null).then(function () {
                            if (roles.indexOf('Administrator') >= 0) {
                                $.getJSON("js/moduleList.json", null, function (d) {
                                    var data = [];
                                    for (var key in d) {
                                        data.push(d[key]);
                                    }
                                    StartUp.Instance.nav.setData(OEEDemos.AppUtils.getTree(data, 0));
                                    StartUp.Instance.hideLoginModal();
                                    $('#logBtn').removeClass('btn-primary').addClass('btn-danger').removeAttr("data-toggle").removeAttr("data-target");
                                    $('#logBtn').html("登出");
                                    $('#spanUserName').html(userName);
                                    $('#logBtn').on('click', function (e) {
                                        StartUp.Instance.logOut();
                                    });
                                });
                            }
                            else {
                                roles.forEach(function (role) {
                                    if (roles.indexOf(role) === roles.length - 1) {
                                        OEEDemos.AccountHelpUtils.credServiceClient.getPermissionsInRoleAsync(role).then(function (permissions) {
                                            permissions.forEach(function (per) {
                                                allPermissions.push(per);
                                            });
                                        }, null).then(function () {
                                            $.getJSON("js/moduleList.json", null, function (d) {
                                                var data = [];
                                                for (var key in d) {
                                                    if (allPermissions.indexOf("Page_" + d[key].moduleName) >= 0) {
                                                        data.push(d[key]);
                                                    }
                                                }
                                                StartUp.Instance.nav.setData(OEEDemos.AppUtils.getTree(data, 0));
                                                StartUp.Instance.hideLoginModal();
                                                $('#logBtn').removeClass('btn-primary').addClass('btn-danger').removeAttr("data-toggle").removeAttr("data-target");
                                                $('#logBtn').html("登出");
                                                $('#spanUserName').html(userName);
                                                $('#logBtn').on('click', function (e) {
                                                    StartUp.Instance.logOut();
                                                });
                                            });
                                        }, null);
                                    }
                                    else {
                                        OEEDemos.AccountHelpUtils.credServiceClient.getPermissionsInRoleAsync(role).then(function (permissions) {
                                            permissions.forEach(function (per) {
                                                allPermissions.push(per);
                                            });
                                        }, null);
                                    }
                                });
                            }
                        }, null);
                        OEEDemos.AppUtils.expandTreeNode("null", function (data) {
                            StartUp.Instance.equipTree.setData(OEEDemos.AppUtils.getTree(data, 'null', true));
                            StartUp.Instance.hideEquimentTree();
                            kendo.ui.progress($('loginModal'), false);
                        }, function (e) {
                            alert(e.message);
                            kendo.ui.progress($("loginModal"), false);
                        });
                    }
                    else {
                        alert("登录失败！");
                        kendo.ui.progress($('#loginModal'), false);
                    }
                }, null);
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
            $(document).keydown(function (e) {
                if (e.keyCode === 13 && $('#loginModal').hasClass("in")) {
                    $('#loginConfirm').trigger('click');
                }
            });
            this.showLoginModal();
            $('#loginModal').on('shown.bs.modal', function (e) {
                kendo.ui.progress($('html'), false);
            });
        };
        StartUp.prototype.logOut = function () {
            OEEDemos.AccountHelpUtils.logOut();
            if (StartUp.currentInstanceName !== "" && typeof OEEDemos.ModuleLoad.getModuleInstance(StartUp.currentInstanceName) !== "undefined") {
                OEEDemos.ModuleLoad.getModuleInstance(StartUp.currentInstanceName).destory();
                StartUp.currentInstanceName = "";
                OEEDemos.ModuleLoad.clearAllModules();
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
        };
        StartUp.prototype.showLoginModal = function () {
            $('#loginModal').modal('show');
        };
        StartUp.prototype.hideLoginModal = function () {
            $('#loginModal').modal('hide');
        };
        StartUp.prototype.hideEquimentTree = function () {
            $('#equip-container').css("display", "none");
            $('#viewport').removeClass("col-md-9").addClass('col-md-12');
        };
        StartUp.prototype.showEquipmentTree = function () {
            $('#equip-container').css("display", "block");
            $('#viewport').removeClass("col-md-12").addClass('col-md-9');
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