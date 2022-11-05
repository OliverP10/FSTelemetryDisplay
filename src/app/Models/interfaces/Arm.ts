export interface Arm {
    yaw: Joint;
    pitch1: Joint;
    pitch2: Joint;
    claw: Joint;
}

export interface Joint {
    value: number;
    min: number;
    max: number;
}
