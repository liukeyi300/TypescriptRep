/// <reference path="../lib/jquery/jquery.d.ts" />
module Aic.Core.Math {
    export class Vertical { }
    export class Point { }
    export class Point3D { }
}
module Aic.Html.Controls {
    export class ArrowButton extends AicControlBase {
        private arrowButtonPointerSVGString =
            '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                '<style>' +
                    'polygon{fill:black;stroke:gray;stroke-width:1px;}'+
                '</style>' +
                '<defs></defs>' +
                '<polygon class="aic-btn-arrow" points="65,5 5,95 45,95 45,185 85,185 85,95 125,95"/>'+
            '</svg>';
        private arrowButtonBarbedSVGString =
            '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                '<style>' +
                    'polygon{fill:black;stroke:gray;stroke-width:1px}' +
                '</style>' +
                '<defs></defs>' +
                '<polygon class="aic-btn-arrow" points="65,5 5,95 19.5,104 55,51.6 55,185, 75,185 75,51.6 106.5,104 125,95"/>' +
            '</svg>';
        private arrowButtonTriangleSVGString = 
            '<svg xmlns= "http://www.w3.org/2000/svg"  xml:space="preserve" x="0" y="0" width="130" height="190">' +
                '<style>' +
                    'polygon{fill:black;stroke:gray;stroke-width:1px}' +
                '</style>' +
                '<defs></defs>' +
                '<polygon class="aic-btn-arrow" points="65,5 5,185 125,185"/>' +
            '</svg>';
        
        constructor(svgContainer: JQuery, options?: IArrowButtonOptions) {
            super();
            
        } 
    }

    interface IArrowButtonOptions extends IBaseOptions {
        direction?: Direction;
        pressBrush?: IBrush;
        click?: Function;
    }

    export enum ArrowType {
        Pointer,
        Barbed,
        Triangle
    }


}