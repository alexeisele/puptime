import React from "react";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Chart,
  LineSeries,
  ArgumentAxis,
  ValueAxis,
  Title,
  Legend
} from "@devexpress/dx-react-chart-material-ui";
import { inject, observer } from "mobx-react";
import { LoadEventStore } from "../../stores/load-event-store";

import "./LoadInfo.css";

export interface ILoadInfoProps {
  loadEventStore?: LoadEventStore;
}

@inject("loadEventStore")
@observer
class LoadInfo extends React.Component<ILoadInfoProps> {
  public render() {
    const { loadEventStore } = this.props;
    const data = loadEventStore ? loadEventStore.loadEvents.slice() : [];
    const loading = loadEventStore ? loadEventStore.loading : true;
    return (
      <div className="load-info-container">
        <Paper>
          {loading ? (
            <CircularProgress />
          ) : (
            <Chart data={data}>
              {/* <ArgumentAxis /> */}
              <ValueAxis />
              <LineSeries
                valueField="oneMinuteLoadAverage"
                argumentField="time"
                name="1 Minute"
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
          )}
        </Paper>
      </div>
    );
  }
}

export default LoadInfo;
