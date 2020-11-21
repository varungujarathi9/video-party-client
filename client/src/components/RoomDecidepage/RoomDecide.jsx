import { navigate } from '@reach/router'
import React from 'react'
// import {userContext} from '../helper/usercontext'
import {socket} from '../helper/socketfile'



export default class DecideRoom extends React.Component{    
    
    constructor(props){
        super(props)
        // this.state={
        //     roomId:''
        // }
        
        
    }
    
    
    componentDidMount(){
        console.log("hello ")
            socket.on('outgoingdata',(uname)=>{
                if(localStorage.getItem('roomId') == null){
                    localStorage.setItem('roomId',uname.room_id)
                }
                
            })
        
    }
   
   

        navigateOut =() =>{
            localStorage.removeItem('username')
            localStorage.removeItem('roomId')
            navigate('/',{replace:true})
        }

   
        render(){
            // const {username,roomId} = this.state
            
        return(
            <div>
                
        <h1>Hello {localStorage.getItem('username')}</h1>
               
                <button  onClick={()=>navigate('/createroom')}>Create Room</button>
                <button  onClick={()=>navigate('/joinroom')}>Join Room</button>
                <button  onClick={this.navigateOut}>Logout</button>
            </div>
        )
            }
}