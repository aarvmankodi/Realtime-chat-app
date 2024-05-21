import React from 'react';
import './selector.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faU, faUser } from '@fortawesome/free-solid-svg-icons'

export default function Selector() {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },

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
