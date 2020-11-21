import React from 'react'
import { socket } from '../helper/socketfile'

export default class CreateRoom extends React.Component{
    state ={
        roomId_val:''
    }

    handleChange =(e) =>{
        e.preventDefault()
        // user.setUsername(e.target.value.trim())
        this.setState({
            roomId_val: e.target.value.trim()
        })

    }

    navigateToVideoPage =() =>{
        console.log("hello")
        const joinRoomdetails = {'sendRoomId':this.state.roomId_val,'username':localStorage.getItem('username')}
        socket.emit('room_id',{join_room:joinRoomdetails})
    }
    
    render(){
        
        return(
            <div>
                <input onChange={this.handleChange} placeholder="Enter room Id"></input>
                <button onClick={this.navigateToVideoPage}>Next</button>
            </div>
        )
    }
}