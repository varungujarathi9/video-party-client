import { serverSocket } from "./Sockets";
var Peer = require("simple-peer");

const TURN_SERVER_URL = "35.223.15.12:3479";
const TURN_SERVER_USERNAME = "videoparty";
const TURN_SERVER_CREDENTIAL = "videoparty100";
const SERVER_CONFIG = {
  iceServers: [
    {
      urls: "turn:" + TURN_SERVER_URL + "?transport=tcp",
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL,
    },
    {
      urls: "stun:" + TURN_SERVER_URL,
      username: TURN_SERVER_USERNAME,
      credential: TURN_SERVER_CREDENTIAL,
    },
  ],
};

var peerConnections = {};
var videoPlayer;
// var vidTracks;
// var audTracks;
// function addMedia(joineePC) {
//   vidTracks = stream.getVideoTracks();
//   audTracks = stream.getAudioTracks();
//   joineePC.addTrack(vidTracks[0], stream);
//   joineePC.addTrack(audTracks[0], stream);
//   console.log("stream added");
// }

// async function getLocalStream() {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     return stream;
//   } catch (err) {
//     console.error("Failed to get local stream", err);
//     throw err; // Rethrow or handle as needed
//   }
// }

function receiveStream() {
  // send my sdpData to creator via socket
  const creatorPeer = new Peer({
    initiator: false,
  });
  creatorPeer.on("signal", (sdpData) => {
    console.log("sending answer");
    serverSocket.emit("send-answer", {
      sdpData: sdpData,
      roomId: sessionStorage.getItem("room-id"),
      from: sessionStorage.getItem("username"),
    });
  });

  creatorPeer.on("connect", (data) => {
    console.log("creatorPeer connected");
  });

  creatorPeer.on("stream", (streamObj) => {
    console.log("stream received");
    videoPlayer = document.querySelector("video");

    const audioTracks = streamObj.getAudioTracks();
    if (audioTracks.length > 0) {
      console.log("Stream contains audio tracks");
      audioTracks[0].enabled = true; // This line is optional and depends on your use case
    } else {
      console.log("Stream does not contain audio tracks");
    }

    if (videoPlayer !== null && videoPlayer !== undefined) {
      if ("srcObject" in videoPlayer) {
        videoPlayer.srcObject = streamObj;
      } else {
        videoPlayer.src = window.URL.createObjectURL(streamObj); // for older browsers
      }
    }
    videoPlayer.muted = false; // Ensure the video is not muted
    videoPlayer.volume = 1; // Set the volume to 100%
  });

  serverSocket.on("receive-offer", (data) => {
    if (data.to == sessionStorage.getItem("username")) {
      console.log("offer received");
      creatorPeer.signal(data.sdpData);
    }
  });
}

function startStream(roomMembers) {
  Object.keys(roomMembers).map((username) => {
    peerConnections[username] = {
      peerConnectionObject: new Peer({
        initiator: true, // Important: Set to false because we are receiving the offer
      }),
    };

    let peer = peerConnections[username].peerConnectionObject;

    // Add the stream to the peer connection object
    peer.on("signal", (sdpData) => {
      console.log("sending offer");
      serverSocket.emit("send-offer", {
        sdpData: sdpData,
        to: username,
        roomId: sessionStorage.getItem("room-id"),
      });
    });

    peer.on("connect", () => {
      console.log("peer connected");
      // Capture the stream from the video element
      videoPlayer = document.querySelector("video");
      let stream;
      if (videoPlayer.captureStream) {
        stream = videoPlayer.captureStream();
      } else if (videoPlayer.mozCaptureStream) {
        stream = videoPlayer.mozCaptureStream();
      } else {
        console.error("Stream capture is not supported");
        return;
      }

      //   // Now you can use stream.getTracks() if stream is correctly captured
      //   if (stream && typeof stream.getTracks === "function") {
      //     console.log("sending video");
      //     stream.getTracks().forEach((track) => {
      //       peer.addTrack(track, stream);
      //       console.log("stream added");
      //     });
      //   } else {
      //     console.error(
      //       "Captured stream is invalid or getTracks is not a function."
      //     );
      //   }
      // });
      if (stream) {
        peer.addStream(stream);
      }
    });
  });

  serverSocket.on("receive-answer", (data) => {
    console.log("answer received");
    const { from, sdpData } = data;
    peerConnections[from]["peerConnectionObject"].signal(sdpData);
  });
}

function destroyPeerConnections() {
  // console.log(peerConnections);
  // Object.keys(peerConnections).map((username) => {
  //   // check if username same as own username
  //   if (username !== sessionStorage.getItem("username")) {
  //     peerConnections[username].peerConnectionObject.removeStream(stream);
  //     peerConnections[username].peerConnectionObject.destory();
  //     console.log(peerConnections[username].peerConnectionObject);
  //     console.log(username, "connection destroyed");
  //   }
  // });
  // peerConnections = {};
  // videoPlayer = null;
  // stream = null;
  // vidTracks = null;
  // audTracks = null;
  // if (creatorPC !== null && creatorPC !== undefined) creatorPC.destroy();
  // creatorPC = null;
}

export { startStream, receiveStream, destroyPeerConnections };
