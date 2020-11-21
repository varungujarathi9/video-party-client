import { navigate } from '@reach/router'
import React from 'react'
import { socket } from '../helper/socketfile'

export default class CreateRoom extends React.Component{
    state={
        filename:'',
        extension:["mp4","mkv","mpv","avi","webm"],
        extensionCheck:false,
        errorMsg:'',
        roomId:''
    }
    // componentDidMount(){
    //     console.log("hello ")
    //         socket.on('outgoingdata',(uname)=>{
    //             this.setState({
    //                 roomId:uname.room_id
                    
    //             })
    //         })
    //     // this.storeinls  
    // }


    handleFile=(e)=>{
        e.preventDefault()
        var file= e.target.value.replace(/^.*[\\]/, '')
        this.setState({
            filename:file,
            
        })

        var extensionVal = file.split('.')

        if(this.state.extension.includes(extensionVal[1])){
            this.setState({
                extensionCheck:true,
                errorMsg:''
            })
        }
        else{
            this.setState({
                errorMsg:"please provide valid file",
                extensionCheck:false
            })
        }  
        

    }   
    

   
   


    render(){
        return(
            <div>
                <label>Browse file</label>
                <input type="file" onChange={this.handleFile}/>
                <p>{localStorage.getItem('roomId')}</p>
                <div style={{ fontSize: '16px', margin: '5px' }}>
                {this.state.extensionCheck ? 
                <div>
                <h6 style={{color:'green'}}
                
                >{this.state.filename}</h6>
                
                    <button onClick={()=>{ navigate("/videopage")}}>Next</button>

                </div>
                
                :<h6 style={{color:'red'}}>{this.state.errorMsg}</h6>}
                  </div>

                <button onClick={()=>{navigate(-1)}}>Back</button>
        
            </div>
        )
    }
}