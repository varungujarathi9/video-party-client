import logo from './logo.svg';
import './App.css';
import data from './configs.json'
import Router from '../src/components/helper/router'
import ConfigData from './configs.json'

function App() {

  console.log(data.ENVIRONMENT_TYPE)
  return (
    <div className="App">
      <Router />
      <p style={{ position: "absolute", right: "15px", bottom: "0" }}>{ConfigData.ENVIRONMENT_TYPE}</p>
    </div>
  );
}

export default App;
