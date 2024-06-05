import React from 'react';
import './selector.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faU, faUser } from '@fortawesome/free-solid-svg-icons'

export default function Selector() {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'Alice' },
        { id: 5, name: 'Bob' },
        { id: 6, name: 'Charlie' },
        { id: 7, name: 'Alice' },
        { id: 8, name: 'Bob' },
        { id: 9, name: 'Charlie' },
        { id: 10, name: 'Alice' },
        { id: 11, name: 'Bob' },
        { id: 12, name: 'Charlie' },
        { id: 13, name: 'Alice' },
        { id: 14, name: 'Bob' },
        { id: 15, name: 'Charlie' },
        { id: 16, name: 'Alice' },
        { id: 17, name: 'Bob' },
        { id: 18, name: 'Charlie' },
        { id: 19, name: 'Alice' },
        { id: 20, name: 'Bob' },
        { id: 21, name: 'Charlie' },
        { id: 22, name: 'Alice' },
        { id: 23, name: 'Bob' },
        { id: 24, name: 'Charlie' },
        { id: 25, name: 'Alice' },
        { id: 26, name: 'Bob' },
        { id: 27, name: 'Charlie' },
        { id: 28, name: 'Alice' },
        { id: 29, name: 'Bob' },
        { id: 30, name: 'Charlie' },

      ];
    return (
        <div className='selector'>
            <div className='info'>
            <h3>Users</h3>
            <div className='user-icon'><FontAwesomeIcon icon={faUser}/></div>
            </div>
            
            <div className='users'>
                {users.map(user => (
                    <div key={user.id} className="user">
                    {user.name}
                    </div>
                    
                ))}
            </div>
        </div>
        
    )
}
