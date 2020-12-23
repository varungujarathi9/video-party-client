// Config variables: change them to point to your own servers
import io from 'socket.io-client'

const SIGNALING_SERVER_URL = 'http://localhost:5000';
// const TURN_SERVER_URL = 'localhost:3478';
// const TURN_SERVER_USERNAME = 'username';
// const TURN_SERVER_CREDENTIAL = 'credential';
// WebRTC config: you don't have to change this for the example to work
// If you are testing on localhost, you can just use PC_CONFIG = {}
// const PC_CONFIG = {
//   iceServers: [
//     {
//       urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
//       username: TURN_SERVER_USERNAME,
//       credential: TURN_SERVER_CREDENTIAL
//     },
//     {
//       urls: 'turn:' + TURN_SERVER_URL + '?transport=udp',
//       username: TURN_SERVER_USERNAME,
//       credential: TURN_SERVER_CREDENTIAL
//     }
//   ]
// };

// Signaling methods

// let socket = io(SIGNALING_SERVER_URL, { autoConnect: false });

// socket.on('data', (data) => {
//   console.log('Data received: ',data);
//   handleSignalingData(data);
// });

// socket.on('ready', () => {
//   console.log('Ready');
//   // Connection with signaling server is ready, and so is local stream
//   createPeerConnection();
//   sendOffer();
// });

// let sendData = (data) => {
//   socket.emit('data', data);
// };

// WebRTC methods
let pc;
let localStream;


// let getLocalStream = () => {
//   console.log(navigator.mediaDevices)
//   navigator.mediaDevices.getUserMedia({video:true})
//     .then((stream) => {
//       console.log('Stream found');
//       localStream = stream;
//       // Connect after making sure that local stream is availble
//       socket.connect();
//     })
//     .catch(error => {
//       console.error('Stream not found: ', error);
//     });
// }

function createPeerConnection (){
  try {
    // pc = new RTCPeerConnection(PC_CONFIG);
    pc = new RTCPeerConnection();
    pc.onicecandidate = onIceCandidate;
    //at the lobby
    pc.onaddstream = onAddStream;
    pc.addStream(localStream);
    console.log('PeerConnection created');
  } catch (error) {
    console.error('PeerConnection failed: ', error);
  }
};

function sendOffer(){
  // 'this will be handled by creator'
  console.log('Send offer');
  pc.createOffer().then(
    setAndSendLocalDescription,
    (error) => { console.error('Send offer failed: ', error); }
  );
};

function sendAnswer(){
  console.log('Send answer');
  pc.createAnswer().then(
    setAndSendLocalDescription,
    (error) => { console.error('Send answer failed: ', error); }
  );
};

function setAndSendLocalDescription (sessionDescription){
  pc.setLocalDescription(sessionDescription);
  console.log('Local description set');
  sendData(sessionDescription);
};

let onIceCandidate = (event) => {
  if (event.candidate) {
    console.log('ICE candidate');
    //emitsocket
    sendData({
      type: 'offer',
      candidate: event.candidate,
      userTpye:'CREATOR',
      roomId:'jhdfnbvjdkfcvnb'
    });
  }
};

let onAddStream = (event) => {
  // allthe players are ready
  console.log('Add stream');
  let remoteStreamElement = document.querySelector('#remoteStream');
  remoteStreamElement.srcObject = event.stream;
};

let handleSignalingData = (data) => {
  switch (data.type) {
    case 'offer':
      createPeerConnection();
      pc.setRemoteDescription(new RTCSessionDescription(data));
      sendAnswer();
      break;
    case 'answer':
      pc.setRemoteDescription(new RTCSessionDescription(data));
      break;
    case 'candidate':
      pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      break;
    default:
        return 
  }
};

// Start connection
// getLocalStream();
export {createPeerConnection,sendOffer,getLocalStream} 



