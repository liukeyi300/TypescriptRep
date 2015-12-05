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
                    //$('button').on('click', () => {
                    //    if (i % 2 === 1) {
                    //        $('#a>.pipe-normal').attr('fill', 'url(#alert)');
                    //        $('#a>.pipe-op-normal').attr('display', 'none');
                    //        $('#a>.pipe-op-alert').attr('display', 'block');
                    //    } else {
                    //        $('#a>.pipe-normal').attr('fill', 'url(#metal)');
                    //        $('#a>.pipe-op-normal').attr('display', 'block');
                    //        $('#a>.pipe-op-alert').attr('display', 'none');
                    //    }
                    //    i++;
                    //});
                    var pipe = new Controls.Pipe($('svg')[0], { x: 100, y: 100, leftText: "输入流量：", rightText: "", status: [{ statuContent: "xcv", statuColor: "#FF0000" }, { statuContent: "wqer", statuColor: "#616F85" }] });
                    var pipe2 = new Controls.Pipe($('svg')[0], { x: 200, y: 200, width: 100, height: 20, status: [{ statuContent: "def", statuColor: "#ff32f5" }, { statuContent: "abc", statuColor: "#561292" }] });
                    $('#test').on('click', function (e) {
                        if (pipe2.getStaus() === "def") {
                            pipe2.setStatus("abc");
                        }
                        else {
                            pipe2.setStatus('def');
                        }
                    });
                    $('#test2').on('click', function (e) {
                        if (pipe.getStaus() === "xcv") {
                            pipe.setStatus("wqer");
                        }
                        else {
                            pipe.setStatus('xcv');
                        }
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