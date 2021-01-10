import React from 'react'
import style from './Developers.module.css'
import BackIcon from '../images/BackIcon.png'
import { navigate } from '@reach/router'
import Twitter from '../images/twitter.png'
import Github from '../images/github.svg'
import LinkedIn from '../images/linkedin.png'

export default class DevelperPage extends React.Component{

    
    navigateBack =()=>{
        navigate("/")
    }
    render(){
        return(
            <div className="container-fluid">
                <button className={style.backBtn} onClick={this.navigateBack}>
                     <div className={style.btnDiv}>
                     <img className={style.btnImg}src={BackIcon} alt="backIcon" />
                     <p className={style.btnText}> Back</p>
                     </div>
                </button>

            <div className={`row noMargin ${style.developerdiv}`}>
                <div className ={`col-md-12 ${style.developerdetails}`} >
                    <img className="col-md-3" src="Varuns image" alt="Varuns image"/>
                    <div className="row noMargin">
                    <p className={`col-md-9 ${style.developertext}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere a tellus euismod consectetur. Quisque in lacinia ipsum. Maecenas a convallis nibh. Ut at dapibus leo. Maecenas ut augue tempor, pretium elit vel, ultricies tortor. Mauris vel imperdiet nisl. Praesent consequat turpis a diam bibendum elementum. Fusce eget congue diam, non tristique ipsum. Donec condimentum neque ligula, ac tincidunt turpis tempus sit amet. Vestibulum rhoncus diam vitae metus semper, eget scelerisque nisl fermentum. Phasellus et velit eu justo vehicula varius a id nulla. Nulla faucibus, ipsum a ultricies feugiat, sem dolor commodo velit, vitae tempor sapien erat id diam. Mauris nec luctus libero.
                    </p>
                <div className={`col-md-9 ${style.linkdiv}`}>
                    <img src={Github}  className={style.linkImg}alt="github image"/>
                    <img src={Twitter} className={style.linkImg} alt="twitter image"/>
                    <img src={LinkedIn} className={style.linkImg} alt="linkedin image"/>
                </div>
                    </div>
                </div>

                <div className ={`col-md-12 ${style.developerdetails}`}>
                <img className="col-md-3" src="Ak image" alt="Ak image"/>
                 <div className="row noMargin">
                    <p className={`col-md-9 ${style.developertext}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere a tellus euismod consectetur. Quisque in lacinia ipsum. Maecenas a convallis nibh. Ut at dapibus leo. Maecenas ut augue tempor, pretium elit vel, ultricies tortor. Mauris vel imperdiet nisl. Praesent consequat turpis a diam bibendum elementum. Fusce eget congue diam, non tristique ipsum. Donec condimentum neque ligula, ac tincidunt turpis tempus sit amet. Vestibulum rhoncus diam vitae metus semper, eget scelerisque nisl fermentum. Phasellus et velit eu justo vehicula varius a id nulla. Nulla faucibus, ipsum a ultricies feugiat, sem dolor commodo velit, vitae tempor sapien erat id diam. Mauris nec luctus libero.
                    </p>
                <div className={`col-md-9 ${style.linkdiv}`}>
                    <img src={Github}  className={style.linkImg}alt="github image"/>
                    <img src={Twitter} className={style.linkImg} alt="twitter image"/>
                    <img src={LinkedIn} className={style.linkImg} alt="linkedin image"/>
                </div>
                    </div>

                </div>

                <div className ={`col-md-12 ${style.developerdetails}`}>
                <img className="col-md-3" src="Jay image" alt="Jay image"/>
                <div className="row noMargin">
                    <p className={`col-md-9 ${style.developertext}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere a tellus euismod consectetur. Quisque in lacinia ipsum. Maecenas a convallis nibh. Ut at dapibus leo. Maecenas ut augue tempor, pretium elit vel, ultricies tortor. Mauris vel imperdiet nisl. Praesent consequat turpis a diam bibendum elementum. Fusce eget congue diam, non tristique ipsum. Donec condimentum neque ligula, ac tincidunt turpis tempus sit amet. Vestibulum rhoncus diam vitae metus semper, eget scelerisque nisl fermentum. Phasellus et velit eu justo vehicula varius a id nulla. Nulla faucibus, ipsum a ultricies feugiat, sem dolor commodo velit, vitae tempor sapien erat id diam. Mauris nec luctus libero.
                    </p>
                <div className={`col-md-9 ${style.linkdiv}`}>
                    <img src={Github}  className={style.linkImg}alt="github image"/>
                    <img src={Twitter} className={style.linkImg} alt="twitter image"/>
                    <img src={LinkedIn} className={style.linkImg} alt="linkedin image"/>
                </div>
                    </div>

                    </div>
                
                    <div className ={`col-md-12 ${style.developerdetails}`}>
                <img className="col-md-3" src="Rahul Image" alt="Rahul Image"/>
                <div className="row noMargin">
                    <p className={`col-md-9 ${style.developertext}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere a tellus euismod consectetur. Quisque in lacinia ipsum. Maecenas a convallis nibh. Ut at dapibus leo. Maecenas ut augue tempor, pretium elit vel, ultricies tortor. Mauris vel imperdiet nisl. Praesent consequat turpis a diam bibendum elementum. Fusce eget congue diam, non tristique ipsum. Donec condimentum neque ligula, ac tincidunt turpis tempus sit amet. Vestibulum rhoncus diam vitae metus semper, eget scelerisque nisl fermentum. Phasellus et velit eu justo vehicula varius a id nulla. Nulla faucibus, ipsum a ultricies feugiat, sem dolor commodo velit, vitae tempor sapien erat id diam. Mauris nec luctus libero.
                    </p>
                <div className={`col-md-9 ${style.linkdiv}`}>
                    <img src={Github}  className={style.linkImg}alt="github image"/>
                    <img src={Twitter} className={style.linkImg} alt="twitter image"/>
                    <img src={LinkedIn} className={style.linkImg} alt="linkedin image"/>
                </div>
                    </div>

                    </div>
                

                    <div className ={`col-md-12 ${style.developerdetails}`}>
                <img className="col-md-3" src="Rihan image" alt="Rihan image"/>
                <div className="row noMargin">
                    <p className={`col-md-9 ${style.developertext}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere a tellus euismod consectetur. Quisque in lacinia ipsum. Maecenas a convallis nibh. Ut at dapibus leo. Maecenas ut augue tempor, pretium elit vel, ultricies tortor. Mauris vel imperdiet nisl. Praesent consequat turpis a diam bibendum elementum. Fusce eget congue diam, non tristique ipsum. Donec condimentum neque ligula, ac tincidunt turpis tempus sit amet. Vestibulum rhoncus diam vitae metus semper, eget scelerisque nisl fermentum. Phasellus et velit eu justo vehicula varius a id nulla. Nulla faucibus, ipsum a ultricies feugiat, sem dolor commodo velit, vitae tempor sapien erat id diam. Mauris nec luctus libero.
                    </p>
                <div className={`col-md-9 ${style.linkdiv}`}>
                    <img src={Github}  className={style.linkImg}alt="github image"/>
                    <img src={Twitter} className={style.linkImg} alt="twitter image"/>
                    <img src={LinkedIn} className={style.linkImg} alt="linkedin image"/>
                </div>
                    </div>

                    </div>
    

            </div>
               
            </div>
        )

    }
}