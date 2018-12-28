import * as React from "react";
import { inject, observer } from "mobx-react";
import { LoadEventStore } from "../../stores/load-event-store";
import Notification from "../../components/Notification";
import { Theme, withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import "./Notifications.css";

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  }
});

export interface INotificationsProps {
  loadEventStore?: LoadEventStore;
  classes: { [key: string]: string };
}

@inject("loadEventStore")
@observer
class Notifications extends React.Component<INotificationsProps> {
  public render() {
    const { loadEventStore, classes } = this.props;
    const notifications = loadEventStore ? loadEventStore.notifications : [];
    return (
      <Paper className="notifications-container">
        <Typography
          variant="h6"
          color="inherit"
          className="notifications-title"
        >
          Load Alerts
        </Typography>
        {notifications.map(notification => (
          <Notification
            key={notification.message}
            className={classes.margin}
            variant={notification.type}
            message={notification.message}
          />
        ))}
      </Paper>
    );
  }
}

export default withStyles(styles)(Notifications);
