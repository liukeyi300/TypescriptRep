/// <reference path="../lib/jquery/jquery.d.ts" />

module Aic.Html.Controls {
    /**
     * Pipe Controls
     * Create pipe svg elments and insert that to the svg label
     */
    export class Pipe extends AICControlBase {
        private svgContainer;
        private status = [];
        private currentStatus: string;
        private fillRect;
        private opaRect;
        private options: PipeOptions;
        private leftValueText;
        private rightValueText;
        /**
         * return a instance can control the new elements
         *
         * @param {SVGElement} svgContainer 
         * @param {PipeOptions} options
         */
        constructor(svgContainer, options?: PipeOptions) {
            super();
            var ops = options || {};
            this.options = {
                x: ops.x | 0,
                y: ops.y | 0,
                width: ops.width | 50,
                height: ops.height | 20,
                stroke: typeof ops.stroke === "undefined" ? {
                    strokeColor: "black",
                    strokeWidth: 0.3
                } : ops.stroke,
                title: ops.title,
                status: typeof ops.status === "undefined" ? [{
                    statuContent: "Normal",
                    statuColor: "#4D5C75"
                }] : ops.status,
                data: typeof ops.data === "undefined" ? {
                    in: 0,
                    out: 0,
                    status: "Normal"
                } : ops.data,
                type: typeof ops.type === "undefined" ? "2WayPipe" : ops.type,
                leftText: typeof ops.leftText === "undefined" ? "" : ops.leftText,
                rightText: typeof ops.rightText === "undefined" ? "" : ops.rightText,
                text: typeof ops.text === "undefined" ? {
                    position: TextPosition.bottom,
                    fontSize:12
                } : ops.text
            };
            var g = AicControlsUtils.getSVGElement('g', svgContainer);
            this.svgContainer = g;
            if (this.options.type === "2WayPipe") {
                this.draw2WayPipe(this.options, g);
            }
        }

        /**
         * draw a 2-way-pipe SVG element started on point(x,y) 
         * 
         * @param {PipeOptions} options
         * @param {SVGElement} svgContainer
         */
        private draw2WayPipe(options: PipeOptions, svgContainer) {
            var x = options.x,
                  y = options.y,
                  width = options.width,
                  height = options.height,
                  status = options.status,
                  leftText = options.leftText,
                  rightText = options.rightText;

            if (height !== 0) {
                if (height < 0) {
                    height *= -1;
                }
                // add styles and gradients
                var defs = AicControlsUtils.getSVGElement('defs', svgContainer);
                var style = AicControlsUtils.getSVGElement('style', svgContainer);
                $(style).text('.stroke{stroke-width:0.3;stroke- linecap:round; stroke - linejoin:round;stroke: black;fill: none;}\n.pipe-op{opacity:0.2}\n');
                for (var i = 0, max = status.length; i < max; i++) {
                    var styleText = $(style).text();
                    $(style).text(styleText + ".pipe-op-" + status[i].statuContent + "{fill:" + status[i].statuColor + "}\n");
                    this.drawLinearGradient(status[i].statuColor, "#F6FAFC", 7, x, y, x, y + height, status[i].statuContent, defs);
                    this.status[status[i].statuContent] = status[i].statuColor;
                }

                //draw pipe and cache it
                this.fillRect = this.drawRect(x, y, width, height, svgContainer, "pipe-" + status[0].statuContent, "fill:url(#" + status[0].statuContent + ");");
                this.opaRect = this.drawRect(x, y, width, height, svgContainer, "pipe-op pipe-op-" + status[0].statuContent);

                //draw left and right texts
                //because the clientWidth is always 0 in ie, we use scrollWidth to relocate the position.
                if (options.text.position === TextPosition.bottom) {
                    var text = this.drawText(x - 30, y + height + 20, 30, 20, leftText, options.text.fontSize, svgContainer);
                    var showWidth = text.scrollWidth;
                    text.setAttributeNS(null, "width", showWidth + "");
                    text.setAttributeNS(null, 'x', x + 5 - showWidth + "");
                    this.leftValueText = this.drawText(x, y + height + 20, width / 2, 20, "14.5ml/s", options.text.fontSize, svgContainer); 

                    
                    text = this.drawText(x + width - 5, y + height + 20, 45, 20, rightText, options.text.fontSize, svgContainer);
                    showWidth = text.scrollWidth;
                    text.setAttributeNS(null, "width", showWidth + "");
                    this.rightValueText = this.drawText(x + width + showWidth - 3, y + height + 20, width / 2, 20, "", options.text.fontSize, svgContainer);
                } else {
                    this.drawText(x - 30, y - 5, 30, 20, leftText, options.text.fontSize, svgContainer);
                    this.leftValueText = this.drawText(x + 5, y - 5, width / 2, 20, "", options.text.fontSize, svgContainer);

                    this.drawText(x + width - 5, y - 5, 45, 20, rightText, options.text.fontSize, svgContainer);
                    this.rightValueText = this.drawText(x + width + 40, y - 5, width / 2, 20, "", options.text.fontSize, svgContainer);
                }

                //draw title
                if (typeof options.title !== 'undefined' && options.title !== false) {

                }

                //draw stroke line
                this.drawLine(x + "", y + "", x + width + "", y + "", svgContainer, "stroke");
                this.drawLine(x + "", y + height + "", x + width + "", y + height + "", svgContainer, "stroke");

                //cache current statu
                this.currentStatus = status[0].statuContent;
            }
        }
        
        public setStatus(statu: string) {
            if (typeof this.status[statu] === 'undefined') {
                alert("该管道无此状态！");
                return;
            }
            if (this.currentStatus === statu) {
                return;
            } else {
                this.fillRect.setAttributeNS(null, "class", 'pipe-' + statu);
                $(this.fillRect).css('fill', 'url(#' + statu + ')');
                this.opaRect.setAttributeNS(null, 'class', 'pipe-op pipe-op-' + statu);
                this.currentStatus = statu;
            }
        }

        public getStaus(): string {
            return this.currentStatus;
        }

        public setData() {
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
        leftText?: string;
        rightText?: string;
        text?: TextOptions;
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

    interface TextOptions {
        position: TextPosition;
        fontSize: number;
    }

    enum TextPosition {
        "top"=0,"bottom",
    }
}