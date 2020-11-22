import { navigate } from '@reach/router'
import React from 'react'
import { serverSocket } from '../helper/connection'

export default class CreateRoom extends React.Component{
    state ={
        roomId_val:'',
        uNameJoinee:[]
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
        const joinRoomdetails = {'sendRoomId':this.state.roomId_val,'userName':localStorage.getItem('username')}
        serverSocket.emit('room_id',{joinRoom:joinRoomdetails})
        this.listNewJoinee()

    }

    listNewJoinee=()=>{
        console.log("********************************************************")
        serverSocket.on('newJoinee', (joineeName) => {
            console.log(joineeName.membersName)
            this.setState({
                uNameJoinee: [...this.state.uNameJoinee, joineeName.membersName]
            })
            localStorage.setItem("roomMembers",this.state.uNameJoinee)
            navigate('/createroom')
        })
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