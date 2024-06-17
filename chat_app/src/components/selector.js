import React, { useEffect , useState , useRef } from 'react';
import './selector.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';


export default function Selector({ setSelectedChat }) {
    const [contacts , setContacts] = useState([]);
    const [groups , setGroups] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState('close');
    const [grpmenuOpen , setGrpMenuOpen] = useState('close');
    const menuRef = useRef(null);
    const navigate = useNavigate();

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
    const toggleGrpMenuOpen = () => {
    
        if ( grpmenuOpen === 'open')
            setGrpMenuOpen('close');
        else
            setGrpMenuOpen('open');
    };

    const fetchData = async() => {
        try{
            const responce = await axios.get('http://localhost:3001/user/contacts' , {withCredentials : true});
            // console.log(responce.data.contacts);
            const newContacts = responce.data.contacts;
            if ( contacts!== newContacts){
                setContacts(newContacts);}


        }catch (e) {
            console.log(e);
        }
    }
    useEffect (() => {
        
        fetchData();
    }, []);
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
    
    const createGrp = async () => {
        let grpName = document.getElementById("search-new-grp").value;
        console.log(grpName);
        if (grpName){
            try{
                const res = await axios.post('http://localhost:3001/createGrp', {
                    grpName : grpName,
                    members : []
                }, {withCredentials : true});
                console.log(res);
                if (res.status === 200){
                    toast.success("group Created");
                    fetchData();
                }else {
                    toast.error("group could not be created");
                }

            } catch (e){
                console.log(e);
            }
        }
    }

    const addContact = async() => {
        let data = document.getElementById("search-new").value;
        
        console.log(data);
        if (data){  
            try{
                const responce = await axios.post('http://localhost:3001/user/contacts/add', {
                newData: data
                }, {withCredentials : true}); 
                if (responce.status === 201){
                    toast.success("user added");
                    fetchData();
                    console.log(responce);
                } else if (responce.status === 202) {
                    toast.error("user dont exist");
                    console.log("no user");
                    console.log(responce);
                } else if (responce.status === 203){
                    toast.error("user already added");
                    
                }
            } catch (e){console.log(e);}
            document.getElementById("search-new").value = "";
        }
        
    }
    const changeChat = async (key) => {
        console.log(key);
        try{
            const responce = await axios.post('http://localhost:3001/chatsTo' , {
                chatter : key
            }, {withCredentials : true});
            console.log(responce);
            console.log("key key key" + key)
            setSelectedChat(key);
        }catch (e){
            console.log(e);
        }
    }

    const logOut = async () => {
        try{
            const res = await axios.get('http://localhost:3001/logout' , {withCredentials : true});
            console.log(res);
            if (res.status === 200){
                console.log("logged out");
                setSelectedChat(null);
                setCurrentUser(null);
                setContacts([]);
                document.cookie = "loginStatus=failed; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";
                navigate("/");
                toast.success("logged out");
            } else{
                toast.error("couldnt log out");
            }
        }catch(e){
            console.log(e);
        }
    }
    
    return (
        <div className='selector'>
            <div className='info'>
            <h3>{currentUser}</h3>
            <button id='addContact' onClick={toggleMenuOpen}><FontAwesomeIcon className="plus" icon={faBars}/></button>
            </div>
            <div  ref={menuRef} className={`user-settings ${menuOpen}`} >
          {/*Stuff we need to add here : 
            Remove Chats button
            User info button
            block button
          */}
          {/* <div className='chat-setting-button'>Add new user</div> */}
          <div className='search-setting'><input type='text' id='search-new' placeholder='add user'></input>
          <button id='search-new-btn' onClick={addContact}><FontAwesomeIcon icon={faSearch}/></button></div>
          <div className='chat-setting-button'>Delete users</div>


          <div className='chat-setting-button' onClick={toggleGrpMenuOpen}>Create new Group</div>
          <div className={`search-setting ${grpmenuOpen}`}><input type='text' id='search-new-grp' placeholder='create Group'></input>
          <button id='search-new-btn' onClick={createGrp}><FontAwesomeIcon icon={faSearch}/></button></div>


          <div className='chat-setting-button'>Info</div>
          <div className='chat-setting-button' id='block' onClick={logOut}>Log Out </div>
          <div className='chat-setting-button' id='block'>Delete Account</div>
        </div>
            
            <div className='contact-names'>
                <div className='users'>
                    <div className='over'>
                    <span id='users-name'>Users</span>
                    {contacts.map(contact => (
                        <div className="user" key={contact} onClick={() => changeChat(contact)}>
                        {contact}
                        </div>
                        
                    ))}
                    </div>
                    
                </div>
                <div className='groups'>
                    <span id='grps-name'>Groups</span>
                </div>
            </div>
        </div>
        
    )
}
