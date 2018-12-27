import { ILoadEvent } from "../stores/load-event";

export class LoadEventService {
  public static async fetchLoadEvents() {
    try {
      const loadEvents = await fetch("/load-events").then(res => res.json());
      return loadEvents;
    } catch (error) {
      console.error(error);
    }
  }

  public static subscribeToLoadEvents(
    onmessage: (event: ILoadEvent) => void,
    onerror?: (err: MessageEvent) => void
  ): EventSource {
    const loadEventStream = new EventSource("/load-events/stream");
    loadEventStream.onmessage = (event: MessageEvent) => {
      onmessage(JSON.parse(event.data) as ILoadEvent);
    };
    loadEventStream.onerror = onerror || console.error;
    return loadEventStream;
  }
}
