import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Selector from './components/selector';
import Main from './components/main';
import Login from './components/login';
import SignUp from './components/signup';
function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path='/chats' element={<Main/>}/>
        <Route path="/" element={<Login/>} />
          <Route path="/signUp" element={<SignUp/>} />
        </Routes>
        <ToastContainer/>
    </Router>
    </>
  );
}

export default App;
