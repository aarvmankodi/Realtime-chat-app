import React , {useState , useRef , useEffect}from 'react'
import './user.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faUser, faUserGroup, faSearch} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { toast } from 'react-toastify';

export default function User({talkingTo , User}) {
    const [menuOpen, setMenuOpen] = useState('close');
    const [email, setEmail] = useState('');
    const [grpMem , setGrpMem] = useState([]);
    const [infoMenu , setInfoMenu] = useState('close');
    const [grpmenuOpen , setGrpMenuOpen] = useState('close');

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
        let user = document.getElementById("search-new-user-grp").value;
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
          document.getElementById("search-new-user-grp").value = "";
      }catch(e){
        console.log(e);
        toast.error("some error occured");
      }
    }
    const getInfo = async () => {
      try{
        if (talkingTo.type == 'contact'){
        
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
        } else if (talkingTo.type == 'group'){
          let response = await axios.get('http://localhost:3001/grpMem' , 
            { params : {
              chatter : talkingTo.chatter} , 
            withCredentials : true});
          console.log(response.data.members);


          if (response.status === 200){
            setGrpMem(response.data.members);
            console.log("gg" , grpMem);
            toggleInfoMenuOpen();
          }
        }
      }
      catch(e){
        console.log(e)
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
    const toggleGrpMenuOpen = () => {
    
      if ( grpmenuOpen === 'open')
          setGrpMenuOpen('close');
      else
          setGrpMenuOpen('open');
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
    

    return (
      <div className={`user-info ${talkingTo.chatter == null ? 'hide' : 'nothing'}`}>
          <div className={`user-icon ${talkingTo.type == 'group' ? 'hide' : 'nothing'}`}><FontAwesomeIcon icon={faUser}/></div>
          <div className={`user-icon ${talkingTo.type == 'contact' ? 'hide' : 'nothing'}`}><FontAwesomeIcon icon={faUserGroup}/></div>
          <div className='user-name'>{talkingTo.chatter}</div>
          <button id='toggle-chat-settings' onClick={toggleMenuOpen}><FontAwesomeIcon className="plus" 
          
           icon={faEllipsisVertical} /></button>
          <div ref={menuRef} className={`chat-settings ${menuOpen}`}>
            <div className='chat-setting-button' onClick={getInfo}>Info</div>
            <div className='chat-setting-button' id='block' onClick={removeUser}>Remove</div>
            <div className={`chat-setting-button ${talkingTo.type == 'contact' ? 'hide' : 'nothing'}`} onClick={toggleGrpMenuOpen}>Add Users</div>
            <div className={`search-setting ${grpmenuOpen}`}>
              <input type='text' id='search-new-user-grp' placeholder='add user'></input>
          <button id='search-new-btn' onClick={addUserToGrp}><FontAwesomeIcon icon={faSearch}/></button></div>
          </div>
          

          <div ref={infoRef}className={`info-area chat-settings ${infoMenu}`}>  
          <div className={`user-info-icon-container  ${talkingTo.type == 'group' ? 'hide' : 'nothing'}`}>
          <div className={`user-info-icon`}><FontAwesomeIcon icon={faUser}/></div>
          
          </div>
          <div className={`user-info-icon-container  ${talkingTo.type == 'contact' ? 'hide' : 'nothing'}`}>
          <div className={`user-info-icon`}><FontAwesomeIcon icon={faUserGroup}/></div>
          
          </div>
          
          
          
          <div className='user-name-info'>{talkingTo.chatter}</div>
          <div className={`user-email-info ${talkingTo.type == 'group' ? 'hide' : 'nothing'}`} >{email}</div>
          
          </div>
      </div>
    )
}