/// <reference path="../JQuery/jquery.d.ts" />

declare module ApplicationServices {
    interface IPromise<T> extends JQueryPromise<T> {
    }
    interface IDeferred<T> extends JQueryDeferred {
    }
    class AsyncUtils {
        static createDeferred<T>(): IDeferred<T>;
        static createPromise<T>(result: T): IPromise<T>;
        static when<T>(...deferreds: any[]): IPromise<T>;
    }
}
declare module ApplicationServices {
    class JsonServiceClientBase {
        private m_url;
        private m_operationTimeout;
        constructor(url: string, operationTimeout?: number);
        public serverUrl : string;
        public operationTimeout : number;
        public sendRequestAsync(action: string, request: any): IPromise<any>;
        private openXHR(action, async);
    }
}
declare module ApplicationServices {
    class AuthenticationServiceClient extends JsonServiceClientBase {
        constructor(url: string, operationTimeout?: number);
        public validateUserAsync(username: string, password: string, customCredential: string): IPromise<boolean>;
        public loginAsync(username: string, password: string, customCredential: string, isPersistent: boolean): IPromise<boolean>;
        public isLoggedInAsync(): IPromise<boolean>;
        public logoutAsync(): IPromise<any>;
    }
}
declare module ApplicationServices {
    interface UserInfo {
        UserName: string;
        Email: string;
        Comment: string;
        IsApproved: boolean;
        IsLockedOut: boolean;
        CreationDate: string;
        LastActivityDate: string;
        LastLockoutDate: string;
        LastLoginDate: string;
        LastPasswordChangedDate: string;
    }
    enum UserCreateStatus {
        Success = 0,
        InvalidUserName = 1,
        InvalidPassword = 2,
        InvalidQuestion = 3,
        InvalidAnswer = 4,
        InvalidEmail = 5,
        DuplicateUserName = 6,
        DuplicateEmail = 7,
        UserRejected = 8,
        InvalidProviderUserKey = 9,
        DuplicateProviderUserKey = 10,
        ProviderError = 11,
    }
    class CredentialServiceClient extends JsonServiceClientBase {
        constructor(url: string, operationTimeout?: number);
        public createUserAsync(userName: string, password: string, email: string, comment: string): IPromise<UserCreateStatus>;
        public deleteUserAsync(userName: string, deleteAllRelatedData: boolean): IPromise<boolean>;
        public updateUserAsync(userName: string, email: string, comment: string, isApproved: boolean): IPromise<any>;
        public unlockUserAsync(userName: string): IPromise<any>;
        public getAllUsersAsync(): IPromise<UserInfo[]>;
        public getAllUserNamesAsync(): IPromise<string[]>;
        public findUserByNameAsync(userName: string): IPromise<UserInfo[]>;
        public getUserAsync(userName: string): IPromise<UserInfo>;
        public userExistsAsync(userName: string): IPromise<boolean>;
        public resetPasswordAsync(userName: string): IPromise<string>;
        public changePasswordAsync(userName: string, oldPassword: string, newPassword: string): IPromise<any>;
        public createRoleAsync(roleName: string): IPromise<any>;
        public deleteRoleAsync(roleName: string, throwOnPopulatedRole: boolean): IPromise<boolean>;
        public getRolesForUserAsync(username: string): IPromise<string[]>;
        public getUsersInRoleAsync(roleName: string): IPromise<string[]>;
        public getAllRolesAsync(): IPromise<string[]>;
        public isUserInRoleAsync(username: string, roleName: string): IPromise<boolean>;
        public addUserToRoleAsync(username: string, roleName: string): IPromise<any>;
        public addUsersToRoleAsync(usernames: string[], roleName: string): IPromise<any>;
        public addUserToRolesAsync(username: string, roleNames: string[]): IPromise<any>;
        public addUsersToRolesAsync(usernames: string[], roleNames: string[]): IPromise<any>;
        public removeUserFromRoleAsync(username: string, roleName: string): IPromise<any>;
        public removeUserFromRolesAsync(username: string, roleNames: string[]): IPromise<any>;
        public removeUsersFromRoleAsync(usernames: string[], roleName: string): IPromise<any>;
        public removeUsersFromRolesAsync(usernames: string[], roleNames: string[]): IPromise<any>;
        public roleExistsAsync(roleName: string): IPromise<boolean>;
        public getAdministratorRoleNameAsync(): IPromise<string>;
        public addPermissionsToRolesAsync(permissionNames: string[], roleNames: string[]): IPromise<any>;
        public removePermissionsFromRolesAsync(permissionNames: string[], roleNames: string[]): IPromise<any>;
        public createPermissionAsync(permissionName: string): IPromise<any>;
        public deletePermissionAsync(permissionName: string): IPromise<boolean>;
        public getAllPermissionsAsync(): IPromise<string[]>;
        public permissionExistsAsync(permissionName: string): IPromise<boolean>;
        public isPermissionInRoleAsync(permissionName: string, roleName: string): IPromise<boolean>;
        public getPermissionsInRoleAsync(roleName: string): IPromise<string[]>;
        public getRolesForPermissionAsync(permissionName: string): IPromise<string[]>;
        public hasUserPermissionAsync(userName: string, permissionName: string, grantNonRolesPermission: boolean): IPromise<boolean>;
        public checkUserPermissionsAsync(userName: string, permissionNames: string[], grantNonRolesPermission: boolean): IPromise<boolean[]>;
        public isNoRolesPermissionAsync(permissionName: string, checkPermissionExistence: boolean): IPromise<boolean>;
    }
}
declare module ApplicationServices {
    class RoleServiceClient extends JsonServiceClientBase {
        constructor(url: string, operationTimeout?: number);
        public isCurrentUserInRoleAsync(role: string): IPromise<boolean>;
        public getRolesForCurrentUserAsync(): IPromise<string[]>;
    }
}
