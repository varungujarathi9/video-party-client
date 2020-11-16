import { navigate } from '@reach/router'
import React,{useContext} from 'react'
import {userContext} from '../helper/usercontext'


export default function DecideRoom (){    
    const user = useContext(userContext)
    const changeRoom=(roomName)=>{
        if(roomName === 'createroom'){
            
            navigate('/createroom')
        }
        if(roomName==='joinroom'){
           
            navigate('/joinroom')
        }

        if(roomName==='logout'){
            
            navigate('/',{replace:true})
        }
        
    }    
        return(
            <div>
                <h1>Helo {user.username}</h1>
               
                <button  onClick={()=>changeRoom('createroom')}>Create Room</button>
                <button  onClick={()=>changeRoom('joinroom')}>Join Room</button>
                <button  onClick={()=>changeRoom('logout')}>Logout</button>
            </div>
        )
    
}