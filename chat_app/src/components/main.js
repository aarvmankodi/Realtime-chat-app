import React ,{ useEffect }from 'react';
import Selector from './selector';
import Chat from './Chat';
import { useNavigate } from 'react-router-dom';

export default function Main() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const loginStatus = getCookie("loginStatus");
    if (loginStatus !== "success") {
      navigate("/");
    }
  }, [navigate]);

  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return "";
  };
  return (
    <>
    <Selector/>
    <Chat />
    </>
  )
}
