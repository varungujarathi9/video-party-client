import { navigate } from '@reach/router'
import React,{useContext, useEffect, useState} from 'react'
import {userContext} from '../helper/usercontext'
import io from 'socket.io-client'



export default function DecideRoom (){    
    const user = useContext(userContext)
    const[uname,setuname] = useState('')
    
    
    useEffect(()=>{
        let endpoint = "http://127.0.0.1:5000"
        let socket=io.connect(`${endpoint}`)
        socket.on('outgoingdata',(socket)=>{
            setuname(socket)
            console.log(socket)
        })
       
    })

   
    
        return(
            <div>
                {/* <h1>Helo {socket.on("username",function(){
                    return user.username
                })}</h1> */}
                <h1>Hello {uname}</h1>
               
                <button  onClick={()=>navigate('/createroom')}>Create Room</button>
                <button  onClick={()=>navigate('/joinroom')}>Join Room</button>
                <button  onClick={()=>navigate('/',{replace:true})}>Logout</button>
            </div>
        )
    
}