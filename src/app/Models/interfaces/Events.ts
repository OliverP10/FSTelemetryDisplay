import { Data } from '@angular/router';

export interface EventMetadata {
    type: string;
    location: string;
}

export interface Event {
    timestamp: Date;
    metadata: EventMetadata;
    trigger: string;
    message: string;
}

export interface ObjectEvent {
    event: Event[];
}

export interface TableEvent {
    timestamp: Data;
    type: string;
    trigger: string;
    message: string;
}
