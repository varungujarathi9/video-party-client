import React from "react";
import { serverSocket } from "./helper/Sockets";
import style from "./Login.module.css";
import { AvatarArr } from "./Avatar.js";
import BackIcon from "../images/BackIcon.png";
import { withRouter } from "./helper/Navigate";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: "",
      username: "",
      roomId: "",
      usernameError: "",
      avatar: AvatarArr,
      setAvatarName: null,
      errorMessage: "",
      usernametypeerror: "",
    };
  }

  componentDidMount() {
    // check if user-type is set or not
    if (
      sessionStorage.getItem("user-type") === "creator" ||
      sessionStorage.getItem("user-type") === "joinee"
    ) {
      this.setState({ userType: sessionStorage.getItem("user-type") });
    } else {
      sessionStorage.clear();
      this.props.navigate("/");
    }

    serverSocket.on("login-error", (data) => {
      this.setState({
        errorMessage: data["msg"],
      });
    });
  }

  onClickLogin = async (event) => {
    event.preventDefault();
    var regEx = /^[a-z0-9]+$/i;
    var validation = regEx.test(this.state.username);

    // TODO: Add regex to check username is valid
    if (this.state.username !== "" && validation) {
      // createPeerConnection()
      var { avatar } = this.state;
      var avatarName = Object.keys(avatar);
      var avatarRandom =
        avatarName[Math.floor(Math.random() * avatarName.length)];
      this.setState({
        setAvatarName: avatarRandom,
      });
      if (this.state.userType === "creator") {
        serverSocket.emit("create", { username: this.state.username });
        console.log("create room");
        this.handleCreateRoom();
      } else if (this.state.userType === "joinee") {
        serverSocket.emit("join", {
          username: this.state.username,
          roomId: this.state.roomId,
        });
        console.log("join room");
        this.handleJoinRoom();
      }
    } else if (validation === false && this.state.username !== "") {
      this.setState({ usernametypeerror: "No special characters allowed" });
    } else {
      this.setState({ usernameError: "Please provide username" });
    }
  };

  handleCreateRoom = () => {
    serverSocket.on("created", (data) => {
      sessionStorage.setItem("username", this.state.username);
      sessionStorage.setItem("room-id", data["room-id"]);
      sessionStorage.setItem(
        "room-details",
        JSON.stringify(data["room-details"])
      );
      this.props.navigate("/lobby");
    });
  };

  handleJoinRoom = () => {
    serverSocket.on("joined", (data) => {
      sessionStorage.setItem("username", this.state.username);
      sessionStorage.setItem("room-id", this.state.roomId);
      sessionStorage.setItem(
        "room-details",
        JSON.stringify(data["room-details"])
      );
      this.props.navigate("/lobby");
    });
  };

  handleUsernameChange = (event) => {
    event.preventDefault();
    this.setState({
      username: event.target.value.trim(),
      usernameError: "",
      usernametypeerror: "",
    });
  };

  handleRoomIDChange = (event) => {
    event.preventDefault();
    this.setState({
      roomId: event.target.value.trim().toUpperCase(),
    });
    console.log(event.target.value.trim().toUpperCase());
  };

  navigateBack = () => {
    this.props.navigate("/");
  };

  render() {
    let { usernameError, usernametypeerror, errorMessage } = this.state;

    return (
      <div className={style.loginDiv}>
        <button className={style.backBtn} onClick={this.navigateBack}>
          <div className={style.btnDiv}>
            <img className={style.btnImg} src={BackIcon} alt="backIcon" />
            <p className={style.btnText}> Back</p>
          </div>
        </button>

        <div className={style.formDiv}>
          <label>Credentials</label>
          <form className={`container ${style.form}`}>
            <div className={style.unameDiv}>
              <label className={style.username} htmlFor="username">
                {" "}
                Username
              </label>
              <input
                className={style.unameInput}
                type="text"
                id="username"
                name="username"
                maxLength="20"
                onChange={this.handleUsernameChange}
                placeholder="username"
              ></input>
            </div>
            {this.state.userType === "joinee" ? (
              <div className={style.roomIdDiv}>
                <label className={style.roomId} htmlFor="roomId">
                  Room ID
                </label>
                <input
                  className={style.roomIdInput}
                  type="text"
                  id="roomId"
                  name="roomId"
                  minLength="6"
                  maxLength="6"
                  onChange={this.handleRoomIDChange}
                  placeholder="roomId"
                ></input>
              </div>
            ) : null}
            <h6
              style={{ color: "red", fontSize: "16px", margin: "5px 0px 12px" }}
            >
              {usernameError}
            </h6>
            <h6
              style={{ color: "red", fontSize: "16px", margin: "5px 0px 12px" }}
            >
              {usernametypeerror}
            </h6>
            <button className={style.joinBtn} onClick={this.onClickLogin}>
              Login
            </button>
          </form>
          <h6 style={{ color: "red", fontSize: "16px", margin: "5px" }}>
            {errorMessage}
          </h6>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
