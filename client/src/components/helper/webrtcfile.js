import { serverSocket } from './connection'

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
            urls: 'stun:' + TURN_SERVER_URL,
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL
        }
    ]
};

// let pc;
// var offerDescription;
// var answerDescription
// let stream;
// var video;
// // serverSocket.on('sdp-data-action', data => {
// //     console.log("getting from server", data)
// //     handleSignalingData(data);
// // })

// function setVideoPlayer(video1){
//     console.log("BBBBBBBBBBB")
//     video = video1
//     console.log(video)
// }

// function getLocalStream(video1){
//     // video = document.getElementById('video-player').firstChild;
//     video = video1
//     console.log(video)
//     if (sessionStorage.getItem("user-type") === "creator"){
//         if (stream) {
//             return stream
//         }
//         if (video.captureStream) {
//         stream = video.captureStream();
//         console.log('Captured stream from video with captureStream',
//             stream);
//         } else if (video.mozCaptureStream) {
//         stream = video.mozCaptureStream();
//         console.log('Captured stream from video with mozCaptureStream()',
//             stream);
//         } else {
//         console.log('captureStream() not supported');
//         }
//         return stream
//     }
// }

// function createPeerConnection(sessionStorage.getItem("user-type")) {
    
//     try {
//         pc = new RTCPeerConnection(PC_CONFIG);
//         pc.onicecandidate = (event) => {
//             if (event.candidate) {
//                 console.log('ICE candidate');
//                 pc.addIceCandidate(event.candidate)
//             };
//         }
//         if (sessionStorage.getItem("user-type") === "creator"){
//             // pc.addTrack(stream)
//             stream.getTracks().forEach(track => pc.addTrack(track, stream));
//         }
//         else {
//             pc.ontrack = onAddTrack
//         }
        
//         console.log('PeerConnection created');
       
//     } catch (error) {
//         console.error('PeerConnection failed: ', error);
//     }
// };

// async function sendOffer() {
//     console.log('Send offer');
//     offerDescription = await pc.createOffer()
//         .then((sessionDescription) => {
//             pc.setLocalDescription(sessionDescription)
//             return sessionDescription
//         },
//             (error) => { console.error('Send offer failed: ', error); }
//         )

//     // console.log("what is createOffer", offerDescription)
//     return offerDescription

//     //  offerDescription =pc.createAnswer()
//     // .then((sessionDescription)=>{  
//     //     pc.setLocalDescription(sessionDescription) 
//     //     return sessionDescription})

//     //     // setAndSendLocalDescription,
//     //     // (error) => { console.error('Send answer failed: ', error); }
//     // console.log(offerDescription)

//     // return offerData
// };

// async function sendAnswer() {
//     console.log('Send answer');
//     answerDescription = await pc.createAnswer()
//         .then((sessionDescription) => {
//             pc.setLocalDescription(sessionDescription)
//             return sessionDescription
//         },
//             (error) => { console.error('Send answer failed: ', error); }
//         )
//     // console.log("answer sending",answerDescription)
//     serverSocket.emit('send-answer', {room_id:sessionStorage.getItem('room-id'),webRtcDesc:answerDescription})
//     return answerDescription
// };

// // function setAndSendLocalDescription(sessionDescription) {
// //     pc.setLocalDescription(sessionDescription);
// //     console.log('Local description set');
// //     //socketemit
// //     setOfferDescription(sessionDescription);

// // };

// // function setOfferDescription(data) {
// //     offerDescription = data
// //     console.log(offerDescription)
// // }


// // function onIceCandidate(event) {
// //     console.log("what is event:", event)

// //     // setOfferDescription({
// //     //     type: 'candidate',
// //     //     candidate: event.candidate
// //     // });
// // }
// // };

// function onAddTrack(event){
//     // allthe players are ready
//     console.log('Add stream');
//     if(sessionStorage.getItem('user-type') === 'joinee'){
//         // console.log(event.streams[0])
//         // console.log(document.getElementsByClassName('player-wrapper')[0].firstChild.firstChild)
//         // let remoteStreamElement = document.getElementsByClassName('player-wrapper')[0].firstChild.firstChild;
//         // console.log(remoteStreamElement)
//         if (video.srcObject !== event.streams[0]) {
//             console.log(event.streams)

//             video.srcObject = event.streams[0];
//         }
//     }
//   };

// function handleSignalingData(data) {
//     switch (data.type) {
//         case 'offer':
//             createPeerConnection();
//             pc.setRemoteDescription(new RTCSessionDescription(data));
//             sendAnswer();
//             // console.log("offer received:",data)
//             break;
//         case 'answer':
//             pc.setRemoteDescription(new RTCSessionDescription(data));
//             // console.log("answer received:",data)
//             break;
//         case 'candidate':
//             console.log("ice:",data)
//             pc.addIceCandidate(new RTCIceCandidate(data.candidate));
//             break;
//         default:
//             return
//     }
// };


// export { createPeerConnection, sendOffer, sendAnswer,handleSignalingData,getLocalStream, setVideoPlayer} 

var videoPlayer;
var pc;
var stream;

