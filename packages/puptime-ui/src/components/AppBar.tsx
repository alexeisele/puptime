import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

export default () => (
  <AppBar position="static">
    <Toolbar>
      <Avatar aria-label="PuptimeLogo" style={{ marginRight: "1rem" }}>
        <img src="/pp-icon.png" height="42" width="42" />
      </Avatar>
      <Typography variant="h5" color="inherit">
        Puptime - Fetch and Monitor Load
      </Typography>
    </Toolbar>
  </AppBar>
);
