import { navigate } from '@reach/router'
import React from 'react'

export default class CreateRoom extends React.Component{
    state={
        filename:'',
        extension:["mp4","mkv","mpv","avi","webm"],
        extensionCheck:false,
        errorMsg:''
    }


    handleFile=(e)=>{
        e.preventDefault()
        var file= e.target.value.replace(/^.*[\\\/]/, '')
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



    gotoVideoPage=()=>{
        navigate("/videopage")
    }

    goBackToDecideRoom= ()=>{
        navigate("/decideroom")
    }


    render(){
        return(
            <div>
                <label>Browse file</label>
                <input type="file" onChange={this.handleFile}/>
                <div style={{ fontSize: '16px', margin: '5px' }}>
                {this.state.extensionCheck ? 
                <div>
                <h6 style={{color:'green'}}
                
                >{this.state.filename}</h6>
                
                    <button onClick={this.gotoVideoPage}>Next</button>

                </div>
                
                :<h6 style={{color:'red'}}>{this.state.errorMsg}</h6>}
                  </div>

                <button onClick={this.goBackToDecideRoom}>Back</button>
        
            </div>
        )
    }
}