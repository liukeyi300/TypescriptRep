/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var UserConfiguration = (function () {
        function UserConfiguration() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: 'http://192.168.0.3:6666/Services/PPAEntitiesDataService.svc'
            });
            this.needEquiptree = false;
            this.viewModel = kendo.observable({
                userInfo: {
                    UserName: "lky",
                    Email: "liukeyi@aic-tech.com",
                    CreationDate: "2011-01-01 00:00:01",
                    LastLoginDate: "2011-01-01 00:00:01",
                    LastLockoutDate: "2011-01-01 00:00:01",
                    LastPasswordChangedDate: "2011-01-01 00:00:01",
                    IsLockedOut: "true",
                    IsApproved: "true",
                    Comment: "safasd",
                }
            });
            this.credClient = new ApplicationServices.CredentialServiceClient("http://192.168.0.3:6666/Services/CredentialService.svc/ajax");
        }
        UserConfiguration.prototype.refreshAllUserList = function () {
            kendo.ui.progress($('html'), true);
            var credClient = this.credClient;
            var crtInstance = this;
            credClient.getAllUserNamesAsync()
                .then(function (userNames) {
                userNames.forEach(function (it) {
                    var ul = $('#user-list-all');
                    var center = $('<center></center>');
                    var li = $('<li data-user-name="' + it + '" ></li>');
                    var b = $('<b>' + it + '</b>');
                    b.appendTo(li);
                    li.appendTo(center);
                    center.appendTo(ul);
                    li.on('click', function () {
                        var li = $(this);
                        var userName = li.data('user-name');
                        if (li.hasClass('user-name-active')) {
                            return;
                        }
                        li.addClass('user-name-active');
                        li.css("background-color", "#f35800")
                            .find('b').css('color', '#FFFFFF');
                        li.parent().siblings('center').find('li').removeClass('user-name-active').css('background-color', '#FFFFFF')
                            .find('b').css('color', '#000000');
                        credClient.getRolesForUserAsync(userName).then(function (roles) {
                            roles.forEach(function (it) {
                                var ul = $('#role-list-user');
                                ul.empty();
                                var center = $('<center></center>');
                                var li = $('<li data-user-name="' + it + '" ></li>');
                                var b = $('<b>' + it + '</b>');
                                b.appendTo(li);
                                li.appendTo(center);
                                center.appendTo(ul);
                            });
                        }, function () { }).fail(function () { }).done(function () { });
                        credClient.getUserAsync(userName).then(function (user) {
                            crtInstance.viewModel.set("userInfo", {
                                UserName: user.UserName,
                                Email: user.Email || "No Email",
                                CreationDate: (new Date(parseInt(user.CreationDate.substr(6)))).toLocaleString(),
                                LastLoginDate: new Date(parseInt(user.LastLoginDate.substr(6))).toLocaleString(),
                                LastLockoutDate: new Date(parseInt(user.LastLockoutDate.substr(6))).toLocaleString(),
                                LastPasswordChangedDate: new Date(parseInt(user.LastPasswordChangedDate.substr(6))).toLocaleString(),
                                IsLockedOut: user.IsLockedOut,
                                IsApproved: user.IsApproved,
                                Comment: user.Comment,
                            });
                        }, function () { }).fail(function () { }).done(function () { });
                    });
                });
            }, function () {
            })
                .fail(function () { }).done(function () { kendo.ui.progress($('html'), false); });
        };
        UserConfiguration.prototype.init = function (view) {
            this.view = view;
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
            this.refreshAllUserList();
        };
        UserConfiguration.prototype.update = function () {
            $('#viewport').append(this.view);
            kendo.bind(this.view, this.viewModel);
        };
        UserConfiguration.prototype.destory = function () {
            kendo.unbind(this.view);
        };
        return UserConfiguration;
    })();
    OEEDemos.UserConfiguration = UserConfiguration;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=UserConfiguration.js.map