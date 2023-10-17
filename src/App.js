
import './App.css';
import version from './version.json'
import Router from '../src/components/helper/router'
import ConfigData from './configs.json'


function App() {
  return (
    <div className="App">
      <Router />
      {ConfigData.ENVIRONMENT_TYPE !== 'Prod' &&<p style={{ position: "absolute", right: "15px", bottom: "20px" }}>{ConfigData.ENVIRONMENT_TYPE}</p>}
      {ConfigData.ENVIRONMENT_TYPE !== 'Prod' &&<p style={{ position: "absolute", right: "15px", bottom: "0" }}>{version.VERSION}</p>}
    </div>
  );
}

export default App;
