var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AicTech;
(function (AicTech) {
    var Web;
    (function (Web) {
        var Html;
        (function (Html) {
            var DowntimeBase = (function () {
                function DowntimeBase(startTime, endTime, dtCause, recNo, recTime) {
                    this.startTime = startTime;
                    this.endTime = endTime;
                    this.dtCause = dtCause;
                    this.recNo = recNo;
                    this.recTime = recTime;
                }
                /**
                 * 获取停机时间
                 * 如果停机记录无效，则返回-1
                 *
                 * @return downtime, 单位:millisecond
                 */
                DowntimeBase.prototype.getDowntime = function () {
                    if (this.startTime !== null || this.endTime !== null || this.startTime <= this.endTime) {
                        return this.endTime.getTime() - this.startTime.getTime();
                    }
                    else {
                        return -1;
                    }
                };
                return DowntimeBase;
            })();
            var Downtime = (function (_super) {
                __extends(Downtime, _super);
                function Downtime(it) {
                    if (typeof it.recTime === 'undefined' || it.recTime === null) {
                        it.recTime = it.startTime;
                    }
                    _super.call(this, it.startTime, it.endTime, it.dtCause, it.recNo, it.recTime);
                }
                return Downtime;
            })(DowntimeBase);
            Html.Downtime = Downtime;
            var DowntimeWithEqp = (function (_super) {
                __extends(DowntimeWithEqp, _super);
                function DowntimeWithEqp(it) {
                    _super.call(this, it);
                    this.equNo = it.equNo;
                    this.equName = it.equName;
                }
                return DowntimeWithEqp;
            })(Downtime);
            Html.DowntimeWithEqp = DowntimeWithEqp;
            var YieldDataModel = (function () {
                function YieldDataModel(it) {
                    this.recNo = it.recNo;
                    this.actual = parseFloat(it.actual);
                    this.shiftId = it.shiftId;
                    this.shiftNo = it.shiftNo;
                    this.recTime = it.recTime;
                }
                return YieldDataModel;
            })();
            Html.YieldDataModel = YieldDataModel;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=DataModelSeasoned.js.map