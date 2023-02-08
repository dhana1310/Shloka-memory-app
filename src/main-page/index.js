import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import React from "react";
// import Header from "./Header";
import AddToList from "./AddToList";
// import MainPage from "./MainPage";

import DisplayGita from "./DisplayGita";
import ButtonAppBar from "./ButtonAppBar";
import JapaPage from "./JapaPage";

const App = (props) => {
  return (
      <Router>
        <ButtonAppBar />
        <div className="container">
          <div className="App">
            {/* <Header subtitle="Welcome to the app" /> */}

            <Routes>
              <Route path="/addToList/:shortCode" element={<AddToList />} />
              <Route path="/addToList" element={<AddToList />} />

              {/* <Route path="/start" element={<DisplayGita />} /> */}
              <Route path="/test" element={<DisplayGita />} />
              <Route path="/" element={<JapaPage />} />
              {/* <Route path="/" element={<MainPage />} /> */}
            </Routes>
          </div>
        </div>
      </Router>
  );
};

export default App;
