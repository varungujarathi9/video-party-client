/**
 * TODO: Dont show next for joinees
 * TODO: socket listen to new-joinee, if joinee listen to video-started
 */

import { navigate } from '@reach/router'
import React from 'react'
import { serverSocket } from './helper/connection'
import style from './Lobby.module.css'
import { AvatarArr } from './Avatar'
import BackIcon from '../images/BackIcon.png'
import UploadIcon from '../images/Upload.png'
import copy from 'copy-to-clipboard'
import SendBtn from '../images/send.png'

export default class Lobby extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userType: '',
            username: '',
            roomDetails: '',
            fileName: '',
            extension: ["mp4"],
            extensionValid: false,
            fileError: '',
            messages: [],
            message: '',
            copyStatus: '',
            lastSender: '',
            disconnected: false
        }
        this.fileUploader = React.createRef()
        this.urlText = React.createRef()
    }

    componentDidMount(){
        if (sessionStorage.getItem('user-type') === 'creator' || sessionStorage.getItem('user-type') === 'joinee' ){
            this.setState({userType: sessionStorage.getItem('user-type')})
        }
        else {
            navigate('/')
        }

        if (sessionStorage.getItem('room-details') !== null || sessionStorage.getItem('room-details') !== '') {
            this.setState({ roomDetails: JSON.parse(sessionStorage.getItem('room-details').replace(/"/g, '\"')) })
        }
        else {
            navigate('/')
        }

        if (sessionStorage.getItem('username') !== null || sessionStorage.getItem('username') !== '') {
            this.setState({ username: sessionStorage.getItem('username') })
        }
        else {
            navigate('/')
        }

        if (sessionStorage.getItem('room-id') !== null || sessionStorage.getItem('room-id') !== '') {
            this.setState({ roomID: sessionStorage.getItem('room-id') })
        }
        else {
            navigate('/')
        }

        serverSocket.on('connect',()=>{
            console.log("server is connected")
            console.log(serverSocket)
            if(this.state.disconnected === true){
                this.setState({
                    disconnected: false
                })
                var rejoinRoomID = sessionStorage.getItem('room-id')
                var rejoinUsername = sessionStorage.getItem('username')

                serverSocket.emit('rejoin-room',{roomID:rejoinRoomID, joineeName:rejoinUsername})

            }
        })

        serverSocket.on('disconnect',(reason)=>{
            this.setState({
                disconnected: true
            })
            console.log("the reason for disconnection is",reason)
            console.log("server is disconnected")
        })


        serverSocket.on('update-room-details', async (data) => {
            sessionStorage.setItem('room-details', JSON.stringify(data))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
            })
        })

        serverSocket.on('video-started', async (data) => {
            navigate('/video-player')
        })

        serverSocket.on('left_room', data => {
            sessionStorage.setItem('room-details', JSON.stringify(data))
            // sessionStorage.setItem('room-members',JSON.stringify(data['members']))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),

            })
            navigate('/')
        })

        serverSocket.on('all_left', data => {
            sessionStorage.setItem('room-details', JSON.stringify(data))
            this.setState({
                roomDetails: JSON.parse(JSON.stringify(data)),
            })
            navigate('/')
        })

        serverSocket.on('receive_message', (data) => {
            var reversedArray = data.slice(0).reverse()
            if (reversedArray.length > 0) {
                this.setState({
                    messages: reversedArray,
                    lastSender: reversedArray[0].senderName
                })

            }

        })

        setTimeout(2000,serverSocket.emit('get-all-messages', { roomID: sessionStorage.getItem('room-id') }))
    }

    handleFile = (e) => {
        this.setState({
            videoStartError: ''
        })
        e.preventDefault()

        var fileList = document.getElementById('videofile').files[0]
        if (fileList !== undefined) {
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

    startVideo = async () => {
        if (this.state.userType === 'creator') {
            serverSocket.emit('start-video', { room_id: sessionStorage.getItem('room-id') })
        }
    }

    leaveRoom = () => {
        if (sessionStorage.getItem('user-type') === 'joinee') {
            serverSocket.emit('remove-member', { username: this.state.username, roomID: this.state.roomID })
        }
        else {
            serverSocket.emit('remove-all-member', { username: this.state.username, roomID: this.state.roomID })
        }
    }

    readyForVideo = () => {
        if (this.state.userType === 'joinee') {
            if (this.state.fileName === '' || this.state.fileName === null) {
                // TODO change alert to UI
                this.setState({
                    videoStreamFlag: true
                })
                sessionStorage.setItem('video_file', null)
            }
            else {
                this.setState({
                    videoStreamFlag: false
                })
            }

            if (this.state.ready === false) {
                document.getElementById('readyButton').innerHTML = 'Cancel'
                document.getElementById('videofile').disabled = true
                this.setState({
                    ready: true
                })
                serverSocket.emit('update-member-status', { roomID: this.state.roomID, username: this.state.username, ready: true })
            }
            else {
                document.getElementById('readyButton').innerHTML = 'Ready for partying'
                document.getElementById('videofile').disabled = false
                this.setState({
                    ready: false
                })
                serverSocket.emit('update-member-status', { roomID: this.state.roomID, username: this.state.username, ready: false })
            }
        }
    }

    capitalizeUsername = () => {
        var username = Object.keys(JSON.parse(sessionStorage.getItem("room-details")).members)[0]
        var finalUsername = username.charAt(0).toUpperCase() + username.slice(1)
        return (
            <p className={style.creatorName}>
                {finalUsername}'s Room

            </p>
        )
    }

    handleMessageChange = (event) => {
        event.preventDefault()
        this.setState({
            message: event.target.value
        })
    }

    sendMsg = (event) => {
        event.preventDefault()
        if (this.state.message !== '') {
            serverSocket.emit('send-message', { senderName: this.state.username, roomID: this.state.roomID, message: this.state.message })
        }
        this.scrollcheck()

        document.getElementById("chat").value = ""
    }


    scrollcheck = () => {
        var getMsgContainer = document.getElementById("msgBox")
        if (getMsgContainer.scrollTop !== 0) {
            getMsgContainer.scrollTop = 0
        }
    }

    openFileUpload = (e) => {
        this.fileUploader.current.click()
    }

    copytoClipBoard = (e) => {
        var urlName = window.location.href
        copy(urlName)
        this.setState({
            copyStatus: 'copied'
        })
    }

    render() {
        var { roomDetails, messages, copyStatus, lastSender } = this.state
        var sessionUsername = sessionStorage.getItem('username')
        if (messages.length > 0) {
            var roomDetailsMembers = Object.keys(roomDetails.members)

        }

        return (
            <div className="container-fluid">
                <button className={style.leaveBtn} onClick={this.leaveRoom}>
                    <div className={style.leaveDiv}>
                        <img className={style.leaveImg} src={BackIcon} alt="backIcon" />
                        <p className={style.leaveText}> Leave Room</p>
                    </div>
                </button>

                {copyStatus === 'copied' &&
                    <div className="alert alert-success" id={style.alertDisplay}>
                        "Copied to clipboard"
                    </div>}



                <div className="row noMargin" id={style.mainContent}>
                    <div className={sessionStorage.getItem('user-type') === 'creator'?"col-md-4":"col-md-5"} id={style.left}>
                        {this.capitalizeUsername()}
                        <p className={style.roomId}>Room ID: {this.state.roomID}</p>

                        <>
                            <i className="fa fa-clipboard" style={{ fontSize: "24px", color: "red" }}></i>
                            <p onClick={this.copytoClipBoard} style={{ cursor: "pointer", color: "#9a9a9a" }}>Copy Room link </p>
                            <textarea ref={this.urlText} id="urlTextField" style={{ display: "none" }}></textarea>
                        </>

                        <p className={style.memTitle}>Members in Lobby:</p>
                        <div className={style.memberDisplay}>
                            {roomDetails !== '' && Object.keys(roomDetails.members).length > 0 && Object.keys(roomDetails.members).map((item) => {
                                return (
                                    <div className={style.imgndtext}>
                                        <img className={style.memberImg} src={AvatarArr[roomDetails.members[item]]} alt="avatarimg" />
                                        <span className={style.memName} key={item}>{item}</span>
                                    </div>

                                )
                            })}
                        </div>
                    </div>


                    {sessionStorage.getItem('user-type') === 'creator'&&
                    <div className="col-md-4" id={style.middle}>
                        <div className={style.uploadFile} onClick={this.openFileUpload}>
                            <img className={style.uploadImg} src={UploadIcon} alt="uploadIcon" />
                            <p>Upload file</p>
                        </div>
                        <input ref={this.fileUploader} className={style.inputFile} type="file" id="videofile" onChange={this.handleFile} />



                        {this.state.extensionCheck ?
                            <div className={style.fileCheck}>
                                <p className={style.fileName}>{this.state.fileName}</p>
                                {sessionStorage.getItem('user-type') === 'creator' && <button className={style.startPlaying} onClick={this.startVideo}><span>Start partying</span></button>}
                            </div>

                            : <div className={style.fileCheck}>
                                <h4 style={{ color: 'red' }}>{this.state.errorMsg}</h4>
                            </div>}
                        {/* <div className={style.fileCheck}>
                        {sessionStorage.getItem('user-type') === 'joinee' && this.state.ready && <p style={{ color: 'blue' }}>Waiting for the host to start</p>}
                        {sessionStorage.getItem('user-type') === 'joinee' && <button id='readyButton' className={style.startPlaying} onClick={this.readyForVideo}>Ready for partying</button>}
                        {sessionStorage.getItem('user-type') === 'joinee' && (videoStreamFlag ? <h6 style={{ color: 'red' }}>You have not selected any file, video will be stream to you directly</h6> : <h6 style={{ color: 'green' }}>Your selected file would be played</h6>)}
                    </div> */}

                    </div>
}



                    <div className={sessionStorage.getItem('user-type') === 'creator'?"col-md-4":"col-md-7"} id={style.right}>
                        <div className={sessionStorage.getItem('user-type') === 'creator'?`${style.msgBoxCreator}`:`${style.msgBoxJoinee}`}>
                            <div className={style.msg} id="msgBox">
                                {messages.length > 0 ?

                                    messages.map((message, id) => {
                                        return (
                                            <>
                                                {/* <img></img> */}
                                                {Boolean(message.senderName === sessionUsername) ?
                                                    <div className={style.msgContainerSender} key={id}>

                                                        <p className={style.chatmsgRight}>{message.message}</p>
                                                        <p className={style.nameRight}>:{message.senderName}</p>
                                                        {roomDetailsMembers.includes(message.senderName) ?
                                                            <img className={style.chatmemimgRight} src={AvatarArr[roomDetails.members[message.senderName]]} alt="avatarimg" />

                                                            : "Member left"}
                                                    </div>
                                                    :
                                                    <div className={style.msgContainer} key={id}>
                                                        {roomDetailsMembers.includes(message.senderName) ?

                                                            <img className={style.chatmemimgLeft} src={AvatarArr[roomDetails.members[message.senderName]]} alt="avatarimg" />
                                                            : "Member Left"}
                                                        <p className={style.nameLeft}>{message.senderName}:</p>
                                                        <p className={style.chatmsgLeft}>{message.message}</p>


                                                    </div>
                                                }


                                            </>

                                        )
                                    })
                                    :
                                    <>
                                        <p style={{color:"darkgrey", fontSize: "13px"}}>Enter message below to chat with friends</p>
                                    </>

                                }

                            </div>
                            <div className={`row ${style.msgfooter}`}>
                                <form onSubmit={this.sendMsg} style={{display:"flex",width:"100%",alignItems:"center"}}>
                                    <input type="text" name='chat' id="chat" className={style.chatInput} onChange={this.handleMessageChange} placeholder="Type to chat" autoComplete="off"></input>
                                    <img src={SendBtn} alt="send button" id={style.sendBtn} onClick={this.sendMsg} />
                                    <button type="submit" style={{ display: "none" }}>Send</button>
                                </form>
                            </div>
                            {/* <button onClick={this.sendMsg}>Send</button> */}
                        </div>
                    </div>

                </div>
                {/* <h4>Room I.D.</h4>
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
                <button onClick={this.leaveRoom}>Leave Room</button> */}
            </div>
        )
    }
}