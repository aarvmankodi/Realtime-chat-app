import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Selector from './components/selector';
import Main from './components/main';
import Login from './components/login';
import SignUp from './components/signup';
function App() {
  document.cookie = "loginStatus=failed; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path="/login" element={<Login/>} />
          <Route path="/signUp" element={<SignUp/>} />
        </Routes>
        <ToastContainer/>
    </Router>
    </>
  );
}

export default App;
