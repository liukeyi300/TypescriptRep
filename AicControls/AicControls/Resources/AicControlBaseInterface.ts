module Aic.Html.Controls {
    export interface ISize {
        width: number;
        height: number;
    }

    export interface IPoint {
        x: number;
        y: number;
    }

    export interface IPoint3D {
        x: number;
        y: number;
        z: number;
    }

    export interface IBrush {
        type?: BrushType;
        color: string;
    }

    export interface IMask {
        opacity?: number;
        color?: string;
    }

    export enum Direction {
        Up=1,
        Down,
        Right,
        Left
    }

    export enum BrushType {
        Normal = 1,
        LinearGradient,
        RadialGradient
    }

    export interface IBaseOptions {
        width?: number;
        height?: number;
        borderThickness?: IBorderThickness;
        margin?: IMargin;
        padding?: IPadding;
        background?: IBrush;
        foreground?: IBrush;
        opacityMask?: IMask;
    }
    
    export interface IBorderThickness {
        top?: number | string;
        right?: number | string;
        bottom?: number | string;
        left?: number | string;
        all?: number | string;
    }

    export interface IMargin {
        top?: number | string;
        right?: number | string;
        bottom?: number | string;
        left?: number | string;
        all?: number | string;
    }

    export interface IPadding {
        top?: number | string;
        right?: number | string;
        bottom?: number | string;
        left?: number | string;
        all?: number | string;
    }

}