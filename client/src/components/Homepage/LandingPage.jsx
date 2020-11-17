import React,{useContext,useEffect, useState}from 'react'
import {navigate} from '@reach/router'
import {userContext} from '../helper/usercontext'
import io from 'socket.io-client'


let endpoint = "http://127.0.0.1:5000"
let socket=io.connect(`${endpoint}`)

export default function LandingPage (){

   




    // const [messages, setMessages] = useState(["Hello And Welcome"]);
    // const [message, setMessage] = useState("");
  
    //const [msg,setMsg] = useState([])
    const user = useContext(userContext)


    useEffect(()=>{
        printUsername()
        
    })

    const onSubmitForm = (e)=>{
        
        var usernameValid = user.username
        
        console.log(Boolean(usernameValid ===''))
        if(usernameValid !== ''){
            console.log("check here")

            
            socket.emit("message", usernameValid);
            // if(socket.on("username")){
            //     navigate("decideroom",{replace:true})
            // }
            
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

    const printUsername = ()=>{
        console.log("jhello")
        socket.on("message",(msg)=>{          
            console.log("check username msg",msg)
        })
    }

    // const displayUsername =() =>{
    //  socket.on("message",msg=>{
    //         user.setUsername(msg)
    //         return user.username
    //     })
    // }

    // const welcomeMsgDisplay =(socket)=>{
    //     // let msg= socket
       

    // }

    
        return(
            <div>
                <form >
                    {/* <p>{msg}</p> */}
                   
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