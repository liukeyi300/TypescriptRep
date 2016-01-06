/// <reference path="reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var ModuleLoad = (function () {
        function ModuleLoad() {
        }
        /**
         * 创建模块和实例，并将其添加到缓存数组中，以免重复加载
         */
        ModuleLoad.createModuleInstance = function (options) {
            var mn = options.moduleName;
            if (typeof mn === "undefined") {
                console.log("there is no this module existed!");
                return;
            }
            ModuleLoad.ensureModuleExists(mn);
            if (ModuleLoad.modules[mn].canCreateInstance()) {
                ModuleLoad.createInstance(options);
            }
            else {
                ModuleLoad.modules[mn].pendingInstantiations.push(options);
                ModuleLoad.loadModuleConstructorClass(options);
            }
        };
        /**
         * 获取模块实例
         */
        ModuleLoad.getModuleInstance = function (moduleName) {
            return ModuleLoad.instances[moduleName];
        };
        /**
          * 清空模块列表
          */
        ModuleLoad.clearAllModules = function () {
            ModuleLoad.instances = [];
            ModuleLoad.modules = [];
            ModuleLoad.loadedScripts = [];
        };
        /**
         * 确保需要加载的模块已经缓存
         */
        ModuleLoad.ensureModuleExists = function (moduleName) {
            if (ModuleLoad.modules[moduleName] === undefined) {
                ModuleLoad.modules[moduleName] = {};
                ModuleLoad.modules[moduleName].moduleName = moduleName;
                ModuleLoad.modules[moduleName].viewTemplate = undefined;
                ModuleLoad.modules[moduleName].instanceConstructor = undefined;
                ModuleLoad.modules[moduleName].pendingInstantiations = [];
                ModuleLoad.modules[moduleName].haveInstanceConstructor = function () {
                    return ModuleLoad.modules[moduleName].instanceConstructor !== undefined;
                };
                ModuleLoad.modules[moduleName].haveViewTemplate = function () {
                    return ModuleLoad.modules[moduleName].viewTemplate !== undefined;
                };
                ModuleLoad.modules[moduleName].canCreateInstance = function () {
                    return ModuleLoad.modules[moduleName].haveViewTemplate() &&
                        ModuleLoad.modules[moduleName].haveInstanceConstructor();
                };
            }
        };
        /**
         * 创建模块的实例
         */
        ModuleLoad.createInstance = function (options) {
            var m = ModuleLoad.modules[options.moduleName];
            var instance = new m.instanceConstructor();
            if (typeof options.onInstantiated === "function") {
                options.onInstantiated(instance, m.viewTemplate);
            }
            ModuleLoad.instances[options.moduleName] = instance;
        };
        /**
         * 缓存每个模块的类，html和css
         */
        ModuleLoad.loadModuleConstructorClass = function (options) {
            var m = ModuleLoad.modules[options.moduleName];
            if (!m.haveInstanceConstructor()) {
                ModuleLoad.loadJavascript(options, function () {
                    m.instanceConstructor = eval('OEEDemos.' + options.moduleName);
                    ModuleLoad.loadModuleViewStyle(options);
                    ModuleLoad.loadModuleViewTemplate(options);
                });
            }
        };
        /**
         * ajax获取模块的html
         */
        ModuleLoad.loadModuleViewTemplate = function (options) {
            var m = ModuleLoad.modules[options.moduleName];
            if (!m.haveViewTemplate()) {
                $.ajax({
                    url: options.baseUrl + options.moduleName + ".html",
                    success: function (data) {
                        m.viewTemplate = data;
                        ModuleLoad.processInstanceCreationQueue(options.moduleName);
                    },
                    complete: function (xhr, ts) {
                        xhr = null;
                    }
                });
            }
        };
        /**
         * 添加模块的css
         */
        ModuleLoad.loadModuleViewStyle = function (options) {
            var loadcss = $("<link rel='stylesheet' type='text/css' href='" + options.baseUrl + options.moduleName + ".css' />");
            $("head").append(loadcss);
        };
        /**
         * 添加模块的js
         */
        ModuleLoad.loadJavascript = function (options, successCallback) {
            if (ModuleLoad.isJavascriptAlreadyLoaded(options.moduleName)) {
                successCallback();
            }
            else {
                var newScript = document.createElement("script");
                newScript.src = options.baseUrl + options.moduleName + ".js";
                var onloaded = function () {
                    ModuleLoad.setJavascriptLoaded(options.moduleName);
                    successCallback();
                };
                newScript.onload = onloaded;
                document.body.appendChild(newScript);
            }
        };
        /**
         * 查看模块的缓存队列，是否还有需要创建的实例
         */
        ModuleLoad.processInstanceCreationQueue = function (moduleName) {
            var m = ModuleLoad.modules[moduleName];
            if (m.canCreateInstance()) {
                while (m.pendingInstantiations.length > 0) {
                    var item = m.pendingInstantiations.shift();
                    ModuleLoad.createInstance(item);
                }
            }
        };
        /**
         * 判断模块的js是否已经加载
         */
        ModuleLoad.isJavascriptAlreadyLoaded = function (scriptUrl) {
            return ModuleLoad.loadedScripts[scriptUrl] !== undefined;
        };
        /**
         * 设置模块的js已经加载成功
         */
        ModuleLoad.setJavascriptLoaded = function (scriptUrl) {
            ModuleLoad.loadedScripts[scriptUrl] = true;
        };
        ModuleLoad.instances = []; //All instances 
        ModuleLoad.modules = []; //All loaded modules 
        ModuleLoad.loadedScripts = []; //All scripts
        ModuleLoad.allModules = []; //All modules
        return ModuleLoad;
    })();
    OEEDemos.ModuleLoad = ModuleLoad;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=moduleLoad.js.map