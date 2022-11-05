export enum Priority {
    HIGH = 3,
    MEDIUM = 2,
    LOW = 1
}

export enum Type {
    SENSOR_LOST,
    NOMINAL_BOUNDRY,
    WARNING_BOUNDRY,
    ANY_BOUNDRY,
    ARUDINO_FAIL,
    TELEMETRY_LOST,
    TELEMTRY_RECOVERED,
    MASTER_WARNING,
    WARNING
}
