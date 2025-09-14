import { useContext } from "react";
import "./App.css";
import AuthContext from "./contexts/AuthContext";
import {  BrowserRouter as Router, Routes , Route } from "react-router-dom";

function App() {

  const user = useContext(AuthContext);
  console.log(user);

  return (
    <Router>

      <Routes>

        <Route path="/" element={<div>Home page</div>} />
        <Route path="/about" element={<div>About us page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
