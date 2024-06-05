import React , {useState} from 'react'
import './message.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
export default function Message( {onSendMessage}) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage('');
  };


  return (
    <div className='message'>
        <input value = {message} onChange={(e) => setMessage(e.target.value)} className='messagebox' name='message' placeholder='whats on your mind?'/>

        <button className='send' onClick={handleSubmit}><FontAwesomeIcon icon={faPaperPlane}/></button>        
    </div>
  )
}
