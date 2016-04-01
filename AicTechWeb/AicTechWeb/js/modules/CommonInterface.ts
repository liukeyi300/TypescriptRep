module AicTech.Web.Html {
    /**
     * 定义数据修改状态
     */
    export enum DirtyDataStatus {
        Add = 0,    //新增
        Modify,     //修改
        Delete       //删除
    }

    /**
     * 定义重绘状态
     */
    export enum RedrawStatu {
        Complete = 0, //完全重绘
        Advance,         //前进
        Backoff           //后退
    }

    /**
     * 定义统计周期
     */
    export enum CircleViews {
        Shift = 1,
        Day,
        Week,
        Month,
        Year,
        Original
    }

    /**
     * 定义在不同的统计周期下，
     * 一次显示的最大数据点的数量
     */
    export enum CircleDataNum {
        Shift = 7,
        Day = 9,
        Week = 6,
        Month = 12,
        Year = 20,
        Orginal = 10
    }

    /**
     * 定义图表类型
     */
    export enum ChartType {
        Line = 0,
        Column,
        Pie,
    }

    /**
     * 定义统计方法
     */
    export enum CalcMethod {
        Count = 0,
        Time
    }

    /**
     * 定义对图表进行数据处理的选项
     */
    export enum ChartOptionsContent {
        chartType = 0,
        dataSeg,
        dataSegSingle,
        calcCircle,
        dataGroup,
        calcMethod,
        dataFilter,
        legend
    }

    export interface IDowntimeCauseColor {
        causeId: string;
        causeColor: string;
    }

    export interface IRecord {
        recNo: string;
        recTime: Date;
    }

    export interface IEquipment {
        equNo: string;
        equName: string;
    }

    export interface IShift {
        shiftId: string;
        shiftNo: string;
        teamId?: string;
        shiftStartTime?: Date;
        shiftEndTime?: Date;
    }

    export interface IParameter {
        parId: string;
        parValue: string;
        parHighValue?: string;
    }
}