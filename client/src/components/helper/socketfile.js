import io from 'socket.io-client'
import data from '../../configs.json'
let endpoint="http://127.0.0.1:5000"
// const  socket  = io.connect(`${data.SERVER}`,{transports: ['websocket'],upgrade:false})
const  socket  = io.connect(`${endpoint}`,{transports: ['websocket'],upgrade:false})

export {socket}