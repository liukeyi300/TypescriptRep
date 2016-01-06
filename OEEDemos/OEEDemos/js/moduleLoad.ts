/// <reference path="reference.ts" />
module OEEDemos {
    export class ModuleLoad {
        private static instances:ModuleBase[] = [];                     //All instances 
        private static modules = [];                                            //All loaded modules 
        private static loadedScripts = [];                                    //All scripts
        public static allModules = [];                                        //All modules
        constructor() { }

         /**
          * 创建模块和实例，并将其添加到缓存数组中，以免重复加载
          */
        static createModuleInstance(options: ModuleLoadOptions): void {
            var mn = options.moduleName;
            if (typeof mn === "undefined") {
                console.log("there is no this module existed!");
                return;
            }
            ModuleLoad.ensureModuleExists(mn);

            if (ModuleLoad.modules[mn].canCreateInstance()) {
                ModuleLoad.createInstance(options);
            } else {
                ModuleLoad.modules[mn].pendingInstantiations.push(options);
                ModuleLoad.loadModuleConstructorClass(options);
            }
        }

        /**
         * 获取模块实例
         */
        static getModuleInstance(moduleName: string) {
            return ModuleLoad.instances[moduleName];
        }

        /**
          * 清空模块列表
          */
        static clearAllModules(): void {
            ModuleLoad.instances = [];
            ModuleLoad.modules = [];
            ModuleLoad.loadedScripts = [];
        }
        
        /**
         * 确保需要加载的模块已经缓存
         */
        private static ensureModuleExists(moduleName: string): void {
            if (ModuleLoad.modules[moduleName] === undefined) {
                ModuleLoad.modules[moduleName] = {};
                ModuleLoad.modules[moduleName].moduleName = moduleName;
                ModuleLoad.modules[moduleName].viewTemplate = undefined;
                ModuleLoad.modules[moduleName].instanceConstructor = undefined;
                ModuleLoad.modules[moduleName].pendingInstantiations = [];

                ModuleLoad.modules[moduleName].haveInstanceConstructor = (): boolean => {
                    return ModuleLoad.modules[moduleName].instanceConstructor !== undefined;
                }

                ModuleLoad.modules[moduleName].haveViewTemplate = (): boolean => {
                    return ModuleLoad.modules[moduleName].viewTemplate !== undefined;
                }

                ModuleLoad.modules[moduleName].canCreateInstance = (): boolean=> {
                    return ModuleLoad.modules[moduleName].haveViewTemplate() &&
                        ModuleLoad.modules[moduleName].haveInstanceConstructor();
                }
            }
        }

        /**
         * 创建模块的实例
         */
        private static createInstance(options: ModuleLoadOptions): void {
            var m = ModuleLoad.modules[options.moduleName];
            var instance = new m.instanceConstructor();

            if (typeof options.onInstantiated === "function") {
                options.onInstantiated(instance, m.viewTemplate);
            }

            ModuleLoad.instances[options.moduleName] = instance;
        }

        /**
         * 缓存每个模块的类，html和css
         */
        private static loadModuleConstructorClass(options: ModuleLoadOptions): void {
            var m = ModuleLoad.modules[options.moduleName];
            if (!m.haveInstanceConstructor()) {
                ModuleLoad.loadJavascript(options, function () {
                    m.instanceConstructor = eval('OEEDemos.' + options.moduleName);
                    ModuleLoad.loadModuleViewStyle(options);
                    ModuleLoad.loadModuleViewTemplate(options);
                });
            }
        }

        /** 
         * ajax获取模块的html
         */
        private static loadModuleViewTemplate(options: ModuleLoadOptions): void {
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
        }

        /** 
         * 添加模块的css
         */
        private static loadModuleViewStyle(options: ModuleLoadOptions): void {
            var loadcss = $("<link rel='stylesheet' type='text/css' href='" + options.baseUrl + options.moduleName + ".css' />");
            $("head").append(loadcss);
        }

        /**
         * 添加模块的js
         */
        private static loadJavascript(options: ModuleLoadOptions, successCallback: () => void): void {
            if (ModuleLoad.isJavascriptAlreadyLoaded(options.moduleName)) {
                successCallback();
            } else {
                var newScript = document.createElement("script");
                newScript.src = options.baseUrl + options.moduleName + ".js";
                
                var onloaded = function () {
                    ModuleLoad.setJavascriptLoaded(options.moduleName);
                    successCallback();
                }
                newScript.onload = onloaded;
                document.body.appendChild(newScript);
            }
        }

        /** 
         * 查看模块的缓存队列，是否还有需要创建的实例
         */
        private static processInstanceCreationQueue(moduleName: string): void {
            var m = ModuleLoad.modules[moduleName];
            if (m.canCreateInstance()) {
                while (m.pendingInstantiations.length > 0) {
                    var item = m.pendingInstantiations.shift();
                    ModuleLoad.createInstance(item);
                }
            }
        }

        /**
         * 判断模块的js是否已经加载
         */
        private static isJavascriptAlreadyLoaded(scriptUrl: string): boolean {
            return ModuleLoad.loadedScripts[scriptUrl] !== undefined;
        }

        /**
         * 设置模块的js已经加载成功
         */
        private static setJavascriptLoaded(scriptUrl: string): void {
            ModuleLoad.loadedScripts[scriptUrl] = true;
        }
    }

    /**
     * 模块加载器传入参数列表
     * baseUrl:string 上下文路径
     * moduleName:string  模块名称
     * onInstantiated:(instance:any, viewTemplate:HTMLElement) =>void 加载完成后的回调函数
     */
    export interface ModuleLoadOptions {
        moduleName: string;
        baseUrl: string;
        onInstantiated: (instance: ModuleBase, viewTemplate: HTMLElement) => void;
    }
}