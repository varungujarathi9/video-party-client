import React from 'react'
import ReactPlayer from 'react-player'

export default class VideoPage extends React.Component{
    render(){
        const videoFileUrl = localStorage.getItem('video_file')
        return(
            <div className='player-wrapper'>
            <ReactPlayer
            className='react-player fixed-bottom'
            url= {videoFileUrl}
            width='100%'
            height='100%'
            controls = {true}

            />
        </div>
        )
    }
}