import { navigate } from '@reach/router'
import React from 'react'
// import {userContext} from '../helper/usercontext'
import {serverSocket} from '../helper/connection'



export default class DecideRoom extends React.Component{    
    
  

    componentDidMount(){
       localStorage.removeItem('roomId')
    }
   

    navigateCreateRoom = ()=>{
            serverSocket.emit('my_roomId')
            this.displayRoomId()
                               
    }
    

    displayRoomId =() =>{
        serverSocket.on('emitRoomId',(roomId)=>{   
         
               localStorage.setItem('roomId',roomId.roomid)
               navigate('/createroom')    
            
        })
    }
    
   

        navigateOut =() =>{
            localStorage.removeItem('username')            
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