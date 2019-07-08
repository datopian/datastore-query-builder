import React, {useState} from 'react';
import QueryBuilder from "react-querybuilder";


function DatastoreSearchSql(props) {
  const [query, setQuery] = useState({});

  const fields = props.fields.map(field => {
    return {name: field.name, label: field.title || field.name}
  })

  function handleSubmit(event) {
    event.preventDefault();
    // Convert query to SQL string
    // Build a datastore URL with SQL string
    // Fetch data and update datapcakge json
    // QUESTION: is it ok to get DOM element here and update its property?
  }

  return (
    <form onSubmit={handleSubmit}>
      <QueryBuilder fields={fields} onQueryChange={setQuery} />
      <input type="submit" value="Submit" />
    </form>
  )
}

export default DatastoreSearchSql;
