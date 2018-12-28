import { LoadEventStore } from "./load-event-store";
import { ILoadEvent } from "./load-event";
describe("LoadEventStore", () => {
  let store: LoadEventStore;
  beforeEach(() => {
    store = new LoadEventStore();
    const firstEvent: ILoadEvent = {
      time: new Date(),
      oneMinuteLoadAverage: 1.3,
      twoMinuteLoadAverage: 1.2,
      fiveMinuteLoadAverage: 1,
      fifteenMinuteLoadAverage: 0.9,
      cpuCount: 4,
      uptime: 100
    };
    store.loadEvents = [firstEvent];
  });

  test("should add warning notification if load is initially high", () => {
    const newEvent: ILoadEvent = {
      time: new Date(),
      oneMinuteLoadAverage: 1.4,
      twoMinuteLoadAverage: 1.3,
      fiveMinuteLoadAverage: 1.1,
      fifteenMinuteLoadAverage: 1,
      cpuCount: 4,
      uptime: 100
    };
    store.addLoadEvent(newEvent);
    expect(store.loadEvents.length).toBe(2);
    expect(store.notifications.length).toBe(1);
    expect(store.notifications[0].type).toBe("warning");
  });

  test("should add success notification if load has recovered", () => {
    const newEvent: ILoadEvent = {
      time: new Date(),
      oneMinuteLoadAverage: 0.9,
      twoMinuteLoadAverage: 0.8,
      fiveMinuteLoadAverage: 0.7,
      fifteenMinuteLoadAverage: 0.6,
      cpuCount: 4,
      uptime: 101
    };
    store.addLoadEvent(newEvent);
    expect(store.loadEvents.length).toBe(2);
    expect(store.notifications.length).toBe(1);
    expect(store.notifications[0].type).toBe("success");
  });

  test("should add warning notification if load is now high", () => {
    const [firstEvent] = store.loadEvents;
    firstEvent.twoMinuteLoadAverage = 0.8;
    const newEvent: ILoadEvent = {
      time: new Date(),
      oneMinuteLoadAverage: 1.4,
      twoMinuteLoadAverage: 1.3,
      fiveMinuteLoadAverage: 1.1,
      fifteenMinuteLoadAverage: 1,
      cpuCount: 4,
      uptime: 100
    };
    store.addLoadEvent(newEvent);
    expect(store.loadEvents.length).toBe(2);
    expect(store.notifications.length).toBe(1);
    expect(store.notifications[0].type).toBe("warning");
  });
});
