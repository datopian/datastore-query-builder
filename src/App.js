import React from 'react';
import './App.css';
import DatastoreSearchSql from './DatastoreSearchSql';


export const QueryBuilder = (props) => {
  const resource = JSON.parse(JSON.stringify(props.resource))
  if (resource.schema) {
    let apiUrl = resource.proxy || resource.api || resource.path
    apiUrl = (new URL(apiUrl)).origin + '/api/3/action/'
    return (
      <div className="App">
        <DatastoreSearchSql
          resource={resource}
          apiUrl={apiUrl}
          action={props.filterBuilderAction}
        />
      </div>
    );
  } else {
    return (
      <div className="no-filters"></div>
    );
  }
}
