import './App.css';
import React, {useState} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Login from "./Component/login";
import {Routes} from "react-router";
import Homepage from "./Component/Home";
import Register from "./Component/Register"


function App() {
    const user = JSON.parse(localStorage.getItem("loginUser")) || null;
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/" element={<Homepage user={user} />}></Route>
                </Routes>
            </Router>
        </div>
    )
}

export default App;
