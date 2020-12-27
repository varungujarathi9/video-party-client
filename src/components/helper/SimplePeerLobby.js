import { serverSocket } from './connection'
import Peer from "simple-peer";

const TURN_SERVER_URL = '35.223.15.12:3479';
const TURN_SERVER_USERNAME = 'videoparty';
const TURN_SERVER_CREDENTIAL = 'videoparty100';
const SERVER_CONFIG = {
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

console.log('Simple peer JS loaded')
var stream;
var videoPlayer;
var peerConnections = {};

function connectToAllPeers(roomDetails){

    Object.keys(roomDetails.members).map((username) => {
        if(username !== sessionStorage.getItem("username")){
            // let temp = {}
            // temp[username] = new Peer({initiator: true, config:SERVER_CONFIG})
            // peerConnections = Object.assign(peerConnections, temp);
            peerConnections[username] = new Peer({initiator: true, config:SERVER_CONFIG})
            peerConnections[username].on('signal', desc => {
                serverSocket.emit("send-offer", {desc:desc, roomID:sessionStorage.getItem("room-id"), from: sessionStorage.getItem("username"), to: username, fromType: sessionStorage.getItem("user-type")})
            })
            peerConnections[username].on('data', data => {
                console.log('got a message from peer: ' + data)
            })
        }
    })
}

serverSocket.on('receive-offer', (data) => {
    // create new connection
    // if(peerConnections === undefined){
    //     peerConnections = {}
    // }
    if(data['to'] === sessionStorage.getItem('username')){
        let from = data['from']
        peerConnections[from] = new Peer({config:SERVER_CONFIG})
        peerConnections[from].on('signal', (desc) => {
            serverSocket.emit("send-answer", {desc:desc, roomID:sessionStorage.getItem("room-id"), from:sessionStorage.getItem("username"), to:data['from'], fromType:sessionStorage.getItem("user-type")})
        })
        peerConnections[from].on('data', data => {
            console.log('got a message from peer: ' + data)
        })
        peerConnections[from].signal(data['desc'])
    }
})

serverSocket.on('receive-answer', (data) => {
    let from = data["from"]
    peerConnections[from].signal(data['desc'])
    console.log("answered")
    if(data["fromType"] === "creator"){
        peerConnections[from].on('stream', (stream) => {
            console.log("receiving stream");
            videoPlayer = document.querySelector('video')
            if ('srcObject' in videoPlayer) {
                videoPlayer.srcObject = stream
            } else {
                videoPlayer.src = window.URL.createObjectURL(stream) // for older browsers
            }
        })
    }
})

function startStreaming(){
    videoPlayer = document.querySelector('video')
    if(videoPlayer === null || videoPlayer === undefined){
        console.error("videoPlayer not set: ", videoPlayer)
    }
    else if(stream === null || stream === undefined){
        stream = videoPlayer.captureStream()
        addMedia()
    }

    // navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: true
    //   }).then(addMedia).catch(() => {})

}

function addMedia() {
    let vidTracks = stream.getVideoTracks()
    let audTracks = stream.getAudioTracks()
    console.log(peerConnections)
    Object.keys(peerConnections).map((username)=>{
        peerConnections[username].send("STREAM")
        peerConnections[username].addTrack(vidTracks[0], stream)
        peerConnections[username].addTrack(audTracks[0], stream)
        console.log("Start streaming")
    })
}

function getPeerConnections(){
    return peerConnections
}

function setPeerConnections(data){
    peerConnections = data
}

// function receiveAudioVideoStream(){
//     for(let i = 0; i < peerConnections.length; i++){
//         peerConnections[i].on('stream', stream => {
//             videoPlayer = document.querySelector('video')
//             if ('srcObject' in videoPlayer) {
//                 videoPlayer.srcObject = stream
//             } else {
//                 videoPlayer.src = window.URL.createObjectURL(stream) // for older browsers
//             }
//         })
//     }
// }

export {connectToAllPeers, startStreaming, getPeerConnections, setPeerConnections}

