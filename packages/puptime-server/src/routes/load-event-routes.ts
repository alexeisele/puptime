import { Request, Response, NextFunction, Application } from "express";
import { LoadEventController } from "../controllers/load-event-controller";

export class Routes {
  public loadEventController: LoadEventController = new LoadEventController();

  public routes(app: Application): void {
    app.route("/").get((req: Request, res: Response) => {
      res.status(200).send({
        message: "GET request successfulll!!!!"
      });
    });

    app
      .route("/load-events")
      .get((req: Request, res: Response, next: NextFunction) => {
        // middleware
        console.log(`Request from: ${req.originalUrl}`);
        console.log(`Request type: ${req.method}`);
        next();
      }, this.loadEventController.getLoadEvents);

    app
      .route("/load-events/stream")
      .get(this.loadEventController.streamLoadEvents);
  }
}
