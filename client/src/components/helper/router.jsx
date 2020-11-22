import React from 'react'
import {Router} from '@reach/router'
import Home from '../Home'
import Login from '../Login'
import Lobby from '../Lobby'
import VideoPlayer from '../VideoPlayer'
import DecideRoom from '../RoomDecidepage/RoomDecide'
import CreateRoom from '../rooms/createroom'
import JoinRoom from '../rooms/joinroom'
import VideoPage from '../rooms/videopage'



export default class RouterPage extends React.Component{
    render(){
        return(
            <Router>
                <Home exact path="/" />
                <Login exact path="/login" />
                <Lobby exact path="/lobby" />
                <VideoPlayer exact path="/video-player" />
                
                <DecideRoom  path="/decideroom"/>     
                <CreateRoom path="/createroom"/>
                <JoinRoom path="/joinroom"/>   
                <VideoPage path="/videopage"/>       
            </Router>
        )
    }
}