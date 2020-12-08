import { navigate } from '@reach/router';
import { Socket } from 'socket.io-client';
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
            urls: 'stun:' + TURN_SERVER_URL + '?transport=udp',
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL
        }
    ]
};

let pc;
var offerDescription;
var answerDescription
let stream;
var video;
// serverSocket.on('sdp-data-action', data => {
//     console.log("getting from server", data)
//     handleSignalingData(data);
// })

function setVideoPlayer(video1){
    console.log("BBBBBBBBBBB")
    video = video1
    console.log(video)
}

function getLocalStream(video1){
    // video = document.getElementById('video-player').firstChild;
    video = video1
    console.log(video)
    if (sessionStorage.getItem("user-type") === "creator"){
        if (stream) {
            return stream
        }
        if (video.captureStream) {
        stream = video.captureStream();
        console.log('Captured stream from video with captureStream',
            stream);
        } else if (video.mozCaptureStream) {
        stream = video.mozCaptureStream();
        console.log('Captured stream from video with mozCaptureStream()',
            stream);
        } else {
        console.log('captureStream() not supported');
        }
        return stream
    }
}

function createPeerConnection(userType) {
    
    try {
        pc = new RTCPeerConnection(PC_CONFIG);
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('ICE candidate');
                pc.addIceCandidate(event.candidate)
            };
        }
        if (userType === "creator"){
            // pc.addTrack(stream)
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
        }
        else {
            pc.ontrack = onAddTrack
        }
        
        console.log('PeerConnection created');
       
    } catch (error) {
        console.error('PeerConnection failed: ', error);
    }
};

async function sendOffer() {
    console.log('Send offer');
    offerDescription = await pc.createOffer()
        .then((sessionDescription) => {
            pc.setLocalDescription(sessionDescription)
            return sessionDescription
        },
            (error) => { console.error('Send offer failed: ', error); }
        )

    // console.log("what is createOffer", offerDescription)
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
    // console.log("answer sending",answerDescription)
    serverSocket.emit('send-answer', {room_id:sessionStorage.getItem('room-id'),webRtcDesc:answerDescription})
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

function onAddTrack(event){
    // allthe players are ready
    console.log('Add stream');
    if(sessionStorage.getItem('user-type') === 'joinee'){
        // console.log(event.streams[0])
        // console.log(document.getElementsByClassName('player-wrapper')[0].firstChild.firstChild)
        // let remoteStreamElement = document.getElementsByClassName('player-wrapper')[0].firstChild.firstChild;
        // console.log(remoteStreamElement)
        if (video.srcObject !== event.streams[0]) {
            console.log(event.streams)

            video.srcObject = event.streams[0];
        }
    }
  };

function handleSignalingData(data) {
    switch (data.type) {
        case 'offer':
            createPeerConnection();
            pc.setRemoteDescription(new RTCSessionDescription(data));
            sendAnswer();
            // console.log("offer received:",data)
            break;
        case 'answer':
            pc.setRemoteDescription(new RTCSessionDescription(data));
            // console.log("answer received:",data)
            break;
        case 'candidate':
            console.log("ice:",data)
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            break;
        default:
            return
    }
};


export { createPeerConnection, sendOffer, sendAnswer,handleSignalingData,getLocalStream, setVideoPlayer} 