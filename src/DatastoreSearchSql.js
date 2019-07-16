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
    const datastoreUrl = props.apiUrl + `datastore_search_sql?sql=${sqlQueryString}`
    // Fetch data and update data in the preview table
    fetch(encodeURI(datastoreUrl))
      .then(res => res.json())
      .then(data => {
        // Records come with 'count', '_id' and '_full_text' columns from datastore
        // so we need to delete them. But first save 'count' value.
        const count = data.result.records[0].count
        // Update number of rows:
        document.getElementById('numberOfRows').innerText = count
        const newData = data.result.records.map(record => {
          delete record.count
          delete record._id
          delete record._full_text
          return record
        })
        window[`table${props.viewId}`].updateData(newData)
        // Order of the columns are changed so make sure we don't mess it up:
        const newHeaders = Object.keys(newData[0])
        window[`table${props.viewId}`].addSettings({
          colHeaders: newHeaders,
          columns: undefined
        })
      })
      .catch(error => console.error(error))
  }

  return (
    <form onSubmit={handleSubmit}>
      <QueryBuilder
        fields={fields}
        onQueryChange={setQuery}
        combinators={[{name: 'and', label: 'AND'}]}
        operators={[
          {name: '=', label: '='},
          {name: '!=', label: '!='},
          {name: '<', label: '<'},
          {name: '>', label: '>'},
          {name: '<=', label: '<='},
          {name: '>=', label: '>='}
        ]}
        controlElements={{
          addGroupAction: () => <div style={{display: 'none'}}></div>,
          combinatorSelector: () => <div style={{display: 'none'}}></div>
        }}
        translations={{
          fields: {
              title: "Fields",
          },
          operators: {
              title: "Operators",
          },
          value: {
              title: "Value",
          },
          removeRule: {
              label: "x",
              title: "Remove rule",
          },
          removeGroup: {
              label: "x",
              title: "Remove group",
          },
          addRule: {
              label: "Add filter",
              title: "Add rule",
          },
          addGroup: {
              label: "Add group",
              title: "Add group",
          },
          combinators: {
              title: "Combinators",
          }
        }}
      />

      <div className="applyButton">
        <input type="submit" value="Submit" />
      </div>
    </form>
  )
}

export default DatastoreSearchSql;
