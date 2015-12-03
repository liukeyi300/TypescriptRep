/// <reference path="lib/jquery/jquery.d.ts" /> 
var i = 1;
var Aic;
(function (Aic) {
    var Html;
    (function (Html) {
        var Controls;
        (function (Controls) {
            var Greeter = (function () {
                function Greeter(element) {
                    //  this.element = element;
                    //   this.element.innerHTML += "The time is: ";
                    //   this.span = document.createElement('span');
                    // this.element.appendChild(this.span);
                    //  this.span.innerText = new Date().toUTCString();
                }
                Greeter.prototype.start = function () {
                    // this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
                    $('button').on('click', function () {
                        if (i % 2 === 1) {
                            $('#a>.pipe-normal').attr('fill', 'url(#alert)');
                            $('#a>.pipe-op-normal').attr('display', 'none');
                            $('#a>.pipe-op-alert').attr('display', 'block');
                        }
                        else {
                            $('#a>.pipe-normal').attr('fill', 'url(#metal)');
                            $('#a>.pipe-op-normal').attr('display', 'block');
                            $('#a>.pipe-op-alert').attr('display', 'none');
                        }
                        i++;
                    });
                };
                Greeter.prototype.stop = function () {
                    clearTimeout(this.timerToken);
                };
                return Greeter;
            })();
            Controls.Greeter = Greeter;
        })(Controls = Html.Controls || (Html.Controls = {}));
    })(Html = Aic.Html || (Aic.Html = {}));
})(Aic || (Aic = {}));
window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Aic.Html.Controls.Greeter(el);
    greeter.start();
};
//# sourceMappingURL=app.js.map