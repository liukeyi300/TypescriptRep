/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var RoleConfiguration = (function () {
        function RoleConfiguration() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: OEEDemos.AccountHelpUtils.serviceAddress + OEEDemos.AccountHelpUtils.ppaEntitiesDataRoot
            });
            this.needEquiptree = false;
            this.viewModel = kendo.observable({
                createRole: function () {
                    var roleName = this.get("roleName");
                    var con = confirm("确定添加角色：" + roleName + " ?");
                    if (con) {
                        OEEDemos.AccountHelpUtils.credServiceClient.createRoleAsync(roleName).then(function () {
                            alert("添加成功！");
                            OEEDemos.ModuleLoad.getModuleInstance('RoleConfiguration').viewModel.set('roleName', "");
                            $('#create-role').modal('hide');
                            OEEDemos.ModuleLoad.getModuleInstance('RoleConfiguration').refreshRoleList();
                        }, null);
                    }
                },
                deleteRole: function () {
                    var roleName = $('#role-list-all li.li-selected-active').data('role-name');
                    var con = confirm("确认删除角色：" + roleName + " ？");
                    if (con) {
                        OEEDemos.AccountHelpUtils.credServiceClient.deleteRoleAsync(roleName, false).then(function (value) {
                            if (value) {
                                alert('已删除！');
                                OEEDemos.ModuleLoad.getModuleInstance('RoleConfiguration').refreshRoleList();
                            }
                        }, null);
                    }
                },
                addUser: function () {
                    var roleName = $('#role-list-all .li-selected-active').data('role-name');
                    var users = [];
                    $('#user-list-4add .li-selected-active').each(function (index, elem) {
                        users.push($(elem).data('user-name'));
                    });
                    kendo.ui.progress($('#add-user'), true);
                    OEEDemos.AccountHelpUtils.credServiceClient.addUsersToRoleAsync(users, roleName).then(function () {
                        OEEDemos.ModuleLoad.getModuleInstance('RoleConfiguration').refreshUserList();
                        $('#add-user').modal('hide');
                        kendo.ui.progress($('#add-user'), false);
                    }, null);
                },
                removeUser: function () {
                    var roleName = $('#role-list-all li.li-selected-active').data('role-name');
                    var userName = $('#user-list-role li.li-selected-active').data('user-name');
                    var con = confirm("确认从角色" + roleName + "中删除用户" + userName + " ?");
                    if (con) {
                        OEEDemos.AccountHelpUtils.credServiceClient.removeUserFromRoleAsync(userName, roleName).then(function () {
                            OEEDemos.ModuleLoad.getModuleInstance('RoleConfiguration').refreshUserList();
                        }, null);
                    }
                },
                roleName: ""
            });
        }
        RoleConfiguration.prototype.refreshRoleList = function () {
            kendo.ui.progress($('html'), true);
            OEEDemos.AccountHelpUtils.credServiceClient.getAllRolesAsync().then(function (roles) {
                var ul = $('#role-list-all');
                ul.empty();
                roles.forEach(function (role) {
                    var center = $('<center></center>');
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
                        kendo.ui.progress($('html'), true);
                        OEEDemos.AccountHelpUtils.credServiceClient.getUsersInRoleAsync(roleName).then(function (users) {
                            var ul = $('#user-list-role');
                            ul.empty();
                            users.forEach(function (user) {
                                var center = $('<center></center>');
                                var li = $('<li data-user-name="' + user + '" ></li>');
                                var b = $('<b>' + user + '</b>');
                                b.appendTo(li);
                                li.appendTo(center);
                                center.appendTo(ul);
                                li.on('click', function () {
                                    var li = $(this);
                                    var userName = li.data('user-name');
                                    if (li.hasClass('li-selected-active')) {
                                        return;
                                    }
                                    //role = roleName;
                                    li.removeClass('li-selected-non-active').addClass('li-selected-active');
                                    li.parent().siblings('center').find('li').removeClass('li-selected-active').addClass('li-selected-non-active');
                                });
                            });
                            $('#user-list-role li:first').trigger('click');
                            kendo.ui.progress($('html'), false);
                        }, null);
                    });
                });
                $('#role-list-all li:first').trigger('click');
            }, null).done(function () { kendo.ui.progress($('html'), false); });
        };
        RoleConfiguration.prototype.refreshUserList = function () {
            var roleName = $('#role-list-all li.li-selected-active').data('role-name');
            kendo.ui.progress($('html'), true);
            OEEDemos.AccountHelpUtils.credServiceClient.getUsersInRoleAsync(roleName).then(function (users) {
                var ul = $('#user-list-role');
                ul.empty();
                users.forEach(function (user) {
                    var center = $('<center></center>');
                    var li = $('<li data-user-name="' + user + '" ></li>');
                    var b = $('<b>' + user + '</b>');
                    b.appendTo(li);
                    li.appendTo(center);
                    center.appendTo(ul);
                    li.on('click', function () {
                        var li = $(this);
                        var userName = li.data('user-name');
                        if (li.hasClass('li-selected-active')) {
                            return;
                        }
                        li.removeClass('li-selected-non-active').addClass('li-selected-active');
                        li.parent().siblings('center').find('li').removeClass('li-selected-active').addClass('li-selected-non-active');
                    });
                });
                $('#user-list-role li:first').trigger('click');
                kendo.ui.progress($('html'), false);
            }, null);
        };
        RoleConfiguration.prototype.bindEvents = function () {
            $('#add-user').on('show.bs.modal', function (e) {
                kendo.ui.progress($('#add-user'), true);
            });
            $('#add-user').on('shown.bs.modal', function (e) {
                var ul = $('#user-list-4add');
                var currentUsers = [];
                var roleName = $('#role-list-all li.li-selected-active').data('role-name');
                OEEDemos.AccountHelpUtils.credServiceClient.getUsersInRoleAsync(roleName).then(function (users) {
                    currentUsers = users;
                }, null).then(function () {
                    OEEDemos.AccountHelpUtils.credServiceClient.getAllUsersAsync().then(function (users) {
                        var need2add = [];
                        var isExist = false;
                        for (var i = 0, length = users.length; i < length; i++) {
                            isExist = false;
                            currentUsers.forEach(function (it) {
                                if (it === users[i].UserName) {
                                    isExist = true;
                                    return;
                                }
                            });
                            if (!isExist) {
                                need2add.push(users[i].UserName);
                            }
                        }
                        if (need2add.length === 0) {
                            alert("所有用户均有此角色，无需添加！");
                            kendo.ui.progress($('add-user'), false);
                            $('#add-user').modal('hide');
                        }
                        else {
                            need2add.forEach(function (it) {
                                var center = $('<center></center>');
                                var li = $('<li data-user-name="' + it + '" ></li>');
                                var b = $('<b>' + it + '</b>');
                                b.appendTo(li);
                                li.appendTo(center);
                                center.appendTo(ul);
                                li.on("click", function (e) {
                                    var li = $(this);
                                    if (li.hasClass('li-selected-active')) {
                                        return;
                                    }
                                    li.removeClass('li-selected-non-active').addClass('li-selected-active');
                                });
                            });
                        }
                    }, null);
                    kendo.ui.progress($('#add-user'), false);
                }, null);
            });
            $('#add-user').on('hidden.bs.modal', function (e) {
                $('#user-list-4add').empty();
            });
        };
        RoleConfiguration.prototype.unbindEvents = function () {
            this.view.find('li').unbind('click');
            $('#add-user').unbind('show.bs.modal');
            $('#add-user').unbind('shown.bs.modal');
            $('#add-user').unbind('hidden.bs.modal');
        };
        RoleConfiguration.prototype.init = function (view) {
            this.view = view;
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
            this.bindEvents();
            this.refreshRoleList();
        };
        RoleConfiguration.prototype.update = function () {
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
            this.bindEvents();
            this.refreshRoleList();
        };
        RoleConfiguration.prototype.destory = function () {
            kendo.unbind(this.view);
            this.unbindEvents();
        };
        return RoleConfiguration;
    })();
    OEEDemos.RoleConfiguration = RoleConfiguration;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=RoleConfiguration.js.map