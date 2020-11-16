import React,{useContext}from 'react'
import {navigate} from '@reach/router'
import {userContext} from '../helper/usercontext'



export default function LandingPage (){
    
    
    const user = useContext(userContext)
    const onSubmitForm = (e)=>{
        
        var usernameValid = user.username
        console.log(Boolean(usernameValid===''))
        if(usernameValid !== ''){
            console.log("check here")
            navigate("decideroom",{replace:true})
            e.preventDefault()            
        }
        else{
           e.preventDefault()
           user.setErrorMsg("please provide username")
           
           
            
        }

    }


    const handleInput=(e)=>{
        e.preventDefault()
        user.setUsername(e.target.value.trim())
      
        
    }

    
        return(
            <div>
                <form >
                    <label>Username</label>
                    <input type="text" onChange = {handleInput} ></input>
                    <button  onClick={onSubmitForm}>submit</button>
                </form>
                <h6 style={{ color: 'red', fontSize: '16px', margin: '5px' }}>
                    {user.errormsg}
                  </h6>
            </div>
        )
    
}