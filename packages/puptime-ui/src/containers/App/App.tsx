import * as React from "react";
import { Provider } from "mobx-react";
import { LoadEventStore } from "../../stores/load-event-store";
import AppBar from "../../components/AppBar";
import Metrics from "../Metrics/Metrics";
import LoadInfo from "../LoadInfo/LoadInfo";
import Notifications from "../Notifications/Notifications";

import "./App.css";

class App extends React.Component {
  private loadEventStore: LoadEventStore = new LoadEventStore();

  public componentDidMount() {
    this.loadEventStore.retrieveLoadEvents();
  }

  public componentWillUnmount() {
    this.loadEventStore.dispose();
  }

  public render() {
    return (
      <Provider loadEventStore={this.loadEventStore}>
        <div className="app">
          <header className="app-header">
            <AppBar />
          </header>
          <div className="app-body">
            <div className="app-content">
              <Metrics />
              <LoadInfo />
            </div>
            <Notifications />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
