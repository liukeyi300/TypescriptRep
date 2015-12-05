/// <reference path="../lib/jquery/jquery.d.ts" />

module Aic.Html.Controls {
    export class AicControlsUtils {
        constructor() { }

        static getSVGElement(elementType: string, svgContainer?) {
            var element = document.createElementNS("http://www.w3.org/2000/svg", elementType);
            if (typeof svgContainer !== 'undefined') {
                svgContainer.appendChild(element);
            }
            return element;
        }

        static extendObj(objA, objB) {

        }
    }
}