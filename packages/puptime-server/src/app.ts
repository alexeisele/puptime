import * as os from "os";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Mongoose, connect, model } from "mongoose";
import { Routes } from "./routes/load-event-routes";
import { ILoadEvent } from "./models/load-event-model";
const LOAD_CHECK_INTERVAL = 10000;

class App {
  public app: express.Application;
  public routes: Routes = new Routes();
  public mongoUrl: string = "mongodb://localhost:27017/LoadDb";
  private dbConnection: Mongoose;
  private loadAverageCheck: NodeJS.Timeout;

  constructor(loadCheckInterval: number = LOAD_CHECK_INTERVAL) {
    this.app = express();
    this.config();
    this.routes.routes(this.app);
    this.mongoSetup(loadCheckInterval);
    process.on("SIGTERM", this.shutDown);
    process.on("SIGINT", this.shutDown);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private async mongoSetup(loadCheckInterval: number) {
    this.dbConnection = await connect(
      this.mongoUrl,
      { useNewUrlParser: true }
    );
    this.initializeLoadChecker(loadCheckInterval);
  }

  private initializeLoadChecker(loadCheckInterval: number) {
    this.loadAverageCheck = setInterval(this.checkLoad, loadCheckInterval);
  }

  private checkLoad = () => {
    console.log(`Checking system load.`);
    this.routes.loadEventController.getCustomLoadAverage(
      2,
      (twoMinuteLoadAverage: number) => {
        const [
          oneMinuteLoadAverage,
          fiveMinuteLoadAverage,
          fifteenMinuteLoadAverage
        ] = os.loadavg();
        const uptime = os.uptime();
        const cpuCount = os.cpus().length;
        const loadEvent: ILoadEvent = {
          time: new Date(),
          oneMinuteLoadAverage,
          twoMinuteLoadAverage:
            twoMinuteLoadAverage > 0
              ? twoMinuteLoadAverage
              : oneMinuteLoadAverage,
          fiveMinuteLoadAverage,
          fifteenMinuteLoadAverage,
          cpuCount,
          uptime
        };
        this.routes.loadEventController.publishLoadEvent(loadEvent);
        this.routes.loadEventController.saveLoadEvent(loadEvent);
      }
    );
  };

  private shutDown = () => {
    this.dbConnection.disconnect();
    clearInterval(this.loadAverageCheck);
  };
}

export default new App().app;
