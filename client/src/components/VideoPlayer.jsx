// TODO: got back to lobby when creator goes back
// TODO: leave room
// TODO: check file duration of all members
// TODO: create a ready button for joinee
import React from 'react'
import ReactPlayer from 'react-player'
import { serverSocket } from './helper/connection'

export default class VideoPlayer extends React.Component{
    state={
        playing: false,
        secondsPlayed: 0,
        lastUpdatedBy: sessionStorage.getItem('username'),
        videoPlayer: null
    }
    
    componentDidMount(){
        serverSocket.on('updated-video', (data) =>{
            if(data['pauseDetails']['username'] !== sessionStorage.getItem('username')){
                console.log('DATA:'+JSON.stringify(data['pauseDetails']))
                this.setState({
                    playing: data['pauseDetails']['playing'],
                    played: data['pauseDetails']['progressTime']
                })
                this.setState({
                    lastUpdatedBy: data['pauseDetails']['username']
                })
                this.state.videoPlayer.seekTo(data['pauseDetails']['progressTime'], 'seconds')
            }
        })
    }

    vidOnPause=()=>{
        if (this.state.lastUpdatedBy === sessionStorage.getItem('username')){
            let pauseDetails = {'playing':false,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':sessionStorage.getItem('username')}
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
            console.log('paused')
        }
        
        this.setState({
            lastUpdatedBy: sessionStorage.getItem('username')
        })
  
    }

    vidOnPlay = () => {
        if (this.state.lastUpdatedBy === sessionStorage.getItem('username')){
            let pauseDetails = {'playing':true,'progressTime':this.state.videoPlayer.getCurrentTime(), 'username':sessionStorage.getItem('username')}
            serverSocket.emit('video-update',{pauseDetails:pauseDetails})
            console.log('played')
        }

        this.setState({
            lastUpdatedBy: sessionStorage.getItem('username')
        })
    }

    ref = (player) =>{
        this.setState({videoPlayer:player})
    }
    render(){
        const videoFileUrl = localStorage.getItem('video_file')
        const {playing} =this.state
        return(
            <div className='player-wrapper'>
            <ReactPlayer
            ref ={this.ref}
            playing={playing}
            className='react-player fixed-bottom'
            url= {videoFileUrl}
            width='100%'
            height='100%'
            controls = {true}
            onPause ={this.vidOnPause}
            onPlay={this.vidOnPlay}
            />
        </div>
        )
    }
}