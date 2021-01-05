import React from 'react';
import { navigate } from '@reach/router'
// import PageNotFound from '../assets/images/PageNotFound';
class NotFoundPage extends React.Component{
    handleClick = (event) => {
        event.preventDefault()
        navigate('/')
    }
    render(){
        return <div>
            {/* <img src={PageNotFound}  /> */}
            <h1>404 Not Found</h1>
            <p style={{textAlign:"center"}} onClick={this.handleClick}>
                Go to Home
            </p>
          </div>;
    }
}
export default NotFoundPage;