import React , {useState , useEffect} from 'react'
import './message.css';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'



export default function Message( {onSendMessage}) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      console.log(message);
      const responce = await axios.post('http://localhost:3001/sendMsg',{ sentMsg : message }, {withCredentials : true});
      if (responce.status === 200){
        
        const sentMsg  = [ responce.data.message];
        console.log("klkkkkkkkk" , sentMsg);
        onSendMessage(sentMsg , responce.data.chatTo);
      } else if (responce.status === 202){
        toast.error("no user selected");
      }
    }catch(e){
      console.log(e);
      toast.error("message not sent");
    }
    setMessage('');
  };
 
    
    
     
    
    
  

  return (
    <div className='message'>
        <input value = {message} onChange={(e) => setMessage(e.target.value)} className='messagebox' name='message' placeholder='whats on your mind?'/>

        <button className='send' onClick={handleSubmit}><FontAwesomeIcon icon={faPaperPlane}/></button>        
    </div>
  )
}
