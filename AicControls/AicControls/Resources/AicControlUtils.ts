/// <reference path="../lib/jquery/jquery.d.ts" />

module Aic.Html.Controls {
    export class AicControlUtils {
        constructor() { }

        static getSVGElement(elementType: string, svgContainer?: JQuery) {
            var element = document.createElementNS("http://www.w3.org/2000/svg", elementType);
            if (typeof svgContainer !== 'undefined') {
                $(element).appendTo(svgContainer);
            }
            return element;
        }

        static extendObj(objA, objB) {

        }
    }
}