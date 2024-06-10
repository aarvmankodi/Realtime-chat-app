import React, { useEffect, useState } from 'react';
import './chat.css';
import io from 'socket.io-client';
import axios from 'axios';
import Message from './chat_components/message';
import User from './chat_components/user';
import { toast } from 'react-toastify'; 


const socket = io('http://localhost:3001');

export default function Chat({ selectedChat }) {
  const clearMessages = () => {
    setMessages([]);
  };
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('chat message', (msg) => {
      {
        console.log("Received message:", msg);
      
      setMessages((prevMessages) => [...prevMessages, msg.message]);
      }
      
      socket.on('clear chat', () => {
        console.log("Clearing chat");
    
        setMessages([]);
      });
      
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('chat message');
    };
  }, []);
 
  useEffect(() => {
    
    const getMessages = async() => {
      try{
        console.log("sending the parameter" , selectedChat);
        const responce = await axios.get('http://localhost:3001/getMsg' , {withCredentials : true,
          params: { chatName: selectedChat }
        });
        console.log(responce);
        let msgs = responce.data.messagesSent;
        clearMessages();
        for (let message of msgs){
          console.log("the message is " + message);
          handleSendMessage(message);
          // socket.emit('chat message',  {selectedChat , currentUser ,message});
        }
      }catch(e){
        console.log(e);
      }
    }

    if (selectedChat) {
      console.log("selected chat " + selectedChat)
      // socket.emit('join room', selectedChat);
      clearMessages();
      getMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getCurrentUser', { withCredentials: true });
        console.log("the current user is " + response.data.username);
        setCurrentUser(response.data.username);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    getCurrentUser();
  }, []);
  
  const handleSendMessage = (message) => { 
    console.log("Sending message:", message);
    console.log("selected chat dsgsdg " + selectedChat)
    socket.emit('clear chat');
    socket.emit('chat message',  {selectedChat , currentUser ,message});
  };

  return (
    <div className='chat'>
      <User talkingTo={selectedChat}/>
      <ul>
        {messages.map((msg, index) => (
          <li className='chat-messages' key={index}>{msg}</li>
        ))}
      </ul>
      <Message onSendMessage={handleSendMessage}/>
    </div>
  );
}
