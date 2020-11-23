// TODO: got back to lobby when creator goes back--DONE
// TODO: leave room
// TODO: check file duration of all members
// TODO: create a ready button for joinee
import { navigate } from '@reach/router'
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
                    secondsPlayed: data['pauseDetails']['progressTime'],
                    lastUpdatedBy: data['pauseDetails']['username']
                })
                this.state.videoPlayer.seekTo(data['pauseDetails']['progressTime'], 'seconds')
                if(data['pauseDetails']['exited'] === true){
                    navigate('/lobby')
                }
            }
        })
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

    ref = (player) =>{
        this.setState({videoPlayer:player})
    }
    render(){
        const videoFileUrl = localStorage.getItem('video_file')
        const {playing} = this.state
        console.log(this.state)
        return(
            <div className='player-wrapper' style={{backgroundColor:'black'}}>
            <ReactPlayer
            ref ={this.ref}
            playing={playing}
            className='react-player fixed-bottom'
            url= {videoFileUrl}
            width='100%'
            height='100vh'
            controls = {true}
            onPause ={this.vidOnPause}
            onPlay={this.vidOnPlay}
            />
        </div>
        )
    }
}