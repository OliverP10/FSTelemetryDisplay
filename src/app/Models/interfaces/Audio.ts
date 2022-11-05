import { Priority, Type } from '../enumerations/Audio';

export interface Sound {
    path: string;
    type: Type;
    priority: Priority;
}
