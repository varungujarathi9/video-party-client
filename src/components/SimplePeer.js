import { serverSocket } from './helper/connection'
import Peer from "simple-peer";

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

var creatorPC;
var joineePC;
var stream;
var videoPlayer

function startPlaying(){
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

function addMedia () {
    let vidtracks = stream.getVideoTracks()
    let audtracks = stream.getAudioTracks()
    joineePC.addTrack(vidtracks[0], stream)
    joineePC.addTrack(audtracks[0], stream)
}

function createPeerConnection(){
    
    if(sessionStorage.getItem("user-type") === "joinee"){
        creatorPC = new Peer({config:PC_CONFIG})
        creatorPC.on('signal', desc => {
            serverSocket.emit("send-offer", {desc:desc, roomID:sessionStorage.getItem("room-id")})
        })
        creatorPC.on('stream', stream => {
            videoPlayer = document.querySelector('video')
            if ('srcObject' in videoPlayer) {
                videoPlayer.srcObject = stream
            } else {
                videoPlayer.src = window.URL.createObjectURL(stream) // for older browsers
            }
        })

    }
    else if(sessionStorage.getItem("user-type") === "creator"){

        joineePC = new Peer({initiator:true, config:PC_CONFIG})
        joineePC.on('signal', desc => {
            serverSocket.emit("send-offer", {desc:desc, roomID:sessionStorage.getItem("room-id")})
        })
    }
    else{
        console.error("User type error")
    }
}

serverSocket.on('receive-offer', (data) => {
    if(sessionStorage.getItem("user-type") === "creator"){
        if(joineePC === undefined || joineePC === null){
            console.error("JOINEE UNDEFINED")
        }
        else{
            joineePC.signal(data['desc'])
        }
    }
    else if(sessionStorage.getItem("user-type") === "joinee"){
        if(creatorPC === undefined || creatorPC === null){
            console.error("CREATOR UNDEFINED")
        }
        else{
            creatorPC.signal(data['desc']) 
        } 
    }
    else{
        console.error("User type error")
    }    
})

export {createPeerConnection, startPlaying}