/// <reference path="../lib/jquery/jquery.d.ts" />
var Aic;
(function (Aic) {
    var Html;
    (function (Html) {
        var Controls;
        (function (Controls) {
            var AICControlBase = (function () {
                function AICControlBase() {
                }
                AICControlBase.prototype.drawRect = function (x, y, width, height, svgContainer, className, style) {
                    var rect = Controls.AicControlsUtils.getSVGElement('rect', svgContainer);
                    rect.setAttributeNS(null, "x", x + "");
                    rect.setAttributeNS(null, "y", y + "");
                    rect.setAttributeNS(null, "width", width + "");
                    rect.setAttributeNS(null, "height", height + "");
                    if (className !== null) {
                        rect.setAttributeNS(null, "class", className);
                    }
                    if (typeof style !== "undefined") {
                        rect.setAttributeNS(null, "style", style);
                    }
                    return rect;
                };
                AICControlBase.prototype.drawLine = function (x1, y1, x2, y2, svgContainer, className) {
                    var line = Controls.AicControlsUtils.getSVGElement('line', svgContainer);
                    line.setAttributeNS(null, "x1", x1);
                    line.setAttributeNS(null, "y1", y1);
                    line.setAttributeNS(null, "x2", x2);
                    line.setAttributeNS(null, "y2", y2);
                    line.setAttributeNS(null, "class", className);
                    return line;
                };
                AICControlBase.prototype.drawLinearGradient = function (startColor, endColor, sectionNumber, x1, y1, x2, y2, id, svgContainer) {
                    var linearGra = Controls.AicControlsUtils.getSVGElement('linearGradient', svgContainer);
                    linearGra.setAttributeNS(null, 'x1', x1 + "");
                    linearGra.setAttributeNS(null, 'y1', y1 + "");
                    linearGra.setAttributeNS(null, 'x2', x2 + "");
                    linearGra.setAttributeNS(null, 'y2', y2 + "");
                    linearGra.setAttributeNS(null, 'id', id);
                    linearGra.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
                    this.drawStop("0", "stop-color:" + startColor, linearGra);
                    this.drawStop("0.5", "stop-color:" + endColor, linearGra);
                    this.drawStop("1", "stop-color:" + startColor, linearGra);
                    return linearGra;
                };
                AICControlBase.prototype.drawText = function (x, y, width, height, textString, fontSize, svgContainer) {
                    var text = Controls.AicControlsUtils.getSVGElement('text', svgContainer);
                    text.setAttributeNS(null, 'x', x + '');
                    text.setAttributeNS(null, 'y', y + '');
                    text.setAttributeNS(null, 'width', width + '');
                    text.setAttributeNS(null, 'height', height + '');
                    text.setAttributeNS(null, 'font-size', fontSize + '');
                    text.textContent = textString;
                    return text;
                };
                AICControlBase.prototype.drawStop = function (offset, style, svgContainer) {
                    var stop = Controls.AicControlsUtils.getSVGElement('stop', svgContainer);
                    stop.setAttributeNS(null, 'offset', offset);
                    stop.setAttributeNS(null, 'style', style);
                    return stop;
                };
                return AICControlBase;
            })();
            Controls.AICControlBase = AICControlBase;
        })(Controls = Html.Controls || (Html.Controls = {}));
    })(Html = Aic.Html || (Aic.Html = {}));
})(Aic || (Aic = {}));
//# sourceMappingURL=AicControlBase.js.map