import React, { useEffect, useState , useRef} from 'react';
import './chat.css';
import io from 'socket.io-client';
import axios from 'axios';
import Message from './chat_components/message';
import User from './chat_components/user';
import { toast } from 'react-toastify'; 

// Ensure withCredentials is set to true
const socket = io('http://localhost:3001', {
  withCredentials: true,
});

export default function Chat({ selectedChat }) {
  const clearMessages = () => {
    setMessages([]);
  };
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const chatContainerRef = useRef(null);



  useEffect(() => {
    if (currentUser && selectedChat != {}) {
      socket.emit('join room', { currentUser, chatter : selectedChat.chatter }); 
      
    }
  }, [selectedChat, currentUser]);
  

  
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      console.log(selectedChat);
      if (currentUser && selectedChat) {
        socket.emit('join room', { currentUser, chatter : selectedChat.chatter }); 
      }
    });
  
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  
    socket.on('chat message', (msg) => {
      console.log("Received message: ????", msg);
      msg.msgs.forEach(message => {
        setMessages((prevMessages) => [...prevMessages ,{
          text : message.message,
          sender : message.sender
        }])
      })

      
  
    });
  
    socket.on('clear chat', () => {
      console.log("Clearing chat");
      setMessages([]);
    });
  
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('chat message');
    };
  }, [selectedChat]);
 

  useEffect(() => {
    const getMessages = () => {
      console.log("sending the parameter", selectedChat);
      axios.get('http://localhost:3001/getMsg', {
        withCredentials: true,
        params: { chatName: selectedChat.chatter }
      })
      .then(response => {
        console.log("Response received:", response);

        let msgs = response.data.messagesSent;
        let chatTo = response.data.chatTo;       
        
        console.log("?????????????" , msgs);
        clearMessages();
        
        handleSendMessage(msgs , chatTo);
        
      })
      .catch(e => {
        console.error("Error while fetching messages:", e);
      });
    }

    if (selectedChat) {
      console.log("Selected chat:", selectedChat);
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
  
 

  const handleSendMessage = (msgs, chatTo) => { 
    console.log("Sending message:", msgs);
    console.log("selected chat", chatTo);
    if (chatTo !== 'default'){
      
      socket.emit('chat message', { chatTo, currentUser, msgs });
    } else{
      console.log("no user selected");
    }
    
  };
  
  return (
    <div className='chat'>
      <User talkingTo={selectedChat}/>
      <div className='outerchat' ref={chatContainerRef}>
      <ul className='list'>
        {messages.map((msg, index) => (
          <div className='chat-messages'>
            <li key={index}  className={`${msg.sender === currentUser ? 'self' : 'other'}`}>{msg.text}</li>
           <li key={index+100}className={`sender ${msg.sender === currentUser ? 'self-user' : 'other-user'}`}>
           {msg.sender === currentUser ? 'you' : msg.sender}
            </li>
          </div>
          
        ))}
      </ul>
      </div>
      
      <Message onSendMessage={handleSendMessage}/>
    </div>
  );
}
