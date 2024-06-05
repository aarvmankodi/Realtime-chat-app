import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser , faLock, faEnvelope} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 



function SignUp() {
  const [formData, setFormData] = useState({form:'users' ,name: '', email: '', password: ''});


  const [action,setAction] = useState("SignUp");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.name]: e.target.value
    }));
  };



  

  const handleLogin  = async (e) => {
    e.preventDefault();
    document.cookie = "loginStatus=failed; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";
   
    
     if (action === 'SignUp'){
      navigate("/");

      
    }
  };
  const handleSignUp = async (e) => {
    
    
    e.preventDefault();
        
    
     if (action==='SignUp'){
      let password1 = document.getElementById('pass1').value;
    let password2 = document.getElementById('pass2').value;
      if (password1 === password2 && password1!== ''){
        try {

          await axios.post('http://localhost:3001/signup', formData);
          toast('New User Added');
          
        } catch (error) {
          console.error('Error submitting form:', error);
          toast.error('Failed to submit form');
        }
      } else {
        toast.error("Ensure both passwords are same");
      }
      
    } 
  };
  
  return (
    <div className='external'>
    <div className='container'>
      <div className='text'>{action}</div>
      <div className='underline-login'></div>
      <div className='entries'>
      
      {action==='Login'?<div></div>:
      <div className='name inp'>
      <FontAwesomeIcon icon={faUser}/>
       <input type='text' placeholder='name' name='name' onChange={handleInputChange}></input>
      </div>
       }

      <div className='email inp'>
      <FontAwesomeIcon icon={faEnvelope}/>
       <input type='email' placeholder='email' name='email' onChange={handleInputChange}></input>
       </div>
      
      <div className='password inp'>
      <FontAwesomeIcon icon={faLock}/> <input type='password' id='pass1' onChange={handleInputChange} placeholder='password' name='password'></input>
      </div>
      {action==='Login'?<div></div>:
       <div className='password inp'>
      <FontAwesomeIcon icon={faLock}/> <input type='password' id='pass2' placeholder='Retype password' name='Retypedpassword'></input>
      </div>}
      
      <div className='submit'>
        <div className='sub grey' onClick={handleLogin}>Log In</div>
        <div className='sub ' onClick={handleSignUp}>Sign Up</div>
      </div>
      </div>
      
    </div>
    </div>
  );
}

export default SignUp;
