import { navigate } from '@reach/router';
import { serverSocket } from './helper/connection'

const TURN_SERVER_URL = '35.223.15.12:3479';
const TURN_SERVER_USERNAME = 'videoparty';
const TURN_SERVER_CREDENTIAL = 'videoparty100';

const PC_CONFIG = {
    iceServers: [
        {
            urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL
        },
        {
            urls: 'turn:' + TURN_SERVER_URL + '?transport=udp',
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL
        }
    ]
};

let pc;
var offerDescription;
var answerDescription
let localStream;

// serverSocket.on('sdp-data-action', data => {
//     console.log("getting from server", data)
//     handleSignalingData(data);
// })

function createPeerConnection() {
    try {
        pc = new RTCPeerConnection(PC_CONFIG);
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate');
            };
        }
        console.log('PeerConnection created');
    } catch (error) {
        console.error('PeerConnection failed: ', error);
    }
};

async function sendOffer() {
    console.log('Send offer');
    console.log("what is createOffer", pc.createOffer())
    offerDescription = await pc.createOffer()
        .then((sessionDescription) => {
            pc.setLocalDescription(sessionDescription)
            return sessionDescription
        },
            (error) => { console.error('Send offer failed: ', error); }
        )

    return offerDescription

    //  offerDescription =pc.createAnswer()
    // .then((sessionDescription)=>{  
    //     pc.setLocalDescription(sessionDescription) 
    //     return sessionDescription})

    //     // setAndSendLocalDescription,
    //     // (error) => { console.error('Send answer failed: ', error); }
    // console.log(offerDescription)

    // return offerData
};

async function sendAnswer() {
    console.log('Send answer');
    answerDescription = await pc.createAnswer()
        .then((sessionDescription) => {
            pc.setLocalDescription(sessionDescription)
            return sessionDescription
        },
            (error) => { console.error('Send answer failed: ', error); }
        )
    console.log("answer",answerDescription)
    return answerDescription
};

// function setAndSendLocalDescription(sessionDescription) {
//     pc.setLocalDescription(sessionDescription);
//     console.log('Local description set');
//     //socketemit
//     setOfferDescription(sessionDescription);

// };

// function setOfferDescription(data) {
//     offerDescription = data
//     console.log(offerDescription)
// }


// function onIceCandidate(event) {
//     console.log("what is event:", event)

//     // setOfferDescription({
//     //     type: 'candidate',
//     //     candidate: event.candidate
//     // });
// }
// };

function getLocalStream(){
navigator.mediaDevices.getUserMedia({video:true,audio:true})
    .then((stream) => {
      console.log('Stream found',stream);
      localStream = stream;
      pc.onaddstream = onAddStream;
      pc.addStream(localStream);
       
    })
    .catch(error => {
      console.error('Stream not found: ', error);
    });
}

function onAddStream(event){
    // allthe players are ready
    console.log('Add stream');
    let remoteStreamElement = document.querySelector('#remoteStream');
    remoteStreamElement.url = event.stream;
  };

function handleSignalingData(data) {
    switch (data.type) {
        case 'offer':
            createPeerConnection();
            pc.setRemoteDescription(new RTCSessionDescription(data));
            sendAnswer();
            console.log("offer:",data)
            break;
        case 'answer':
            pc.setRemoteDescription(new RTCSessionDescription(data));
            console.log("answer:",data)
            break;
        case 'candidate':
            console.log("ice:",data)
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            break;
        default:
            return
    }
};


export { createPeerConnection, sendOffer, sendAnswer,handleSignalingData,getLocalStream} 