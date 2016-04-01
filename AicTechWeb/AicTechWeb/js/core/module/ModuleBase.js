var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Core;
        (function (Core) {
            var Module;
            (function (Module) {
                var ModuleBase = (function () {
                    function ModuleBase() {
                        this.viewModel = kendo.observable({});
                        this.equipId = "";
                        this.equipName = "";
                        this.needEquiptree = true;
                    }
                    Object.defineProperty(ModuleBase.prototype, "serviceContext", {
                        get: function () {
                            return (new Core.Service.DataContextService()).getServiceContext();
                        },
                        enumerable: true,
                        configurable: true
                    });
                    /**
                     * ModuleBase.refreshData()
                     * get startTime and endTime and equipmentId
                     */
                    ModuleBase.prototype.refreshData = function () {
                        this.startTime = AicTech.Web.Html.StartUp.Instance.startTime || Web.Utils.DateUtils.lastDay(new Date());
                        this.endTime = AicTech.Web.Html.StartUp.Instance.endTime || new Date();
                        this.equipId = AicTech.Web.Html.StartUp.Instance.currentEquipmentId;
                        this.equipName = AicTech.Web.Html.StartUp.Instance.currentEquipmentName;
                    };
                    ModuleBase.prototype.init = function (view) {
                        this.view = view;
                    };
                    ModuleBase.prototype.update = function () { };
                    ModuleBase.prototype.dispose = function () {
                        this.startTime = null;
                        this.endTime = null;
                        this.equipId = "";
                        this.equipName = "";
                    };
                    return ModuleBase;
                })();
                Module.ModuleBase = ModuleBase;
            })(Module = Core.Module || (Core.Module = {}));
        })(Core = Web.Core || (Web.Core = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=ModuleBase.js.map