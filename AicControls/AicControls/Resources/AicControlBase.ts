/// <reference path="../lib/jquery/jquery.d.ts" />

module Aic.Html.Controls {
    export class AICControlBase {
        public width: number;
        public height: number;
        constructor() { }

        public drawRect(x: number, y: number, width: number, height: number, svgContainer, className?: string, style?: string) {
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

        public drawLine(x1: string, y1: string, x2: string, y2: string, svgContainer, className: string) {
            var line = AicControlsUtils.getSVGElement('line', svgContainer);
            line.setAttributeNS(null, "x1", x1);
            line.setAttributeNS(null, "y1", y1);
            line.setAttributeNS(null, "x2", x2);
            line.setAttributeNS(null, "y2", y2);
            line.setAttributeNS(null, "class", className);
            return line;
        }

        public drawLinearGradient(startColor: string, endColor: string, sectionNumber: number, x1: number, y1: number, x2: number, y2: number, id: string, svgContainer) {
            var linearGra = AicControlsUtils.getSVGElement('linearGradient', svgContainer);
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
            var text = AicControlsUtils.getSVGElement('text', svgContainer);
            text.setAttributeNS(null, 'x', x + '');
            text.setAttributeNS(null, 'y', y + '');
            text.setAttributeNS(null, 'width', width + '');
            text.setAttributeNS(null, 'height', height + '');
            text.setAttributeNS(null, 'font-size', fontSize+'');
            text.textContent = textString;
            return text;
        }

        private drawStop(offset: string, style: string, svgContainer) {
            var stop = AicControlsUtils.getSVGElement('stop', svgContainer);
            stop.setAttributeNS(null, 'offset', offset);
            stop.setAttributeNS(null, 'style', style);
            return stop;
        }


    }
}