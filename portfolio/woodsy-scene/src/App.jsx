//import logo from './logo.svg';
import background from './images/background.png';
import Snowfall from 'react-snowfall';
import './App.css';

function App() {
  return (
    <div className="App">
        <div className="AppImageContainer">
          <img src={background} className="AppBackground" alt="background"/>
          <Snowfall snowflakeCount={300} color={"pink"} style={{ height:"100%" }}/>
        </div>
    </div>
  );
}

export default App;
