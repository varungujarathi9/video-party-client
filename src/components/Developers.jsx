import React from 'react'
import style from './Developers.module.css'
import BackIcon from '../images/BackIcon.png'
import { navigate } from '@reach/router'

export default class DevelperPage extends React.Component{

    
    navigateBack =()=>{
        navigate("/")
    }
    render(){
        return(
            <div>
                <button className={style.backBtn} onClick={this.navigateBack}>
                     <div className={style.btnDiv}>
                     <img className={style.btnImg}src={BackIcon} alt="backIcon" />
                     <p className={style.btnText}> Back</p>
                     </div>


                </button>
                Developers page
            </div>
        )

    }
}