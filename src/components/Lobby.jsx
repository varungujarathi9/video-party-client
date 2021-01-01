/**
 * TODO: Dont show next for joinees
 * TODO: socket listen to new-joinee, if joinee listen to video-started
 */

import { navigate } from '@reach/router'
import React from 'react'
import { serverSocket } from './helper/connection'
// import {connectToAllPeers, getPeerConnections} from './helper/SimplePeerLobby.js'

export default class Lobby extends React.Component {
    state = {
        userType: '',
        username: '',
        roomDetails: '',
        fileName: '',
        extension: ["mp4", "mkv", "x-msvideo", "x-matroska"],
        extensionValid: false,
        fileError: '',
        messages: [],
        message: '',
    }

    componentDidMount(){

        if (sessionStorage.getItem('user-type') === 'creator' || sessionStorage.getItem('user-type') === 'joinee' ){
            this.setState({userType: sessionStorage.getItem('user-type')})
        }
        else{
            navigate('/')
        }

        if (sessionStorage.getItem('room-details') !== null || sessionStorage.getItem('room-details') !== '' ){
            // console.log(JSON.parse(sessionStorage.getItem('room-details').replace(/"/g,'\"')))
            this.setState({roomDetails: JSON.parse(sessionStorage.getItem('room-details').replace(/"/g,'\"'))})
        }
        else{
            navigate('/')
        }

        if (sessionStorage.getItem('username') !== null || sessionStorage.getItem('username') !== '' ){
            this.setState({username: sessionStorage.getItem('username')})
        }
        else{
            navigate('/')
        }

        if (sessionStorage.getItem('room-id') !== null || sessionStorage.getItem('room-id') !== '' ){
            this.setState({roomID: sessionStorage.getItem('room-id')})
        }
        else{
            navigate('/')
        }

        serverSocket.on('update-room-details', async (data)=>{
            // console.log(data)
            sessionStorage.setItem('room-details', JSON.stringify(data))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
            })
        })

        serverSocket.on('video-started', async (data) =>{
            navigate('/video-player')
        })

        serverSocket.on('left_room',data=>{
            sessionStorage.setItem('room-details', JSON.stringify(data))
            // sessionStorage.setItem('room-members',JSON.stringify(data['members']))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),

            })
            navigate('/')
        })

        serverSocket.on('all_left',data=>{
            // console.log(data)
            sessionStorage.setItem('room-details', JSON.stringify(data))
            // sessionStorage.setItem('room-members',JSON.stringify(data['members']))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
            })
            navigate('/')
        })

        serverSocket.on('receive_message',data=>{
            sessionStorage.setItem('messages', data)
            this.setState({
                messages: data,
            })
        })
        serverSocket.emit('get-all-messages',{roomID:sessionStorage.getItem('room-id')})
    }

    handleFile = (e) => {
        this.setState({
            videoStartError:''
        })
        e.preventDefault()

        var fileList = document.getElementById('videofile').files[0]
        if (fileList !== undefined){
            var typeOfFile = fileList.type
            var file = e.target.value.replace(/^.*[\\]/, '')

            this.setState({
                fileName: file,
            })

            var extensionVal = typeOfFile.split('/')

            if (this.state.extension.includes(extensionVal[1])) {
                this.setState({
                    extensionCheck: true,
                    errorMsg: '',
                })
            }
            else {
                this.setState({
                    errorMsg: "Please provide valid file",
                    extensionCheck: false,
                })
            }
            var fileUrl = URL.createObjectURL(fileList).split()
            sessionStorage.setItem('video_file', fileUrl)
        }
        else {
            this.setState({
                errorMsg: "",
                extensionCheck: false,
            })
        }
    }

    startVideo = async () =>{
        if(this.state.userType === 'creator'){
            serverSocket.emit('start-video', {room_id:sessionStorage.getItem('room-id')})
        }
    }

    leaveRoom =() =>{
        if(sessionStorage.getItem('user-type') === 'joinee'){
            serverSocket.emit('remove-member',{username:this.state.username, roomID:this.state.roomID})
        }
        else{
            serverSocket.emit('remove-all-member',{username:this.state.username, roomID:this.state.roomID})
        }
    }

    handleMessageChange = (event) => {
        event.preventDefault()
        this.setState({
            message: event.target.value
        })
    }

    sendMsg = (event) =>{
        event.preventDefault()
        if(this.state.message !== ''){
            serverSocket.emit('send-message',{senderName:this.state.username, roomID:this.state.roomID, message:this.state.message})
        }
        document.getElementById("chat").value = ""
    }

    render() {
        var {roomDetails} = this.state
        var {messages} = this.state

        return (
            <div>

                <label>Browse file</label><br/>
                <input type="file" id="videofile" onChange={this.handleFile} />
                <div style={{ fontSize: '16px', margin: '5px' }}>
                    {this.state.extensionCheck ?
                        <div>
                            <h5 style={{ color: 'green' }}>{this.state.fileName}</h5>
                            {sessionStorage.getItem('user-type') === 'creator' && <button onClick={this.startVideo}>Start partying</button>}
                        </div>

                        : <h6 style={{ color: 'red' }}>{this.state.errorMsg}</h6>}
                </div>
                <h4>Room I.D.</h4>
                {this.state.roomID}
                <h4>Room Members</h4>
                {roomDetails !== '' && Object.keys(roomDetails.members).length > 0 && Object.keys(roomDetails.members).map((username)=>{
                    return (
                        <p key={username}>{username}</p>
                    )
                })}
                <h4>Text Channel</h4>
                {messages.length > 0 && messages.map((message)=>{
                    return(
                    <p key={message["messageNumber"]}>{message["senderName"]}:{message["message"]}</p>
                    )
                })}
                <input type="text" name='chat' id='chat' onChange={this.handleMessageChange}></input>
                <button onClick={this.sendMsg}>Send</button>
                <br/>
                <button onClick={this.leaveRoom}>Leave Room</button>
            </div>
        )
    }
}