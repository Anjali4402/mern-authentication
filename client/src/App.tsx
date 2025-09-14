import { useContext } from "react";
import "./App.css";
import AuthContext from "./contexts/AuthContext";

function App() {

  const user = useContext(AuthContext);

  return (
    <>
      <h1>Mern Authentication</h1>
      <h2>User is {user?.isAuthenticated ? "" : "not"} authenticated.</h2>
    </>
  );
}

export default App;
