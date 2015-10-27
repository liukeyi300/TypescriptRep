// Type definitions for VIS
// by liob 2015/10/10 11:30
declare module vis {
    class Timeline {
        constructor(container: HTMLElement, items: any[]|DataSet|DataView, options: TimelineOptions);
        constructor(container: HTMLElement, items: any[]|DataSet|DataView, groups: any[]| DataSet | DataView, options);
        addCustomTime(time?: Date|number|string, id?: number|string): void;
        destroy(): void;
        fit(options?: Object): void;
        focus(id: Object, options?: Object): void;
        getCurrentTime(): void;
        getCustomTime(id?: Object): void;
        getEventProperties(event: Object): void;
        setData({groups, items}): void;
        setGroups(groups): void;
        setItems(items): void;
        setOptions(options: TimelineOptions): void;
    }

    class DataSet {
        length: number;
        constructor(data?: any[], options?: DataSetOptions);
        add(data: Object, senderId?): number[];
        clear(senderId?): number[];
        distinct(field): any[];
        get(options?, data?): any;
        update(data: any): number[]; 
    }

    interface DataSetOptions {
        fieldId?: string;
    }

    class DataView {
        constructor(data: DataSet, options: DataViewOptions);
        getDataSet(): DataSet;
    }

    interface DataViewOptions {
        convert?;
        filter: Function;
        field: string[];
    }

    interface TimelineOptions {
        align?: string;
        autoResize?: boolean;
        clickToUse?: boolean;
        configure?: boolean| ((options: any, path: any) => void);
        dataAttributes?: any;
        editable?: boolean|EditableOptions;
        end?: any;
        format?: any;
        groupEditable?: boolean|GroupEditableOptions;
        groupOrder?: string|(() => void);
        groupOrderSwap?: any;
        groupTemplate?: any;
        height?: number|string;
        hiddenDates?: any;
        locale?: string;
        locales?: any;
        moment?: (() => void);
        margin?: number | MarginOptions;
        max?: any;
        maxHeight?: number|string;
        min?: any;
        minHeight?: number|string;
        moveable?: boolean;
        multiselect?: boolean;
        onAdd?: (item, callback: Function) => void;
        onAddGroup?: (item, callback: Function) => void;
        onMove?: (item, callback: Function) => void;
        onMoveGroup?: (item, callback: Function) => void;
        onMoving?: (item, callback: Function) => void;
        onRemove?: (item, callback: Function) => void;
        onRemoveGroup?: (item, callback: Function) => void;
        order?: Function;
        orientation?: string|OrientationOptions;
        selectable?: boolean;
        showCurrentTime?: boolean;
        showMajorLabels?: boolean;
        showMinorLabels?: boolean;
        stack?: boolean;
        snap?: Function;
        start?: any;
        template?: Function;
        throttleRedraw?: number;
        timeAxis?: TimeAxisOptions;
        type?: string;
        width?: string|number;
        zoomable?: boolean;
        zoomKey?: string;
        zoomMax?: number;
        zoomMin?: number;
    }

    interface EditableOptions {
        add?: boolean;
        remove?: boolean;
        updateGroup?: boolean;
        updateTime?: boolean;
    }

    interface GroupEditableOptions {
        add?: boolean;
        remove?: boolean;
        order?: boolean;
    }

    interface MarginOptions {
        axis?: number;
        item?: number|MarginItemOptions;
    }

    interface MarginItemOptions {
        horizontal?: number;
        vertical?: number;
    }

    interface OrientationOptions {
        axis?: string;
        item?: string;
    }

    interface TimeAxisOptions {
        scale?: string;
        step?: number;
    }
}