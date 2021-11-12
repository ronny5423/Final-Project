import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainMenu from './components/sharedComponents/MainMenu';
import UserMenu from './components/sharedComponents/UserMenu';
import Login from './components/sharedComponents/Login'
import {Route, Switch} from "react-router-dom";
import About from "./components/pageComponents/About";
import ContactForm from "./components/pageComponents/ContactUs";
import UmlEditor from "./components/pageComponents/UmlEditor";
import SqlEditor from "./components/pageComponents/SqlEditor";
import React from "react";
import SignUp from "./components/pageComponents/SignUp";


function App() {
  let isLoggedIn = false;
  return (
    <div className="App">
      <div>
        <MainMenu />
        <UserMenu />
      </div>
        <Switch>
            <Route path="/home" >
                <Login></Login>
            </Route>
            <Route path={"/about"}>
                <About/>
            </Route>
            <Route path={"/contact"}>
                <ContactForm/>
            </Route>
            <Route path="/UmlEditor" >
                <UmlEditor></UmlEditor>
            </Route>
            <Route path="/SqlEditor" >
                <SqlEditor></SqlEditor>
            </Route>
            <Route>
                <SignUp/>
            </Route>
        </Switch>
    </div>
  );
}

export default App;
