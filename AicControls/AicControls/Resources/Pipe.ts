/// <reference path="../lib/jquery/jquery.d.ts" />

module Aic.Html.Controls {
    export class Pipe {
        constructor(el: HTMLElement | JQuery, options?: PipeOptions) {
            var ops = options || {};
            var contatiner = (el instanceof HTMLElement) ? $(el) : el;
        }
    }

    export interface PipeOptions {

    }
}