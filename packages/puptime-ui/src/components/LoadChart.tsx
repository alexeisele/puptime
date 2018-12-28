import React from "react";
import {
  Chart,
  LineSeries,
  ArgumentAxis,
  ValueAxis,
  Title,
  Legend
} from "@devexpress/dx-react-chart-material-ui";
import { ArgumentScale } from "@devexpress/dx-react-chart";
import { scaleTime } from "d3-scale";
import { timeSecond, TimeInterval } from "d3-time";
import { ILoadEvent } from "../stores/load-event";

export interface ILoadChartProps {
  loadEvents: ILoadEvent[];
}

const timeScale = () => {
  const scale = scaleTime();
  scale.ticks(timeSecond.every(10) as TimeInterval);
  return scale;
};

const LoadChart = (props: ILoadChartProps) => (
  <Chart data={props.loadEvents}>
    <ArgumentScale factory={timeScale as any} />
    <ArgumentAxis />
    <ValueAxis />
    <LineSeries
      valueField="oneMinuteLoadAverage"
      argumentField="time"
      name="1 Minute"
    />
    <LineSeries
      valueField="twoMinuteLoadAverage"
      argumentField="time"
      name="2 Minutes"
    />
    <LineSeries
      valueField="fiveMinuteLoadAverage"
      argumentField="time"
      name="5 Minutes"
    />
    <LineSeries
      valueField="fifteenMinuteLoadAverage"
      argumentField="time"
      name="15 Minutes"
    />
    <Legend />
    <Title text="Machine Load Average" />
  </Chart>
);

export default LoadChart;
