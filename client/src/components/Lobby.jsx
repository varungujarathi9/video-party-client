/**
 * TODO: Dont show next for joinees
 * TODO: socket listen to new-joinee, if joinee listen to video-started 
 */

import { navigate } from '@reach/router'
import React from 'react'
import { serverSocket } from './helper/connection'

export default class Lobby extends React.Component {
    state = {
        userType: '',
        username: '',
        roomDetails: '',
        fileName: '',
        extension: ["mp4", "mkv", "x-msvideo", "x-matroska"],
        extensionValid: false,
        fileError: '',
       
    }

    componentDidMount(){
        
        if (sessionStorage.getItem('user-type') === 'creator' || sessionStorage.getItem('user-type') === 'joinee' ){
            this.setState({userType: sessionStorage.getItem('user-type')})
        }
        else{
            navigate('/')
        }

        if (sessionStorage.getItem('room-details') !== null || sessionStorage.getItem('room-details') !== '' ){
            console.log(JSON.parse(sessionStorage.getItem('room-details').replace(/"/g,'\"')))
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

        serverSocket.on('update-joinee', (data)=>{
            console.log(data)
            sessionStorage.setItem('room-details', JSON.stringify(data))
            // sessionStorage.setItem('room-members',JSON.stringify(data['members']))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
                
            })
        })

        serverSocket.on('video-started', (data)=>{
            if (this.state.userType === 'joinee' && ( this.state.fileName === '' || this.state.fileName === null)){
                // TODO change alert to UI
                alert('Select a file')
            }
            else{
                navigate('/video-player')
            }
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
            sessionStorage.setItem('room-details', JSON.stringify(data))
            // sessionStorage.setItem('room-members',JSON.stringify(data['members']))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
                
            })     
            navigate('/')    
        })
    }


 

    handleFile = (e) => {
        e.preventDefault()

        var filelist = document.getElementById('videofile').files[0]
        console.log(filelist)
        var typeOfFile = filelist.type
        console.log(typeOfFile)
        var file = e.target.value.replace(/^.*[\\]/, '')

        this.setState({
            fileName: file,
        })

        var extensionVal = typeOfFile.split('/')
        console.log(extensionVal)

        if (this.state.extension.includes(extensionVal[1])) {
            this.setState({
                extensionCheck: true,
                errorMsg: ''
            })
        }
        else {
            this.setState({
                errorMsg: "Please provide valid file",
                extensionCheck: false
            })
        }

        var fileUrl = URL.createObjectURL(filelist).split()
        localStorage.setItem('video_file', fileUrl)


    }

    startVideo = () =>{
        serverSocket.emit('start-video')
    }


    leaveRoom =() =>{
        if(sessionStorage.getItem('user-type') === 'joinee'){
            serverSocket.emit('remove-member',{username:this.state.username, roomID:this.state.roomID})
        }
        else{
            serverSocket.emit('remove-all-member',{username:this.state.username, roomID:this.state.roomID})
        }
    }
    
    
    render() {
        // let membersList = []
        // if (localStorage.getItem('roomMembers') !== null){
        //     membersList = localStorage.getItem('roomMembers')
        // }
        // else{
        //     membersList = []
        // }
        // let roomDetailsString = sessionStorage.getItem('room-details').replace(/"/g, '\"')
        var {roomDetails} = this.state
        return (
            <div>
                
                <label>Browse file</label><br/>
                <input type="file" id="videofile" onChange={this.handleFile} />
                <div style={{ fontSize: '16px', margin: '5px' }}>
                    {this.state.extensionCheck ?
                        <div>
                            <h5 style={{ color: 'green' }}>{this.state.fileName}</h5>
                            {sessionStorage.getItem('user-type') === 'creator' && <button onClick={this.startVideo}>Start Partying</button>}
                        </div>

                        : <h6 style={{ color: 'red' }}>{this.state.errorMsg}</h6>}
                </div>
                <button onClick={() => { navigate(-1) }}>Back</button>
                <h4>Room I.D.</h4>
                {this.state.roomID}
                <h4>Room Members</h4>
                {roomDetails !== '' && roomDetails.members.length > 0 && roomDetails.members.map(username=>{
                    return (
                        <p key={username}>{username}</p>
                    )
                })}
                <button onClick={this.leaveRoom}>Leave Room</button>
            </div>
        )
        
    }
}