﻿/// <reference path="../../reference.ts" />

module OEEDemos {
    export class UserConfiguration implements ModuleBase {
        ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
            name: 'oData',
            oDataServiceHost: AccountHelpUtils.serviceAddress + AccountHelpUtils.ppaEntitiesDataRoot
        });
        needEquiptree = false;
        view: JQuery;
        viewModel = kendo.observable({
            userInfo: {
                UserName: "&nbsp;",
                Email: "&nbsp;",
                CreationDate: "&nbsp;",
                LastLoginDate: "&nbsp;",
                LastLockoutDate: "&nbsp;",
                LastPasswordChangedDate: "&nbsp;",
                IsLockedOut: false,
                IsApproved: false,
                Comment: "&nbsp;"
            },
            userName: "",
            userPwd: "",
            userPwdConfirm: "",
            userEmail: "",
            userComment: "",
            pwd4Change: "",
            pwd4ChangeConfirm: "",
            pwdFormer: "",
            createUser: function () {
                var userPwd = this.get('userPwd');
                var userPwdConfirm = this.get('userPwdConfirm');
                var userName = this.get('userName');

                if (userName === "") {
                    alert("请输入用户名！");
                    return;
                } else if (userPwd === "" || userPwd !== userPwdConfirm) {
                    alert("请输入相同的密码！");
                    return;
                } else {
                    var userEmail = this.get('userEmail');
                    var userComment = this.get('userComment');
                    var credClient = AccountHelpUtils.credServiceClient;
                    credClient.createUserAsync(userName, userPwd, userEmail || "", userComment || "").then((value: ApplicationServices.UserCreateStatus) => {
                        if (value == ApplicationServices.UserCreateStatus.Success) {
                            alert("添加成功！");
                            $('#create-user').modal('hide');
                            ModuleLoad.getModuleInstance('UserConfiguration').refreshAllUserList();
                        }
                    }, null).fail();
                }
            },
            unlockUser: function () {
                var userName = this.get("userInfo.UserName");
                if (userName === "&nbsp;") {
                    return;
                }
                var con = confirm("确认解锁用户：" + userName + " ?");
                var that = this;
                if (con) {
                    var credClient = AccountHelpUtils.credServiceClient;
                    credClient.unlockUserAsync(userName).then(() => {
                        that.set("userInfo.IsLockedOut", false);
                    }, null);
                }

            },
            deleteUser: function () {
                var userName = this.get("userInfo.UserName");
                if (userName === "&nbsp;") {
                    return;
                }
                var con = confirm("确认删除用户：" + userName + " ?");
                if (con) {
                    var credClient = AccountHelpUtils.credServiceClient;
                    credClient.deleteUserAsync(userName, true).then((value: boolean) => {
                        if (value) {
                            alert("已删除");
                            ModuleLoad.getModuleInstance('UserConfiguration').refreshAllUserList();
                        }
                    }, null).fail();
                }
            },
            changePwd: function () {
                var formerPwd = this.get("pwdFormer");
                var pwd4Change = this.get("pwd4Change");
                var pwd4ChangeConfirm = this.get("pwd4ChangeConfirm");
                if (pwd4Change !== pwd4ChangeConfirm) {
                    alert("请输入相同的密码！");
                    return;
                } else {
                    var con = confirm("确认修改用户" + this.get("userInfo.UserName") + "的密码？");
                    if (con) {
                        AccountHelpUtils.credServiceClient.changePasswordAsync(this.get('userInfo.UserName'), formerPwd, pwd4Change)
                            .then(function (value: boolean) {
                                if (value) {
                                    alert("修改成功！");
                                    $('#changePwd').modal("hide");
                                    ModuleLoad.getModuleInstance('UserConfiguration').viewModel.set('pwdFormer', "");
                                    ModuleLoad.getModuleInstance('UserConfiguration').viewModel.set('pwd4Change', "");
                                    ModuleLoad.getModuleInstance('UserConfiguration').viewModel.set('pwd4ChangeConfirm', "");
                                } else {
                                    alert("请输入正确的原密码！");
                                    return;
                                }
                            }, null);
                 
                    }
                }
            },
            resetPwd: function () {
                var userName = this.get("userInfo.UserName");
                if (userName === "&nbsp;") {
                    return;
                } 
                var con = confirm("确认重置密码：" + userName + " ?");
                var that = this;
                if (con) {
                    var credClient = AccountHelpUtils.credServiceClient;
                    credClient.resetPasswordAsync(userName).then((newPwd: string) => {
                        alert("用户" + userName + "的新密码为：" + newPwd);
                    }, null);
                }
            },
            addRoleForUser: function () {
                var userName = this.get('userInfo.UserName');
                var roles = [];
                $('#role-list-4add .li-selected-active').each((index: number, elem: HTMLElement) => {
                    roles.push($(elem).data('role-name'));
                });
                AccountHelpUtils.credServiceClient.addUserToRolesAsync(userName, roles).then(function () {
                    ModuleLoad.getModuleInstance('UserConfiguration').refreshRoleList();
                    $('#addRole').modal('hide');
                }, null);
            },
            deleteRole: function () {
                var userName = this.get("userInfo.UserName");
                var roleName = ModuleLoad.getModuleInstance('UserConfiguration').crtRole;

                var con = confirm("确认从用户 " + userName + "中删除角色 " + roleName + " ?");
                if (con) {
                    AccountHelpUtils.credServiceClient.removeUserFromRoleAsync(userName, roleName).then(function () {
                        ModuleLoad.getModuleInstance('UserConfiguration').refreshRoleList();
                    }, null);
                }
            }
        });

        private crtRole = "";

        constructor() { }

        private refreshAllUserList(): void {
            $('#user-list-all').empty();
            $('#role-list-user').empty();
            kendo.ui.progress($('html'), true);
            var credClient = AccountHelpUtils.credServiceClient;
            var crtInstance: UserConfiguration = this;
            
            credClient.getAllUserNamesAsync()
                .then((userNames: string[]) => {
                    userNames.forEach((it: string) => {
                        var ul = $('#user-list-all');
                        var center = $('<center></center>');
                        var li = $('<li data-user-name="' + it  + '" ></li>');
                        var b = $('<b>' + it + '</b>');
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
                            li.parent().siblings('center').find('li').removeClass('li-selected-active').addClass("li-selected-non-active");

                            kendo.ui.progress($('html'), true);
                            credClient.getRolesForUserAsync(userName).then((roles: string[]) => {
                                var ul = $('#role-list-user');
                                ul.empty();
                                roles.forEach((it: string) => {
                                    var center = $('<center></center>');
                                    var li = $('<li data-role-name="' + it + '" ></li>');
                                    var b = $('<b>' + it + '</b>');
                                    b.appendTo(li);
                                    li.appendTo(center);
                                    center.appendTo(ul);

                                    li.on('click', function () {
                                        var li = $(this);
                                        var roleName = li.data('role-name');
                                        if (li.hasClass('li-selected-active')) {
                                            return;
                                        }
                                        crtInstance.crtRole = roleName;
                                        li.removeClass('li-selected-non-active').addClass('li-selected-active');
                                        li.parent().siblings('center').find('li').removeClass('li-selected-active').addClass("li-selected-non-active");
                                    });
                                });
                                $('#role-list-user li:first').trigger('click');
                                kendo.ui.progress($('html'), false);
                            }, () => { })
                            .fail(() => { }).done(() => { });
                            kendo.ui.progress($('html'), true);
                            credClient.getUserAsync(userName).then((user: ApplicationServices.UserInfo) => {
                                crtInstance.viewModel.set("userInfo", {
                                    UserName: user.UserName,
                                    Email: user.Email || "无",
                                    CreationDate: DateUtils.format(DateUtils.dateString2Date(user.CreationDate), "yyyy-MM-dd hh:mm:ss"),
                                    LastLoginDate: DateUtils.format(DateUtils.dateString2Date(user.LastLoginDate), "yyyy-MM-dd hh:mm:ss"),
                                    LastLockoutDate: DateUtils.format(DateUtils.dateString2Date(user.LastLockoutDate), "yyyy-MM-dd hh:mm:ss"),
                                    LastPasswordChangedDate: DateUtils.format(DateUtils.dateString2Date(user.LastPasswordChangedDate), "yyyy-MM-dd hh:mm:ss"),
                                    IsLockedOut: user.IsLockedOut,
                                    IsApproved: user.IsApproved,
                                    Comment: user.Comment || "无",
                                });
                                kendo.ui.progress($('html'), false);
                            }, () => { })
                            .fail(() => { }).done(() => { });
                        });
                    });
                    $('#user-list-all li:first').trigger('click');
                }, null)
                .fail(() => { }).done(() => { kendo.ui.progress($('html'), false); });
        }

        private refreshRoleList(): void {
            var instant: UserConfiguration = ModuleLoad.getModuleInstance('UserConfiguration');
            var userName = instant.viewModel.get('userInfo.UserName');
            var ul = $("#role-list-user");
            ul.empty();

            kendo.ui.progress($('html'), true);

            AccountHelpUtils.credServiceClient.getRolesForUserAsync(userName).then(function (roles: string[]) {
                roles.forEach((it: string) => {
                    var center = $('<center></center>');
                    var li = $('<li data-role-name="' + it + '" ></li>');
                    var b = $('<b>' + it + '</b>');
                    b.appendTo(li);
                    li.appendTo(center);
                    center.appendTo(ul);

                    li.on('click', function () {
                        var li = $(this);
                        var roleName = li.data('role-name');
                        if (li.hasClass('li-selected-active')) {
                            return;
                        }
                        instant.crtRole = roleName;
                        li.removeClass('li-selected-non-active').addClass('li-selected-active');
                        li.parent().siblings('center').find('li').removeClass('li-selected-active').addClass("li-selected-non-active");
                    });
                });
                $('#role-list-user li:first').trigger('click');

                kendo.ui.progress($('html'), false);
            }, null);
        }

        private bindEvents(): void {
            this.viewModel.bind('change', function (e) {
                if (e.field === 'userPwd' || e.field === 'userPwdConfirm') {
                    var userPwd = this.get('userPwd');
                    var userPwdConfirm = this.get('userPwdConfirm');
                    if (userPwd !== userPwdConfirm) {
                        $('#user-pwd-txt').addClass('pwd-not-same');
                        $('#user-pwd-confirm').addClass('pwd-not-same');
                    } else {
                        $('#user-pwd-txt').removeClass('pwd-not-same');
                        $('#user-pwd-confirm').removeClass('pwd-not-same');
                    }
                } else if (e.field === 'pwd4Change' || e.field === 'pwd4ChangeConfirm') {
                    userPwd = this.get('pwd4Change');
                    userPwdConfirm = this.get('pwd4ChangeConfirm');
                    if (userPwd !== userPwdConfirm) {
                        $('#user-pwd-4change').addClass('pwd-not-same');
                        $('#user-pwd-confirm-4change').addClass('pwd-not-same');
                    } else {
                        $('#user-pwd-4change').removeClass('pwd-not-same');
                        $('#user-pwd-confirm-4change').removeClass('pwd-not-same');
                    } 
                }
            });

            $('#addRole').on('show.bs.modal', function (e) {
                kendo.ui.progress($('#addRole'), true);
            });

            $('#addRole').on('shown.bs.modal', function (e) {
                var currentRoles = [];
                var userName = ModuleLoad.getModuleInstance('UserConfiguration').viewModel.get('userInfo.UserName');
                var ul = $('#role-list-4add');
                AccountHelpUtils.credServiceClient.getRolesForUserAsync(userName).then(function (roles: string[]) {
                    currentRoles = roles;
                }, null).then(function () {
                    AccountHelpUtils.credServiceClient.getAllRolesAsync().then(function (roles: string[]) {
                        var need2Add = [];
                        var isExist = false;
                        for (var i = 0, max = roles.length; i < max; i++) {
                            isExist = false;
                            currentRoles.forEach((it) => {
                                if (it === roles[i]) {
                                    isExist = true;
                                }
                            });

                            if (!isExist) {
                                need2Add.push(roles[i]);
                            }
                        }

                        if (need2Add.length === 0) {
                            alert("该用户已经拥有所有角色！");
                            kendo.ui.progress($('#addRole'), false);
                            $('#addRole').modal('hide');
                        } else {
                            need2Add.forEach((it) => {
                                var center = $('<center></center>');
                                var li = $('<li data-role-name="' + it + '" ></li>');
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

                        kendo.ui.progress($('#addRole'), false);
                    }, null);
                }, null);
            });

            $('#addRole').on('hidden.bs.modal', function (e) {
                $('#role-list-4add').empty();
            });
        }

        private unbindEvents(): void{
            this.viewModel.unbind('change');
            $('#addRole').unbind('show.bs.modal');
            $('#addRole').unbind('shown.bs.modal');
            $('#addRole').unbind('hidden.bs.modal');
        }

        init(view: JQuery): void {
            this.view = view;
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
            this.bindEvents();
            this.refreshAllUserList();
            
        }

        update(): void {
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
            this.bindEvents();
            this.refreshAllUserList();
        }

        destory(): void {
            kendo.unbind(this.view);
            this.unbindEvents();
        }
    }
}