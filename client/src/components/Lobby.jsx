/**
 * TODO: Dont show next for joinees
 * TODO: socket listen to new-joinee, if joinee listen to video-started
 */

import { navigate } from '@reach/router'
import React from 'react'
import { serverSocket } from './helper/connection'
import style from './Lobby.module.css'
import {AvatarArr} from './Avatar.js'

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
        avatar:AvatarArr
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

        serverSocket.on('update-members', (data)=>{
            // console.log(data)
            sessionStorage.setItem('room-details', JSON.stringify(data))
            // sessionStorage.setItem('room-members',JSON.stringify(data['members']))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
            })
            if(this.state.ready && JSON.parse(JSON.stringify(data))['started']){
                // createPeerConnection() 
                sessionStorage.setItem('video-stream-flag', this.state.videoStreamFlag)
                navigate('/video-player')
            }
        })

        serverSocket.on('video-started', (data)=>{
            // createPeerConnection() 
            sessionStorage.setItem('video-stream-flag', this.state.videoStreamFlag)
            // handleSignalingData({'sdp':data['sesDetails'],'type':data['typeOfSdp']})
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
            console.log(data)
            sessionStorage.setItem('room-details', JSON.stringify(data))
            // sessionStorage.setItem('room-members',JSON.stringify(data['members']))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
            })
            navigate('/')
        })
    }




    handleFile = (e) => {
        this.setState({
            videoStartError:''
        })
        e.preventDefault()

        var filelist = document.getElementById('videofile').files[0]
        if (filelist !== undefined){
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
                    errorMsg: '',
                    videoStreamFlag: true
                })
            }
            else {
                this.setState({
                    errorMsg: "Please provide valid file",
                    extensionCheck: false,
                    videoStreamFlag: false
                })
            }
            var fileUrl = URL.createObjectURL(filelist).split()
            sessionStorage.setItem('video_file', fileUrl)
        }
        else {
            this.setState({
                errorMsg: "",
                extensionCheck: false,
                videoStreamFlag: false
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

    readyForVideo = () => {
        if(this.state.userType === 'joinee'){
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

            if (this.state.ready === false){
                document.getElementById('readyButton').innerHTML = 'Cancel'
                document.getElementById('videofile').disabled = true
                this.setState({
                    ready: true
                })
                serverSocket.emit('update-member-status',{roomID:this.state.roomID, username:this.state.username, ready:true})
            }
            else{
                document.getElementById('readyButton').innerHTML = 'Ready for partying'
                document.getElementById('videofile').disabled = false
                this.setState({
                    ready: false
                })
                serverSocket.emit('update-member-status',{roomID:this.state.roomID, username:this.state.username, ready:false})
            }
       }
    }

    capitalizeUsername = () =>{
        var username  = sessionStorage.getItem('username')
        var finalUsername = username.charAt(0).toUpperCase()+username.slice(1)
        return(
            <p className={style.creatorName}>
                {finalUsername}'s Room
                
            </p>
        )
    }

    render() {
        var {roomDetails,videoStreamFlag,avatar} = this.state
       
        return (
            <div>
                <div className={style.left}>
                {sessionStorage.getItem('user-type') === 'creator' && this.capitalizeUsername()}
                {sessionStorage.getItem('user-type') === 'creator' &&<p className={style.roomId}>Room ID: {this.state.roomID}</p>}
                <p className={style.memTitle}>Members in Lobby
                <p className={style.memName}>
                <div>
                {roomDetails !== '' && Object.keys(roomDetails.members).length > 0 && Object.keys(roomDetails.members).map((username)=>{
                    return (
                            <>
                            <img src={avatar[Math.floor(Math.random()*avatar.length)]} alt="avatarimg"/>
                            <span key={username}>{username}</span>
                             {/* <span key={username}>{username}:{roomDetails.members[username]?"ready":"not ready"}</span> */}
                            </>
                       
                    )
                })}
                </div>
                </p>
                
               </p>
               <button className={style.leaveRoomBtn}onClick={this.leaveRoom}>Leave Room</button>

                </div>
               

                <div className={style.right}>
                   
                    <p><input className={style.inputFile} type="file" id="videofile" onChange={this.handleFile} />
                    </p>
                      
               
                    {this.state.extensionCheck ?
                        <div className={style.fileCheck}>
                            <p className={style.fileName}>{this.state.fileName}</p>
                            {sessionStorage.getItem('user-type') === 'creator' && <button className={style.startPlaying}onClick={this.startVideo}>Start partying</button>}
                        </div>

                        : <h4 style={{ color: 'red' }}>{this.state.errorMsg}</h4>}
                 <div className={style.fileCheck}>
                {sessionStorage.getItem('user-type') === 'joinee' && this.state.ready && <p style={{ color: 'blue' }}>Waiting for the host to start</p>}
                {sessionStorage.getItem('user-type') === 'joinee' && <button id='readyButton' className={style.startPlaying} onClick={this.readyForVideo}>Ready for partying</button>}
                {sessionStorage.getItem('user-type') === 'joinee' && (videoStreamFlag?<h6 style={{ color: 'red' }}>You have not selected any file, video will be stream to you directly</h6>:<h6 style={{ color: 'green' }}>Your selected file would be played</h6>)}
                </div>
                </div>
                
               
                
               
            </div>
        )
    }
}