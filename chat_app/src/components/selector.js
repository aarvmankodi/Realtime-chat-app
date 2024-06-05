import React, { useEffect , useState } from 'react';
import './selector.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faU, faUser } from '@fortawesome/free-solid-svg-icons'

export default function Selector() {
    // const users = [
    //     { id: 1, name: 'Alice' },
    //     { id: 2, name: 'Bob' },
    //     { id: 3, name: 'Charlie' },
    //     { id: 4, name: 'Alice' },
    //     { id: 5, name: 'Bob' },
    //     { id: 6, name: 'Charlie' },
    //     { id: 7, name: 'Alice' },
    //     { id: 8, name: 'Bob' },
    //     { id: 9, name: 'Charlie' },
    //     { id: 10, name: 'Alice' },
    //     { id: 11, name: 'Bob' },
    //     { id: 12, name: 'Charlie' },
    //     { id: 13, name: 'Alice' },
    //     { id: 14, name: 'Bob' },
    //     { id: 15, name: 'Charlie' },
    //     { id: 16, name: 'Alice' },
    //     { id: 17, name: 'Bob' },
    //     { id: 18, name: 'Charlie' },
    //     { id: 19, name: 'Alice' },
    //     { id: 20, name: 'Bob' },
    //     { id: 21, name: 'Charlie' },
    //     { id: 22, name: 'Alice' },
    //     { id: 23, name: 'Bob' },
    //     { id: 24, name: 'Charlie' },
    //     { id: 25, name: 'Alice' },
    //     { id: 26, name: 'Bob' },
    //     { id: 27, name: 'Charlie' },
    //     { id: 28, name: 'Alice' },
    //     { id: 29, name: 'Bob' },
    //     { id: 30, name: 'Charlie' },

    //   ];
    const [contacts , setContacts] = useState([]);
    useEffect (() => {
        const fetchData = async() => {
            try{
                const responce = await axios.get('http://localhost:3001/user/contacts');
                setContacts(responce.data);
            }catch (e) {
                console.log(e);
            }
        }
    })

    const addContact = async() => {
        let data = prompt("enter name");
        console.log(data);
        try{
            await axios.post('http://localhost:3001/user/contacts/add', {
            newData: data
            }); console.log("added");
        } catch (e){console.log(e)}

    }
    return (
        <div className='selector'>
            <div className='info'>
            <h3>Users</h3>
            <button className='user-icon' id='addContact' onClick={addContact}><FontAwesomeIcon icon={faUser}/></button>
            </div>
            
            <div className='users'>
                {contacts.map(contact => (
                    <div className="user">
                    {contact}
                    </div>
                    
                ))}
            </div>
        </div>
        
    )
}
