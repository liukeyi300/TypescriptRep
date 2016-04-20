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
            Html.DowntimeBase = DowntimeBase;
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
            var RatioClass = (function () {
                function RatioClass(recNo, recTime, actual, quantity) {
                    this.recNo = recNo;
                    this.recTime = recTime;
                    this.actual = actual;
                    this.quantity = quantity;
                }
                return RatioClass;
            })();
            Html.RatioClass = RatioClass;
            var TimeAccmplshRtDataModel = (function (_super) {
                __extends(TimeAccmplshRtDataModel, _super);
                function TimeAccmplshRtDataModel(it) {
                    var actual, quantity;
                    if (typeof it.actual == 'undefined') {
                        actual = 0;
                    }
                    else {
                        actual = parseFloat(it.actual);
                    }
                    if (typeof it.quantity === 'undefined') {
                        quantity = 0;
                    }
                    else {
                        quantity = parseFloat(it.quantity);
                    }
                    _super.call(this, it.recNo, it.recTime, actual, quantity);
                    this.shiftNo = it.shiftNo;
                }
                Object.defineProperty(TimeAccmplshRtDataModel.prototype, "shiftId", {
                    get: function () {
                        return this._shiftId;
                    },
                    set: function (shiftId) {
                        this._shiftId = shiftId;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TimeAccmplshRtDataModel.prototype, "shiftStartTime", {
                    get: function () {
                        return this._shiftStartTime;
                    },
                    set: function (st) {
                        this._shiftStartTime = st;
                    },
                    enumerable: true,
                    configurable: true
                });
                return TimeAccmplshRtDataModel;
            })(RatioClass);
            Html.TimeAccmplshRtDataModel = TimeAccmplshRtDataModel;
            var OfferAccmplshRtDataModel = (function (_super) {
                __extends(OfferAccmplshRtDataModel, _super);
                function OfferAccmplshRtDataModel(it) {
                    _super.call(this, it.recNo, it.recTime, parseFloat(it.actual), parseFloat(it.quantity));
                    this.poId = it.poId;
                }
                return OfferAccmplshRtDataModel;
            })(RatioClass);
            Html.OfferAccmplshRtDataModel = OfferAccmplshRtDataModel;
            var VarietyAccmplshRtDataModel = (function (_super) {
                __extends(VarietyAccmplshRtDataModel, _super);
                function VarietyAccmplshRtDataModel(it) {
                    _super.call(this, it.recNo, it.recTime, parseFloat(it.actual), parseFloat(it.quantity));
                    this.defId = it.defId;
                }
                return VarietyAccmplshRtDataModel;
            })(RatioClass);
            Html.VarietyAccmplshRtDataModel = VarietyAccmplshRtDataModel;
            var QualifyAnalystBaseDataModel = (function () {
                function QualifyAnalystBaseDataModel(recNo, recTime, shiftId, shiftNo, total) {
                    this.recNo = recNo;
                    this.recTime = recTime;
                    this.shiftId = shiftId;
                    this.shiftNo = shiftNo;
                    this.total = total;
                }
                return QualifyAnalystBaseDataModel;
            })();
            Html.QualifyAnalystBaseDataModel = QualifyAnalystBaseDataModel;
            var QualifyRtDataModel = (function (_super) {
                __extends(QualifyRtDataModel, _super);
                function QualifyRtDataModel(it) {
                    _super.call(this, it.recNo, it.recTime, it.shiftId, it.shiftNo, parseFloat(it.total));
                    this.qualify = parseFloat(it.qualify);
                }
                return QualifyRtDataModel;
            })(QualifyAnalystBaseDataModel);
            Html.QualifyRtDataModel = QualifyRtDataModel;
            var ScrapRtDataModel = (function (_super) {
                __extends(ScrapRtDataModel, _super);
                function ScrapRtDataModel(it) {
                    _super.call(this, it.recNo, it.recTime, it.shiftId, it.shiftNo, parseFloat(it.total));
                    this.scrap = parseFloat(it.scrap);
                }
                return ScrapRtDataModel;
            })(QualifyAnalystBaseDataModel);
            Html.ScrapRtDataModel = ScrapRtDataModel;
            var ReworkRtDataModel = (function (_super) {
                __extends(ReworkRtDataModel, _super);
                function ReworkRtDataModel(it) {
                    _super.call(this, it.recNo, it.recTime, it.shiftId, it.shiftNo, parseFloat(it.total));
                    this.rework = parseFloat(it.rework);
                }
                return ReworkRtDataModel;
            })(QualifyAnalystBaseDataModel);
            Html.ReworkRtDataModel = ReworkRtDataModel;
            var QualifyAvgAnalystDataModel = (function () {
                function QualifyAvgAnalystDataModel(it) {
                    this.recNo = it.recNo;
                    this.recTime = it.recTime;
                    this.qualify = parseFloat(it.qualify);
                    this.scrap = parseFloat(it.scrap);
                    this.rework = parseFloat(it.rework);
                }
                return QualifyAvgAnalystDataModel;
            })();
            Html.QualifyAvgAnalystDataModel = QualifyAvgAnalystDataModel;
            var ConsumptionBase = (function () {
                function ConsumptionBase(typeId, quantity) {
                    this.typeId = typeId;
                    this.quantity = quantity;
                }
                return ConsumptionBase;
            })();
            Html.ConsumptionBase = ConsumptionBase;
            var ConsumptionTimeDataModel = (function (_super) {
                __extends(ConsumptionTimeDataModel, _super);
                function ConsumptionTimeDataModel(it) {
                    if (typeof it.engId !== 'undefined') {
                        _super.call(this, it.engId, parseFloat(it.quantity));
                    }
                    else {
                        _super.call(this, it.defId, parseFloat(it.quantity));
                    }
                    this.recNo = it.recNo;
                    this.recTime = it.recTime;
                    this.shiftNo = it.shiftNo;
                    this.shiftId = it.shiftId;
                    this.shiftStartTime = it.shiftStartTime;
                }
                return ConsumptionTimeDataModel;
            })(ConsumptionBase);
            Html.ConsumptionTimeDataModel = ConsumptionTimeDataModel;
        })(Html = Web.Html || (Web.Html = {}));
    })(Web = AicTech.Web || (AicTech.Web = {}));
})(AicTech || (AicTech = {}));
//# sourceMappingURL=DataModelSeasoned.js.map