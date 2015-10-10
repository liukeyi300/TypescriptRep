// Type definitions for VIS
// by liob 2015/10/10 11:30
declare module vis {
    class timeline {

    }

    function Timeline(container: HTMLElement, items: any[]|DataSet|DataView, options: TimelineOptions): vis.timeline;
    function Timeline(container: HTMLElement, items: any[]|DataSet|DataView, groups:any[] | DataSet | DataView, options): void;

    interface DataSet {

    }

    interface DataView {

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
}