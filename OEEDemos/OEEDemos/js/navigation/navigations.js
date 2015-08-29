/// <reference path="../reference.ts" />
var OEEDemos;
(function (OEEDemos) {
    var Navigations = (function () {
        function Navigations(treeDiv, data) {
            if (data === void 0) { data = null; }
            this.view = treeDiv;
            if (data != null) {
                this.dataSource = data;
            }
        }
        Navigations.prototype.initTree = function () {
            if (this.dataSource != null) {
                this.view.kendoTreeView({
                    dataSource: this.dataSource
                });
            }
            else {
                alert("NULL");
            }
        };
        return Navigations;
    })();
    OEEDemos.Navigations = Navigations;
})(OEEDemos || (OEEDemos = {}));
//# sourceMappingURL=navigations.js.map