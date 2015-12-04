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
            var pipe = new Pipe($('svg')[0], { x: 0, y: 0 });
            var pipe = new Pipe($('svg')[0], { x: 100, y: 100, status: [{ statuContent: "abc", statuColor: "#FF0000" }, { statuContent:"def", statuColor:"#0000FF" }] });
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