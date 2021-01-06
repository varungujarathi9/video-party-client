import { navigate } from '@reach/router'
import React from 'react'
import style from './Home.module.css'
import CreateRoomPng from '../images/createroom.png'
import JoinRoomPng from '../images/joinroom.png'
import HeartIcon from '../images/heart.png'

export default class Home extends React.Component {

    componentDidMount() {
        // clear localStorage on coming back to homepage
        sessionStorage.clear()
    }

    navigateToLogin = (userType) => (event) => {
        sessionStorage.setItem('user-type', userType)
        navigate('/login')
    }

    render() {

        return (
            <div>
                <div>
                    <h1 className={style.title}>Video Party!!</h1>
                </div>
                {/* <p className={style.about}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500
            </p> */}
                <div className={style.left}>
                    
                    <button className={style.createBtn} onClick={this.navigateToLogin('creator')}>
                        <div className={style.buttonDiv}>
                            <img className={style.buttonImg} src={CreateRoomPng} alt="createroomimg" />
                            <p className={style.buttonText}>Create Party</p>
                        </div>
                    </button>
                   
                    
                    <div className={style.details}>
                        <h3>Host your own room</h3>
                        <p className={style.btnDetails}>
                            Want to watch movies with your friends?? Host your own room and watch movies with your friends seemlessly.
                    </p>
                    </div>

                </div>
                <div className={style.right}>
                    
                    <button className={style.joinBtn} onClick={this.navigateToLogin('joinee')}>
                        <div className={style.buttonDiv}>
                            <img className={style.buttonImg} src={JoinRoomPng} alt="joinroomimg" />
                            <p className={style.buttonText}>Join Party</p>
                        </div>
                    </button>
                    
                   
                    <div className={style.details}>
                        <h3>Join an existing room</h3>
                        <p className={style.btnDetails}>
                            Want to watch movies alone? Stream it online and watch it alone.
                    </p>
                    </div>

                </div>
                <p className={style.extras}>Made with <img className={style.heartImg} src={HeartIcon} alt="heart image" /> </p>
            </div>
        )
    }
}