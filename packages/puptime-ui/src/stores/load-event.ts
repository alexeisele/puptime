export interface ILoadEvent {
  time: Date;
  oneMinuteLoadAverage: number;
  twoMinuteLoadAverage: number;
  fiveMinuteLoadAverage: number;
  fifteenMinuteLoadAverage: number;
  cpuCount: number;
  uptime: number;
  isAboveThreshold?: boolean;
}

export class LoadEvent implements ILoadEvent {
  public time: Date;
  public oneMinuteLoadAverage: number;
  public twoMinuteLoadAverage: number;
  public fiveMinuteLoadAverage: number;
  public fifteenMinuteLoadAverage: number;
  public cpuCount: number;
  public uptime: number;

  private threshold: number;

  constructor(event: ILoadEvent, threshold: number) {
    this.time = new Date(event.time);
    this.oneMinuteLoadAverage = event.oneMinuteLoadAverage;
    this.twoMinuteLoadAverage = event.twoMinuteLoadAverage;
    this.fiveMinuteLoadAverage = event.fiveMinuteLoadAverage;
    this.fifteenMinuteLoadAverage = event.fifteenMinuteLoadAverage;
    this.cpuCount = event.cpuCount;
    this.uptime = event.uptime;
    this.threshold = threshold;
  }

  public get isAboveThreshold(): boolean {
    return this.twoMinuteLoadAverage > this.threshold;
  }
}
