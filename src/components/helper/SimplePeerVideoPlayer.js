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

var peerConnections = {};
var creatorPC;
var stream;
var videoPlayer;
var vidTracks;
var audTracks;
function addMedia (joineePC) {
    vidTracks = stream.getVideoTracks()
    audTracks = stream.getAudioTracks()
    joineePC.addTrack(vidTracks[0], stream)
    joineePC.addTrack(audTracks[0], stream)
    console.log("stream added")
}

function startStreaming(roomMembers){
    // if creator, create peer connection with each member
    // elseif joinee, create peer connection with creator only
    let userType = sessionStorage.getItem("user-type")
    // destroyPeerConnections()
    if(userType === 'creator'){
        //  create stream object
        videoPlayer = document.querySelector('video')
        if(videoPlayer === null || videoPlayer === undefined){
            console.error("videoPlayer not set: ", videoPlayer)
        }
        else if(stream === null || stream === undefined){
            stream = videoPlayer.captureStream()
        }
        
        //  create peer connection with each member
        Object.keys(roomMembers).map((username) => {
            // check if username same as own username
            if(username !== sessionStorage.getItem("username")){
                if(username in peerConnections){
                    peerConnections[username].peerConnectionObject.replaceTrack(vidTracks[0], vidTracks[0], stream)
                    peerConnections[username].peerConnectionObject.replaceTrack(audTracks[0], audTracks[0], stream)
                    
                    peerConnections[username]['streamAdded'] = true;
                }
                else{
                    peerConnections[username] = {peerConnectionObject: new Peer({initiator: true, config:SERVER_CONFIG}), streamAdded: false}
                    peerConnections[username]['peerConnectionObject'].on('signal', (desc) => {
                        serverSocket.emit("send-offer", {desc:desc, roomID:sessionStorage.getItem("room-id"), from: sessionStorage.getItem("username"), to: username,})
                    })
                }
            }
            return (null)
        })

    }
    else{
        creatorPC = new Peer({config:SERVER_CONFIG})
        creatorPC.on('signal', (desc) => {
            serverSocket.emit("send-answer", {desc:desc, roomID:sessionStorage.getItem("room-id"), from: sessionStorage.getItem("username")})
        })
    }
}

function destroyPeerConnections(){
    console.log(peerConnections)
    Object.keys(peerConnections).map((username) => {
        // check if username same as own username
        if(username !== sessionStorage.getItem("username")){
            peerConnections[username].peerConnectionObject.removeStream(stream)
            peerConnections[username].peerConnectionObject.destory()
            console.log(peerConnections[username].peerConnectionObject)
            console.log(username, "connection destroyed")
        }
    })
    peerConnections = {}
    videoPlayer = null
    stream = null
    vidTracks = null
    audTracks = null
    if (creatorPC !== null && creatorPC !== undefined)
        creatorPC.destroy()
    creatorPC = null
}


serverSocket.on('receive-offer', (data) => {
    if(sessionStorage.getItem("user-type") === "joinee"){
        if(data['to'] === sessionStorage.getItem('username')){
            //  handle null object
            if(creatorPC === null || creatorPC === undefined){
                creatorPC = new Peer({config:SERVER_CONFIG})
                creatorPC.on('signal', (desc) => {
                    serverSocket.emit("send-answer", {desc:desc, roomID:sessionStorage.getItem("room-id"), from: sessionStorage.getItem("username")})
                })
            }

            // add signalling desc of creator
            creatorPC.signal(data['desc'])

            // add callback event to receive stream
            creatorPC.on('stream', (stream) => {
                videoPlayer = document.querySelector('video')
                if (videoPlayer !== null && videoPlayer !== undefined){
                    if('srcObject' in videoPlayer) {
                        videoPlayer.srcObject = stream
                    } else {
                        videoPlayer.src = window.URL.createObjectURL(stream) // for older browsers
                    }
                }
            })
        }
    }
})

serverSocket.on('receive-answer', (data) => {
    // receive answer from joinees
    if(sessionStorage.getItem("user-type") === "creator"){
        let from = data["from"]
        peerConnections[from]['peerConnectionObject'].signal(data['desc'])
        if(peerConnections[from]['streamAdded'] === false){
            console.log(from,"connection created")
            addMedia(peerConnections[from]['peerConnectionObject'])
            peerConnections[from]['streamAdded'] = true;
        }
    }
})

export {startStreaming, destroyPeerConnections}