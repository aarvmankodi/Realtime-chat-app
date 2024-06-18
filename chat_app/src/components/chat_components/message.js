import React , {useState , useRef , useEffect} from 'react'
import './message.css';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane , faFaceSmile} from '@fortawesome/free-regular-svg-icons'
import  Picker  from '@emoji-mart/react';
import data from '@emoji-mart/data';



export default function Message( {onSendMessage}) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const menuRef = useRef(null);
  

  const handleClickOutsideMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => {
        document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, []);


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
 
  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
    // setShowEmojiPicker(false);
  };
    
     
    
    
  

  return (
    <div className='message'>
        <input value = {message} onChange={(e) => setMessage(e.target.value)} className='messagebox' name='message' placeholder={`whats on your mind?`}/>
        <button className='send' onClick={() => setShowEmojiPicker(!showEmojiPicker)}><FontAwesomeIcon icon={faFaceSmile}/></button>
        <button className='send' onClick={handleSubmit}><FontAwesomeIcon icon={faPaperPlane}/></button> 
        <div className={showEmojiPicker?'emoji' : 'd-none'} ref={menuRef}> <Picker data={data}
        onEmojiSelect={
          handleEmojiSelect
        }/></div>       
    </div>
  )
}
