import { RotateProp } from '@fortawesome/fontawesome-svg-core';

export interface Motors {
    motorOne: Motor;
    motorTwo: Motor;
    motorThree: Motor;
    motorFour: Motor;
}

export interface Motor {
    enabled: boolean;
    forwards: boolean;
    speed: number;
    rotation: number ;
}
