import React from 'react'
import style from './Developers.module.css'
import BackIcon from '../images/BackIcon.png'
import { navigate } from '@reach/router'
import Twitter from '../images/twitter.png'
import Github from '../images/github.svg'
import LinkedIn from '../images/linkedin.png'
import Ak from '../images/ak.jpeg'
import Jay from '../images/Jay.png'
import Varun from '../images/Varun.png'
import Rihan from '../images/rihan.png'
import Rahul from '../images/Rahul.png'

export default class DevelperPage extends React.Component {


    navigateBack = () => {
        navigate("/")
    }
    render() {
        return (
            <div className="container-fluid">
                <button className={style.backBtn} onClick={this.navigateBack}>
                    <div className={style.btnDiv}>                       
                            <img className={style.btnImg} src={BackIcon} alt="backIcon" />
                        
                        <p className={style.btnText}> Back</p>
                    </div>
                </button>

                <div className={`row noMargin ${style.developerdiv}`}>
                    <div className={`col-md-12 ${style.developerdetails}`} >
                        Developers
                    </div>
                    <div className="card" style={{ width: "300px",marginRight:"5%" }}>
                       
                        <img src={Ak} className="card-img-top" alt="..." />
                        
                        <div className="card-body text-center">
                            <h5 className="card-title">Aravind Krishnan</h5>
                            <a href="https://www.linkedin.com/in/aravind-krishnan-808a85152/" target="_blank">
                            <img src={LinkedIn} className={style.linkImg} alt="linkedin image" />
                            </a>
                        </div>
                    </div>
                    <div className="card" style={{ width: "300px" ,marginRight:"5%"}}>
                        <img src={Varun} className="card-img-top" alt="..." />
                        <div className="card-body text-center">
                            <h5 className="card-title">Varun Gujarathi </h5>
                            <a href="https://www.linkedin.com/in/varungujarathi/" target="_blank">
                            <img src={LinkedIn} className={style.linkImg} alt="linkedin image" />
                            </a>
                        </div>
                    </div>
                    <div className="card" style={{ width: "300px",marginRight:"5%" }}>
                        <img src={Jay} className="card-img-top" alt="..." />
                        <div className="card-body text-center">
                            <h5 className="card-title">Jay Khatri</h5>
                            <a href="https://www.linkedin.com/in/jay-khatri-a52483169/" target="_blank">
                            <img src={LinkedIn} className={style.linkImg} alt="linkedin image" />
                            </a>
                        </div>
                    </div>
                    
                    <div className={`col-md-12 ${style.designerdetails}`}>
                        Designers
                    </div>
                  
                    <div className="card" style={{ width: "300px",marginRight:"5%" }}>
                        <img src={Rahul} className="card-img-top" alt="..." />
                        <div className="card-body text-center">
                            <h5 className="card-title" >Rahul Bhide</h5>
                            <a href="https://www.linkedin.com/in/rahul-bhide/" target="_blank">
                            <img src={LinkedIn} className={style.linkImg} alt="linkedin image" />
                            </a>
                        </div>
                    </div>
                    <div className="card" style={{ width: "300px",marginRight:"5%" }}>
                        <img src={Rihan} className="card-img-top" alt="..." />
                        <div className="card-body text-center">
                            <h5 className="card-title">Rihan Krithik Ramesh</h5>     
                            <a href="https://www.linkedin.com/in/rihankrithik/" target="_blank">                       
                            <img src={LinkedIn} className={style.linkImg} alt="linkedin image" />
                            </a>
                        </div>
                    </div>

                    
                    
                </div>

            </div>
        )

    }
}