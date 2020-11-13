import { navigate } from '@reach/router'
import React from 'react'


export default class DecideRoom extends React.Component{




    changeRoom=(roomName)=>{
        if(roomName === 'createroom'){
            console.log("create")
            navigate('/createroom')
        }
        if(roomName==='joinroom'){
            console.log("join")
            navigate('/joinroom')
        }

        if(roomName==='logout'){
            console.log("logout")
            navigate('/',{replace:true})
        }
        
    }
    render(){
        return(
            <div>
                <button  onClick={()=>this.changeRoom('createroom')}>Create Room</button>
                <button  onClick={()=>this.changeRoom('joinroom')}>Join Room</button>
                <button  onClick={()=>this.changeRoom('logout')}>Logout</button>
            </div>
        )
    }
}