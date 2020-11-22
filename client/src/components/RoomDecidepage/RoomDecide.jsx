import { navigate } from '@reach/router'
import React from 'react'
// import {userContext} from '../helper/usercontext'
import {socket} from '../helper/socketfile'



export default class DecideRoom extends React.Component{    
    
  

    componentDidMount(){
       localStorage.removeItem('roomId')
    }
   

    navigateCreateRoom = ()=>{
            socket.emit('my_roomId')
            this.displayRoomId()
                               
    }
    

    displayRoomId =() =>{
        console.log("before listening")
        socket.on('emitRoomId',(roomId)=>{     
            console.log("after listening")      
               localStorage.setItem('roomId',roomId.roomid)
               navigate('/createroom')    
            
        })
    }
    
   

        navigateOut =() =>{
            localStorage.clear()         
            navigate('/',{replace:true})
        }

   
        render(){
           
            
        return(
            <div>
                
                <h1>Hello {localStorage.getItem('username')}</h1>
               
                <button  onClick={this.navigateCreateRoom}>Create Room</button>
                <button  onClick={()=>navigate('/joinroom')}>Join Room</button>
                <button  onClick={this.navigateOut}>Logout</button>
            </div>
        )
            }
}