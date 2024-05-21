import React from 'react'
import './user.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faU, faUser } from '@fortawesome/free-solid-svg-icons'
export default function User() {
  return (
    <div className='user-info'>
        <div className='user-icon'><FontAwesomeIcon icon={faUser}/></div>
        <div className='user-name'>User Name</div>
    </div>
  )
}
