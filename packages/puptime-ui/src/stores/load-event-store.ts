import { observable, IObservableArray, computed, action } from "mobx";
import { ILoadEvent, LoadEvent } from "./load-event";
import { LoadEventService } from "../services/load-event-service";
import { INotification } from "./notification";

const LOAD_THRESHOLD = 1;

export class LoadEventStore {
  @observable
  private _loadEvents: IObservableArray<ILoadEvent> = observable.array();
  @observable
  private _notifications: IObservableArray<INotification> = observable.array();
  @observable
  private _loading: boolean = false;
  private loadEventStream: EventSource;
  private loadThreshold: number;

  constructor(loadThreshold: number = LOAD_THRESHOLD) {
    this.loadThreshold = loadThreshold;
  }

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

  @computed
  public get cpuCount(): number {
    return this.mostRecentEvent ? this.mostRecentEvent.cpuCount : 0;
  }

  @computed
  public get uptime(): number {
    return this.mostRecentEvent ? this.mostRecentEvent.uptime : 0;
  }

  @computed
  public get notifications(): INotification[] {
    return this._notifications;
  }

  public async retrieveLoadEvents() {
    try {
      this._loading = true;
      this.loadEvents = await LoadEventService.fetchLoadEvents().then(events =>
        events.map(
          (event: ILoadEvent) => new LoadEvent(event, this.loadThreshold)
        )
      );
      this.loadEventStream = LoadEventService.subscribeToLoadEvents(
        this.addLoadEvent,
        this.onLoadEventStreamError
      );
      const loadEventCount = this.loadEvents.length;
      if (loadEventCount > 1) {
        this.notifyIfNeeded(
          this.loadEvents[loadEventCount - 2],
          this.loadEvents[loadEventCount - 1]
        );
      }
    } catch (err) {
      console.log(`Error retrieving load events ${err}`);
      this.addNotification({
        type: "error",
        message: `Unable to retrieve load events!`
      });
    } finally {
      this._loading = false;
    }
  }

  @action.bound
  public addLoadEvent(event: ILoadEvent) {
    const lastLoadEvent = this.mostRecentEvent;
    const newLoadEvent = new LoadEvent(event, this.loadThreshold);
    if (lastLoadEvent) {
      this.notifyIfNeeded(lastLoadEvent, newLoadEvent);
    }
    this._loadEvents.push(newLoadEvent);
  }

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

  @action.bound
  private addNotification(val: INotification) {
    this._notifications.push(val);
  }

  private onLoadEventStreamError = (error: MessageEvent) => {
    console.error(`LoadEvent Stream Error!`);
    this.addNotification({
      type: "error",
      message: `Disconnected from Server! Please Refresh.`
    });
    this.loadEventStream.close();
  };

  private notifyIfNeeded(lastLoadEvent: ILoadEvent, newLoadEvent: ILoadEvent) {
    const highLoadMessage = `High load generated an alert - load = ${
      newLoadEvent.fiveMinuteLoadAverage
    }, triggered at ${newLoadEvent.time.toLocaleString()}`;
    const recoveredMessage = `Load back to normal at ${newLoadEvent.time.toString()}`;
    if (lastLoadEvent.isAboveThreshold) {
      if (newLoadEvent.isAboveThreshold) {
        if (this.notifications.length === 0) {
          this.addNotification({
            type: "warning",
            message: highLoadMessage
          });
        }
      } else {
        this.addNotification({
          type: "success",
          message: recoveredMessage
        });
      }
    } else {
      if (newLoadEvent.isAboveThreshold) {
        this.addNotification({
          type: "warning",
          message: highLoadMessage
        });
      }
    }
  }
}
