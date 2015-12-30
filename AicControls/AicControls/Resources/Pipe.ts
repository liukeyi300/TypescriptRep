/// <reference path="reference.ts" />

module Aic.Html.Controls {
    /**
     * Pipe Controls
     * Create pipe svg elments and insert that to the svg label
     */
    export class Pipe extends AicControlBase {
        private status = [];
        private currentStatus: string;
        private options: IPipeOptions;
        private twoWayPipeSVGstring =
            '<svg version= "1.1" xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="40" height="20"> '+
                '<style>' +
                    '.stroke{ stroke-width:0.3;stroke-linecap:round;stroke-linejoin:round;stroke: black;fill: none;}\n .default-color {fill: #3664BF;opacity: 0.2; }' +
                '</style>' + 
                '<defs>' + 
                   '<linearGradient id="default" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="20">' +
                        '<stop offset= "0" style= "stop-color:#4D5C75" />' +
                        '<stop offset="0.5" style= "stop-color:#F6FAFC" />' +
                        '<stop offset="1" style= "stop-color:#4D5C75" />' + 
                    '</linearGradient>' +
                '</defs>'  +
                '<rect x="0" y="0" width="40" height="20" class="pipe" fill="url(#default)"/>' +
                '<rect x="0" y="0" width="40" height="20" class="default-color pipe-op"/>' +
                '<line class="stroke" x1="0" y1="0" x2="40" y2="0" />' +
                '<line class="stroke" x1="0" y1="20" x2="40" y2="20">' +
            '</svg>';
        private viewModel = kendo.observable({
            leftText: " ",
            rightText: " ",
            leftValue: "12316.564ml/s",
            rightValue: "45612.59942ml/s",
            title: "asfa"
        });
        /**
         * Create a instance to control new elements
         *
         * @param {JQuery} svgContainer 
         * @param {IPipeOptions} options
         */
        constructor(svgContainer: JQuery, options?: IPipeOptions) {
            super();
            var ops = options || {};
            this.options = {
                width: ops.width || 200,
                height: ops.height || 100,
                stroke: typeof ops.stroke === "undefined" ? {
                    strokeColor: "black",
                    strokeWidth: 0.3
                } : ops.stroke,
                title: ops.title || "",
                status: typeof ops.status === "undefined" ? [{
                    statuContent: "default",
                    statuColor: "#4D5C75"
                }] : ops.status,
                data: ops.data || null,
                type: typeof ops.type === "undefined" ? "2WayPipe" : ops.type,
                leftText: typeof ops.leftText === "undefined" ? "" : ops.leftText,
                rightText: typeof ops.rightText === "undefined" ? "" : ops.rightText
            };
            this.svgContainer = svgContainer;
            if (this.options.type === "2WayPipe") {
                this.draw2WayPipe(svgContainer, this.options);
            }
        }

