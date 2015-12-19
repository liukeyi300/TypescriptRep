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

    }

    export interface IMask {
        opacity?: number;
        color?: string;
    }

    export enum Direction {
        Up,
        Right,
        Down,
        Left
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
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
        all?: string;
    }

    export interface IMargin {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
        all?: string;
    }

    export interface IPadding {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
        all?: string;
    }

}