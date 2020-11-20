import { navigate } from '@reach/router'
import React from 'react'
// import {userContext} from '../helper/usercontext'
import {socket} from '../helper/socketfile'



export default class DecideRoom extends React.Component{    
    // const user = useContext(userContext)
    // const[uname,setuname] = useState('')    
    constructor(props){
        super(props)
        this.state={
            username:''
        }
        
        
    }
    
    // useEffect(()=>{
        
    //     Socket.on('outgoingdata',(msg)=>{
    //         setuname(msg)
    //         console.log(msg)
    //     })
       
    // })

    componentDidMount(){
            socket.on('outgoingdata',this.receiveUsername)
    }

    receiveUsername =(uname)=>{

        this.setState({username:uname.data})
    }

   
        render(){
        return(
            <div>
                
                <h1>Hello {this.state.username}</h1>
               
                <button  onClick={()=>navigate('/createroom')}>Create Room</button>
                <button  onClick={()=>navigate('/joinroom')}>Join Room</button>
                <button  onClick={()=>navigate('/',{replace:true})}>Logout</button>
            </div>
        )
            }
}