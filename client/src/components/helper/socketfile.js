import io from 'socket.io-client'
import data from '../../configs.json'
let endpoint="http://35.223.15.12:5000"
const  socket  = io.connect(`${data.SERVER}`,{transports: ['websocket'],upgrade:false})

export {socket}