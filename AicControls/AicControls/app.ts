/// <reference path="lib/jquery/jquery.d.ts" /> 
var i = 1;
module Aic.Html.Controls {
    export class Greeter {
        element: HTMLElement;
        span: HTMLElement;
        timerToken: number;
   

        constructor(element: HTMLElement) {
          //  this.element = element;
         //   this.element.innerHTML += "The time is: ";
         //   this.span = document.createElement('span');
           // this.element.appendChild(this.span);
          //  this.span.innerText = new Date().toUTCString();
        }

        start() {
            // this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
           // var pipe = new Pipe($('#test01'), {
           //     width: 500,
           //     height:30,
           //     leftText: "in: ",
           //     rightText: "out: ",
           //     status: [{
           //         statuContent: "xcv",
           //         statuColor: "#FF0000"
           //     }, {
           //             statuContent: "wqer",
           //             statuColor: "#616F85"
           //         }],
           //     data: {
           //         in: "23654.15ml/s",
           //         out: "6234.18ml/s",
           //         status:"wqer"
           //     },
           //     title: "Pipe 1"
           // });
           //var pipe2 = new Pipe($('#test02'), {
           //     width: 200,
           //     height: 30,
           //     leftText: "输入: ",
           //     rightText: "输出: ",
           //     status: [{
           //         statuContent: "def",
           //         statuColor: "#ff32f5"
           //     }, {
           //         statuContent: "abc",
           //         statuColor: "#561292"
           //         }]
           // });
           // $('#test').on('click', function (e) {
           //     if (pipe2.getStaus() === "def") {
           //         pipe2.setStatus("abc");
           //     } else {
           //         pipe2.setStatus('def');
           //     }
           //});

            var arrowButton = new ArrowButton($('#test03'), {
                width: 300,
                height: 100,
                direction: Direction.Up,
                foreground: {
                    type: BrushType.Normal,
                    color:"#FFFFFF"
                },
                click: (e: JQueryEventObject) => {
                    
                }
            });

            //$('#test2').on('click', function (e) {
            //    if (pipe.getStaus() === "xcv") {
            //        pipe.setStatus("wqer");
            //    } else {
            //        pipe.setStatus('xcv');
            //    }
            //});
        }

        stop() {
            clearTimeout(this.timerToken);
        }

    }
}


window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Aic.Html.Controls.Greeter(el);
    greeter.start();
};