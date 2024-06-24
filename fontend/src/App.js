// src/App.js
import React from "react";
import "./App.css";
import Task from "./components/Task";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <div className="app">
      <Task />
    </div>
  );
};

export default App;
