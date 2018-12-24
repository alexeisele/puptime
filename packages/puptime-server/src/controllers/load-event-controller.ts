import * as mongoose from "mongoose";
import { Request, Response } from "express";
import SSE = require("express-sse");
import { LoadEventSchema, ILoadEvent } from "./../models/load-event-model";

const LoadEvent = mongoose.model("LoadEvent", LoadEventSchema);

export class LoadEventController {
  private loadEventStream: SSE = new SSE();

  public getLoadEvents(req: Request, res: Response) {
    LoadEvent.find({}, (err, loadEvent) => {
      if (err) {
        res.send(err);
      }
      res.json(loadEvent);
    });
  }

  public streamLoadEvents(req: Request, res: Response) {
    this.loadEventStream.init(req, res);
  }

  public publishLoadEvent(event: ILoadEvent) {
    this.loadEventStream.send(event);
  }
}
