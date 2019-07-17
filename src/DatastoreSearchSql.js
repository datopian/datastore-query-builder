import React from 'react';
import {Formik, Form, FieldArray, Field} from 'formik'


function DatastoreSearchSql(props) {

  const operators = [
    {name: '=', label: '='},
    {name: '!=', label: '!='},
    {name: '<', label: '<'},
    {name: '>', label: '>'},
    {name: '<=', label: '<='},
    {name: '>=', label: '>='}
  ]

  function handleSubmit(values) {
    // Convert query to SQL string. Note we're adding 'COUNT(*) OVER()' so that
    // we get number of total rows info.
    let sqlQueryString = `SELECT COUNT(*) OVER (), * FROM "${props.resourceId}" WHERE `
    if (values.rules.length === 0) { // No rules given so alert about that
      alert('Please, provide at least one rule.')
    } else {
      values.rules.forEach((rule, index) => {
        if (index === 0) {
          // TODO: unquote value for numbers
          sqlQueryString += `"${rule.field}" ${rule.operator} '${rule.value}'`
        } else { // If we have >1 rule we will need 'AND', 'OR' combinators
          sqlQueryString += ` ${rule.combinator.toUpperCase()} "${rule.field}" ${rule.operator} '${rule.value}'`
        }
      })
      // Set a limit of 100 rows as we don't need more for previewing...
      sqlQueryString += ` LIMIT 100`
    }
    // Build a datastore URL with SQL string
    const datastoreUrl = props.apiUrl + `datastore_search_sql?sql=${sqlQueryString}`
    // Fetch data and update the preview table
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
    <Formik
      initialValues={{ rules: [] }}
      onSubmit={values =>
        handleSubmit(values)
      }
      render={({ values }) => (
        <Form>
          <FieldArray
            name='rules'
            render={arrayHelpers => (
              <div>
                {values.rules && values.rules.length > 0 ? (
                  values.rules.map((rule, index) => (
                    <div key={index}>
                      <Field name={`rules.${index}.combinator`} component="select" required>
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </Field>
                      <Field name={`rules.${index}.field`} component="select" required>
                        {props.fields.map((field, index) => (
                          <option value={field.name} key={`field${index}`}>{field.title || field.name}</option>
                        ))}
                      </Field>
                      <Field name={`rules.${index}.operator`} component="select" required>
                        {operators.map((operator, index) => (
                          <option value={operator.name} key={`operator${index}`}>{operator.label}</option>
                        ))}
                      </Field>
                      <Field name={`rules.${index}.value`} required />
                      <button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)} // remove a rule from the list
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => arrayHelpers.insert(index, {combinator: 'AND', field: props.fields[0].name, operator: '=', value: ''})} // insert an empty rule at a position
                      >
                        +
                      </button>
                    </div>
                  ))
                ) : (
                  <button type="button" onClick={() => arrayHelpers.push({combinator: 'AND', field: props.fields[0].name, operator: '=', value: ''})}>
                    {/* show this when user has removed all rules from the list */}
                    Add a rule
                  </button>
                )}
                <div>
                  <button type="submit">Submit</button>
                </div>
              </div>
            )}
          />
        </Form>
      )}
    />
  )
}

export default DatastoreSearchSql;
