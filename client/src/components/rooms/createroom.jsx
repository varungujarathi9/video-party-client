import { navigate } from '@reach/router'
import React,{useState} from 'react'

export default function  CreateRoom(){
   

    const [filename,setFileName] = useState('')
    const [extension] = useState(["mp4","mkv","mpv","avi","webm"])
    const [extensionCheck,setExtensionCheck] = useState(false)
    const [errorMsg,setErrorMsg] = useState('')

    function handleFile(e){
        e.preventDefault()
        var file= e.target.value.replace(/^.*[\\\/]/, '')
        setFileName(file)
       

        var extensionVal = file.split('.')

        if(extension.includes(extensionVal[1])){
            setExtensionCheck(true)
            setErrorMsg('')
            
        }
        else{
            setExtensionCheck(false)
            setErrorMsg("please provide valid file")
           
        }  
        

    }



    function gotoVideoPage(){
        navigate("/videopage")
    }

    function goBackToDecideRoom(){
        navigate("/decideroom")
    }


    
        return(
            <div>
                <label>Browse file</label>
                <input type="file" onChange={handleFile}/>
                <div style={{ fontSize: '16px', margin: '5px' }}>
                {extensionCheck ? 
                <div>
                <h6 style={{color:'green'}}
                
                >{filename}</h6>
                
                    <button onClick={gotoVideoPage}>Next</button>

                </div>
                
                :<h6 style={{color:'red'}}>{errorMsg}</h6>}
                  </div>

                <button onClick={goBackToDecideRoom}>Back</button>
        
            </div>
        )
    
}