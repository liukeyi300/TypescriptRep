var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Core;
        (function (Core) {
            var Service;
            (function (Service) {
                var DataContextService = (function () {
                    function DataContextService() {
                    }
                    DataContextService.prototype.getServiceContext = function () {
                        return DataContextService.serviceContext;
                    };
                    DataContextService.prototype.setServiceContext = function (context) {
                        DataContextService.serviceContext = context;
                    };
                    return DataContextService;
                })();
                Service.DataContextService = DataContextService;
            })(Service = Core.Service || (Core.Service = {}));
        })(Core = Web.Core || (Web.Core = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=DataContextService.js.map