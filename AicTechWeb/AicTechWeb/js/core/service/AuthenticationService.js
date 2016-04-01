var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Core;
        (function (Core) {
            var Service;
            (function (Service) {
                var AuthenticationService = (function () {
                    //#endregion
                    //#region constructor
                    function AuthenticationService() {
                    }
                    Object.defineProperty(AuthenticationService, "serviceAddress", {
                        get: function () {
                            return AuthenticationService._serviceAddress;
                        },
                        set: function (address) {
                            if (Web.Utils.StringUtil.endWith(address, "\/")) {
                                address = address.replace(/\/+$/, "");
                            }
                            AuthenticationService._serviceAddress = address;
                            if (typeof address !== 'undefined' && address !== "") {
                                AuthenticationService.authServiceClient = new ApplicationServices.AuthenticationServiceClient(address + AuthenticationService.authServiceRoot);
                                AuthenticationService.credServiceClient = new ApplicationServices.CredentialServiceClient(address + AuthenticationService.credServiceRoot);
                                AuthenticationService.roleServiceClient = new ApplicationServices.RoleServiceClient(address + AuthenticationService.roleServiceRoot);
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    //#endregion
                    //#region Public static Methods
                    /**
                     * 登录
                     */
                    AuthenticationService.login = function (serviceAddress, userName, pwd) {
                        var d = $.Deferred();
                        AuthenticationService.serviceAddress = serviceAddress;
                        try {
                            AuthenticationService.authServiceClient.loginAsync(userName, pwd, "", true)
                                .then(function (value) {
                                d.resolve(value);
                            })
                                .fail(function () {
                                d.reject();
                            });
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                        return d.promise();
                    };
                    /**
                     * 登出
                     */
                    AuthenticationService.logOut = function () {
                        if (AuthenticationService.authServiceClient !== null) {
                            try {
                                AuthenticationService.authServiceClient.logoutAsync().done(function () {
                                    AuthenticationService.serviceAddress = "";
                                    AuthenticationService.authServiceClient = null;
                                    AuthenticationService.credServiceClient = null;
                                    AuthenticationService.roleServiceClient = null;
                                });
                            }
                            catch (ex) {
                                console.log(ex);
                            }
                        }
                    };
                    //#region Private Properties
                    AuthenticationService._serviceAddress = "";
                    AuthenticationService.authServiceRoot = "/Services/AuthenticationService.svc/ajax";
                    AuthenticationService.credServiceRoot = "/Services/CredentialService.svc/ajax";
                    AuthenticationService.roleServiceRoot = "/Services/RoleService.svc/ajax";
                    AuthenticationService.ppaEntitiesDataRoot = "/Services/PPAEntitiesDataService.svc";
                    return AuthenticationService;
                })();
                Service.AuthenticationService = AuthenticationService;
            })(Service = Core.Service || (Core.Service = {}));
        })(Core = Web.Core || (Web.Core = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=AuthenticationService.js.map