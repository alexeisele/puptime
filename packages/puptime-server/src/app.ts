import * as os from "os";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Mongoose, connect, model } from "mongoose";
import { Routes } from "./routes/load-event-routes";
import { LoadEventSchema, ILoadEvent } from "./models/load-event-model";
const LOAD_CHECK_INTERVAL = 10000;
const LoadEvent = model("LoadEvent", LoadEventSchema);

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
    const [
      oneMinuteLoadAverage,
      fiveMinuteLoadAverage,
      fifteenMinuteLoadAverage
    ] = os.loadavg();
    const uptime = os.uptime();
    const cpuCount = os.cpus().length;
    const loadEvent: ILoadEvent = {
      time: Date.now(),
      oneMinuteLoadAverage,
      fiveMinuteLoadAverage,
      fifteenMinuteLoadAverage,
      cpuCount,
      uptime
    };
    console.log(`Sending and saving load event - ${JSON.stringify(loadEvent)}`);
    this.broadCastLoadEvent(loadEvent);
    this.saveLoadEvent(loadEvent);
  };

  private broadCastLoadEvent(event: ILoadEvent) {
    this.routes.loadEventController.publishLoadEvent(event);
  }

  private saveLoadEvent(event: ILoadEvent) {
    const loadEvent = new LoadEvent(event);
    loadEvent.save();
  }

  private shutDown = () => {
    this.dbConnection.disconnect();
    clearInterval(this.loadAverageCheck);
  };
}

export default new App().app;
