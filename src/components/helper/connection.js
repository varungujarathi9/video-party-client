import io from 'socket.io-client'
import configs from '../../configs.json'



// uncomment this while running in gcp
const serverSocket  = io.connect(`${configs.SERVER}`,{transports: ['polling'],upgrade:false, 'max reconnection attempts' : 10,'reconnect': true,})

// uncomment this while using in local server
// const endpoint = "http://localhost:5000"
// const serverSocket  = io.connect(`${endpoint}`,{transports: ['websocket'],upgrade:false})

export {serverSocket}