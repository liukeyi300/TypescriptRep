/// <reference path="../lib/jquery/jquery.d.ts" />
var Aic;
(function (Aic) {
    var Html;
    (function (Html) {
        var Controls;
        (function (Controls) {
            var AicControlUtils = (function () {
                function AicControlUtils() {
                }
                AicControlUtils.getSVGElement = function (elementType, svgContainer) {
                    var element = document.createElementNS("http://www.w3.org/2000/svg", elementType);
                    if (typeof svgContainer !== 'undefined') {
                        $(element).appendTo(svgContainer);
                    }
                    return element;
                };
                AicControlUtils.extendObj = function (objA, objB) {
                };
                return AicControlUtils;
            })();
            Controls.AicControlUtils = AicControlUtils;
        })(Controls = Html.Controls || (Html.Controls = {}));
    })(Html = Aic.Html || (Aic.Html = {}));
})(Aic || (Aic = {}));
//# sourceMappingURL=AicControlUtils.js.map