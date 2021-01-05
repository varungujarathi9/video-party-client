import { navigate } from '@reach/router'
import React from 'react'
import style from './Home.module.css'
import CreateRoomPng from '../images/createroom.png'
import JoinRoomPng from '../images/joinroom.png'
import HeartIcon from '../images/heart.png'
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
                <div>
                <h1 className={style.title}>Video Party!!</h1>
                </div>

                <div>
                <p className={style.about}>
                Download and watch videos with your peers
                </p>
                </div>
                <div>
                <button  className={style.createBtn}onClick={this.navigateToLogin('creator')}>
                    <div className={style.buttonDiv}>
                    <img className={style.buttonImg}src={CreateRoomPng} alt="createroomimg"/>
                    <p className={style.buttonText}>Create Party</p>
                    </div>
                   </button>
                <button  className={style.joinBtn}onClick={this.navigateToLogin('joinee')}>
                    <div className={style.buttonDiv}>
                    <img className={style.buttonImg} src={JoinRoomPng} alt="joinroomimg"/>
                    <p className={style.buttonText}>Join Party</p>
                    </div>
                </button>
                </div>
                
                <p className={style.extras}>Made with <img className={style.heartImg} src={HeartIcon} alt="heart image"/> </p>
            </div>
        )
    }
}