        /**
         * draw a 2-way-pipe SVG element started on point(x,y) 
         * 
         * @param {JQuery} svgContainer
         * @param {IPipeOptions} options
         */
        private draw2WayPipe(svgContainer: JQuery, options: IPipeOptions) {
            var svg: JQuery,
                defs,
                style,
                titleDiv: JQuery,
                leftValueDiv: JQuery,
                rightValueDiv: JQuery,
                width = options.width,
                height = options.height,
                status = options.status,
                leftText = options.leftText,
                rightText = options.rightText;

            if (height !== 0) {
                if (height < 0) {
                    height *= -1;
                }

                svgContainer.addClass('aic-pipe');
                svgContainer.css({ height: (height + 60) + "px", width: width + "px" });

                titleDiv = $('<div class="pipe-2way-title aic-full-width">');
                leftValueDiv = $('<div class="aic-left pipe-2way-value aic-text-left" >');
                rightValueDiv = $('<div class="aic-right pipe-2way-value aic-text-right">');

                svg = this.setSize($(this.twoWayPipeSVGstring), {
                    width: options.width,
                    height: options.height
                });
                
                // add styles and gradients
                defs = svg.find('defs').empty()[0];
                style = svg.find('style')[0]; 
                $(style).text('.pipe-op{opacity:0.2}\n');
                for (var i = 0, max = status.length; i < max; i++) {
                    var styleText = $(style).text();
                    $(style).text(styleText + ".pipe-op-" + status[i].statuContent + "{fill:" + status[i].statuColor + "}\n");
                    this.drawLinearGradient(status[i].statuColor, "#F6FAFC", 7, 0, 0, 0, 20, status[i].statuContent, defs);
                    this.status[status[i].statuContent] = status[i].statuColor;
                }

                //draw title
                if (typeof options.title !== 'undefined' && options.title !== "") {
                    var center = $('<center></center>');
                    $('<text data-bind="html:title"></text>').appendTo(center);
                    center.appendTo(titleDiv);
                    titleDiv.appendTo(svgContainer);
                } else {
                    svgContainer.height((svgContainer.height() - 30) + "px");
                }

                //add svg element
                svg.appendTo(svgContainer);

                //add value
                if (options.data !== null) {
                    leftValueDiv.appendTo(svgContainer);
                    rightValueDiv.appendTo(svgContainer);
                    $("<text data-bind='html:leftText'></text>").appendTo(leftValueDiv);
                    $("<text data-bind='html:leftValue'></text>").appendTo(leftValueDiv);
                    $("<text data-bind='html:rightText'></text>").appendTo(rightValueDiv);
                    $("<text data-bind='html:rightValue'></text>").appendTo(rightValueDiv);
                } else {
                    svgContainer.height(svgContainer.height()-30);
                }

                //set start statu
                this.setStatus(status[0].statuContent);

                //set data
                this.setData(options.data);
            }

            kendo.bind(svgContainer, this.viewModel);

            if (typeof options.leftText !== "undefined" && options.leftText !== "") {
                this.viewModel.set('leftText', "&nbsp;"+options.leftText);
            }
            if (typeof options.rightText !== "undefined" && options.rightText !== "") {
                this.viewModel.set('rightText', options.rightText);
            }
            if (options.data !== null) {
                if (typeof options.data.in !== "undefined" && typeof options.data.in !== "undefined") {
                    this.viewModel.set('leftValue', options.data.in);
                }
                if (typeof options.data.out !== "undefined" && typeof options.data.in !== "undefined") {
                    this.viewModel.set('rightValue', options.data.out + "&nbsp;");
                }
            }
            if (typeof options.title !== "undefined" && options.title !== "") {
                this.viewModel.set('title', options.title);
            }
        }
        
        /**
         * Change the pipe`s status by changing 'fill' and 'class'
         *
         * @param {string} statu
         */
        public setStatus(statu: string) {
            if (typeof this.status[statu] === 'undefined') {
                alert("该管道无此状态！");
                return;
            }
            if (this.currentStatus === statu) {
                return;
            } else {
                this.svgContainer.find('.pipe').css('fill', 'url(#' + statu + ')');
                this.svgContainer.find('.pipe-op')[0].setAttributeNS(null, 'class', 'pipe-op pipe-op-' + statu);
                this.currentStatus = statu;
            }
        }

        public getStaus(): string {
            return this.currentStatus;
        }

        public setData(data: ITwoWayPipeData) {
            if (data !== null) {
                if (typeof data.in !== "undefined" && typeof data.in !== "undefined") {
                    this.viewModel.set('leftValue', data.in);
                }
                if (typeof data.out !== "undefined" && typeof data.in !== "undefined") {
                    this.viewModel.set('rightValue', data.out + "&nbsp;");
                }
            }
        }

        public setOptions(options: IPipeOptions): void {
            super.setOptions(options);
        }

        public destroy(): void {

        };
    }

    interface IPipeOptions extends IBaseOptions {
        stroke?: boolean | IStrokOptions;
        title?: string;
        status?: IStatusOptions[];
        data?: ITwoWayPipeData;
        leftText?: string;
        rightText?: string;
        type?: string;
    }

    export interface IStrokOptions {
        strokeColor: string;
        strokeWidth: number;
    }

    export interface IStatusOptions {
        statuContent: string;
        statuColor: string;
    }

    export interface ITwoWayPipeData {
        in?: string;
        out?: string;
        status?: string;
    }
}