import React from 'react'
import LandingPage from '../Homepage/LandingPage'
import DecideRoom from '../RoomDecidepage/DecideRoom'
import CreateRoom from '../rooms/createroom'
import JoinRoom from '../rooms/joinroom'
import {Router} from '@reach/router'


export default class RouterPage extends React.Component{
    render(){
        return(
            <Router>
                <LandingPage exact path="/" />
                <DecideRoom  path="decideroom"/>     
                <CreateRoom path="/createroom"/>
                <JoinRoom path="/joinroom"/>           
            </Router>
        )
    }
}