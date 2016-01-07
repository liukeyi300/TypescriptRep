/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var PermissionManagement = (function () {
        function PermissionManagement() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: OEEDemos.AccountHelpUtils.serviceAddress + OEEDemos.AccountHelpUtils.ppaEntitiesDataRoot
            });
            this.needEquiptree = false;
            this.viewModel = kendo.observable({
                savePermission: function () {
                    var permissionsFilter = [];
                    var permissions2Add = [];
                    var permissions2Remove = [];
                    var role = $(".role-table .li-selected-active").data('role-name');
                    var curPers = OEEDemos.ModuleLoad.getModuleInstance("PermissionManagement").currentPermissions;
                    $('#permission-list input[type=checkbox]:checked').each(function (index, elem) {
                        permissions2Add.push('Page_' + $(elem).data('module-name'));
                        permissionsFilter['Page_' + $(elem).data('module-name')] = true;
                    });
                    if (role !== 'Administrator') {
                        curPers.forEach(function (per) {
                            if (permissionsFilter[per] !== true) {
                                permissions2Remove.push(per);
                            }
                        });
                    }
                    if (permissions2Add.length > 0) {
                        OEEDemos.AccountHelpUtils.credServiceClient.addPermissionsToRolesAsync(permissions2Add, [role]);
                    }
                    if (permissions2Remove.length > 0) {
                        OEEDemos.AccountHelpUtils.credServiceClient.removePermissionsFromRolesAsync(permissions2Remove, [role]);
                    }
                },
                clearAll: function () {
                    if ($('.role-table .li-selected-active').data('role-name') === "Administrator") {
                        return;
                    }
                    var checkText = [], treeview = $('#permission-list').data('kendoTreeView');
                    $('#permission-list input[type=checkbox]').each(function (index, elem) {
                        checkText.push($(elem).attr('name'));
                    });
                    checkText.forEach(function (it) {
                        treeview.dataItem(treeview.findByText(it)).set('checked', false);
                    });
                },
                chooseAll: function () {
                    if ($('.role-table .li-selected-active').data('role-name') === "Administrator") {
                        return;
                    }
                    var checkText = [], treeview = $('#permission-list').data('kendoTreeView');
                    $('#permission-list input[type=checkbox]:not(.system-permission)').each(function (index, elem) {
                        checkText.push($(elem).attr('name'));
                    });
                    checkText.forEach(function (it) {
                        treeview.dataItem(treeview.findByText(it)).set('checked', true);
                    });
                }
            });
            this.currentPermissions = [];
        }
        PermissionManagement.prototype.initWidget = function () {
            this.permissionList = new OEEDemos.Navigations($("#permission-list"), {
                checkboxes: {
                    checkChildren: false,
                    template: function (e) {
                        if (e.item.moduleName === "UserConfiguration" ||
                            e.item.moduleName === "RoleConfiguration" ||
                            e.item.moduleName === "PermissionManagement") {
                            return "<input type='checkbox' disabled class='system-permission " + e.item.moduleName +
                                "' name='" + e.item.text + "' data-module-name='" + e.item.moduleName + "' />";
                        }
                        else {
                            return "<input type='checkbox' class= '" + e.item.moduleName + "' name='" + e.item.text +
                                "' data-module-name='" + e.item.moduleName + "'/>";
                        }
                    }
                },
                check: function (e) {
                    OEEDemos.ModuleLoad.getModuleInstance('PermissionManagement').checkChildrenNode(this, this.dataItem(e.node));
                    if ($(e.node).find('input').is(":checked")) {
                        OEEDemos.ModuleLoad.getModuleInstance('PermissionManagement').checkParentNode(this.dataItem(e.node));
                    }
                },
                dataImageUrlField: "null"
            });
        };
        PermissionManagement.prototype.refreshRoleList = function () {
            var ul = $('#role-list-all');
            var instance = this;
            ul.empty();
            kendo.ui.progress($('.permission-container'), true);
            OEEDemos.AccountHelpUtils.credServiceClient.getAllRolesAsync().then(function (roles) {
                roles.forEach(function (role) {
                    var center = $("<center></center>"), li = $('<li data-role-name="' + role + '" ></li>'), b = $('<b>' + role + '</b>');
                    b.appendTo(li);
                    li.appendTo(center);
                    center.appendTo(ul);
                    li.on('click', function (e) {
                        var li = $(this);
                        var roleName = li.data('role-name');
                        if (li.hasClass('li-selected-active')) {
                            return;
                        }
                        li.removeClass('li-selected-non-active').addClass('li-selected-active');
                        li.parent().siblings('center').find('li').removeClass('li-selected-active').addClass('li-selected-non-active');
                        OEEDemos.ModuleLoad.getModuleInstance("PermissionManagement").refreshPermissionList(roleName);
                    });
                });
                $.getJSON('js/moduleList.json', null, function (d) {
                    var data = [], treeData, item;
                    for (var key in d) {
                        item = d[key];
                        delete item.imageUrl;
                        data.push(d[key]);
                    }
                    treeData = OEEDemos.AppUtils.getTree(data, 0);
                    instance.permissionList.setData(treeData);
                    //树形结构有几层就需要展开几次
                    var cur = [];
                    cur.push(treeData);
                    var depth = OEEDemos.AppUtils.getTreeDepth(cur);
                    var treeView = $('#permission-list').data('kendoTreeView');
                    for (var i = 0; i < depth - 1; i++) {
                        treeView.expand('.k-item');
                    }
                    $('#role-list-all li:first').trigger('click');
                    kendo.ui.progress($('.permission-container'), false);
                });
            }, null);
        };
        PermissionManagement.prototype.refreshPermissionList = function (role) {
            kendo.ui.progress($('.permission-container'), true);
            var instance = OEEDemos.ModuleLoad.getModuleInstance('PermissionManagement');
            var treeview = $('#permission-list').data('kendoTreeView');
            instance.viewModel.get('clearAll')();
            instance.currentPermissions = [];
            if (role === "Administrator") {
                var checkText = [];
                instance.disableCheck();
                $('#permission-list input[type=checkbox]').each(function (index, elem) {
                    checkText.push($(elem).attr('name'));
                });
                checkText.forEach(function (it) {
                    treeview.dataItem(treeview.findByText(it)).set('checked', true);
                });
                kendo.ui.progress($('.permission-container'), false);
            }
            else {
                instance.enableCheck();
                OEEDemos.AccountHelpUtils.credServiceClient.getPermissionsInRoleAsync(role).then(function (permissions) {
                    permissions.forEach(function (per) {
                        if (per.substring(0, 5) === "Page_") {
                            var permission = per.substr(5);
                            var text = $('input[type=checkbox]:not(.system-permission).' + permission).attr("name");
                            var dataItem = treeview.dataItem(treeview.findByText(text));
                            instance.currentPermissions.push(per);
                            if (typeof dataItem !== "undefined") {
                                dataItem.set('checked', true);
                            }
                        }
                    });
                    kendo.ui.progress($('.permission-container'), false);
                }, null);
            }
        };
        PermissionManagement.prototype.checkChildrenNode = function (sender, item) {
            var thisNode = sender.findByText(item.text);
            var isCheck = thisNode.find('input[type=checkbox]:first').is(':checked');
            if (thisNode.find('input[type=checkbox]:first').attr('disabled')) {
                item.set('checked', false);
            }
            if (typeof item.items === "undefined") {
                return;
            }
            else {
                for (var i = 0, max = item.items.length; i < max; i++) {
                    if (isCheck) {
                        sender.dataItem(sender.findByText(item.items[i].text)).set('checked', true);
                    }
                    else {
                        sender.dataItem(sender.findByText(item.items[i].text)).set('checked', false);
                    }
                    OEEDemos.ModuleLoad.getModuleInstance('PermissionManagement').checkChildrenNode(sender, sender.dataItem(sender.findByText(item.items[i].text)));
                }
            }
        };
        PermissionManagement.prototype.checkParentNode = function (node) {
            if ("parentNode" in node) {
                node.parentNode().set("checked", true);
                OEEDemos.ModuleLoad.getModuleInstance('PermissionManagement').checkParentNode(node.parentNode());
            }
            return;
        };
        PermissionManagement.prototype.disableCheck = function () {
            $('#permission-list input[type=checkbox]').attr('disabled', 'disabled');
        };
        PermissionManagement.prototype.enableCheck = function () {
            $('#permission-list input[type=checkbox]:not(.system-permission)').removeAttr('disabled');
        };
        PermissionManagement.prototype.init = function (view) {
            this.view = view;
            $('#viewport').append(this.view);
            kendo.bind(this.view.find(".function-area"), this.viewModel);
            //this.bindEvents();
            this.initWidget();
            this.refreshRoleList();
        };
        PermissionManagement.prototype.update = function () {
            $('#viewport').append(this.view);
            kendo.bind(this.view.find(".function-area"), this.viewModel);
            this.initWidget();
            //this.bindEvents();
            this.refreshRoleList();
        };
        PermissionManagement.prototype.destory = function () {
            var treeView = $('#permission-list').data('kendoTreeView');
            kendo.unbind(this.view.find(".function-area"));
            this.permissionList.destory();
            $('#permission-list').empty();
            //this.unbindEvents();
        };
        return PermissionManagement;
    })();
    OEEDemos.PermissionManagement = PermissionManagement;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=PermissionManagement.js.map