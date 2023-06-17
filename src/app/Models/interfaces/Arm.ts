export interface Arm {
    yaw: Joint;
    pitch1: Joint;
    pitch2: Joint;
    roll: Joint;
}

export interface Joint {
    value: number;
    oldValue: number;
    min: number;
    max: number;
}
