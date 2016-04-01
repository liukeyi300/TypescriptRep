/// <reference path="../JQuery/JQuery.d.ts" />
declare module ApplicationServices {
    interface IPromise<T> extends JQueryPromise<T> {
    }
    interface IDeferred<T> extends JQueryDeferred<T> {
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
        serverUrl: string;
        operationTimeout: number;
        sendRequestAsync(action: string, request: any): IPromise<any>;
        private openXHR(action, async);
    }
}
declare module ApplicationServices {
    class AuthenticationServiceClient extends JsonServiceClientBase {
        constructor(url: string, operationTimeout?: number);
        validateUserAsync(username: string, password: string, customCredential: string): IPromise<boolean>;
        loginAsync(username: string, password: string, customCredential: string, isPersistent: boolean): IPromise<boolean>;
        isLoggedInAsync(): IPromise<boolean>;
        logoutAsync(): IPromise<any>;
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
        createUserAsync(userName: string, password: string, email: string, comment: string): IPromise<UserCreateStatus>;
        deleteUserAsync(userName: string, deleteAllRelatedData: boolean): IPromise<boolean>;
        updateUserAsync(userName: string, email: string, comment: string, isApproved: boolean): IPromise<any>;
        unlockUserAsync(userName: string): IPromise<any>;
        getAllUsersAsync(): IPromise<UserInfo[]>;
        getAllUserNamesAsync(): IPromise<string[]>;
        findUserByNameAsync(userName: string): IPromise<UserInfo[]>;
        getUserAsync(userName: string): IPromise<UserInfo>;
        userExistsAsync(userName: string): IPromise<boolean>;
        resetPasswordAsync(userName: string): IPromise<string>;
        changePasswordAsync(userName: string, oldPassword: string, newPassword: string): IPromise<boolean>;
        createRoleAsync(roleName: string): IPromise<any>;
        deleteRoleAsync(roleName: string, throwOnPopulatedRole: boolean): IPromise<boolean>;
        getRolesForUserAsync(username: string): IPromise<string[]>;
        getUsersInRoleAsync(roleName: string): IPromise<string[]>;
        getAllRolesAsync(): IPromise<string[]>;
        isUserInRoleAsync(username: string, roleName: string): IPromise<boolean>;
        addUserToRoleAsync(username: string, roleName: string): IPromise<any>;
        addUsersToRoleAsync(usernames: string[], roleName: string): IPromise<any>;
        addUserToRolesAsync(username: string, roleNames: string[]): IPromise<any>;
        addUsersToRolesAsync(usernames: string[], roleNames: string[]): IPromise<any>;
        removeUserFromRoleAsync(username: string, roleName: string): IPromise<any>;
        removeUserFromRolesAsync(username: string, roleNames: string[]): IPromise<any>;
        removeUsersFromRoleAsync(usernames: string[], roleName: string): IPromise<any>;
        removeUsersFromRolesAsync(usernames: string[], roleNames: string[]): IPromise<any>;
        roleExistsAsync(roleName: string): IPromise<boolean>;
        getAdministratorRoleNameAsync(): IPromise<string>;
        addPermissionsToRolesAsync(permissionNames: string[], roleNames: string[]): IPromise<any>;
        removePermissionsFromRolesAsync(permissionNames: string[], roleNames: string[]): IPromise<any>;
        createPermissionAsync(permissionName: string): IPromise<any>;
        deletePermissionAsync(permissionName: string): IPromise<boolean>;
        getAllPermissionsAsync(): IPromise<string[]>;
        permissionExistsAsync(permissionName: string): IPromise<boolean>;
        isPermissionInRoleAsync(permissionName: string, roleName: string): IPromise<boolean>;
        getPermissionsInRoleAsync(roleName: string): IPromise<string[]>;
        getRolesForPermissionAsync(permissionName: string): IPromise<string[]>;
        hasUserPermissionAsync(userName: string, permissionName: string, grantNonRolesPermission: boolean): IPromise<boolean>;
        checkUserPermissionsAsync(userName: string, permissionNames: string[], grantNonRolesPermission: boolean): IPromise<boolean[]>;
        isNoRolesPermissionAsync(permissionName: string, checkPermissionExistence: boolean): IPromise<boolean>;
    }
}
declare module ApplicationServices {
    class RoleServiceClient extends JsonServiceClientBase {
        constructor(url: string, operationTimeout?: number);
        isCurrentUserInRoleAsync(role: string): IPromise<boolean>;
        getRolesForCurrentUserAsync(): IPromise<string[]>;
    }
}
