import React from 'react'
import {Router} from '@reach/router'
import Home from '../Home'
import Login from '../Login'
import Lobby from '../Lobby'
import Join from '../Join'
import VideoPlayer from '../VideoPlayer'
import NotFoundPage from '../NotFoundPage'
import DevelopersPage from '../Developers'

export default class RouterPage extends React.Component{
    render(){
        return(
            <Router>
                <Home exact path="/" />
                <Login  path="/login" />
                <Lobby path="/lobby" />
                <Join  path="/lobby/:roomId" />
                <VideoPlayer exact path="/video-player" />
                <DevelopersPage exact path="/developers"/>
                <NotFoundPage path="*" />
            </Router>
        )
    }
}