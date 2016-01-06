/// <reference path="../../reference.ts" />

module OEEDemos {
    export class PermissionManagement implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
        });
        needEquiptree = false;
        view: JQuery;
        viewModel = kendo.observable({
            savePermission: function () {
                var permissionsFilter = [];
                var permissions2Add = [];
                var permissions2Remove = [];
                var role = $(".role-table .li-selected-active").data('role-name');
                var curPers: any[] = ModuleLoad.getModuleInstance("PermissionManagement").currentPermissions;
                $('#permission-list input[type=checkbox]:checked').each((index: number, elem: HTMLElement) => {
                    permissions2Add.push('Page_'+$(elem).data('module-name'));
                    permissionsFilter['Page_' + $(elem).data('module-name')] = true;
                });
                if (role !== 'Administrator') {
                    curPers.forEach((per) => {
                        if (permissionsFilter[per] !== true) {
                            permissions2Remove.push(per);
                        }
                    });
                }

                if (permissions2Add.length > 0) {
                    AccountHelpUtils.credServiceClient.addPermissionsToRolesAsync(permissions2Add, [role]);
                }

                if (permissions2Remove.length > 0) {
                    AccountHelpUtils.credServiceClient.removePermissionsFromRolesAsync(permissions2Remove, [role]);
                }
            },
            clearAll: function () {
                if ($('.role-table .li-selected-active').data('role-name') === "Administrator") {
                    return;
                }

                var checkText = [];
                var treeview = $('#permission-list').data('kendoTreeView');
                $('#permission-list input[type=checkbox]').each((index: number, elem: HTMLElement) => {
                    checkText.push($(elem).attr('name'))
                });

                checkText.forEach((it: string) => {
                    treeview.dataItem(treeview.findByText(it)).set('checked', false);
                });
            },
            chooseAll: function () {
                if ($('.role-table .li-selected-active').data('role-name') === "Administrator") {
                    return;
                }

                var checkText = [];
                var treeview = $('#permission-list').data('kendoTreeView');
                $('#permission-list input[type=checkbox]:not(.system-permission)').each((index: number, elem: HTMLElement) => {
                    checkText.push($(elem).attr('name'))
                });

                checkText.forEach((it: string) => {
                    treeview.dataItem(treeview.findByText(it)).set('checked', true);
                });
            }
        });

        private permissionList: Navigations;
        private currentPermissions = [];

        constructor() { }

        private initWidget(): void{
            this.permissionList = new Navigations($("#permission-list"), {
                checkboxes: {
                    checkChildren: false,
                    template: function (e) {
                        if (e.item.moduleName === "UserConfiguration" ||
                            e.item.moduleName === "RoleConfiguration" ||
                            e.item.moduleName === "PermissionManagement") {
                            return "<input type='checkbox' disabled class='system-permission " + e.item.moduleName +
                                "' name='" + e.item.text + "' data-module-name='" + e.item.moduleName + "' />";
                        } else {
                            return "<input type='checkbox' class= '" + e.item.moduleName + "' name='" + e.item.text +
                                "' data-module-name='" + e.item.moduleName + "'/>";
                        }
                    }
                },
                check: function (e) {
                    ModuleLoad.getModuleInstance('PermissionManagement').checkChildrenNode(this, this.dataItem(e.node));
                    if ($(e.node).find('input').is(":checked")) {
                        ModuleLoad.getModuleInstance('PermissionManagement').checkParentNode(this.dataItem(e.node));
                    }
                },
                dataImageUrlField:"null"
            });
        }

        private refreshRoleList() {
            var ul = $('#role-list-all');
            var instance = this;
            ul.empty();
            kendo.ui.progress($('.permission-container'), true);
            
            AccountHelpUtils.credServiceClient.getAllRolesAsync().then((roles: string[]) => {
                roles.forEach((role) => {
                    var center = $("<center></center>");
                    var li = $('<li data-role-name="' + role + '" ></li>');
                    var b = $('<b>' + role + '</b>');
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

                        ModuleLoad.getModuleInstance("PermissionManagement").refreshPermissionList(roleName);
                    });
                });

                $.getJSON('js/moduleList.json', null, function (d) {
                    var data = [],
                        treeData,
                        item;
                    for (var key in d) {
                        item = d[key];
                        delete item.imageUrl;
                        data.push(d[key]);
                    }
                    treeData = AppUtils.getTree(data, 0);
                    instance.permissionList.setData(treeData);

                    //树形结构有几层就需要展开几次
                    var cur = [];
                    cur.push(treeData)
                    var depth = AppUtils.getTreeDepth(cur);
                    var treeView = $('#permission-list').data('kendoTreeView');
                    for (var i = 0; i < depth - 1; i++) {
                        treeView.expand('.k-item');
                    }

                    $('#role-list-all li:first').trigger('click');
                    
                    kendo.ui.progress($('.permission-container'), false);
                });
            }, null);

        }

        private refreshPermissionList(role: string) {
            kendo.ui.progress($('.permission-container'), true);
            var instance: PermissionManagement = ModuleLoad.getModuleInstance('PermissionManagement');
            var treeview = $('#permission-list').data('kendoTreeView');
            instance.viewModel.get('clearAll')();
            instance.currentPermissions = [];
            if (role === "Administrator") {
                var checkText = [];
                instance.disableCheck();
                $('#permission-list input[type=checkbox]').each((index: number, elem: HTMLElement) => {
                    checkText.push($(elem).attr('name'))
                });

                checkText.forEach((it: string) => {
                    treeview.dataItem(treeview.findByText(it)).set('checked', true);
                });

                kendo.ui.progress($('.permission-container'), false);
            } else {
                instance.enableCheck();
                AccountHelpUtils.credServiceClient.getPermissionsInRoleAsync(role).then((permissions: string[]) => {
                    permissions.forEach((per: string) => {
                        if (per.substring(0,5) === "Page_") {
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
        }

        private checkChildrenNode(sender, item): void {
            var thisNode = sender.findByText(item.text);
            var isCheck = thisNode.find('input[type=checkbox]:first').is(':checked');
            if (thisNode.find('input[type=checkbox]:first').attr('disabled')) {
                item.set('checked', false);
            }
            if (typeof item.items === "undefined") {
                return;
            } else {
                for (var i = 0, max = item.items.length; i < max; i++) {
                    if (isCheck) {
                        sender.dataItem(sender.findByText(item.items[i].text)).set('checked', true);
                    } else {
                        sender.dataItem(sender.findByText(item.items[i].text)).set('checked', false);
                    }
                    ModuleLoad.getModuleInstance('PermissionManagement').checkChildrenNode(sender, sender.dataItem(sender.findByText(item.items[i].text)));
                }
            }
        }

        private checkParentNode(node): void {
            if ("parentNode" in node) {
                node.parentNode().set("checked", true);
                ModuleLoad.getModuleInstance('PermissionManagement').checkParentNode(node.parentNode());
            }
            return;
        }

        private disableCheck(): void {
            $('#permission-list input[type=checkbox]').attr('disabled','disabled');
        }

        private enableCheck(): void {
            $('#permission-list input[type=checkbox]:not(.system-permission)').removeAttr('disabled');
        }

        init(view: JQuery): void {
            this.view = view;
            $('#viewport').append(this.view);
            kendo.bind(this.view.find(".function-area"), this.viewModel);
            //this.bindEvents();
            this.initWidget();
            this.refreshRoleList();
        }

        update(): void {
            $('#viewport').append(this.view);
            kendo.bind(this.view.find(".function-area"), this.viewModel);
            this.initWidget();
            //this.bindEvents();
            this.refreshRoleList();
        }

        destory(): void {
            var treeView = $('#permission-list').data('kendoTreeView');
            kendo.unbind(this.view.find(".function-area"));
            this.permissionList.destory();
            $('#permission-list').empty();
            //this.unbindEvents();
        }
    }
}