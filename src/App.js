import React from 'react';
import './App.css';
import DatastoreSearchSql from './DatastoreSearchSql';


function App(props) {
  const view = props.view
  if (view.resources[0].schema) {
    return (
      <div className="App">
        <DatastoreSearchSql fields={view.resources[0].schema.fields} />
      </div>
    );
  } else {
    return (
      <div className="no-filters"></div>
    );
  }

}

export default App;
