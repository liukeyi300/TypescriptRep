/// <reference path = "reference.ts" />
var Validation;
(function (Validation) {
    var lettersRegexp = /^[A-Za-z]+$/;
    var numberRegexp = /^[0-9]+$/;
    var LettersOnlyValidator = (function () {
        function LettersOnlyValidator() {
        }
        LettersOnlyValidator.prototype.isAcceptable = function (s) {
            return lettersRegexp.test(s);
        };
        return LettersOnlyValidator;
    })();
    Validation.LettersOnlyValidator = LettersOnlyValidator;
    var ZipCodeValidator = (function () {
        function ZipCodeValidator() {
        }
        ZipCodeValidator.prototype.isAcceptable = function (s) {
            return s.length === 5 && numberRegexp.test(s);
        };
        return ZipCodeValidator;
    })();
    Validation.ZipCodeValidator = ZipCodeValidator;
})(Validation || (Validation = {}));
$(function () {
    var strings = ["Hello", "9005", "110"];
    var validators = {};
    validators['ZIP code'] = new Validation.ZipCodeValidator();
    validators['Letters only'] = new Validation.LettersOnlyValidator();
    strings.forEach(function (s) {
        for (var name in validators) {
            alert('"' + s + '" ' + (validators[name].isAcceptable(s) ? ' matches ' : 'doesn`t match ') + name);
        }
    });
});
//# sourceMappingURL=module.js.map