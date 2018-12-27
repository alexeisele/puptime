import * as React from "react";
import { inject, observer } from "mobx-react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { LoadEventStore } from "../../stores/load-event-store";
import { secondsToDhms } from "../../utils";

import "./Metrics.css";

export interface IMetricsProps {
  loadEventStore?: LoadEventStore;
}

@inject("loadEventStore")
@observer
class Metrics extends React.Component<IMetricsProps> {
  public render() {
    const { loadEventStore } = this.props;
    return (
      <div className="metrics-container">
        <Card className="metrics-card">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Number of CPUs
            </Typography>
            <Typography variant="h5" component="h2">
              {loadEventStore && loadEventStore.cpuCount}
            </Typography>
          </CardContent>
        </Card>
        <Card className="metrics-card">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Uptime
            </Typography>
            <Typography variant="h5" component="h2">
              {loadEventStore && secondsToDhms(loadEventStore.uptime)}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default Metrics;
