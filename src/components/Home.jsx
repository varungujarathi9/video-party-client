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
    navigatePage =()=>{
        navigate('/developers')
    }

    render() {

        return (
            <div className="container-fluid">
                <div className="row">
                    <h1 className={style.title}>Video Party!!</h1>
                </div>

               {/* create party details */}
                <div className={`row ${style.btnsdiv}`}>
                    <div className={`col-md-6 ${style.leftDiv}`}>
                        <div  className="col-md-12" style={{maxWidth:"80%", height:"55%", margin:"auto"}}>
                            <button className={style.createBtn} onClick={this.navigateToLogin('creator')}>
                                <div className={style.buttonDiv}>
                                    <img className={style.buttonImg} src={CreateRoomPng} alt="create room" />
                                    <p className={style.buttonText}>Create Party</p>
                                </div>
                            </button>
                        </div>
                        <div className={`col-md-12 ${style.details}`}>
                            <h4 className={style.detailsTitle}>Host your own room</h4>
                            <p className={style.btnDetails}>
                                Want to watch movies with your friends? Host your own room and watch movies with your friends seemlessly.
                            </p>
                        </div>
                    </div>


                    {/* join btn details */}
                    <div className="col-md-6">
                        <div  className="col-md-12" style={{maxWidth:"80%", height:"55%", margin:"auto"}}>
                            <button className={style.joinBtn} onClick={this.navigateToLogin('joinee')}>
                                <div className={style.buttonDiv}>
                                    <img className={style.buttonImg} src={JoinRoomPng} alt="join room" />
                                    <p className={style.buttonText}>Join Party</p>
                                </div>
                            </button>
                        </div>
                        <div className={`col-md-12 ${style.details}`}>
                            <h4 className={style.detailsTitle}>Join an existing room</h4>
                            <p className={style.btnDetails}>
                                Want to watch movies alone? Stream it online and watch it alone.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`row ${style.developersLink}`}>
                    <p className={style.extras}>Made with <img className={style.heartImg} src={HeartIcon} alt="heart" onClick={this.navigatePage} style={{cursor:"pointer"}}/> </p>
                </div>
            </div>
        )
    }
}