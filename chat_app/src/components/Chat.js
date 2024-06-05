// import React, { useEffect, useState } from 'react';
// import './chat.css';
// import io from 'socket.io-client';


// import Message from './chat_components/message';
// import User from './chat_components/user';


// const socket = io('http://localhost:3001/');


// export default function Chat() {
//   const [messages, setMessages] = useState([]);
  
  
//   useEffect(() => {
//     socket.on('chat message', (msg) => {
//       console.log("done")
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     return () => {
//       socket.off('chat message');
//     };
//   }, []);

//   const handleSendMessage = (message) => {
//     console.log("sdf")
//     socket.emit('chat message', message);
//   };

//   return (

//     <div className='chat'>
//         <User/>
//         <ul>
//         {messages.map((msg, index) => (
//           <li className='chat-messages' key={index}>{msg}</li>
//         ))}
//       </ul>
//         <Message onSendMessage={handleSendMessage}/>
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react';
import './chat.css';
import io from 'socket.io-client';

import Message from './chat_components/message';
import User from './chat_components/user';

const socket = io('http://localhost:3001');

export default function Chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('chat message', (msg) => {
      console.log("Received message:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('chat message');
    };
  }, []);

  const handleSendMessage = (message) => {
    console.log("Sending message:", message);
    socket.emit('chat message', message);
  };

  return (
    <div className='chat'>
      <User/>
      <ul>
        {messages.map((msg, index) => (
          <li className='chat-messages' key={index}>{msg}</li>
        ))}
      </ul>
      <Message onSendMessage={handleSendMessage}/>
    </div>
  );
}
