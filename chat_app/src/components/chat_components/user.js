import React , {useState , useRef , useEffect}from 'react'
import './user.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faUser, faBan} from '@fortawesome/free-solid-svg-icons'
export default function User({talkingTo}) {
  const [menuOpen, setMenuOpen] = useState('close');

  const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen('close');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


  const toggleMenuOpen = () => {
   
      if ( menuOpen === 'open')
          setMenuOpen('close');
      else
          setMenuOpen('open');
  }; 

  return (
    <div className={`user-info ${talkingTo.chatter == null ? `hide` : `nothing`}`}>
        <div className='user-icon'><FontAwesomeIcon icon={faUser}/></div>
        <div className='user-name'>{talkingTo.chatter}</div>
        <button id='toggle-chat-settings' onClick={toggleMenuOpen}><FontAwesomeIcon className="plus" icon={faEllipsisVertical} /></button>
        <div ref={menuRef} className={`chat-settings ${menuOpen}`}>
          {/*Stuff we need to add here : 
            Remove Chats button
            User info button
            block button
          */}
          <div className='chat-setting-button'>Delete Chats</div>
          <div className='chat-setting-button'>Info</div>
          <div className='chat-setting-button' id='block'>Block </div>
        </div>
    </div>
  )
}
