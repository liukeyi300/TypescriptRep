/// <reference path="../lib/jquery/jquery.d.ts" />

module Aic.Html.Controls {
    /**
     * Pipe Controls
     * Create pipe svg elments and insert them to svg label
     */
    export class Pipe {
        private svgContainer;
        private status: StatusOptions[];
        /**
         * return a instance can control the new elements
         *
         * @param svgContainer:SVGElement 
         * @param options: PipeOptions
         */
        constructor(svgContainer, options?: PipeOptions) {
            var ops = options || {};
            var option: PipeOptions = {
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
            var g = AicControlsUtils.getSVGElement('g', svgContainer);
            this.svgContainer = g;
            this.status = option.status;
            if (option.type === "2WayPipe") {
                this.draw2WayPipe(option.width, option.height, option.x, option.y, g, "",  option.status);
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
        private draw2WayPipe(width: number, height: number, x: number, y: number, svgContainer, className, status: StatusOptions[]) {
            if (height !== 0) {
                if (height < 0) {
                    height *= -1;
                }
                var style = AicControlsUtils.getSVGElement('style', svgContainer);
                var defs = AicControlsUtils.getSVGElement('defs', svgContainer);
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
        }

        private drawRect(x: number, y: number, width: number, height: number, svgContainer, className?: string, style?: string) {
            var rect = AicControlsUtils.getSVGElement('rect', svgContainer);
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
        }

        private drawLine(x1: string, y1: string, x2: string, y2: string, svgContainer, className: string) {
            var line = AicControlsUtils.getSVGElement('line', svgContainer);
            line.setAttributeNS(null, "x1", x1);
            line.setAttributeNS(null, "y1",y1);
            line.setAttributeNS(null, "x2", x2);
            line.setAttributeNS(null, "y2", y2);
            line.setAttributeNS(null, "class", className);
            return line;
        }  

        private drawLinearGradient(startColor: string, endColor: string, sectionNumber: number, x1: number, y1: number, x2: number, y2: number, id: string, svgContainer) {
            var linearGra = AicControlsUtils.getSVGElement('linearGradient', svgContainer);
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
        }

        private drawStop(offset: string, style: string, svgContainer) {
            var stop = AicControlsUtils.getSVGElement('stop', svgContainer);
            stop.setAttributeNS(null, 'offset', offset);
            stop.setAttributeNS(null, 'style', style);
        }
    }

    interface PipeOptions {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        stroke?: boolean | StrokOptions;
        title?: boolean | TitleOptions;
        status?: StatusOptions[];
        data?: TwoWayPipeData;
        type?: string;
    }

    interface StrokOptions {
        strokeColor: string;
        strokeWidth: number;
    } 

    interface TitleOptions {
        content: string;
        position: string;
    }

    interface StatusOptions {
        statuContent: string;
        statuColor: string;
    }

    interface TwoWayPipeData {
        in?: number;
        out?: number;
        status?: string;
    }
}