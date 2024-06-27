import React from "react";
import { withRouter } from "./helper/Navigate";
// import PageNotFound from '../assets/images/PageNotFound';
class NotFoundPage extends React.Component {
  handleClick = (event) => {
    event.preventDefault();
    this.props.navigate("/");
  };
  render() {
    return (
      <div style={{ position: "absolute", left: "40%", top: "20%" }}>
        {/* <img src={PageNotFound}  /> */}
        <h1 style={{ color: "white" }}>404 Not Found</h1>
        <p
          style={{
            textAlign: "center",
            color: "lightblue",
            fontSize: "20px",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={this.handleClick}
        >
          Go to Home
        </p>
      </div>
    );
  }
}
export default withRouter(NotFoundPage);
