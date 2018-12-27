import { observable, IObservableArray, computed } from "mobx";
import { ILoadEvent } from "./load-event";
import { LoadEventService } from "../services/load-event-service";

export class LoadEventStore {
  @observable
  private _loadEvents: IObservableArray<ILoadEvent> = observable.array([]);
  @observable
  private _loading: boolean = false;
  private loadEventStream: EventSource;

  @computed
  public get loadEvents(): ILoadEvent[] {
    return this._loadEvents;
  }

  public set loadEvents(val: ILoadEvent[]) {
    this._loadEvents.replace(val);
  }

  @computed
  public get loading(): boolean {
    return this._loading;
  }

  public set loading(val: boolean) {
    this._loading = val;
  }

  @computed
  public get cpuCount(): number {
    return this.mostRecentEvent ? this.mostRecentEvent.cpuCount : 0;
  }

  @computed
  public get uptime(): number {
    return this.mostRecentEvent ? this.mostRecentEvent.uptime : 0;
  }

  public async retrieveLoadEvents() {
    try {
      this.loading = true;
      this.loadEvents = await LoadEventService.fetchLoadEvents();
      this.loadEventStream = LoadEventService.subscribeToLoadEvents(
        this.addLoadEvent,
        this.onLoadEventStreamError
      );
    } catch (err) {
      console.log(`Error retrieving load events ${err}`);
    } finally {
      this.loading = false;
    }
  }

  public addLoadEvent = (event: ILoadEvent) => {
    this._loadEvents.push(event);
  };

  public dispose() {
    this.loadEventStream.close();
  }

  @computed
  private get mostRecentEvent(): ILoadEvent | null {
    const eventsCount = this.loadEvents.length;
    if (eventsCount > 0) {
      const mostRecentEvent = this.loadEvents[eventsCount - 1];
      return mostRecentEvent;
    }
    return null;
  }

  private onLoadEventStreamError = (error: MessageEvent) => {
    console.error(`LoadEvent Stream Error!`);
    this.loadEventStream.close();
  };
}
