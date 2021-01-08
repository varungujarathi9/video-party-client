import React from 'react'
import {Router} from '@reach/router'
import Home from '../Home'
import Login from '../Login'
import Lobby from '../Lobby'
import Join from '../Join'
import VideoPlayer from '../VideoPlayer'

export default class RouterPage extends React.Component{
    render(){
        return(
            <Router>
                <Home exact path="/" />
                <Login exact path="/login" />
                <Lobby exact path="/lobby" />
                <Join exact path="/join" />
                <VideoPlayer exact path="/video-player" />
            </Router>
        )
    }
}