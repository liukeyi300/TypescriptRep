module AicTech.Web.Html {
    class DowntimeBase implements IRecord {
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
}