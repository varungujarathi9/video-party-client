import { navigate } from '@reach/router'
import React,{useContext} from 'react'
import {userContext} from '../helper/usercontext'
import io from 'socket.io-client'



export default function DecideRoom (){    
    const user = useContext(userContext)
    
        return(
            <div>
                {/* <h1>Helo {socket.on("username",function(){
                    return user.username
                })}</h1> */}
               
                <button  onClick={()=>navigate('/createroom')}>Create Room</button>
                <button  onClick={()=>navigate('/joinroom')}>Join Room</button>
                <button  onClick={()=>navigate('/',{replace:true})}>Logout</button>
            </div>
        )
    
}