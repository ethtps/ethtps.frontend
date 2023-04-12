import { MainPage } from "./components/pages/MainPage/MainPage.tsx";
import NetworkPage from "./components/pages/networks/NetworkPage.js";
import StatusPage from "./components/pages/Status/StatusPage.tsx";
import RegisterL2Page from "./components/pages/RegisterL2Page.tsx";
import {  Route, Switch } from "react-router-dom";

export function Main(){
  return (
    <>
      <Switch>
        <Route path="/" children={<MainPage/>}></Route>
        <Route path="/Network/" children={<NetworkPage/>}></Route>
        <Route path="/Status/" children={<StatusPage/>}></Route>
        <Route path="/register-l2/" children={<RegisterL2Page/>}></Route>
      </Switch>
    </>
  );
}