/// <reference path="reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var ModuleBaseClass = (function () {
        function ModuleBaseClass(viewModel) {
            this.viewModel = viewModel;
            kendo.bind(this.view, this.viewModel);
        }
        ModuleBaseClass.prototype.init = function (view) { };
        ModuleBaseClass.prototype.destory = function () { };
        ModuleBaseClass.prototype.update = function () { };
        return ModuleBaseClass;
    })();
    OEEDemos.ModuleBaseClass = ModuleBaseClass;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=moduleBase.js.map