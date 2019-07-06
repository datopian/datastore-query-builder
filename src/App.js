import React from 'react';
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
