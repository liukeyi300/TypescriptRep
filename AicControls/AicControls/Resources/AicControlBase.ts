/// <reference path="../lib/jquery/jquery.d.ts" />

module Aic.Html.Controls {
    export class AicControlBase {
        public svgContainer: JQuery;
        constructor() { }
        
        public drawRect(x: number, y: number, width: number, height: number, svgContainer, className?: string, style?: string) {
            var rect = AicControlUtils.getSVGElement('rect', svgContainer);
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

        public drawLine(x1: number, y1: number, x2: number, y2: number, svgContainer, className: string) {
            var line = AicControlUtils.getSVGElement('line', svgContainer);
            line.setAttributeNS(null, "x1", x1 + "");
            line.setAttributeNS(null, "y1", y1 + "");
            line.setAttributeNS(null, "x2", x2 + "");
            line.setAttributeNS(null, "y2", y2 + "");
            line.setAttributeNS(null, "class", className);
            return line;
        }

        public drawLinearGradient(startColor: string, endColor: string, sectionNumber: number, x1: number, y1: number, x2: number, y2: number, id: string, svgContainer) {
            var linearGra = AicControlUtils.getSVGElement('linearGradient', svgContainer);
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
        }

        public drawText(x: number, y: number, width: number, height: number, textString: string, fontSize: number, svgContainer) {
            var text = AicControlUtils.getSVGElement('text', svgContainer);
            text.setAttributeNS(null, 'x', x + '');
            text.setAttributeNS(null, 'y', y + '');
            text.setAttributeNS(null, 'width', width + '');
            text.setAttributeNS(null, 'height', height + '');
            text.setAttributeNS(null, 'font-size', fontSize+'');
            text.textContent = textString;
            return text;
        }

        /**
         * transform a element from original size to new size
         * use matrix(a,b,c,e,d,f) 
         * (x,y) => (ax+cy+e, bx+dy+f)
         *
         * @param {JQuery} el
         * @param {Size} size
         * @return {JQuery} el
         */
        public setSize(el: JQuery, size: Size): JQuery {
            var oW = el.width(),
                oH = el.height(),
                nW = size.width,
                nH = size.height;

            el.css("transform", "matrix(" + nW / oW + ",0,0," + nH / oH + "," + (nW - oW) / 2 + "," + (nH - oH) / 2 + ")");

            /* IE 9 */
            el.css("-ms-transform", "matrix(" + nW / oW + ",0,0," + nH / oH + "," + (nW - oW) / 2 + "," + (nH - oH) / 2 + ")");

            /* Safari and Chrome */
            el.css("-webkit-transform", "matrix(" + nW / oW + ",0,0," + nH / oH + "," + (nW - oW) / 2 + "," + (nH - oH) / 2 + ")");

            /* Opera */
            el.css("-o-transform", "matrix(" + nW / oW + ",0,0," + nH / oH + "," + (nW - oW) / 2 + "," + (nH - oH) / 2 + ")"); 

            /* Firefox */
            el.css("-moz-transform", "matrix(" + nW / oW + ",0,0," + nH / oH + "," + (nW - oW) / 2 + "," + (nH - oH) / 2 + ")");

            return el;
        }

        public setOptions(options: BaseOptions): void {

        }

        private drawStop(offset: string, style: string, svgContainer) {
            var stop = AicControlUtils.getSVGElement('stop', svgContainer);
            stop.setAttributeNS(null, 'offset', offset);
            stop.setAttributeNS(null, 'style', style);
            return stop;
        }
    }

    export interface BaseOptions {
        width?: number;
        height?: number;
    }

    export interface Size {
        width: number;
        height: number;
    }

    export interface Point {
        x: number;
        y: number;
    }

    export interface Point3D {
        x: number;
        y: number;
        z: number;
    }
}