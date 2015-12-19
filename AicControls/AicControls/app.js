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
                    var pipe = new Controls.Pipe($('#test01'), {
                        width: 500,
                        height: 30,
                        leftText: "in: ",
                        rightText: "out: ",
                        status: [{
                                statuContent: "xcv",
                                statuColor: "#FF0000"
                            }, {
                                statuContent: "wqer",
                                statuColor: "#616F85"
                            }],
                        data: {
                            in: "23654.15ml/s",
                            out: "6234.18ml/s",
                            status: "wqer"
                        },
                        title: "Pipe 1"
                    });
                    var pipe2 = new Controls.Pipe($('#test02'), {
                        width: 200,
                        height: 30,
                        leftText: "输入: ",
                        rightText: "输出: ",
                        status: [{
                                statuContent: "def",
                                statuColor: "#ff32f5"
                            }, {
                                statuContent: "abc",
                                statuColor: "#561292"
                            }]
                    });
                    $('#test').on('click', function (e) {
                        if (pipe2.getStaus() === "def") {
                            pipe2.setStatus("abc");
                        }
                        else {
                            pipe2.setStatus('def');
                        }
                    });
                    var arrowButton = new Controls.ArrowButton($('#test03'));
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