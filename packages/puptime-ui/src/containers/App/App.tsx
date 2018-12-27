import * as React from "react";
import { Provider } from "mobx-react";
import { LoadEventStore } from "../../stores/load-event-store";
import AppBar from "../../components/AppBar";
import Metrics from "../Metrics/Metrics";
import LoadInfo from "../LoadInfo/LoadInfo";

import "./App.css";

class App extends React.Component {
  private loadEventStore: LoadEventStore = new LoadEventStore();

  public componentDidMount() {
    this.loadEventStore.retrieveLoadEvents();
  }

  public render() {
    return (
      <Provider loadEventStore={this.loadEventStore}>
        <div className="App">
          <header className="App-header">
            <AppBar />
          </header>
          <div className="App-body">
            <Metrics />
            <LoadInfo />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
