export interface TelemetryMetadata {
    label: string;
    type: string;
    location: string;
}

export interface TelemetryAny {
    timestamp: Date;
    metadata: TelemetryMetadata;
    value: any;
}

export interface ObjectTelemetry {
    telemetry: TelemetryAny[];
}

export interface ObjectTelemetryLabels {
    labels: string[];
}

export interface TelemetryNumber extends TelemetryAny {
    value: number;
}

export interface TelemetryString extends TelemetryAny {
    value: string;
}

export interface TelemetryBoolean extends TelemetryAny {
    value: boolean;
}

export interface TelemetryLocation extends TelemetryAny {
    value: Location;
}

export interface Location {
    longitude: number;
    latitude: number;
}
