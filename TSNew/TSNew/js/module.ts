/// <reference path = "reference.ts" />
module Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    var lettersRegexp = /^[A-Za-z]+$/;
    var numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

$(function () {
    var strings = ["Hello", "9005", "110"];
    var validators: { [s: string]: Validation.StringValidator } = {};
    validators['ZIP code'] = new Validation.ZipCodeValidator();
    validators['Letters only'] = new Validation.LettersOnlyValidator();
    strings.forEach(s => {
        for (var name in validators) {
            alert('"' + s + '" ' + (validators[name].isAcceptable(s) ? ' matches ' : 'doesn`t match ') + name);
        }
    });
});