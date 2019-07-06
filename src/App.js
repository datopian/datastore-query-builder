import React from 'react';
import logo from './logo.svg';
import './App.css';

function App(props) {
  const view = props.view
  return (
    <div className="App">
      {JSON.stringify(view)}
    </div>
  );
}

export default App;
