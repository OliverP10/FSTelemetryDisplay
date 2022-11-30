import { Display } from './Display';

export interface Screen {
    name: string;
    displayName: string;
    screenItems: ScreenItem[];
}

export interface ScreenItem {
    _id?: string;
    display: Display;
    colSize: number;
    rowSize: number;
    options: any;
}

export interface DBScreenItem {
    _id?: string;
    display: string;
    colSize: number;
    rowSize: number;
    options: any;
}

export type ScreenName = 'Dashboard' | 'Control Systems' | 'Car' | 'Perofrmance' | 'Engine' | 'Data Analysis' | 'Communications' | 'Create Display' | 'About' | '';
