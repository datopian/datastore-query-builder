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
    let sqlQueryString = `SELECT COUNT(*) OVER (), * FROM "${props.resourceId}" WHERE `
    if (query.rules.length === 0) { // No rules given so alert about that
      alert('Please, provide at least one rule.')
    } else {
      const combinator = query.combinator
      query.rules.forEach((rule, index) => {
        if (index === 0) {
          // TODO: unquote value for numbers
          sqlQueryString += `"${rule.field}" ${rule.operator} '${rule.value}'`
        } else { // If we have >1 rule we will need 'AND', 'OR' combinators
          sqlQueryString += ` ${combinator.toUpperCase()} "${rule.field}" ${rule.operator} '${rule.value}'`
        }
      })
      // Set a limit of 100 rows
      sqlQueryString += ` LIMIT 100`
    }
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
