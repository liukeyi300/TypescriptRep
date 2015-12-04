/// <reference path="../lib/jquery/jquery.d.ts" />
var Aic;
(function (Aic) {
    var Html;
    (function (Html) {
        var Controls;
        (function (Controls) {
            /**
             * Pipe Controls
             * Create pipe svg elments and insert them to svg label
             */
            var Pipe = (function () {
                /**
                 * return a instance can control the new elements
                 *
                 * @param svgContainer:SVGElement
                 * @param options: PipeOptions
                 */
                function Pipe(svgContainer, options) {
                    var ops = options || {};
                    var option = {
                        x: ops.x | 0,
                        y: ops.y | 0,
                        width: ops.width | 50,
                        height: ops.height | 20,
                        stroke: typeof ops.stroke === "undefined" ? {
                            strokeColor: "black",
                            strokeWidth: 0.3
                        } : ops.stroke,
                        title: typeof ops.title === "undefined" ? {
                            content: "2WayPipe",
                            position: "top"
                        } : ops.title,
                        status: typeof ops.status === "undefined" ? [{
                                statuContent: "Normal",
                                statuColor: "#4D5C75"
                            }] : ops.status,
                        data: typeof ops.data === "undefined" ? {
                            in: 0,
                            out: 0,
                            status: "Normal"
                        } : ops.data,
                        type: typeof ops.type === "undefined" ? "2WayPipe" : ops.type
                    };
                    var g = Controls.AicControlsUtils.getSVGElement('g', svgContainer);
                    this.svgContainer = g;
                    this.status = option.status;
                    if (option.type === "2WayPipe") {
                        this.draw2WayPipe(option.width, option.height, option.x, option.y, g, "", option.status);
                    }
                }
                /**
                 * draw a 2-way-pipe SVG element started on point(x,y)
                 *
                 * @param width
                 * @param height
                 * @param x
                 * @param y
                 * @param {SVGElement} svgContainer
                 * @param className
                 * @param {Object} [StautsOptions] Available options:
                 *                            -{string} statuContent, statu`s description, "Normal" by default
                 *                            -{string} statuColor,     statu`s color, "#4D5C75" by default
                 */
                Pipe.prototype.draw2WayPipe = function (width, height, x, y, svgContainer, className, status) {
                    if (height !== 0) {
                        if (height < 0) {
                            height *= -1;
                        }
                        var style = Controls.AicControlsUtils.getSVGElement('style', svgContainer);
                        var defs = Controls.AicControlsUtils.getSVGElement('defs', svgContainer);
                        $(style).text('.stroke{stroke-width:0.3;stroke- linecap:round; stroke - linejoin:round;stroke: black;fill: none;}\n.pipe-op{opacity:0.2}\n');
                        for (var i = 0, max = status.length; i < max; i++) {
                            var styleText = $(style).text();
                            $(style).text(styleText + ".pipe-op-" + status[i].statuContent + "{fill:" + status[i].statuColor + "}\n");
                            this.drawLinearGradient(status[i].statuContent, "#F6FAFC", 7, x, y, x, y + height, status[i].statuContent, defs);
                            var rect = this.drawRect(x, y, width, height, svgContainer, "pipe-" + status[i].statuContent, "fill:url(#" + status[i].statuContent + ");");
                            if (i !== 0) {
                                rect.setAttributeNS(null, 'display', 'none');
                            }
                        }
                        var rect1 = this.drawRect(x, y, width, height, svgContainer, "pipe-op pipe-op-" + status[0].statuContent);
                        this.drawLine(x + "", y + "", x + width + "", y + "", svgContainer, "stroke");
                        this.drawLine(x + "", y + height + "", x + width + "", y + height + "", svgContainer, "stroke");
                    }
                };
                Pipe.prototype.drawRect = function (x, y, width, height, svgContainer, className, style) {
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
                Pipe.prototype.drawLine = function (x1, y1, x2, y2, svgContainer, className) {
                    var line = Controls.AicControlsUtils.getSVGElement('line', svgContainer);
                    line.setAttributeNS(null, "x1", x1);
                    line.setAttributeNS(null, "y1", y1);
                    line.setAttributeNS(null, "x2", x2);
                    line.setAttributeNS(null, "y2", y2);
                    line.setAttributeNS(null, "class", className);
                    return line;
                };
                Pipe.prototype.drawLinearGradient = function (startColor, endColor, sectionNumber, x1, y1, x2, y2, id, svgContainer) {
                    var linearGra = Controls.AicControlsUtils.getSVGElement('linearGradient', svgContainer);
                    linearGra.setAttributeNS(null, 'x1', x1 + "");
                    linearGra.setAttributeNS(null, 'y1', y1 + "");
                    linearGra.setAttributeNS(null, 'x2', x2 + "");
                    linearGra.setAttributeNS(null, 'y2', y2 + "");
                    linearGra.setAttributeNS(null, 'id', id);
                    linearGra.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
                    var stop = document.createElementNS(null, 'stop');
                    stop.setAttributeNS(null, "offset", "0");
                    stop.setAttributeNS(null, "style", "stop-color:#4D5C75");
                    linearGra.appendChild(stop);
                    var stop1 = document.createElementNS(null, 'stop');
                    stop1.setAttributeNS(null, "offset", "1");
                    stop1.setAttributeNS(null, "style", "stop-color:#F6FAFC");
                    linearGra.appendChild(stop1);
                };
                return Pipe;
            })();
            Controls.Pipe = Pipe;
        })(Controls = Html.Controls || (Html.Controls = {}));
    })(Html = Aic.Html || (Aic.Html = {}));
})(Aic || (Aic = {}));
//# sourceMappingURL=Pipe.js.map