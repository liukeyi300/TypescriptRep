/// <reference path="../JQuery/jquery.d.ts" />
var ApplicationServices;
(function (ApplicationServices) {
    

    

    /// <summary>
    /// Helper class for Async related utilities.
    /// </summary>
    var AsyncUtils = (function () {
        function AsyncUtils() {
        }
        /// <summary>
        /// Create a new deferred object.
        /// </summary>
        AsyncUtils.createDeferred = function () {
            return $.Deferred();
        };

        /// <summary>
        /// Create an empty/fullfilled promise object.
        /// </summary>
        AsyncUtils.createPromise = function (result) {
            var d = AsyncUtils.createDeferred();
            d.resolve(result);
            return d.promise();
        };

        /// <summary>
        /// Provides a way to execute callback functions based on one or more objects, usually Deferred objects that represent asynchronous events.
        /// </summary>
        AsyncUtils.when = function () {
            var deferreds = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                deferreds[_i] = arguments[_i + 0];
            }
            return jQuery.when.apply(null, deferreds);
        };
        return AsyncUtils;
    })();
    ApplicationServices.AsyncUtils = AsyncUtils;
})(ApplicationServices || (ApplicationServices = {}));
/// <reference path="Async.ts" />
var ApplicationServices;
(function (ApplicationServices) {
    /// <summary>
    /// JSON WCF/WEB/REST service client base class.
    /// </summary>
    var JsonServiceClientBase = (function () {
        /// <summary>
        /// Default constructor.
        /// </summary>
        function JsonServiceClientBase(url, operationTimeout) {
            if (typeof operationTimeout === "undefined") { operationTimeout = 0; }
            // trim trailing slash of url
            if (url && url.length > 0 && url.charAt(url.length - 1) == '/') {
                url = url.substr(0, url.length - 1);
            }

            this.m_url = url;
            this.m_operationTimeout = operationTimeout;
        }
        Object.defineProperty(JsonServiceClientBase.prototype, "serverUrl", {
            /// <summary>
            /// Gets the server url.
            /// </summary>
            get: function () {
                return this.m_url;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(JsonServiceClientBase.prototype, "operationTimeout", {
            /// <summary>
            /// Gets the default timeout for requests send via the channel.
            /// </summary>
            get: function () {
                return this.m_operationTimeout;
            },
            /// <summary>
            /// Sets the default timeout for requests send via the channel.
            /// </summary>
            set: function (value) {
                this.m_operationTimeout = value;
            },
            enumerable: true,
            configurable: true
        });


        /// <summary>
        /// Send a request over the secure channel asynchronously.
        /// </summary>
        /// <param name="action">Action name.</param>
        /// <param name="request">The request to send.</param>
        /// <returns>The asynchronous task.</returns>
        JsonServiceClientBase.prototype.sendRequestAsync = function (action, request) {
            var _this = this;
            var deferred = ApplicationServices.AsyncUtils.createDeferred();
            var webRequest = this.openXHR(action, true);
            var data = null;
            if (request != null && typeof (request) != "undefined") {
                data = JSON.stringify(request);
            }

            // hook event
            webRequest.onreadystatechange = function (ev) {
                if (webRequest.readyState == XMLHttpRequest.DONE) {
                    try  {
                        // check operation succeeded
                        if (webRequest.status >= 200 && webRequest.status < 300) {
                            if (webRequest.responseText) {
                                var r = JSON.parse(webRequest.responseText);

                                // unwrap Microsoft AJax wrapped message {d: [] }
                                if (r != null && typeof (r) == "object") {
                                    var obj = (r);
                                    if (obj.hasOwnProperty("d")) {
                                        r = obj["d"];
                                    }
                                }

                                // set result
                                deferred.resolve(r);
                            } else {
                                deferred.resolve(null);
                            }
                        } else {
                            var msg = webRequest.statusText || "";
                            msg += " status:" + webRequest.status + ",serverUrl:" + _this.serverUrl;
                            throw new Error(msg);
                        }
                    } catch (e) {
                        // operation failed
                        deferred.reject(e);
                    }
                }
            };

            webRequest.send(data);
            return deferred.promise();
        };

        /// <summary>
        /// Open XMLHttpRequest.
        /// </summary>
        JsonServiceClientBase.prototype.openXHR = function (action, async) {
            var webRequest = new XMLHttpRequest();

            // open web request
            webRequest.open("POST", this.serverUrl + "/" + action, async);

            // enable cookie
            webRequest.withCredentials = true;

            // set request header
            webRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");

            // XMLHttpRequest spec does not allow timeout in synchronous mode
            if (async && this.operationTimeout > 0) {
                webRequest.timeout = this.operationTimeout;
            }

            return webRequest;
        };
        return JsonServiceClientBase;
    })();
    ApplicationServices.JsonServiceClientBase = JsonServiceClientBase;
})(ApplicationServices || (ApplicationServices = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="JsonServiceClientBase.ts" />
var ApplicationServices;
(function (ApplicationServices) {
    /// <summary>
    /// ASP.NET Authentication service client based on JSON.
    /// </summary>
    var AuthenticationServiceClient = (function (_super) {
        __extends(AuthenticationServiceClient, _super);
        /// <summary>
        /// Default constructor.
        /// </summary>
        function AuthenticationServiceClient(url, operationTimeout) {
            if (typeof operationTimeout === "undefined") { operationTimeout = 0; }
            _super.call(this, url, operationTimeout);
        }
        /// <summary>Authenticates user credentials without issuing an authentication ticket.</summary>
        /// <param name="username">The user name to be validated.</param>
        /// <param name="password">The password for the specified user.</param>
        /// <param name="customCredential">The value or values to validate in addition to username and password.</param>
        /// <returns>true if the user credentials are valid; otherwise, false.</returns>
        AuthenticationServiceClient.prototype.validateUserAsync = function (username, password, customCredential) {
            return this.sendRequestAsync("ValidateUser", {
                "username": username,
                "password": password,
                "customCredential": customCredential
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>Checks user credentials and creates an authentication ticket (cookie) if the credentials are valid.</summary>
        /// <param name="username">The user name to be validated.</param>
        /// <param name="password">The password for the specified user.</param>
        /// <param name="customCredential">The value or values to validate in addition to username and password.</param>
        /// <param name="isPersistent">A value that indicates whether the authentication ticket remains valid across sessions.</param>
        /// <returns>true if user credentials are valid; otherwise, false.</returns>
        AuthenticationServiceClient.prototype.loginAsync = function (username, password, customCredential, isPersistent) {
            return this.sendRequestAsync("Login", {
                "username": username,
                "password": password,
                "customCredential": customCredential,
                "isPersistent": isPersistent
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>Determines whether the current user is authenticated.</summary>
        /// <returns>true if the user has been authenticated; otherwise, false.</returns>
        AuthenticationServiceClient.prototype.isLoggedInAsync = function () {
            return this.sendRequestAsync("IsLoggedIn", null).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>Clears the authentication ticket (cookie) in the browser.</summary>
        AuthenticationServiceClient.prototype.logoutAsync = function () {
            return this.sendRequestAsync("Logout", null);
        };
        return AuthenticationServiceClient;
    })(ApplicationServices.JsonServiceClientBase);
    ApplicationServices.AuthenticationServiceClient = AuthenticationServiceClient;
})(ApplicationServices || (ApplicationServices = {}));
/// <reference path="JsonServiceClientBase.ts" />
var ApplicationServices;
(function (ApplicationServices) {
    

    /// <summary>Describes the result of a CreateUser operation.</summary>
    (function (UserCreateStatus) {
        UserCreateStatus[UserCreateStatus["Success"] = 0] = "Success";
        UserCreateStatus[UserCreateStatus["InvalidUserName"] = 1] = "InvalidUserName";
        UserCreateStatus[UserCreateStatus["InvalidPassword"] = 2] = "InvalidPassword";
        UserCreateStatus[UserCreateStatus["InvalidQuestion"] = 3] = "InvalidQuestion";
        UserCreateStatus[UserCreateStatus["InvalidAnswer"] = 4] = "InvalidAnswer";
        UserCreateStatus[UserCreateStatus["InvalidEmail"] = 5] = "InvalidEmail";
        UserCreateStatus[UserCreateStatus["DuplicateUserName"] = 6] = "DuplicateUserName";
        UserCreateStatus[UserCreateStatus["DuplicateEmail"] = 7] = "DuplicateEmail";
        UserCreateStatus[UserCreateStatus["UserRejected"] = 8] = "UserRejected";
        UserCreateStatus[UserCreateStatus["InvalidProviderUserKey"] = 9] = "InvalidProviderUserKey";
        UserCreateStatus[UserCreateStatus["DuplicateProviderUserKey"] = 10] = "DuplicateProviderUserKey";
        UserCreateStatus[UserCreateStatus["ProviderError"] = 11] = "ProviderError";
    })(ApplicationServices.UserCreateStatus || (ApplicationServices.UserCreateStatus = {}));
    var UserCreateStatus = ApplicationServices.UserCreateStatus;

    /// <summary>
    /// Enables access to the aictech credential service.
    /// </summary>
    var CredentialServiceClient = (function (_super) {
        __extends(CredentialServiceClient, _super);
        /// <summary>
        /// Default constructor.
        /// </summary>
        function CredentialServiceClient(url, operationTimeout) {
            if (typeof operationTimeout === "undefined") { operationTimeout = 0; }
            _super.call(this, url, operationTimeout);
        }
        /// <summary>
        /// Create a new user.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="password">Password of user.</param>
        /// <param name="email">Email.</param>
        /// <param name="comment">comment.</param>
        /// <returns>Create status.</returns>
        CredentialServiceClient.prototype.createUserAsync = function (userName, password, email, comment) {
            return this.sendRequestAsync("CreateUser", {
                "userName": userName,
                "password": password,
                "email": email,
                "comment": comment
            }).then(function (value) {
                if (typeof (value) == "number") {
                    return (value);
                } else {
                    return 11 /* ProviderError */;
                }
            });
        };

        /// <summary>
        /// Deletes a user from the database.
        /// </summary>
        /// <param name="userName">The name of the user to delete.</param>
        /// <param name="deleteAllRelatedData">true to delete data related to the user from the database.</param>
        /// <returns>true if the user was deleted; otherwise, false.</returns>
        CredentialServiceClient.prototype.deleteUserAsync = function (userName, deleteAllRelatedData) {
            return this.sendRequestAsync("DeleteUser", {
                "userName": userName,
                "deleteAllRelatedData": deleteAllRelatedData
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>
        /// Update user.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="email">new email.</param>
        /// <param name="comment">Comment.</param>
        /// <param name="isApproved">Whether user is approved.</param>
        CredentialServiceClient.prototype.updateUserAsync = function (userName, email, comment, isApproved) {
            return this.sendRequestAsync("UpdateUser", {
                "userName": userName,
                "email": email,
                "comment": comment,
                "isApproved": isApproved
            });
        };

        /// <summary>
        /// Unlock user.
        /// </summary>
        /// <param name="userName">user name.</param>
        CredentialServiceClient.prototype.unlockUserAsync = function (userName) {
            return this.sendRequestAsync("UnlockUser", {
                "userName": userName
            });
        };

        /// <summary>
        /// Get all users.
        /// </summary>
        /// <returns>All users' information.</returns>
        CredentialServiceClient.prototype.getAllUsersAsync = function () {
            return this.sendRequestAsync("GetAllUsers", null).then(function (value) {
                if (Array.isArray(value))
                    return (value);
                else
                    return null;
            });
        };

        /// <summary>
        /// Get all user names.
        /// </summary>
        /// <returns>All user names.</returns>
        CredentialServiceClient.prototype.getAllUserNamesAsync = function () {
            return this.sendRequestAsync("GetAllUserNames", null).then(function (value) {
                if (Array.isArray(value))
                    return (value);
                else
                    return null;
            });
        };

        /// <summary>
        /// Find user by name.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <returns>User collection.</returns>
        CredentialServiceClient.prototype.findUserByNameAsync = function (userName) {
            return this.sendRequestAsync("FindUserByName", {
                "userName": userName
            }).then(function (value) {
                if (Array.isArray(value))
                    return (value);
                else
                    return null;
            });
        };

        /// <summary>
        /// Get user by user name.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <returns>User information.</returns>
        CredentialServiceClient.prototype.getUserAsync = function (userName) {
            return this.sendRequestAsync("GetUser", {
                "userName": userName
            }).then(function (value) {
                if (value != null && typeof (value) == "object")
                    return (value);
                else
                    return null;
            });
        };

        /// <summary>
        /// Check if user exists.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <returns>Returns true if user exists.</returns>
        CredentialServiceClient.prototype.userExistsAsync = function (userName) {
            return this.sendRequestAsync("UserExists", {
                "userName": userName
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>
        /// Reset user's password.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <returns>new password.</returns>
        CredentialServiceClient.prototype.resetPasswordAsync = function (userName) {
            return this.sendRequestAsync("ResetPassword", {
                "userName": userName
            }).then(function (value) {
                if (typeof (value) == "string") {
                    return (value);
                } else {
                    return null;
                }
            });
        };

        /// <summary>
        /// Change password.
        /// </summary>
        /// <param name="userName">user name.</param>
        /// <param name="oldPassword">Old password.</param>
        /// <param name="newPassword">New password.</param>
        CredentialServiceClient.prototype.changePasswordAsync = function (userName, oldPassword, newPassword) {
            return this.sendRequestAsync("ChangePassword", {
                "userName": userName,
                "oldPassword": oldPassword,
                "newPassword": newPassword
            });
        };

        /// <summary>
        /// Create new role.
        /// </summary>
        /// <param name="roleName">Role name.</param>
        CredentialServiceClient.prototype.createRoleAsync = function (roleName) {
            return this.sendRequestAsync("CreateRole", {
                "roleName": roleName
            });
        };

        /// <summary>
        /// Delete role.
        /// </summary>
        /// <param name="roleName">Role name.</param>
        /// <param name="throwOnPopulatedRole">
        /// If true, throws an exception if roleName has one or more members.
        /// </param>
        /// <returns>true if roleName was deleted from the data source; otherwise; false.</returns>
        CredentialServiceClient.prototype.deleteRoleAsync = function (roleName, throwOnPopulatedRole) {
            return this.sendRequestAsync("DeleteRole", {
                "roleName": roleName,
                "throwOnPopulatedRole": throwOnPopulatedRole
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>
        /// Get roles for user.
        /// </summary>
        /// <param name="username">User name.</param>
        /// <returns>Roles for user.</returns>
        CredentialServiceClient.prototype.getRolesForUserAsync = function (username) {
            return this.sendRequestAsync("GetRolesForUser", {
                "username": username
            }).then(function (value) {
                if (Array.isArray(value)) {
                    return (value);
                } else {
                    return null;
                }
            });
        };

        /// <summary>
        /// Get users in role.
        /// </summary>
        /// <param name="roleName">Role name.</param>
        /// <returns>Users in role.</returns>
        CredentialServiceClient.prototype.getUsersInRoleAsync = function (roleName) {
            return this.sendRequestAsync("GetUsersInRole", {
                "roleName": roleName
            }).then(function (value) {
                if (Array.isArray(value)) {
                    return (value);
                } else {
                    return null;
                }
            });
        };

        /// <summary>
        /// Get all role names.
        /// </summary>
        /// <returns>All roles.</returns>
        CredentialServiceClient.prototype.getAllRolesAsync = function () {
            return this.sendRequestAsync("GetAllRoles", null).then(function (value) {
                if (Array.isArray(value)) {
                    return (value);
                } else {
                    return null;
                }
            });
        };

        /// <summary>
        /// Check if user in role.
        /// </summary>
        /// <param name="username">User name.</param>
        /// <param name="roleName">Role name.</param>
        /// <returns>Returns true if user in role.</returns>
        CredentialServiceClient.prototype.isUserInRoleAsync = function (username, roleName) {
            return this.sendRequestAsync("IsUserInRole", {
                "username": username,
                "roleName": roleName
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>
        /// Add user to role.
        /// </summary>
        /// <param name="username">User name.</param>
        /// <param name="roleName">Role name.</param>
        CredentialServiceClient.prototype.addUserToRoleAsync = function (username, roleName) {
            return this.sendRequestAsync("AddUserToRole", {
                "username": username,
                "roleName": roleName
            });
        };

        /// <summary>
        /// Add users to role.
        /// </summary>
        /// <param name="usernames">User names.</param>
        /// <param name="roleName">Role name.</param>
        CredentialServiceClient.prototype.addUsersToRoleAsync = function (usernames, roleName) {
            return this.sendRequestAsync("AddUsersToRole", {
                "usernames": usernames,
                "roleName": roleName
            });
        };

        /// <summary>
        /// Add user to Roles.
        /// </summary>
        /// <param name="username">User name.</param>
        /// <param name="roleNames">Role names.</param>
        CredentialServiceClient.prototype.addUserToRolesAsync = function (username, roleNames) {
            return this.sendRequestAsync("AddUserToRoles", {
                "username": username,
                "roleNames": roleNames
            });
        };

        /// <summary>
        /// Add users to roles.
        /// </summary>
        /// <param name="usernames">User names.</param>
        /// <param name="roleNames">Role names.</param>
        CredentialServiceClient.prototype.addUsersToRolesAsync = function (usernames, roleNames) {
            return this.sendRequestAsync("AddUsersToRoles", {
                "usernames": usernames,
                "roleNames": roleNames
            });
        };

        /// <summary>
        /// Removes the specified user from the specified role.
        /// </summary>
        /// <param name="username">User name.</param>
        /// <param name="roleName">Role name.</param>
        CredentialServiceClient.prototype.removeUserFromRoleAsync = function (username, roleName) {
            return this.sendRequestAsync("RemoveUserFromRole", {
                "username": username,
                "roleName": roleName
            });
        };

        /// <summary>
        /// Removes the specified user from the specified roles.
        /// </summary>
        /// <param name="username">User name.</param>
        /// <param name="roleNames">Role names.</param>
        CredentialServiceClient.prototype.removeUserFromRolesAsync = function (username, roleNames) {
            return this.sendRequestAsync("RemoveUserFromRoles", {
                "username": username,
                "roleNames": roleNames
            });
        };

        /// <summary>
        /// Removes the specified users from the specified role.
        /// </summary>
        /// <param name="usernames">User name.</param>
        /// <param name="roleName">Role Name.</param>
        CredentialServiceClient.prototype.removeUsersFromRoleAsync = function (usernames, roleName) {
            return this.sendRequestAsync("RemoveUsersFromRole", {
                "usernames": usernames,
                "roleName": roleName
            });
        };

        /// <summary>
        /// Removes the specified user names from the specified roles.
        /// </summary>
        /// <param name="usernames">User names.</param>
        /// <param name="roleNames">Role names.</param>
        CredentialServiceClient.prototype.removeUsersFromRolesAsync = function (usernames, roleNames) {
            return this.sendRequestAsync("RemoveUsersFromRoles", {
                "usernames": usernames,
                "roleNames": roleNames
            });
        };

        /// <summary>
        /// Gets a value indicating whether the specified role name already exists
        /// </summary>
        /// <param name="roleName">Role name.</param>
        /// <returns>
        /// true if the role name already exists in the data source; otherwise, false.
        /// </returns>
        CredentialServiceClient.prototype.roleExistsAsync = function (roleName) {
            return this.sendRequestAsync("RoleExists", {
                "roleName": roleName
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>
        /// Get administrator role name.
        /// </summary>
        /// <returns>Administrator role name.</returns>
        CredentialServiceClient.prototype.getAdministratorRoleNameAsync = function () {
            return this.sendRequestAsync("GetAdministratorRoleName", null).then(function (value) {
                if (typeof (value) == "string") {
                    return (value);
                } else {
                    return null;
                }
            });
        };

        /// <summary>
        /// Add permissions to roles.
        /// </summary>
        /// <param name="permissionNames">Permission names.</param>
        /// <param name="roleNames">Role names.</param>
        CredentialServiceClient.prototype.addPermissionsToRolesAsync = function (permissionNames, roleNames) {
            return this.sendRequestAsync("AddPermissionsToRoles", {
                "permissionNames": permissionNames,
                "roleNames": roleNames
            });
        };

        /// <summary>
        /// Remove permissions from roles.
        /// </summary>
        /// <param name="permissionNames">Permission names.</param>
        /// <param name="roleNames">Role names.</param>
        CredentialServiceClient.prototype.removePermissionsFromRolesAsync = function (permissionNames, roleNames) {
            return this.sendRequestAsync("RemovePermissionsFromRoles", {
                "permissionNames": permissionNames,
                "roleNames": roleNames
            });
        };

        /// <summary>
        /// Create permission.
        /// </summary>
        /// <param name="permissionName">Permission name.</param>
        CredentialServiceClient.prototype.createPermissionAsync = function (permissionName) {
            return this.sendRequestAsync("CreatePermission", {
                "permissionName": permissionName
            });
        };

        /// <summary>
        /// Delete permission.
        /// </summary>
        /// <param name="permissionName">Permission name.</param>
        /// <returns>returns true if delete ok.</returns>
        CredentialServiceClient.prototype.deletePermissionAsync = function (permissionName) {
            return this.sendRequestAsync("DeletePermission", {
                "permissionName": permissionName
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>
        /// Get all permissions.
        /// </summary>
        /// <returns>All permission names.</returns>
        CredentialServiceClient.prototype.getAllPermissionsAsync = function () {
            return this.sendRequestAsync("GetAllPermissions", null).then(function (value) {
                if (Array.isArray(value)) {
                    return (value);
                } else {
                    return null;
                }
            });
        };

        /// <summary>
        /// Check whether the specified permission exists.
        /// </summary>
        /// <param name="permissionName">Permission name.</param>
        /// <returns>return true if permission exists.</returns>
        CredentialServiceClient.prototype.permissionExistsAsync = function (permissionName) {
            return this.sendRequestAsync("PermissionExists", {
                "permissionName": permissionName
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>
        /// Check if the role have the specified permission.
        /// </summary>
        /// <param name="permissionName">Permission name.</param>
        /// <param name="roleName">Role name.</param>
        /// <returns>return true if role has specified permission.</returns>
        CredentialServiceClient.prototype.isPermissionInRoleAsync = function (permissionName, roleName) {
            return this.sendRequestAsync("IsPermissionInRole", {
                "permissionName": permissionName,
                "roleName": roleName
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>
        /// Get all permissions the role has.
        /// </summary>
        /// <param name="roleName">Role name.</param>
        /// <returns>Permission names.</returns>
        CredentialServiceClient.prototype.getPermissionsInRoleAsync = function (roleName) {
            return this.sendRequestAsync("GetPermissionsInRole", {
                "roleName": roleName
            }).then(function (value) {
                if (Array.isArray(value)) {
                    return (value);
                } else {
                    return null;
                }
            });
        };

        /// <summary>
        /// Get roles for permission.
        /// </summary>
        /// <param name="permissionName">Permission name.</param>
        /// <returns>Role names.</returns>
        CredentialServiceClient.prototype.getRolesForPermissionAsync = function (permissionName) {
            return this.sendRequestAsync("GetRolesForPermission", {
                "permissionName": permissionName
            }).then(function (value) {
                if (Array.isArray(value)) {
                    return (value);
                } else {
                    return null;
                }
            });
        };

        /// <summary>
        /// Check if user has the specified permission.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="permissionName">permission name.</param>
        /// <param name="grantNonRolesPermission">
        /// True to grant user permission if no roles assigned to the specified permission.
        /// </param>
        /// <returns>Return true if user has the specified permission.</returns>
        CredentialServiceClient.prototype.hasUserPermissionAsync = function (userName, permissionName, grantNonRolesPermission) {
            return this.sendRequestAsync("HasUserPermission", {
                "userName": userName,
                "permissionName": permissionName,
                "grantNonRolesPermission": grantNonRolesPermission
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>
        /// Batch check user's permissions.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="permissionNames">Permission names.</param>
        /// <param name="grantNonRolesPermission">
        /// True to grant user permission if no roles assigned to the specified permission.
        /// </param>
        /// <returns>User's permission.</returns>
        CredentialServiceClient.prototype.checkUserPermissionsAsync = function (userName, permissionNames, grantNonRolesPermission) {
            return this.sendRequestAsync("CheckUserPermissions", {
                "userName": userName,
                "permissionNames": permissionNames,
                "grantNonRolesPermission": grantNonRolesPermission
            }).then(function (value) {
                if (Array.isArray(value)) {
                    return (value);
                } else {
                    return null;
                }
            });
        };

        /// <summary>
        /// Check whether the permission is no roles.
        /// </summary>
        /// <param name="permissionName">Permission name.</param>
        /// <param name="checkPermissionExistence">Whether to check permission existence.</param>
        /// <returns>return true if permission not assigned any roles.</returns>
        CredentialServiceClient.prototype.isNoRolesPermissionAsync = function (permissionName, checkPermissionExistence) {
            return this.sendRequestAsync("IsNoRolesPermission", {
                "permissionName": permissionName,
                "checkPermissionExistence": checkPermissionExistence
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };
        return CredentialServiceClient;
    })(ApplicationServices.JsonServiceClientBase);
    ApplicationServices.CredentialServiceClient = CredentialServiceClient;
})(ApplicationServices || (ApplicationServices = {}));
/// <reference path="JsonServiceClientBase.ts" />
var ApplicationServices;
(function (ApplicationServices) {
    /// <summary>
    /// Enables access to the ASP.NET role provider as a WCF Web service.
    /// </summary>
    var RoleServiceClient = (function (_super) {
        __extends(RoleServiceClient, _super);
        /// <summary>
        /// Default constructor.
        /// </summary>
        function RoleServiceClient(url, operationTimeout) {
            if (typeof operationTimeout === "undefined") { operationTimeout = 0; }
            _super.call(this, url, operationTimeout);
        }
        /// <summary>Determines whether the logged-in user belongs to the specified role.</summary>
        /// <param name="role">The name of the role to check.</param>
        /// <paramref name="role" /> is null or the user is not logged in.</exception>
        /// <returns>true if the user is in the specified role; otherwise, false.</returns>
        RoleServiceClient.prototype.isCurrentUserInRoleAsync = function (role) {
            return this.sendRequestAsync("IsCurrentUserInRole", {
                "role": role
            }).then(function (value) {
                if (typeof (value) == "boolean") {
                    return (value);
                } else {
                    return false;
                }
            });
        };

        /// <summary>Returns all the roles for the logged-in user.</summary>
        /// <returns>An array of the names of the roles that the user belongs to.</returns>
        RoleServiceClient.prototype.getRolesForCurrentUserAsync = function () {
            return this.sendRequestAsync("GetRolesForCurrentUser", null).then(function (value) {
                if (Array.isArray(value)) {
                    return (value);
                } else {
                    return null;
                }
            });
        };
        return RoleServiceClient;
    })(ApplicationServices.JsonServiceClientBase);
    ApplicationServices.RoleServiceClient = RoleServiceClient;
})(ApplicationServices || (ApplicationServices = {}));
//# sourceMappingURL=ApplicationServices.js.map
