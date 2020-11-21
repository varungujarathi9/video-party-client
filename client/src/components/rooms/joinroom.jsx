import React from 'react'

export default class CreateRoom extends React.Component{

    navigateToVideoPage =() =>{
        console.log("hello")
    }
    
    render(){
        return(
            <div>
                <input onChange={this.handleChange} placeholder="Enter room Id"></input>
                <button onClick={this.navigateToVideoPage}>Next</button>
            </div>
        )
    }
}