/// <reference path="../lib/jquery/jquery.d.ts" />
var Aic;
(function (Aic) {
    var Html;
    (function (Html) {
        var Controls;
        (function (Controls) {
            var Pipe = (function () {
                function Pipe(el, options) {
                    var ops = options || {};
                    var contatiner = (el instanceof HTMLElement) ? $(el) : el;
                }
                return Pipe;
            })();
            Controls.Pipe = Pipe;
        })(Controls = Html.Controls || (Html.Controls = {}));
    })(Html = Aic.Html || (Aic.Html = {}));
})(Aic || (Aic = {}));
//# sourceMappingURL=Pipe.js.map