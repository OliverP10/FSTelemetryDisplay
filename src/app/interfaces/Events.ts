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
