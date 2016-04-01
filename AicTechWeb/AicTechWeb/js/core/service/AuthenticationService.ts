module AicTech.Web.Core.Service {
    export class AuthenticationService {

        //#region Private Properties
        private static _serviceAddress: string = "";
        private static authServiceRoot = "/Services/AuthenticationService.svc/ajax";
        private static credServiceRoot = "/Services/CredentialService.svc/ajax";
        private static roleServiceRoot = "/Services/RoleService.svc/ajax";
        //#endregion

        //#region constructor
        constructor() { }
        //#endregion
        
        //#region Public Static Properties
        public static authServiceClient: ApplicationServices.AuthenticationServiceClient;
        public static credServiceClient: ApplicationServices.CredentialServiceClient;
        public static roleServiceClient: ApplicationServices.RoleServiceClient;
        public static ppaEntitiesDataRoot = "/Services/PPAEntitiesDataService.svc"
        
        static get serviceAddress(): string {
            return AuthenticationService._serviceAddress;
        }

        static set serviceAddress(address: string) {
            if (Utils.StringUtil.endWith(address, "\/")) {
                address = address.replace(/\/+$/, "");
            }
            AuthenticationService._serviceAddress = address;
            if (typeof address !== 'undefined' && address !== "") {
                AuthenticationService.authServiceClient = new ApplicationServices.AuthenticationServiceClient(address + AuthenticationService.authServiceRoot);
                AuthenticationService.credServiceClient = new ApplicationServices.CredentialServiceClient(address + AuthenticationService.credServiceRoot);
                AuthenticationService.roleServiceClient = new ApplicationServices.RoleServiceClient(address + AuthenticationService.roleServiceRoot);
            }
        }
        //#endregion

        //#region Public static Methods
        /**
         * 登录
         */
        public static login(serviceAddress: string, userName: string, pwd: string): JQueryPromise<boolean> {
            var d = $.Deferred();
            
            AuthenticationService.serviceAddress = serviceAddress;
            try {
                AuthenticationService.authServiceClient.loginAsync(userName, pwd, "", true)
                    .then((value: boolean) => {
                        d.resolve(value);
                    })
                    .fail(() => {
                        d.reject();
                    });
            } catch (ex) {
                console.log(ex);
            }
            return d.promise();
        }

        /**
         * 登出
         */
        public static logOut() {
            if (AuthenticationService.authServiceClient !== null) {
                try {
                    AuthenticationService.authServiceClient.logoutAsync().done(() => {
                        AuthenticationService.serviceAddress = "";
                        AuthenticationService.authServiceClient = null;
                        AuthenticationService.credServiceClient = null;
                        AuthenticationService.roleServiceClient = null;
                    });
                } catch (ex) {
                    console.log(ex);
                }
            }
        }
        //#endregion
    }    
}