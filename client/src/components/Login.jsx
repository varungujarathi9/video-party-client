import React from 'react'
import {navigate} from '@reach/router'
import {serverSocket} from './helper/connection'
import style from './Login.module.css'
// import {createPeerConnection,sendOffer,sendAnswer,handleSignalingData} from './webrtcfile.js'

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userType: '',
            username: '',
            roomID: '',
            usernameError: ''
        }
        // sessionStorage.removeItem('room-details')
        // sessionStorage.removeItem('room-id')
        // sessionStorage.removeItem('username')
    }

    componentDidMount(){
        
        // check if user-type is set or not 
        if (sessionStorage.getItem('user-type') === 'creator' || sessionStorage.getItem('user-type') === 'joinee' ){
            this.setState({userType: sessionStorage.getItem('user-type')})
        }
        else{
            sessionStorage.clear()
            localStorage.clear()
            navigate('/')
        }
    }


   
    onClickLogin = async (event) =>{
        event.preventDefault()
        
        // TODO: Add regex to check username is valid
        if (this.state.username !== '') {    
            // createPeerConnection()  
            if(this.state.userType === 'creator'){ 
                // var receiveOffer = await sendOffer()              
                serverSocket.emit('create-room', {username:this.state.username});          
                this.handleCreateRoom()
            }
            else if(this.state.userType === 'joinee'){
                // var sendJoineeAnswer = await sendAnswer()
                // console.log("send answer",sendJoineeAnswer)
                serverSocket.emit('join-room', {username:this.state.username, roomID:this.state.roomID});
                this.handleJoinRoom()
            }
        }
        else {
            this.setState({usernameError: "Please provide username"})
        }
    }

    handleCreateRoom = () => {
        serverSocket.on('room-created',(data)=>{            
            sessionStorage.setItem('username', this.state.username)
            sessionStorage.setItem('room-id', data['room-id'])
            sessionStorage.setItem('room-details', JSON.stringify(data['room-details']))
            //write peerconnection
           
            navigate('/lobby')    
        })
    }

    handleJoinRoom = () => {  
        serverSocket.on('room-joined',(data)=>{   
            sessionStorage.setItem('username', this.state.username)
            sessionStorage.setItem('room-id', this.state.roomID)
            sessionStorage.setItem('room-details', JSON.stringify(data['room-details']))
            //write peerconnection
         

            navigate('/lobby')    
        })
    }

    handleUsernameChange = (event) => {
        event.preventDefault()
        this.setState({
            username: event.target.value.trim()
        })
    }

    handleRoomIDChange = (event) => {
        event.preventDefault()
        this.setState({
            roomID: event.target.value.trim()
        })
    }

    render() {
        const { usernameError } = this.state
        
        return (
            <div>    
                <div>
                           
                <form className={style.form}>
                    <div className={style.unameDiv}> 
                        <label className={style.username} htmlFor='username'> Enter Username</label>
                        <input className={style.unameInput}type="text" id='username' name='username' maxLength='20' onChange={this.handleUsernameChange} placeholder="username"></input>
                    </div>    
                    {this.state.userType === 'joinee' ? (
                        <div className={style.roomIdDiv}>
                            <label className={style.roomId} htmlFor='roomID'>Room ID</label> 
                            <input className={style.roomIdInput}type='text' id='roomID' name='roomID' minLength='6' maxLength='6' onChange={this.handleRoomIDChange} placeholder="roomId"></input>
                        </div>
                    ) : null
                    }
                    <button className={style.joinBtn} onClick={this.onClickLogin}>Login</button>
                </form>
                <h6 style={{ color: 'red', fontSize: '16px', margin: '5px' }}>{usernameError}</h6>
                </div>
            </div>
        )
    }
}