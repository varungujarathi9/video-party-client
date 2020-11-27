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
        videoStreamFlag: true,
        ready: false,
    }

    componentDidMount(){
        if (sessionStorage.getItem('user-type') === 'creator' || sessionStorage.getItem('user-type') === 'joinee' ){
            this.setState({userType: sessionStorage.getItem('user-type')})
        }
        else{
            navigate('/')
        }

        if (sessionStorage.getItem('room-details') !== null || sessionStorage.getItem('room-details') !== '' ){
            this.setState({roomDetails: JSON.parse(sessionStorage.getItem('room-details').replace(/"/g, '\"'))})
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
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data))
            })
        })

        serverSocket.on('video-started', (data)=>{
            sessionStorage.setItem('video-stream-flag', this.state.videoStreamFlag)
            navigate('/video-player')
        })
    }

    handleFile = (e) => {
        this.setState({
            videoStartError:''
        })
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
        sessionStorage.setItem('video_file', fileUrl)
    }

    startVideo = () =>{
        if(this.state.userType === 'creator'){
            serverSocket.emit('start-video')
        }
    }

    readyForVideo = () => {
        if(this.state.userType === 'joinee'){
            if (this.state.ready === false){
                document.getElementById('readyButton').innerHTML = 'Cancel'
                document.getElementById('videofile').disabled = true
                this.setState({
                    ready: true
                })
            }
            else{
                document.getElementById('readyButton').innerHTML = 'Ready for partying'
                document.getElementById('videofile').disabled = false
                this.setState({
                    ready: false
                })
            }

            if ( this.state.fileName === '' || this.state.fileName === null){
                // TODO change alert to UI
                this.setState({
                    videoStreamFlag: true
                })
                sessionStorage.setItem('video_file', null)
            }
            else{
                this.setState({
                    videoStreamFlag: false
                })
            }

            serverSocket.emit('update-member-status',{room_id:this.state.roomID, username:this.state.username, ready:this.state.ready})
       }
    }

    render() {
        var {roomDetails} = this.state
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
                {sessionStorage.getItem('user-type') === 'joinee' && this.state.ready && <p style={{ color: 'blue' }}>Waiting for the host to start</p>}
                {sessionStorage.getItem('user-type') === 'joinee' && <button id='readyButton' onClick={this.readyForVideo}>Ready for partying</button>}
                {sessionStorage.getItem('user-type') === 'joinee' && (this.state.videoStreamFlag?<h6 style={{ color: 'red' }}>You have not selected any file, video will be stream to you directly</h6>:<h6 style={{ color: 'green' }}>Your selected file would be played</h6>)}
                <button onClick={() => { navigate('/') }}>Back</button>
                <h4>Room I.D.</h4>
                {this.state.roomID}
                <h4>Room Members</h4>
                {roomDetails !== '' && roomDetails.members.length > 0 && roomDetails.members.map(username=>{
                    return (
                        <p key={username}>{username}</p>
                    )
                })}
            </div>
        )
    }
}