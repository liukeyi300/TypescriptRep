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
                        '.aic-btn-arrow{fill:black;}' +
                        '</style>' +
                        '<defs></defs>' +
                        '<polygon class="aic-btn-arrow" points="65,5 5,95 45,95 45,185 85,185 85,95 125,95"/>' +
                        '</svg>';
                    this.arrowButtonBarbedSVGString = '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                        '<style>' +
                        '.aic-btn-arrow{fill:black;}' +
                        '</style>' +
                        '<defs></defs>' +
                        '<polygon class="aic-btn-arrow" points="65,5 5,95 19.5,104 55,51.6 55,185, 75,185 75,51.6 106.5,104 125,95"/>' +
                        '</svg>';
                    this.arrowButtonTriangleSVGString = '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                        '<style>' +
                        '.aic-btn-arrow{fill:black;}' +
                        '</style>' +
                        '<defs></defs>' +
                        '<polygon class="aic-btn-arrow" points="65,5 5,185 125,185"/>' +
                        '</svg>';
                    var ops = options || {};
                    this.options = {
                        width: ops.width || 130,
                        height: ops.height || 190,
                        borderThickness: ops.borderThickness || { all: 0 },
                        margin: ops.margin || { all: 0 },
                        padding: ops.padding || { all: 0 },
                        background: ops.background,
                        foreground: ops.foreground,
                        opacityMask: ops.opacityMask,
                        direction: ops.direction || Controls.Direction.Up,
                        pressBrush: ops.pressBrush,
                        click: ops.click,
                        type: ops.type || ArrowType.Pointer
                    };
                    this.svgContainer = svgContainer;
                    this.drawBtn(svgContainer, this.options);
                }
                ArrowButton.prototype.drawBtn = function (svgContainer, options) {
                    var svg, style, defs, height = options.height, width = options.width, type = options.type, direction = options.direction;
                    if (height !== 0) {
                        if (height < 0) {
                            height *= -1;
                        }
                        svgContainer.addClass('aic-button');
                        //Up=1, Down=2, Right=3, Left=4
                        if (direction >= Controls.Direction.Right) {
                            var w = width;
                            width = height;
                            height = w;
                            options.width = width;
                            options.height = height;
                        }
                        switch (type) {
                            case ArrowType.Barbed:
                                svg = this.setSize($(this.arrowButtonBarbedSVGString), {
                                    width: options.width,
                                    height: options.height
                                });
                                break;
                            case ArrowType.Triangle:
                                svg = this.setSize($(this.arrowButtonTriangleSVGString), {
                                    width: options.width,
                                    height: options.height
                                });
                                break;
                            default:
                                svg = this.setSize($(this.arrowButtonPointerSVGString), {
                                    width: options.width,
                                    height: options.height
                                });
                                break;
                        }
                        switch (direction) {
                            case Controls.Direction.Left:
                                svgContainer.css({
                                    webkitTransform: "rotate(-90deg)",
                                    oTransform: "rotate(-90deg)",
                                    msTransform: "rotate(-90deg)",
                                    mozTransform: "rotate(-90deg)",
                                    transform: "rotate(-90deg)"
                                });
                                break;
                            case Controls.Direction.Right:
                                svgContainer.css({
                                    webkitTransform: "rotate(90deg)",
                                    oTransform: "rotate(90deg)",
                                    msTransform: "rotate(90deg)",
                                    mozTransform: "rotate(90deg)",
                                    transform: "rotate(90deg)"
                                });
                                break;
                            case Controls.Direction.Down:
                                svgContainer.css({
                                    webkitTransform: "rotate(180deg)",
                                    oTransform: "rotate(180deg)",
                                    msTransform: "rotate(180deg)",
                                    mozTransform: "rotate(180deg)",
                                    transform: "rotate(180deg)"
                                });
                                break;
                            default: break;
                        }
                        svg.css({
                            borderRadius: "5px",
                            marginLeft: "5px",
                            marginTop: "5px",
                            background: "red"
                        });
                        if (typeof options.background !== "undefined") {
                            switch (options.background.type) {
                                case Controls.BrushType.LinearGradient:
                                    svg.css({
                                        background: "linear-gradient(" + options.background.color + ")"
                                    });
                                    break;
                                case Controls.BrushType.RadialGradient:
                                    svg.css({
                                        background: "radial-gradient(" + options.background.color + ")"
                                    });
                                    break;
                                default:
                                    svg.css("background", options.background.color);
                                    break;
                            }
                        }
                        this.currentBackground = svg.css('background');
                        style = svg.find('style');
                        if (typeof options.foreground !== "undefined") {
                            switch (options.foreground.type) {
                                case Controls.BrushType.LinearGradient:
                                    //this.drawLinearGradient
                                    break;
                                case Controls.BrushType.RadialGradient:
                                    break;
                                default:
                                    style.text('.aic-btn-arrow{fill:' + options.foreground.color + ';}');
                                    break;
                            }
                        }
                        svg.appendTo(svgContainer);
                        this.setOptions(options);
                    }
                };
                ArrowButton.prototype.setOptions = function (options) {
                    var _this = this;
                    options.height += 10;
                    options.width += 10;
                    _super.prototype.setOptions.call(this, options);
                    var svg = this.svgContainer.find('svg'), svgContainer = this.svgContainer;
                    svgContainer.css({
                        background: "radial-gradient(white 70%, gray 90%, black 100%)",
                        padding: "5px",
                        borderRadius: "5px",
                        boxShadow: "0px 0px 1px 1px #000"
                    });
                    svgContainer.hover(function (e) {
                        svgContainer.css("box-shadow", "0px 0px 1px 1px #000");
                    }, function (e) {
                        svgContainer.css("box-shadow", "0px 0px 0px");
                    });
                    svgContainer.on('click', function (e) {
                        if (typeof options.click !== "undefined") {
                            options.click(e);
                        }
                        svgContainer.find('svg').css('background', _this.currentBackground);
                    });
                    svgContainer.on('mousedown', function (e) {
                        if (typeof options.pressBrush !== 'undefined') {
                        }
                        else {
                            svgContainer.find('svg').css('background', '#888888');
                        }
                    });
                    svgContainer.on('mouseout', function (e) {
                        svgContainer.find('svg').css('background', _this.currentBackground);
                    });
                };
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