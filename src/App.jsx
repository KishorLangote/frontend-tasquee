import Home from "./components/Home";
import Login from "./components/Login";
import PageNotFound from "./components/PageNotFound";
import Signup from "./components/Signup";
import {Navigate, Routes, Route} from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState()

  useEffect(() => {
    const token = localStorage.getItem("jwt")
    setToken(token)
  }, [])
 
  return (
    <>
      <div>
       <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={() =>setToken(localStorage.getItem("jwt"))} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
       </Routes>
       <Toaster />
      </div>
    </>
  );
}

export default App;
