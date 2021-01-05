import { navigate } from '@reach/router'
import React from 'react'

export default class Home extends React.Component{

    componentDidMount(){
        // clear localStorage on coming back to homepage
        sessionStorage.clear()
    }

    navigateToLogin = (userType) => (event) => {
        sessionStorage.setItem('user-type', userType)
        navigate('/login')
    }

    render(){

        return(
            <div>
                <h1>Lets Party!!</h1>
                <button  onClick={this.navigateToLogin('creator')}>Create Party</button>
                <button  onClick={this.navigateToLogin('joinee')}>Join Party</button>
            </div>
        )
    }
}