import React from 'react';
import logo from './logo.svg';
import './App.css';

Class App extends Component {
  state = {
    dynamicURL: roomCode
  }
  
  render(){
  return (
    <Router>
      <Route path=`/${dyanmicURL}` component={GameContainer}/>
    </Router>
  );
}
}

export default App;
