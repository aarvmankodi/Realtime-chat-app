import React , {useState , useRef , useEffect}from 'react'
import './user.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faUser, faBan} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { toast } from 'react-toastify';

export default function User({talkingTo , User}) {
    const [menuOpen, setMenuOpen] = useState('close');
    const [email, setEmail] = useState('');
    const [grpMem , setGrpMem] = useState([]);
    const [infoMenu , setInfoMenu] = useState('close');
    const menuRef = useRef(null);
    const infoRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen('close');
        }
    };
    const handleClickOutsideInfo = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
          setInfoMenu('close');
      }
  };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutsideInfo);
      return () => {
          document.removeEventListener('mousedown', handleClickOutsideInfo);
      };
  }, []);

    const addUserToGrp = async () => {
      try{
        let user = prompt("add name of user to group?");
        console.log(user);

        let response = await axios.post("http://localhost:3001/addUserToGrp" , 
          {user , talkingTo} ,
          {withCredentials : true} )
          if (response.status === 200){
            console.log(response)
            console.log(`${user} added to ${talkingTo.chatter}`);
            toast.success(`${user} added to ${talkingTo.chatter}`);
            setGrpMem(response.data.members);
            console.log("gg" , grpMem);




          } else if (response.status === 210){
            toast.error("User does not exist");
          } else if (response.status === 218){
            toast.error("User already added to grp");
          }
          
          else {
            console.log("response failed");
            console.log(response);
            toast.error("user not added");
          }
      }catch(e){
        console.log(e);
        toast.error("some error occured");
      }
    }

    const getGrpMem = async () => {
      try{
        let response = await axios.get('http://localhost:3001/grpMem' , 
          { params : {
            chatter : talkingTo.chatter} , 
          withCredentials : true});
        console.log(response.data.members);
        if (response.status === 200){
          setGrpMem(response.data.members);
          console.log("gg" , grpMem);
        }
      }catch(e){
        console.log(e);
      }
    }

    const getMembers = async () => {
      try{
        let response = await axios.get('http://localhost:3001/getMembers' , 
          {
            params : {
              chattingTo : talkingTo.chatter
            },
            withCredentials : true,
          });
          console.log(response);
          if (response.status === 200){
            console.log(response.data.name);
            console.log(response.data.email);
            console.log("success");
            
          }else {
            console.log("failure");
          }

      } catch(e){
        console.log(e);
      }
    }
    const toggleInfoMenuOpen = () => {
    
      if ( infoMenu === 'open')
          setInfoMenu('close');
      else
          setInfoMenu('open');
  };
    const toggleMenuOpen = () => {
    
        if ( menuOpen === 'open')
            setMenuOpen('close');
        else
            setMenuOpen('open');
    }; 

    const removeUser = async () => {
      const abc = window.confirm("are you sure?");
      if (abc){
        try{
        
          const response = await axios.post("http://localhost:3001/removeUser" , 
            {
              user : User , 
              talkingTo : talkingTo
            },
            {withCredentials : true});
            console.log(response);
            if (response.status === 200){
              toast.success('Chat have been deleted');
              window.location.reload();
            } else {
              toast.error("some failure has occured");
            }
        }catch(e){
          console.log(e);
        }
      } 
    }
    const getInfo = async () => {
      try{
        const res = await axios.get("http://localhost:3001/getInfo" , 
          {withCredentials : true ,
            params : {
              user : talkingTo
            }
          }
        );
        console.log(res);
        if (res.status == 200){
          
          setEmail(res.data.email);
          toggleInfoMenuOpen();
        }
      }catch(e){
        console.log(e)
      }
    }

    return (
      <div className={`user-info ${talkingTo.chatter == null ? 'hide' : 'nothing'}`}>
          <div className='user-icon'><FontAwesomeIcon icon={faUser}/></div>
          <div className='user-name'>{talkingTo.chatter}</div>
          <button id='toggle-chat-settings' onClick={toggleMenuOpen}><FontAwesomeIcon className="plus" icon={faEllipsisVertical} /></button>
          <div ref={menuRef} className={`chat-settings ${menuOpen}`}>
            <div className='chat-setting-button' onClick={getInfo}>Info</div>
            <div className='chat-setting-button' id='block' onClick={removeUser}>Remove </div>
            <div className={`chat-setting-button ${talkingTo.type == 'contact' ? 'hide' : 'nothing'}`} onClick={addUserToGrp}>Add Users</div>
          </div>

          <div ref={infoRef}className={`info-area chat-settings ${infoMenu}`}>
          <div className='user-info-icon-container'>
            <div className='user-info-icon'><FontAwesomeIcon icon={faUser}/></div>
          </div>
          
          
          <div className='user-name-info'>{talkingTo.chatter}</div>
          <div className='user-email-info'>aarvmankodi06@gmail.com</div>
          </div>
      </div>
    )
}