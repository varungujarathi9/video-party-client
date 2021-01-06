import React from 'react'
import {navigate} from '@reach/router'
import {serverSocket} from './helper/connection'
import style from './Login.module.css'
import {AvatarArr} from './Avatar.js'
import BackIcon from '../images/BackIcon.png'

export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userType: '',
            username: '',
            roomID: '',
            usernameError: '',
            avatar:AvatarArr,
            setAvatarName:null,
            errorMessage: ''
        }
    }

    componentDidMount(){

        // check if user-type is set or not
        if (sessionStorage.getItem('user-type') === 'creator' || sessionStorage.getItem('user-type') === 'joinee' ){
            this.setState({userType: sessionStorage.getItem('user-type')})
        }
        else{
            sessionStorage.clear()
            navigate('/')
        }

        serverSocket.on("login-error", (data) => {
            this.setState({
                errorMessage: data['msg']
            })
        })
    }

    onClickLogin = async (event) =>{
        event.preventDefault()

        // TODO: Add regex to check username is valid
        if (this.state.username !== '') {
            // createPeerConnection()
            var {avatar} = this.state
            var avatarName = Object.keys(avatar)
            var avatarRandom = avatarName[Math.floor(Math.random()*avatarName.length)]
            this.setState({
                setAvatarName:avatarRandom
            })
            if(this.state.userType === 'creator'){
                serverSocket.emit('create-room', {username:this.state.username,avatarname:avatarRandom});
                this.handleCreateRoom()
            }
            else if(this.state.userType === 'joinee'){
                serverSocket.emit('join-room', {username:this.state.username, roomID:this.state.roomID,avatarname:avatarRandom});
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
            sessionStorage.setItem('avatarName',this.state.setAvatarName)
            navigate('/lobby')
        })
    }

    handleJoinRoom = () => {
        serverSocket.on('room-joined',(data)=>{
            sessionStorage.setItem('username', this.state.username)
            sessionStorage.setItem('room-id', this.state.roomID)
            sessionStorage.setItem('room-details', JSON.stringify(data['room-details']))
            sessionStorage.setItem('avatarName',this.state.setAvatarName)
            //write peerconnection
            console.log(data)

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

    navigateBack =()=>{
        navigate('/')
    }

    render() {
        let {usernameError, errorMessage } = this.state

        return (
            <div className={style.loginDiv}>
                 <button className={style.backBtn} onClick={this.navigateBack}>
                     <div className={style.btnDiv}>
                     <img className={style.btnImg}src={BackIcon} alt="backIcon" />
                     <p className={style.btnText}> Back</p>
                     </div>


                </button>
                <div className={style.formDiv}>
                    <form className={style.form}>
                        <div className={style.unameDiv}>
                            <label className={style.username} htmlFor='username'> Username</label>
                            <input className={style.unameInput}type="text" id='username' name='username' maxLength='20' onChange={this.handleUsernameChange} placeholder="username"></input>
                        </div>
                        {this.state.userType === 'joinee' ? (
                            <div className={style.roomIdDiv}>
                                <label className={style.roomId} htmlFor='roomID'>Room ID</label>
                                <input className={style.roomIdInput}type='text' id='roomID' name='roomID' minLength='6' maxLength='6' onChange={this.handleRoomIDChange} placeholder="roomId"></input>
                            </div>
                        ) : null
                        }
                        <h6 style={{ color: 'red', fontSize: '16px', margin: '5px 0px 12px' }}>{usernameError}</h6>
                        <button className={style.joinBtn} onClick={this.onClickLogin}>Login</button>
                    </form>
                    <h6 style={{ color: 'red', fontSize: '16px', margin: '5px' }}>{errorMessage}</h6>
                </div>
            </div>
        )
    }
}