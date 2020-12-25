import { navigate } from '@reach/router'
import React from 'react'
import style from './Home.module.css'
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
                <h1 className={style.title}>Video Party!!</h1>
                <p className={style.about}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500
                </p>
                <button  className={style.createBtn}onClick={this.navigateToLogin('creator')}>Create Party</button>
                <button  className={style.joinBtn}onClick={this.navigateToLogin('joinee')}>Join Party</button>
            </div>
        )
    }
}