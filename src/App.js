import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainMenu from './components/sharedComponents/MainMenu';
import UserMenu from './components/sharedComponents/UserMenu';
import React, { useState, useEffect } from 'react';
import Switches from "./Utils/Switches";
import axios from "axios";

axios.defaults.withCredentials=true

function App() {

  return (
    <div className="App">

      <div>
        <MainMenu />
        <UserMenu />
      </div>
        <Switches/>
    </div>
  );
}

export default App;
