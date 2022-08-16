export const ROOT_URL: string="http://192.168.0.44";    // 'http://' prefix is important for cors
export const ROVER_MODE: boolean = true;

export interface Display {
    id: number;
    title: string;
    type: string;
    colSize: number;
    rowSize: number;
    dataLabels: string[];
    options?: any;
}

export interface MoveDisplay {
    display: Display;
    direction: string;
}

export interface ResizeDisplay {
    display: Display;
    axis: string;
    change: number;
}

export interface DataSet {
    label: string,
    data: number[],
    borderColor: string,
    backgroundColor: string,
    tension: number,
}

export interface CarData {
    labels: number[],
    dataSets: number[],
}

export interface GraphOption {
    type: string,
    data?: any,
    options: any,
}

export interface Size {
    width: number,
    height: number
}

export interface Post {
    datalabels: string[]
}

export interface Screen {
    dashboard: ScreenItem[],
    controlSystems: ScreenItem[]
}

export interface ScreenItem {
    id: number
    colSize: number
    rowSize: number
}

export interface ErrorData {
    dataLabel:string,
    type:string,
    error:string,
}
