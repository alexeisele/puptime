import * as mongoose from "mongoose";
import * as moment from "moment";
import { Request, Response } from "express";
import SSE = require("express-sse");
import { LoadEventSchema, ILoadEvent } from "./../models/load-event-model";

const LoadEvent = mongoose.model("LoadEvent", LoadEventSchema);

export class LoadEventController {
  private loadEventStream: SSE = new SSE();

  public getLoadEvents(req: Request, res: Response) {
    LoadEvent.find({}, (err, loadEvents) => {
      if (err) {
        res.send(err);
      }
      res.json(loadEvents);
    });
  }

  public streamLoadEvents = (req: Request, res: Response) => {
    console.log(`Load Event stream established`);
    this.ensureNoTransform(res);
    this.loadEventStream.init(req, res);
  };

  public saveLoadEvent(event: ILoadEvent) {
    const loadEvent = new LoadEvent(event);
    loadEvent.save();
  }

  public publishLoadEvent = (event: ILoadEvent) => {
    this.loadEventStream.send(event);
  };

  public getCustomLoadAverage(
    minutes: number,
    onComplete: (res: number) => void
  ) {
    LoadEvent.find(
      {
        time: {
          $gte: moment()
            .subtract(minutes, "minutes")
            .toDate()
        }
      },
      (err, loadEvents: ILoadEvent[]) => {
        let average = 0;
        if (loadEvents.length > 0) {
          const sumOneMinute = loadEvents
            .map(event => event.oneMinuteLoadAverage)
            .reduce((sum, load) => (sum += load), 0);
          average = sumOneMinute / loadEvents.length;
        }
        onComplete(average);
      }
    );
  }

  /**
   * Workaround to ensure that server sent events are not
   * compressed/buffered by any reverse proxy's between the server and client
   * @param res Response
   */
  private ensureNoTransform(res: Response) {
    const originalSetHeader = res.setHeader.bind(res);
    const setHeaderOverride = (header: string, value: string) => {
      if (header === "Cache-Control") {
        originalSetHeader(header, "no-transform");
      } else {
        originalSetHeader(header, value);
      }
    };
    res.setHeader = setHeaderOverride;
  }
}
