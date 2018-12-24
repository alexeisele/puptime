import { Schema } from "mongoose";

export interface ILoadEvent {
  time: number;
  oneMinuteLoadAverage: number;
  fiveMinuteLoadAverage: number;
  fifteenMinuteLoadAverage: number;
  cpuCount: number;
  uptime: number;
}

export const LoadEventSchema = new Schema({
  time: {
    type: Date,
    default: Date.now
  },
  oneMinuteLoadAverage: {
    type: Number
  },
  fiveMinuteLoadAverage: {
    type: Number
  },
  fifteenMinuteLoadAverage: {
    type: Number
  },
  cpuCount: {
    type: Number
  },
  uptime: {
    type: Number
  }
});
