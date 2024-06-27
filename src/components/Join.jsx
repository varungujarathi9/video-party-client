import React from "react";
import { serverSocket } from "./helper/Sockets";
import { withRouter } from "./helper/Navigate";
// import {createPeerConnection,sendOffer,sendAnswer,handleSignalingData} from './webrtcfile.js'

class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: "",
      username: "",
      roomId: props.roomId,
      errorMessage: "",
    };
  }

  componentDidMount() {
    // check if user-type is set or not
    if (sessionStorage.getItem("user-type") === "joinee") {
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

  onClickJoin = async (event) => {
    event.preventDefault();

    // TODO: Add regex to check username is valid
    console.log("Joining room");
    if (this.state.username !== "") {
      serverSocket.emit("join-room", {
        username: this.state.username,
        roomId: this.state.roomId,
      });
      this.handleJoinRoom();
    } else {
      this.setState({ usernameError: "Please provide username" });
    }
  };

  // handleCreateRoom = () => {
  //     serverSocket.on('room-created',(data)=>{
  //         sessionStorage.setItem('username', this.state.username)
  //         sessionStorage.setItem('room-id', data['room-id'])

  //         sessionStorage.setItem('room-details', JSON.stringify(data['room-details']))
  //         navigate('/lobby')
  //     })
  // }

  handleJoinRoom = () => {
    serverSocket.on("room-joined", (data) => {
      sessionStorage.setItem("username", this.state.username);
      sessionStorage.setItem("room-id", this.state.roomId);
      sessionStorage.setItem("user-type", "joinee");
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
    });
  };

  // handleRoomIDChange = (event) => {
  //     event.preventDefault()
  //     this.setState({
  //         roomId: event.target.value.trim()
  //     })
  // }

  render() {
    let { errorMessage } = this.state;

    return (
      <div>
        <h1>Login to continue</h1>
        <form>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              maxLength="20"
              onChange={this.handleUsernameChange}
            ></input>
          </div>
          {/* {this.state.userType === 'joinee' ? (
                        <div>
                            <label htmlFor='roomId'>Room ID</label>
                            <input type='text' id='roomId' name='roomId' minLength='6' maxLength='6' onChange={this.handleRoomIDChange}></input>
                        </div>
                    ) : null
                    } */}
          <button onClick={this.onClickJoin}>Join</button>
        </form>
        <h6 style={{ color: "red", fontSize: "16px", margin: "5px" }}>
          {errorMessage}
        </h6>
      </div>
    );
  }
}

export default withRouter(Join);
