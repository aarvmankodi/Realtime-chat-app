import React, { useEffect , useState } from 'react';
import './selector.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faU, faUser } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'; 

export default function Selector({ setSelectedChat }) {
    const [contacts , setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
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

    const addContact = async() => {
        let data = prompt("enter name");
        console.log(data);
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
    return (
        <div className='selector'>
            <div className='info'>
            <h3>{currentUser}</h3>
            <button className='user-icon' id='addContact' onClick={addContact}><FontAwesomeIcon icon={faUser}/></button>
            </div>
            
            <div className='users'>
                {contacts.map(contact => (
                    <div className="user" key={contact} onClick={() => changeChat(contact)}>
                    {contact}
                    </div>
                    
                ))}
            </div>
        </div>
        
    )
}
