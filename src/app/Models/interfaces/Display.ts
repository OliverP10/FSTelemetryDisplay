import { ScreenItem } from './Screen';

export interface Display {
    _id: string;
    title: string;
    type: string;
    colSize: number;
    rowSize: number;
    labels: string[];
    options: any;
}

export interface MoveScreenItem {
    screenItem: ScreenItem;
    direction: string;
}

export interface ResizeScreenItem {
    screenItem: ScreenItem;
    axis: string;
    change: number;
}

export interface DataSet {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
}

export interface CarData {
    labels: number[];
    dataSets: number[];
}

export interface GraphOption {
    type: string;
    data?: any;
    options: any;
}

export interface Size {
    width: number;
    height: number;
}

export interface Post {
    datalabels: string[];
}

export interface ErrorData {
    dataLabel: string;
    type: string;
    error: string;
}
