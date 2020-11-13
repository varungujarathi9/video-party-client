import React from 'react'
import {navigate} from '@reach/router'


export default class LandingPage extends React.Component{
    constructor(props){
        super(props)
        this.state={
            username:'',
            errorMsg:''
        }
    }



    onSubmitForm =(e)=>{
        
        var usernameValid = this.state.username
        console.log(Boolean(usernameValid===''))
        if(usernameValid !== ''){
            console.log("check here")
            navigate("decideroom",{replace:true})
            e.preventDefault()
        }
        else{
           e.preventDefault()
            this.setState({
                errorMsg:"Please fill username"
            })
           
            
        }

    }


    handleInput=(e)=>{
        e.preventDefault()
        this.setState({
            username:e.target.value
        })
    }

    render(){
        return(
            <div>
                <form >
                    <label>Username</label>
                    <input type="text" onChange = {this.handleInput} ></input>
                    <button  onClick={this.onSubmitForm}>submit</button>
                </form>
                <h6 style={{ color: 'red', fontSize: '16px', margin: '5px' }}>
                    {this.state.errorMsg}
                  </h6>
            </div>
        )
    }
}