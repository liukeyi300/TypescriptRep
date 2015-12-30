var Aic;
(function (Aic) {
    var Html;
    (function (Html) {
        var Controls;
        (function (Controls) {
            (function (Direction) {
                Direction[Direction["Up"] = 1] = "Up";
                Direction[Direction["Down"] = 2] = "Down";
                Direction[Direction["Right"] = 3] = "Right";
                Direction[Direction["Left"] = 4] = "Left";
            })(Controls.Direction || (Controls.Direction = {}));
            var Direction = Controls.Direction;
            (function (BrushType) {
                BrushType[BrushType["Normal"] = 1] = "Normal";
                BrushType[BrushType["LinearGradient"] = 2] = "LinearGradient";
                BrushType[BrushType["RadialGradient"] = 3] = "RadialGradient";
            })(Controls.BrushType || (Controls.BrushType = {}));
            var BrushType = Controls.BrushType;
        })(Controls = Html.Controls || (Html.Controls = {}));
    })(Html = Aic.Html || (Aic.Html = {}));
})(Aic || (Aic = {}));
//# sourceMappingURL=AicControlBaseInterface.js.map