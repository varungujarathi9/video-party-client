import React from 'react'
import {navigate} from '@reach/router'
import {serverSocket} from './helper/connection'

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

    onClickLogin = (event) =>{
        event.preventDefault()

        // TODO: Add regex to check username is valid
        if (this.state.username !== '') {
            if(this.state.userType === 'creator'){
                serverSocket.emit('create-room', {username:this.state.username});
                this.handleCreateRoom()
            }
            else if(this.state.userType === 'joinee'){
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
            navigate('/lobby')
        })
    }

    handleJoinRoom = () => {
        serverSocket.on('room-joined',(data)=>{
            sessionStorage.setItem('username', this.state.username)
            sessionStorage.setItem('room-id', this.state.roomID)
            sessionStorage.setItem('room-details', JSON.stringify(data['room-details']))
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
                <h1>Login to continue</h1>
                <form>
                    <div>
                        <label htmlFor='username'>Username</label>
                        <input type="text" id='username' name='username' maxLength='20' onChange={this.handleUsernameChange}></input>
                    </div>
                    {this.state.userType === 'joinee' ? (
                        <div>
                            <label htmlFor='roomID'>Room ID</label>
                            <input type='text' id='roomID' name='roomID' minLength='6' maxLength='6' onChange={this.handleRoomIDChange}></input>
                        </div>
                    ) : null
                    }
                    <button onClick={this.onClickLogin}>Login</button>
                </form>
                <h6 style={{ color: 'red', fontSize: '16px', margin: '5px' }}>{usernameError}</h6>
            </div>
        )
    }
}