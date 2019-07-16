import React from 'react';
import './App.css';
import DatastoreSearchSql from './DatastoreSearchSql';


function App(props) {
  const view = props.view
  if (view.resources[0].schema) {
    return (
      <div className="App">
        <DatastoreSearchSql
          resourceId={view.resources[0].id}
          viewId={view.id}
          fields={view.resources[0].schema.fields}
          apiUrl='https://www.energidataservice.dk/api/3/action/'
        />
      </div>
    );
  } else {
    return (
      <div className="no-filters"></div>
    );
  }

}

export default App;
