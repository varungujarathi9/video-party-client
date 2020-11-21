import logo from './logo.svg';
import './App.css';
import data from './configs.json'
import Router from '../src/components/helper/router'

function App() {

  console.log(data.ENVIRONMENT_TYPE)
  return (
    <div className="App">
     <Router/>
    </div>
  );
}

export default App;
