import React from 'react'
import './chat.css';
import Message from './chat_components/message';
import User from './chat_components/user';
export default function Chat() {
  return (

    <div className='chat'>
        <User/>
        Chat
        <Message/>
    </div>
  )
}
