import { MainPage } from "./components/pages/MainPage/MainPage.tsx";
import NetworkPage from "./components/pages/networks/NetworkPage.js";
import TimeWarpPage from "./components/pages/TimeWarpPage.js";
import StatusPage from "./components/pages/Status/StatusPage.tsx";
import RegisterL2Page from "./components/pages/RegisterL2Page.tsx";
import React from "react";
import { Routes, Route, Router, Switch } from "react-router-dom";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Switch>
          <Route exact path="/" component={MainPage}></Route>
          <Route path="/Network/" component={NetworkPage}></Route>
          <Route path="/TimeWarp/" component={TimeWarpPage}></Route>
          <Route path="/Status/" component={StatusPage}></Route>
          <Route path="/register-l2/" component={RegisterL2Page}></Route>
        </Switch>
      </>
    );
  }
}
