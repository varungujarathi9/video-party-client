import React from "react";
import style from "./Home.module.css";
import CreateRoomPng from "../images/createroom.png";
import JoinRoomPng from "../images/joinroom.png";
import HeartIcon from "../images/heart.png";
import { withRouter } from "./helper/Navigate";

class Home extends React.Component {
  componentDidMount() {
    // clear localStorage on coming back to homepage
    sessionStorage.clear();

    // make a request to https://video-party-server.onrender.com/ to wake up the server
    fetch("https://video-party-server.onrender.com/")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  navigateToLogin = (userType) => (event) => {
    sessionStorage.setItem("user-type", userType);
    this.props.navigate("/login");
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <h1 className={style.title}>Video Party!!</h1>
        </div>

        {/* create party details */}
        <div className={`row ${style.btnsdiv}`}>
          <div className={`col-md-6 ${style.leftDiv}`}>
            <div className="col-md-12">
              <button
                className={style.createBtn}
                onClick={this.navigateToLogin("creator")}
              >
                <div className={style.buttonDiv}>
                  <img
                    className={style.buttonImg}
                    src={CreateRoomPng}
                    alt="create room"
                  />
                  <p className={style.buttonText}>Create Party</p>
                </div>
              </button>
            </div>
            <div className={`col-md-12 ${style.details}`}>
              <h4 className={style.detailsTitle}>Host your own room</h4>
              <p className={style.btnDetails}>
                Host your own room and watch movies with your friends
                seamlessly.
              </p>
            </div>
          </div>

          {/* join btn details */}
          <div className="col-md-6">
            <div className="col-md-12">
              <button
                className={style.joinBtn}
                onClick={this.navigateToLogin("joinee")}
              >
                <div className={style.buttonDiv}>
                  <img
                    className={style.buttonImg}
                    src={JoinRoomPng}
                    alt="join room"
                  />
                  <p className={style.buttonText}>Join&nbsp; Party</p>
                </div>
              </button>
            </div>
            <div className={`col-md-12 ${style.details}`}>
              <h4 className={style.detailsTitle}>Join an existing room</h4>
              <p className={style.btnDetails}>
                Join the existing room and watch streamed videos with your
                friends.
              </p>
            </div>
          </div>
        </div>
        <div className={`row ${style.developersLink}`}>
          <p className={style.extras}>
            Made with &nbsp;
            <img
              className={style.heartImg}
              src={HeartIcon}
              alt="heart"
              style={{ cursor: "pointer" }}
            />{" "}
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
