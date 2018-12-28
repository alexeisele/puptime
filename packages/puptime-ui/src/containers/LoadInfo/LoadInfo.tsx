import React from "react";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { inject, observer } from "mobx-react";
import { LoadEventStore } from "../../stores/load-event-store";
import LoadChart from "../../components/LoadChart";

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
      <Paper className="load-info-container">
        {loading ? <CircularProgress /> : <LoadChart loadEvents={data} />}
      </Paper>
    );
  }
}

export default LoadInfo;
