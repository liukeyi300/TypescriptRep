module AicTech.Web.Html {
    export class DowntimeBase implements IRecord {
        startTime: Date;
        endTime: Date;
        dtCause: string;
        recNo: string;
        recTime: Date;

        constructor(startTime: Date, endTime: Date, dtCause: string, recNo: string, recTime: Date) {
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
        public getDowntime(): number {
            if (this.startTime !== null || this.endTime !== null || this.startTime <= this.endTime) {
                return this.endTime.getTime() - this.startTime.getTime();
            } else {
                return -1;
            }
        }
    }

    export class Downtime extends DowntimeBase {
        constructor(it: { startTime: Date, endTime: Date, dtCause: string, recNo: string, recTime?: Date }) {
            if (typeof it.recTime === 'undefined' || it.recTime === null) {
                it.recTime = it.startTime;
            } 
            super(it.startTime, it.endTime, it.dtCause, it.recNo, it.recTime);
        }
    }

    export class DowntimeWithEqp extends Downtime implements IEquipment {
        equNo: string;
        equName: string;

        constructor(it: {
            equNo: string;
            equName: string;
            startTime: Date,
            endTime: Date,
            dtCause: string,
            recNo: string
        }) {
            super(it);
            this.equNo = it.equNo;
            this.equName = it.equName;
        }
    }

    export class YieldDataModel implements IRecord, IShift {
        recNo: string;
        actual: number;
        shiftId: string;
        shiftNo: string;
        recTime: Date;

        constructor(it: { recNo: string, actual: string, shiftId: string, shiftNo: string, recTime: Date }) {
            this.recNo = it.recNo;
            this.actual = parseFloat(it.actual);
            this.shiftId = it.shiftId;
            this.shiftNo = it.shiftNo;
            this.recTime = it.recTime;
        }
    }

    export class RatioClass implements IRecord {
        recNo: string;
        recTime: Date;
        actual: number;
        quantity: number;

        constructor(recNo: string, recTime: Date, actual: number, quantity: number) {
            this.recNo = recNo;
            this.recTime = recTime;
            this.actual = actual;
            this.quantity = quantity;
        }
    }

    export class TimeAccmplshRtDataModel extends RatioClass implements IShift {
        shiftNo: string;
        private _shiftId: string;
        private _shiftStartTime: Date;

        public get shiftId(): string {
            return this._shiftId;
        }

        public set shiftId(shiftId: string) {
            this._shiftId = shiftId;
        }

        public get shiftStartTime(): Date {
            return this._shiftStartTime;
        }

        public set shiftStartTime(st: Date) {
            this._shiftStartTime = st;
        }

        constructor(it: { recNo: string, recTime: Date, shiftNo: string, actual?: string, quantity?: string }) {
            var actual, quantity;
            if (typeof it.actual == 'undefined') {
                actual = 0;
            } else {
                actual = parseFloat(it.actual);
            }
            if (typeof it.quantity === 'undefined') {
                quantity = 0;
            } else {
                quantity = parseFloat(it.quantity);
            }
            super(it.recNo, it.recTime, actual, quantity);
            this.shiftNo = it.shiftNo;
        }
    }

    export class OfferAccmplshRtDataModel extends RatioClass {
        poId: string;
        constructor(it: { recNo: string, recTime: Date, actual: string, quantity: string, poId: string }) {
            super(it.recNo, it.recTime, parseFloat(it.actual), parseFloat(it.quantity));
            this.poId = it.poId;
        }
    }

    export class VarietyAccmplshRtDataModel extends RatioClass {
        defId: string;
        constructor(it: { recNo: string, recTime: Date, actual: string, quantity: string, defId: string }) {
            super(it.recNo, it.recTime, parseFloat(it.actual), parseFloat(it.quantity));
            this.defId = it.defId;
        }
    }

    export class QualifyAnalystBaseDataModel implements IRecord, IShift {
        recNo: string;
        recTime: Date;
        shiftId: string;
        shiftNo: string;
        total: number;

        constructor(recNo: string, recTime: Date, shiftId: string, shiftNo: string, total: number) {
            this.recNo = recNo;
            this.recTime = recTime;
            this.shiftId = shiftId;
            this.shiftNo = shiftNo;
            this.total = total;
        }
    }

    export class QualifyRtDataModel extends QualifyAnalystBaseDataModel {
        qualify: number;
        constructor(it: { recNo: string, recTime: Date, shiftId: string, shiftNo: string, total: string, qualify: string }) {
            super(it.recNo, it.recTime, it.shiftId, it.shiftNo, parseFloat(it.total));
            this.qualify = parseFloat(it.qualify);
        }
    }

    export class ScrapRtDataModel extends QualifyAnalystBaseDataModel {
        scrap: number;
        constructor(it: { recNo: string, recTime: Date, shiftId: string, shiftNo: string, total: string, scrap: string }) {
            super(it.recNo, it.recTime, it.shiftId, it.shiftNo, parseFloat(it.total));
            this.scrap = parseFloat(it.scrap);
        }
    }

    export class ReworkRtDataModel extends QualifyAnalystBaseDataModel {
        rework: number;
        constructor(it: { recNo: string, recTime: Date, shiftId: string, shiftNo: string, total: string, rework: string }) {
            super(it.recNo, it.recTime, it.shiftId, it.shiftNo, parseFloat(it.total));
            this.rework = parseFloat(it.rework);
        }
    }

    export class QualifyAvgAnalystDataModel implements IRecord {
        recNo: string
        recTime: Date;
        qualify: number;
        scrap: number;
        rework: number;

        constructor(it: { recNo: string, recTime: Date, qualify: string, scrap: string, rework: string }) {
            this.recNo = it.recNo;
            this.recTime = it.recTime;
            this.qualify = parseFloat(it.qualify);
            this.scrap = parseFloat(it.scrap);
            this.rework = parseFloat(it.rework);
        }
    }

    export class ConsumptionBase {
        quantity: number;
        typeId: string;

        constructor(typeId: string, quantity: number) {
            this.typeId = typeId;
            this.quantity = quantity;
        }
    }

    export class ConsumptionTimeDataModel extends ConsumptionBase implements IRecord, IShift {
        recNo: string;
        recTime: Date;
        shiftNo: string;
        shiftId: string;
        shiftStartTime: Date;

        constructor(it: { recNo: string, recTime: Date, shiftNo: string, shiftId: string, shiftStartTime: Date, quantity: string, engId: string });
        constructor(it: { recNo: string, recTime: Date, shiftNo: string, shiftId: string, shiftStartTime: Date, quantity: string, defId: string });
        constructor(it: any) {
            if (typeof it.engId !== 'undefined') {
                super(it.engId, parseFloat(it.quantity));
            } else {
                super(it.defId, parseFloat(it.quantity));
            }
            this.recNo = it.recNo;
            this.recTime = it.recTime;
            this.shiftNo = it.shiftNo;
            this.shiftId = it.shiftId;
            this.shiftStartTime = it.shiftStartTime;
        }
    }
    
}