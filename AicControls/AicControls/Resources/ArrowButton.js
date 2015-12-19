var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../lib/jquery/jquery.d.ts" />
var Aic;
(function (Aic) {
    var Core;
    (function (Core) {
        var Math;
        (function (Math) {
            var Vertical = (function () {
                function Vertical() {
                }
                return Vertical;
            })();
            Math.Vertical = Vertical;
            var Point = (function () {
                function Point() {
                }
                return Point;
            })();
            Math.Point = Point;
            var Point3D = (function () {
                function Point3D() {
                }
                return Point3D;
            })();
            Math.Point3D = Point3D;
        })(Math = Core.Math || (Core.Math = {}));
    })(Core = Aic.Core || (Aic.Core = {}));
})(Aic || (Aic = {}));
var Aic;
(function (Aic) {
    var Html;
    (function (Html) {
        var Controls;
        (function (Controls) {
            var ArrowButton = (function (_super) {
                __extends(ArrowButton, _super);
                function ArrowButton(svgContainer, options) {
                    _super.call(this);
                    this.arrowButtonPointerSVGString = '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                        '<style>' +
                        'polygon{fill:black;stroke:gray;stroke-width:1px;}' +
                        '</style>' +
                        '<defs></defs>' +
                        '<polygon class="aic-btn-arrow" points="65,5 5,95 45,95 45,185 85,185 85,95 125,95"/>' +
                        '</svg>';
                    this.arrowButtonBarbedSVGString = '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                        '<style>' +
                        'polygon{fill:black;stroke:gray;stroke-width:1px}' +
                        '</style>' +
                        '<defs></defs>' +
                        '<polygon class="aic-btn-arrow" points="65,5 5,95 19.5,104 55,51.6 55,185, 75,185 75,51.6 106.5,104 125,95"/>' +
                        '</svg>';
                    this.arrowButtonTriangleSVGString = '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                        '<style>' +
                        'polygon{fill:black;stroke:gray;stroke-width:1px}' +
                        '</style>' +
                        '<defs></defs>' +
                        '<polygon class="aic-btn-arrow" points="65,5 5,185 125,185"/>' +
                        '</svg>';
                }
                return ArrowButton;
            })(Controls.AicControlBase);
            Controls.ArrowButton = ArrowButton;
            (function (ArrowType) {
                ArrowType[ArrowType["Pointer"] = 0] = "Pointer";
                ArrowType[ArrowType["Barbed"] = 1] = "Barbed";
                ArrowType[ArrowType["Triangle"] = 2] = "Triangle";
            })(Controls.ArrowType || (Controls.ArrowType = {}));
            var ArrowType = Controls.ArrowType;
        })(Controls = Html.Controls || (Html.Controls = {}));
    })(Html = Aic.Html || (Aic.Html = {}));
})(Aic || (Aic = {}));
//# sourceMappingURL=ArrowButton.js.map