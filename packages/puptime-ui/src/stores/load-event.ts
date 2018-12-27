export interface ILoadEvent {
  time: Date;
  oneMinuteLoadAverage: number;
  fiveMinuteLoadAverage: number;
  fifteenMinuteLoadAverage: number;
  cpuCount: number;
  uptime: number;
}