const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};
const remoteStream = new MediaStream();
var remoteVideo;
function setVideoPlayer(object){
    remoteVideo = object
    remoteVideo.srcObject = remoteStream;
    // videoPlayer = object
    // console.log("videoPlayer set", videoPlayer)
}
var localStream;
function maybeCreateStream() {
    // if (stream) {
    //     return;
    // }
    // if (videoPlayer.captureStream) {
    //     stream = videoPlayer.captureStream();
    //     console.log('Captured stream from videoPlayer with captureStream',
    //         stream);
    //     call();
    // } else if (videoPlayer.mozCaptureStream) {
    //     stream = videoPlayer.mozCaptureStream();
    //     console.log('Captured stream from videoPlayer with mozCaptureStream()',
    //         stream);
    //     call();
    // } else {
    //     console.log('captureStream() not supported');
    // }
    call()
}

// Video tag capture must be set up after video tracks are enumerated.
// if(sessionStorage.getItem("user-type") === "creator"){
//     videoPlayer.oncanplay = maybeCreateStream;
//     if (videoPlayer.readyState >= 3) { // HAVE_FUTURE_DATA
//         // Video is already ready to play, call maybeCreateStream in case oncanplay
//         // fired before we registered the event handler.
//         maybeCreateStream();
//     }
// }

async function call(){
    pc = new RTCPeerConnection(PC_CONFIG);
    pc.onicecandidate = e => onIceCandidate(pc, e);
    console.log(1)
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
    if(sessionStorage.getItem("user-type") === "creator"){
        console.log(localStream.getTracks())
        localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
        });
        console.log(2)
        pc.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError, offerOptions);
    }
    else if(sessionStorage.getItem("user-type") === "joinee"){
        console.log(3)
        pc.ontrack = gotRemoteStream;
    }
    else{
        console.log("USERTYPE:" + sessionStorage.getItem("user-type") + ", SOME ISSUE IN CALL")
    }
}

function gotRemoteStream(event) {
    // if (videoPlayer.srcObject !== event.streams[0]) {
    //   videoPlayer.srcObject = event.streams[0];
    //   console.log('pc2 received remote stream', event);
    // }
    remoteStream.addTrack(event.track, remoteStream);
}

function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
}

function onCreateOfferSuccess(desc) {
    console.log(`Offer from pc ${desc.sdp}`);
    console.log('pc setLocalDescription start');
    pc.setLocalDescription(desc, () => onSetLocalSuccess(pc), onSetSessionDescriptionError);
    serverSocket.emit("send-offer", {desc:desc, roomID:sessionStorage.getItem("room-id")})
}

function sendAnswer(desc){
    pc.setRemoteDescription(desc, () => onSetRemoteSuccess(pc), onSetSessionDescriptionError);
    console.log('pc2 createAnswer start');
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    pc.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
    
}

function onCreateAnswerSuccess(desc) {
    console.log(`Answer from pc:${desc.sdp}`);
    console.log('pc setLocalDescription start');
    pc.setLocalDescription(desc, () => onSetLocalSuccess(pc), onSetSessionDescriptionError);
    serverSocket.emit("send-answer",{desc:desc, roomID:sessionStorage.getItem("room-id")})
}

function onIceCandidate(pc, event) {
    serverSocket.emit("ice-candidate", {candidate: event.candidate, roomID:sessionStorage.getItem('room-id')})
}

function onAddIceCandidateSuccess(pc) {
    console.log('addIceCandidate success');
}

function onAddIceCandidateError(pc, error) {
    console.log(`failed to add ICE Candidate: ${error.toString()}`);
}

function onSetLocalSuccess(pc) {
    console.log('setLocalDescription complete');
}

function onSetRemoteSuccess(pc) {
    console.log('setRemoteDescription complete');
}

function onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description: ${error.toString()}`);
}

// function handleSignalingData(data) {
//     switch (data.type) {
//         case 'offer':
//             createPeerConnection();
//             pc.setRemoteDescription(new RTCSessionDescription(data));
//             sendAnswer();
//             // console.log("offer received:",data)
//             break;
//         case 'answer':
//             pc.setRemoteDescription(new RTCSessionDescription(data));
//             // console.log("answer received:",data)
//             break;
//         case 'candidate':
//             console.log("ice:",data)
//             pc.addIceCandidate(new RTCIceCandidate(data.candidate));
//             break;
//         default:
//             return
//     }
// };

function handleSignalingData(data, type){
    switch (type) {
        case 'offer':
            call();
            sendAnswer(data["desc"]);
            break;
        case 'answer':
            pc.setRemoteDescription(data["desc"], () => onSetRemoteSuccess(pc), onSetSessionDescriptionError);
            break;
        case 'candidate':
            if(data["candidate"] !== null){
                console.log(data["candidate"])
                data["candidate"].usernameFragment = null;
                pc.addIceCandidate(new RTCIceCandidate(data["candidate"]))
                    .then(
                        () => onAddIceCandidateSuccess(pc),
                        err => onAddIceCandidateError(pc, err)
                    );
                console.log(`ICE candidate: ${data["candidate"] ? data["candidate"].candidate : '(null)'}`);
            }
            break;      
        default:
            return
    }
}

export {setVideoPlayer, maybeCreateStream, handleSignalingData}