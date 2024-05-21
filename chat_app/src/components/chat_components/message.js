import React from 'react'
import './message.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
export default function Message() {
  return (
    <div className='message'>
        <input className='messagebox' name='message' placeholder='whats on your mind?'/>

        <button className='send'><FontAwesomeIcon icon={faPaperPlane}/></button>        
    </div>
  )
}
