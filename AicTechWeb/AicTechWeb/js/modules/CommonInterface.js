var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Html;
        (function (Html) {
            /**
             * 定义数据修改状态
             */
            (function (DirtyDataStatus) {
                DirtyDataStatus[DirtyDataStatus["Add"] = 0] = "Add";
                DirtyDataStatus[DirtyDataStatus["Modify"] = 1] = "Modify";
                DirtyDataStatus[DirtyDataStatus["Delete"] = 2] = "Delete"; //删除
            })(Html.DirtyDataStatus || (Html.DirtyDataStatus = {}));
            var DirtyDataStatus = Html.DirtyDataStatus;
            /**
             * 定义重绘状态
             */
            (function (RedrawStatu) {
                RedrawStatu[RedrawStatu["Complete"] = 0] = "Complete";
                RedrawStatu[RedrawStatu["Advance"] = 1] = "Advance";
                RedrawStatu[RedrawStatu["Backoff"] = 2] = "Backoff"; //后退
            })(Html.RedrawStatu || (Html.RedrawStatu = {}));
            var RedrawStatu = Html.RedrawStatu;
            /**
             * 定义统计周期
             */
            (function (CircleViews) {
                CircleViews[CircleViews["Shift"] = 1] = "Shift";
                CircleViews[CircleViews["Day"] = 2] = "Day";
                CircleViews[CircleViews["Week"] = 3] = "Week";
                CircleViews[CircleViews["Month"] = 4] = "Month";
                CircleViews[CircleViews["Year"] = 5] = "Year";
                CircleViews[CircleViews["Original"] = 6] = "Original";
            })(Html.CircleViews || (Html.CircleViews = {}));
            var CircleViews = Html.CircleViews;
            /**
             * 定义在不同的统计周期下，
             * 一次显示的最大数据点的数量
             */
            (function (CircleDataNum) {
                CircleDataNum[CircleDataNum["Shift"] = 7] = "Shift";
                CircleDataNum[CircleDataNum["Day"] = 9] = "Day";
                CircleDataNum[CircleDataNum["Week"] = 6] = "Week";
                CircleDataNum[CircleDataNum["Month"] = 12] = "Month";
                CircleDataNum[CircleDataNum["Year"] = 20] = "Year";
                CircleDataNum[CircleDataNum["Orginal"] = 10] = "Orginal";
            })(Html.CircleDataNum || (Html.CircleDataNum = {}));
            var CircleDataNum = Html.CircleDataNum;
            /**
             * 定义图表类型
             */
            (function (ChartType) {
                ChartType[ChartType["Line"] = 0] = "Line";
                ChartType[ChartType["Column"] = 1] = "Column";
                ChartType[ChartType["Pie"] = 2] = "Pie";
            })(Html.ChartType || (Html.ChartType = {}));
            var ChartType = Html.ChartType;
            /**
             * 定义统计方法
             */
            (function (CalcMethod) {
                CalcMethod[CalcMethod["Count"] = 0] = "Count";
                CalcMethod[CalcMethod["Time"] = 1] = "Time";
            })(Html.CalcMethod || (Html.CalcMethod = {}));
            var CalcMethod = Html.CalcMethod;
            /**
             * 定义对图表进行数据处理的选项
             */
            (function (ChartOptionsContent) {
                ChartOptionsContent[ChartOptionsContent["chartType"] = 0] = "chartType";
                ChartOptionsContent[ChartOptionsContent["dataSeg"] = 1] = "dataSeg";
                ChartOptionsContent[ChartOptionsContent["dataSegSingle"] = 2] = "dataSegSingle";
                ChartOptionsContent[ChartOptionsContent["calcCircle"] = 3] = "calcCircle";
                ChartOptionsContent[ChartOptionsContent["dataGroup"] = 4] = "dataGroup";
                ChartOptionsContent[ChartOptionsContent["calcMethod"] = 5] = "calcMethod";
                ChartOptionsContent[ChartOptionsContent["dataFilter"] = 6] = "dataFilter";
                ChartOptionsContent[ChartOptionsContent["legend"] = 7] = "legend";
            })(Html.ChartOptionsContent || (Html.ChartOptionsContent = {}));
            var ChartOptionsContent = Html.ChartOptionsContent;
            var Girl = (function () {
                function Girl() {
                }
                return Girl;
            })();
            Html.Girl = Girl;
            var JingzeDai = (function () {
                function JingzeDai() {
                    this.GivenName = "Jingze";
                    this.FamilyName = "Dai";
                    this.IsADuanziHand = true;
                }
                JingzeDai.prototype.CarryGirls = function (girls) { };
                JingzeDai.prototype.PublishEssay = function () { };
                JingzeDai.prototype.RunMore = function () { };
                JingzeDai.prototype.DrinkMore = function () { };
                JingzeDai.prototype.PublishSelfShot = function () { };
                JingzeDai.prototype.PublishDuanzi = function (duanzi) { };
                return JingzeDai;
            })();
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=CommonInterface.js.map