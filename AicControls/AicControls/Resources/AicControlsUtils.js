/// <reference path="../lib/jquery/jquery.d.ts" />
var Aic;
(function (Aic) {
    var Html;
    (function (Html) {
        var Controls;
        (function (Controls) {
            var AicControlsUtils = (function () {
                function AicControlsUtils() {
                }
                AicControlsUtils.getSVGElement = function (elementType, svgContainer) {
                    var element = document.createElementNS("http://www.w3.org/2000/svg", elementType);
                    if (typeof svgContainer !== 'undefined') {
                        $(element).appendTo(svgContainer);
                    }
                    return element;
                };
                AicControlsUtils.extendObj = function (objA, objB) {
                };
                return AicControlsUtils;
            })();
            Controls.AicControlsUtils = AicControlsUtils;
        })(Controls = Html.Controls || (Html.Controls = {}));
    })(Html = Aic.Html || (Aic.Html = {}));
})(Aic || (Aic = {}));
//# sourceMappingURL=AicControlsUtils.js.map