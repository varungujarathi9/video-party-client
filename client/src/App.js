import logo from './logo.svg';
import './App.css';
import version from './version.json'
import Router from '../src/components/helper/router'
import ConfigData from './configs.json'

function App() {
  return (
    <div className="App">
      <Router />
      <p style={{ position: "absolute", right: "15px", bottom: "10px" }}>{ConfigData.ENVIRONMENT_TYPE}</p>
      <p style={{ position: "absolute", right: "15px", bottom: "0" }}>{version.VERSION}</p>
    </div>
  );
}

export default App;
