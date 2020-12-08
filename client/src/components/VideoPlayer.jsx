// TODO: got back to lobby when creator goes back--DONE
// TODO: leave room
// TODO: check file duration of all members
// TODO: create a ready button for joinee
import { navigate } from '@reach/router'
import React from 'react'
import ReactPlayer from 'react-player'
import { serverSocket } from './helper/connection'
import {getLocalStream,createPeerConnection,sendAnswer,sendOffer, handleSignalingData, setVideoPlayer} from './webrtcfile.js'

export default class VideoPlayer extends React.Component{
    constructor(props){
        super(props)
        this.state={
            playing: false,
            secondsPlayed: 0,
            lastUpdatedBy: sessionStorage.getItem('username'),
            videoPlayer: null,
            videoStreamFlag: true
        }
        this.videoPlayerRef = React.createRef()
    }

    componentDidMount(){
        console.log("COMPONENT DID MOUNT")
        if(sessionStorage.getItem('video-stream-flag') === '' || sessionStorage.getItem('video-stream-flag') === null || sessionStorage.getItem('video-stream-flag') === undefined){
            navigate('/lobby')
        }
        this.setState({
            videoStreamFlag: sessionStorage.getItem('video-stream-flag')
        })
        serverSocket.on('updated-video', (data) =>{
            if(data['pauseDetails']['username'] !== sessionStorage.getItem('username')){
                console.log('DATA:'+JSON.stringify(data['pauseDetails']))
                this.setState({
                    playing: data['pauseDetails']['playing'],
                    secondsPlayed: data['pauseDetails']['progressTime'],
                    lastUpdatedBy: data['pauseDetails']['username']
                })
                this.state.videoPlayer.seekTo(data['pauseDetails']['progressTime'], 'seconds')
                if(data['pauseDetails']['exited'] === true){
                    navigate('/lobby')
                }
            }
        })

        serverSocket.on('receive-offer', (data) => {
            handleSignalingData({'sdp':data['sesDetails'],'type':data['typeOfSdp']})
        })

        serverSocket.on('receive-answer', (data) => {
            // TODO: addIceCandidate
            // FIXME
            if(sessionStorage.getItem("user-type") === "creator"){
                handleSignalingData({'sdp':data['sesDetails'],'type':data['typeOfSdp']})
            }
        })

        setTimeout(() => {this.establishWebRTC()}, 5000)
    }

    establishWebRTC = async () =>{
        let userType = sessionStorage.getItem("user-type")
        console.log(userType)
        
        console.log(document.getElementById("video-player").firstChild)
        getLocalStream(document.getElementById("video-player").firstChild);
        
 
        createPeerConnection(userType)
        if (sessionStorage.getItem("user-type") === "creator"){
            let send_Offer = await sendOffer();
            setTimeout(function(){ serverSocket.emit('send-offer',{room_id:sessionStorage.getItem('room-id'),webRtcDesc:send_Offer}); }, 3000);
        }
        
        
    }

    componentWillUnmount(){
        if (this.state.lastUpdatedBy === sessionStorage.getItem('username')){
            let pauseDetails = {'roomID':sessionStorage.getItem('room-id'),'playing':false,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':sessionStorage.getItem('username'), 'exited':true}
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
            localStorage.removeItem('video_file')
        }
    }

    vidOnPause=()=>{
        if (this.state.lastUpdatedBy === sessionStorage.getItem('username')){
            let pauseDetails = {'roomID':sessionStorage.getItem('room-id'), 'playing':false,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':sessionStorage.getItem('username'), 'exited':false}
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
            console.log('paused')
        }

        this.setState({
            lastUpdatedBy: sessionStorage.getItem('username'),
            playing: false,
            secondsPlayed: this.state.videoPlayer.getCurrentTime()
        })

    }

    vidOnPlay = () => {
        if (this.state.lastUpdatedBy === sessionStorage.getItem('username')){
            let pauseDetails = {'roomID':sessionStorage.getItem('room-id'), 'playing':true,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':sessionStorage.getItem('username'), 'exited':false}
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
            console.log('played')
        }

        this.setState({
            lastUpdatedBy: sessionStorage.getItem('username'),
            playing: true,
            secondsPlayed: this.state.videoPlayer.getCurrentTime()
        })
    }

    handleRef = (player) =>{

        this.setState({videoPlayer:player})
      
        // if (sessionStorage.getItem("user-type") === "creator"){
        //     console.log(this.videoPlayerRef.current)
        //     getLocalStream(this.videoPlayerRef.current);
        // }
        
    }

    ready = () => {
        // this.establishWebRTC()
    }
    render(){
        console.log("RENDER START")
        const videoFileUrl = sessionStorage.getItem('video_file')
        const {playing} = this.state
        const {videoStreamFlag} = this.state
        const userType=sessionStorage.getItem('user-type')
        
        return(
            
            <div>
            {sessionStorage.getItem('user-type')==="joinee" && videoStreamFlag?<p>Stream video</p>:<p>Play local file</p>}
            <div className='player-wrapper' style={{backgroundColor:'black'}}>
            <ReactPlayer
            id="video-player"
            ref ={this.handleRef}
            playing={playing}
            className='react-player fixed-bottom'
            url= {videoFileUrl}
            width='100%'
            height='100vh'
            controls = {true}
            onPause ={this.vidOnPause}
            onPlay={this.vidOnPlay}
            onReady={this.ready}
            />
            </div>
        </div>
        )
    }
}