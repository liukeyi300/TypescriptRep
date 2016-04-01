/// <reference path="../../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var ShiftManagement = (function () {
        function ShiftManagement() {
            this.ppaServiceContext = new AicTech.PPA.DataModel.PPAEntities({
                name: 'oData',
                oDataServiceHost: OEEDemos.AccountHelpUtils.serviceAddress + OEEDemos.AccountHelpUtils.ppaEntitiesDataRoot
            });
            this.needEquiptree = false;
        }
        ShiftManagement.prototype.init = function (view) {
            this.view = view;
            $('#viewport').append(view);
        };
        ShiftManagement.prototype.update = function () {
            $('#viewport').append(this.view);
        };
        ShiftManagement.prototype.destory = function () {
        };
        return ShiftManagement;
    })();
    OEEDemos.ShiftManagement = ShiftManagement;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=ShiftManagement.js.map