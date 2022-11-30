export interface SeriesOption {
    name: string;
    type: string;
    data: GraphData[];
}

export interface GraphData {
    x: number;
    y: number;
}

export interface GraphOptions {
    viewSize: number;
    maxPoints: number;
}
