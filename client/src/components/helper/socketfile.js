import io from 'socket.io-client'

let endpoint="http://127.0.0.1:5000"
const  socket  = io.connect(`${endpoint}`,{transports: ['websocket'],upgrade:false})

export {socket}