import io from 'socket.io-client'
import configs from '../../configs.json'

const serverSocket  = io.connect(`${configs.SERVER}`,{transports: ['websocket'],upgrade:false})

export {serverSocket}