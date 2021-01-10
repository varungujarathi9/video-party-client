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

function addMedia (joineePC) {
    let vidTracks = stream.getVideoTracks()
    let audTracks = stream.getAudioTracks()
    joineePC.addTrack(vidTracks[0], stream)
    joineePC.addTrack(audTracks[0], stream)
}

function startStreaming(roomMembers){
    // if creator, create peer connection with each member
    // elseif joinee, create peer connection with creator only
    let userType = sessionStorage.getItem("user-type")
    if(userType === 'creator'){
        //  create stream object
        videoPlayer = document.querySelector('video')
        if(videoPlayer === null || videoPlayer === undefined){
            console.error("videoPlayer not set: ", videoPlayer)
        }
        else if(stream === null || stream === undefined){
            stream = videoPlayer.captureStream()
        }
        destroyPeerConnections()
        //  create peer connection with each member
        Object.keys(roomMembers).map((username) => {
            // check if username same as own username
            if(username !== sessionStorage.getItem("username")){
                peerConnections[username] = {peerConnectionObject: new Peer({initiator: true, config:SERVER_CONFIG}), streamAdded: false}
                peerConnections[username]['peerConnectionObject'].on('signal', (desc) => {
                    serverSocket.emit("send-offer", {desc:desc, roomID:sessionStorage.getItem("room-id"), from: sessionStorage.getItem("username"), to: username,})
                })
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

    // // create peer connection for each member
    // // send offer to each member

    // if(sessionStorage.getItem("user-type") === "joinee"){
    //     creatorPC = new Peer({config:SERVER_CONFIG})
    //     creatorPC.on('signal', desc => {
    //         serverSocket.emit("send-offer", {desc:desc, roomID:sessionStorage.getItem("room-id")})
    //     })
    //     creatorPC.on('stream', stream => {
    //         videoPlayer = document.querySelector('video')
    //         if ('srcObject' in videoPlayer) {
    //             videoPlayer.srcObject = stream
    //         } else {
    //             videoPlayer.src = window.URL.createObjectURL(stream) // for older browsers
    //         }
    //     })

    // }
    // else if(sessionStorage.getItem("user-type") === "creator"){

    //     joineePC = new Peer({initiator:true, config:SERVER_CONFIG})
    //     joineePC.on('signal', desc => {
    //         serverSocket.emit("send-offer", {desc:desc, roomID:sessionStorage.getItem("room-id")})
    //     })
    // }
    // else{
    //     console.error("User type error")
    // }
}

function destroyPeerConnections(){
    Object.keys(peerConnections).map((username) => {
        // check if username same as own username
        if(username !== sessionStorage.getItem("username")){
            peerConnections[username].close()
            console.log(username, "connection destroyed")
        }
    })
    peerConnections = {}
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