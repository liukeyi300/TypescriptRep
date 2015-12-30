﻿/// <reference path="../lib/jquery/jquery.d.ts" />
module Aic.Core.Math {
    export class Vertical { }
    export class Point { }
    export class Point3D { }
}
module Aic.Html.Controls {
    export class ArrowButton extends AicControlBase {
        private options: IArrowButtonOptions;
        private currentBackground: string;
        private arrowButtonPointerSVGString =
            '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                '<style>' +
                    '.aic-btn-arrow{fill:black;}'+
                '</style>' +
                '<defs></defs>' +
                '<polygon class="aic-btn-arrow" points="65,5 5,95 45,95 45,185 85,185 85,95 125,95"/>'+
            '</svg>';
        private arrowButtonBarbedSVGString =
            '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                '<style>' +
                    '.aic-btn-arrow{fill:black;}' +
                '</style>' +
                '<defs></defs>' +
                '<polygon class="aic-btn-arrow" points="65,5 5,95 19.5,104 55,51.6 55,185, 75,185 75,51.6 106.5,104 125,95"/>' +
            '</svg>';
        private arrowButtonTriangleSVGString = 
            '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                '<style>' +
                    '.aic-btn-arrow{fill:black;}' +
                '</style>' +
                '<defs></defs>' +
                '<polygon class="aic-btn-arrow" points="65,5 5,185 125,185"/>' +
            '</svg>';

        constructor(svgContainer: JQuery, options?: IArrowButtonOptions) {
            super();
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
                direction: ops.direction || Direction.Up,
                pressBrush: ops.pressBrush,
                click: ops.click,
                type: ops.type || ArrowType.Pointer
            };
            this.svgContainer = svgContainer;
            this.drawBtn(svgContainer, this.options);
        } 

        private drawBtn(svgContainer: JQuery, options: IArrowButtonOptions): void {
            var svg: JQuery,
                style: JQuery,
                defs: JQuery,
                height = options.height,
                width = options.width,
                type = options.type,
                direction = options.direction;
            if (height !== 0) {
                if (height < 0) {
                    height *= -1;
                }
                svgContainer.addClass('aic-button');
                //Up=1, Down=2, Right=3, Left=4
                if (direction >= Direction.Right) {
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
                    case Direction.Left:
                        svgContainer.css({
                            webkitTransform: "rotate(-90deg)",
                            oTransform: "rotate(-90deg)",
                            msTransform: "rotate(-90deg)",
                            mozTransform: "rotate(-90deg)",
                            transform:"rotate(-90deg)"
                        })
                        break;
                    case Direction.Right:
                        svgContainer.css({
                            webkitTransform: "rotate(90deg)",
                            oTransform: "rotate(90deg)",
                            msTransform: "rotate(90deg)",
                            mozTransform: "rotate(90deg)",
                            transform: "rotate(90deg)"
                        })
                        break;
                    case Direction.Down:
                        svgContainer.css({
                            webkitTransform: "rotate(180deg)",
                            oTransform: "rotate(180deg)",
                            msTransform: "rotate(180deg)",
                            mozTransform: "rotate(180deg)",
                            transform: "rotate(180deg)"
                        })
                        break;
                    default: break;
                }
                svg.css({
                    borderRadius: "5px",
                    marginLeft: "5px",
                    marginTop: "5px",
                    background:"red"
                });
               
                if (typeof options.background !== "undefined") {
                    switch (options.background.type) {
                        case BrushType.LinearGradient:
                            svg.css({
                                background: "linear-gradient(" + options.background.color + ")"
                            });
                            break;
                        case BrushType.RadialGradient:
                            svg.css({
                                background: "radial-gradient(" + options.background.color+")"
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
                        case BrushType.LinearGradient:
                            //this.drawLinearGradient
                            break;
                        case BrushType.RadialGradient:

                            break;
                        default:
                            style.text('.aic-btn-arrow{fill:' + options.foreground.color + ';}');
                            break;
                    }
                }
                
                svg.appendTo(svgContainer);
                this.setOptions(options);
            }
        }

        public setOptions(options: IArrowButtonOptions): void {
            options.height += 10;
            options.width += 10;
            super.setOptions(options);
            var svg = this.svgContainer.find('svg'), svgContainer = this.svgContainer;
            
            svgContainer.css({
                background: "radial-gradient(white 70%, gray 90%, black 100%)",
                padding: "5px",
                borderRadius: "5px",
                boxShadow: "0px 0px 1px 1px #000"
            });

            svgContainer.hover((e: JQueryEventObject) => {
                svgContainer.css("box-shadow", "0px 0px 1px 1px #000");
            }, (e: JQueryEventObject) => {
                svgContainer.css("box-shadow", "0px 0px 0px");
            });

            svgContainer.on('click',  (e)=> {
                if (typeof options.click !== "undefined") {
                    options.click(e);
                }
                svgContainer.find('svg').css('background', this.currentBackground);
            });

            svgContainer.on('mousedown', function (e) {
                if (typeof options.pressBrush !== 'undefined') {

                } else {
                    svgContainer.find('svg').css('background', '#888888');
                }
            });
            svgContainer.on('mouseout', (e) => {
                svgContainer.find('svg').css('background', this.currentBackground);
            });
        }
    }

    interface IArrowButtonOptions extends IBaseOptions {
        direction?: Direction;
        pressBrush?: IBrush;
        click?: (e: JQueryEventObject) => void;
        type?: ArrowType;
    }

    export enum ArrowType {
        Pointer,
        Barbed,
        Triangle
    }


}