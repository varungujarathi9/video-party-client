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
                <div className="col-md-12">
                    <button className={style.backBtn} onClick={this.navigateBack}>
                        <div className={style.btnDiv}>
                            <img className={style.btnImg} src={BackIcon} alt="backIcon" />
                            <p className={style.btnText}> Back</p>
                        </div>
                    </button>
                </div>

                <div className={`row noMargin ${style.developersDiv}`}>
                    <div className={`col-md-12 ${style.developerTitle}`} >
                        <h1><span>Developers</span></h1>
                    </div>
                    <div className="col-md-4 col-sm-12">
                    <div className={`card ${style.profileCard}`}>
                            <img src={Varun} className={`card-img-top ${style.developerImage}`} alt="..." />
                            <div className="card-body text-center">
                                <h5 className="card-title">Varun Gujarathi</h5>
                                <a href="https://www.linkedin.com/in/varungujarathi/" target="_blank">
                                <img src={LinkedIn} className={style.linkImg} alt="linkedin" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-sm-12">
                        <div className={`card ${style.profileCard}`}>

                            <img src={Ak} className={`card-img-top ${style.developerImage}`} alt="..." />

                            <div className="card-body text-center">
                                <h5 className="card-title">Aravind Krishnan</h5>
                                <a href="https://www.linkedin.com/in/aravind-krishnan-808a85152/" target="_blank">
                                <img src={LinkedIn} className={style.linkImg} alt="linkedin" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-sm-12">
                        <div className={`card ${style.profileCard}`}>
                            <img src={Jay} className={`card-img-top ${style.developerImage}`} alt="..." />
                            <div className="card-body text-center">
                                <h5 className="card-title">Jay Khatri</h5>
                                <a href="https://www.linkedin.com/in/jay-khatri-a52483169/" target="_blank">
                                <img src={LinkedIn} className={style.linkImg} alt="linkedin" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={`col-md-12 ${style.designerTitle}`}>
                        <h1><span>Designers</span></h1>
                    </div>

                    <div className="col-md-2"></div>
                    <div className="col-md-4 col-sm-12">
                        <div className={`card ${style.profileCard}`}>
                            <img src={Rahul} className={`card-img-top ${style.developerImage}`} alt="..." />
                            <div className="card-body text-center">
                                <h5 className="card-title">Rahul Bhide</h5>
                                <a href="https://www.linkedin.com/in/rahul-bhide/" target="_blank">
                                <img src={LinkedIn} className={style.linkImg} alt="linkedin" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <div className={`card ${style.profileCard}`}>
                            <img src={Rihan} className={`card-img-top ${style.developerImage}`} alt="..." />
                            <div className="card-body text-center">
                                <h5 className="card-title">Rihan Krithik Ramesh</h5>
                                <a href="https://www.linkedin.com/in/rihankrithik/" target="_blank">
                                <img src={LinkedIn} className={style.linkImg} alt="linkedin" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2"></div>-
                </div>
            </div>
        )

    }
}